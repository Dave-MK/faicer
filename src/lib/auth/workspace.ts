import "server-only";

import { redirect } from "next/navigation";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { getSessionSnapshot } from "@/lib/auth/session";
import {
  canManageOrganisation,
  canReviewRecords,
  hasRequiredRole,
} from "@/lib/auth/permissions";
import {
  findMockMembershipForUserInOrganisation,
  findMockOrganisationById,
  findMockUserById,
  listMockAuditEvents,
} from "@/lib/data/mock-registry";
import type {
  MembershipRole,
  WorkspaceAuditEvent,
  WorkspaceMembership,
  WorkspaceOrganisation,
  WorkspaceUser,
} from "@/lib/types";
import {
  getFirstSupabaseOrganisationId,
  getSupabaseSessionUser,
  getSupabaseWorkspaceBundle,
} from "@/lib/supabase/workspace";

type WorkspaceContext = {
  user: WorkspaceUser;
  organisation: WorkspaceOrganisation;
  membership: WorkspaceMembership;
  permissions: {
    canManageOrganisation: boolean;
    canReviewRecords: boolean;
  };
  auditEvents: WorkspaceAuditEvent[];
};

export async function requireSignedInUser() {
  if (isSupabaseAuthEnabled()) {
    const sessionUser = await getSupabaseSessionUser();

    if (!sessionUser) {
      redirect("/sign-in");
    }

    return sessionUser.workspaceUser;
  }

  const session = await getSessionSnapshot();

  if (!session?.userId) {
    redirect("/sign-in");
  }

  const user = await findMockUserById(session.userId);

  if (!user) {
    redirect("/sign-in");
  }

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
  };
}

async function getSupabaseWorkspaceContext(
  allowedRoles?: MembershipRole[],
): Promise<WorkspaceContext> {
  const sessionUser = await getSupabaseSessionUser();

  if (!sessionUser) {
    redirect("/sign-in");
  }

  const session = await getSessionSnapshot();
  const activeOrganisationId =
    session?.userId === sessionUser.workspaceUser.id
      ? session.activeOrganisationId
      : null;

  const organisationId =
    activeOrganisationId ??
    (await getFirstSupabaseOrganisationId(sessionUser.workspaceUser.id));

  if (!organisationId) {
    redirect("/setup/organisation");
  }

  const bundle = await getSupabaseWorkspaceBundle(
    sessionUser.workspaceUser.id,
    organisationId,
  );

  if (!bundle) {
    redirect("/setup/organisation");
  }

  if (!hasRequiredRole(bundle.membership.role, allowedRoles)) {
    redirect("/dashboard");
  }

  return {
    user: sessionUser.workspaceUser,
    organisation: bundle.organisation,
    membership: bundle.membership,
    permissions: {
      canManageOrganisation: canManageOrganisation(bundle.membership.role),
      canReviewRecords: canReviewRecords(bundle.membership.role),
    },
    auditEvents: bundle.auditEvents,
  };
}

async function getMockWorkspaceContext(
  allowedRoles?: MembershipRole[],
): Promise<WorkspaceContext> {
  const session = await getSessionSnapshot();

  if (!session?.userId || !session.activeOrganisationId) {
    redirect("/sign-in");
  }

  const user = await findMockUserById(session.userId);
  const organisation = await findMockOrganisationById(session.activeOrganisationId);
  const membership = await findMockMembershipForUserInOrganisation(
    session.userId,
    session.activeOrganisationId,
  );

  if (!user || !organisation || !membership) {
    redirect("/sign-in");
  }

  if (!hasRequiredRole(membership.role, allowedRoles)) {
    redirect("/dashboard");
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
    },
    organisation: {
      id: organisation.id,
      name: organisation.name,
      sector: organisation.sector,
      country: organisation.country,
      employeeBand: organisation.employeeBand,
      createdAt: organisation.createdAt,
      updatedAt: organisation.updatedAt,
    },
    membership: {
      id: membership.id,
      organisationId: membership.organisationId,
      userId: membership.userId,
      role: membership.role,
      status: membership.status,
      invitedAt: membership.invitedAt,
      joinedAt: membership.joinedAt,
    },
    permissions: {
      canManageOrganisation: canManageOrganisation(membership.role),
      canReviewRecords: canReviewRecords(membership.role),
    },
    auditEvents: await listMockAuditEvents(organisation.id),
  };
}

export async function requireWorkspaceContext(allowedRoles?: MembershipRole[]) {
  if (isSupabaseAuthEnabled()) {
    return getSupabaseWorkspaceContext(allowedRoles);
  }

  return getMockWorkspaceContext(allowedRoles);
}

export function summarizeWorkspace(context: WorkspaceContext) {
  return [
    {
      label: "Role",
      value: context.membership.role,
      detail: "Role checks are centralized and reused before org-level actions.",
    },
    {
      label: "Audit events",
      value: String(context.auditEvents.length),
      detail: "The seed scaffold already records key actions into an audit stream.",
    },
    {
      label: "Sector",
      value: context.organisation.sector,
      detail: "Organisation profile fields are in place for the guided setup flow.",
    },
    {
      label: "Employee band",
      value: context.organisation.employeeBand,
      detail: "This becomes useful later for pricing, reminders, and training scope.",
    },
  ];
}
