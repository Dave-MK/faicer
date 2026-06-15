"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { persistMockRegistryBundle } from "@/lib/data/mock-registry";
import {
  addMockMember,
  updateMockMemberRole,
  deactivateMockMember,
} from "@/lib/data/mock-store";
import {
  updateSupabaseMemberRole,
  deactivateSupabaseMember,
} from "@/lib/supabase/members";
import { inviteMemberSchema, updateMemberRoleSchema } from "@/lib/validation/member";

export async function inviteMemberAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const parsed = inviteMemberSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/settings?tab=members&error=invalid-form");
  }

  // Supabase invite relies on Supabase Auth's invite flow (email-based).
  // For now we fall through to mock, same as before.

  const result = addMockMember({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    displayName: parsed.data.displayName,
    email: parsed.data.email,
    role: parsed.data.role,
  });

  await persistMockRegistryBundle({
    user: result.user,
    membership: result.membership,
    auditEvent: result.auditEvent,
  });

  redirect("/settings?tab=members&message=invited");
}

export async function updateMemberRoleAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const parsed = updateMemberRoleSchema.safeParse({
    membershipId: formData.get("membershipId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    redirect("/settings?tab=members&error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const updated = await updateSupabaseMemberRole({
      membershipId: parsed.data.membershipId,
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      role: parsed.data.role,
    });
    if (!updated) redirect("/settings?tab=members&error=not-found");
    redirect("/settings?tab=members&message=updated");
  }

  const result = updateMockMemberRole(parsed.data.membershipId, {
    actorUserId: context.user.id,
    role: parsed.data.role,
  });

  if (!result) {
    redirect("/settings?tab=members&error=not-found");
  }

  await persistMockRegistryBundle({
    membership: result.membership,
    auditEvent: result.auditEvent,
  });

  redirect("/settings?tab=members&message=updated");
}

export async function deactivateMemberAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const membershipId = formData.get("membershipId");

  if (typeof membershipId !== "string" || !membershipId) {
    redirect("/settings?tab=members&error=missing");
  }

  if (isSupabaseAuthEnabled()) {
    const updated = await deactivateSupabaseMember({
      membershipId,
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
    });
    if (!updated) redirect("/settings?tab=members&error=not-found");
    redirect("/settings?tab=members&message=deactivated");
  }

  const result = deactivateMockMember(membershipId, context.user.id);

  if (!result) {
    redirect("/settings?tab=members&error=not-found");
  }

  await persistMockRegistryBundle({
    membership: result.membership,
    auditEvent: result.auditEvent,
  });

  redirect("/settings?tab=members&message=deactivated");
}
