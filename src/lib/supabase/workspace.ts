import "server-only";

import type {
  WorkspaceAuditEvent,
  WorkspaceMembership,
  WorkspaceOrganisation,
  WorkspaceUser,
} from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getSupabaseSessionUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const displayName =
    typeof user.user_metadata.display_name === "string"
      ? user.user_metadata.display_name
      : typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : user.email ?? "User";

  const workspaceUser: WorkspaceUser = {
    id: user.id,
    email: user.email ?? "",
    displayName,
  };

  return { supabase, user, workspaceUser };
}

function mapOrganisation(row: Record<string, unknown>): WorkspaceOrganisation {
  return {
    id: String(row.id),
    name: String(row.name),
    sector: String(row.sector),
    country: String(row.country),
    employeeBand: String(row.employee_band),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapMembership(row: Record<string, unknown>): WorkspaceMembership {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    userId: String(row.user_id),
    role: row.role as WorkspaceMembership["role"],
    status: row.status as WorkspaceMembership["status"],
    invitedAt: String(row.invited_at),
    joinedAt: row.joined_at ? String(row.joined_at) : null,
  };
}

function mapAuditEvent(row: Record<string, unknown>): WorkspaceAuditEvent {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    actorUserId: String(row.actor_user_id ?? ""),
    action: String(row.action),
    entityType: String(row.entity_type),
    entityId: String(row.entity_id),
    metadataJson:
      typeof row.metadata_json === "object" && row.metadata_json !== null
        ? (row.metadata_json as Record<string, string>)
        : {},
    createdAt: String(row.created_at),
  };
}

export async function getFirstSupabaseOrganisationId(userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("memberships")
    .select("organisation_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  return data?.organisation_id ?? null;
}

export async function getSupabaseWorkspaceBundle(
  userId: string,
  organisationId: string,
) {
  const supabase = await createSupabaseServerClient();

  const [{ data: membershipRow }, { data: organisationRow }, { data: auditRows }] =
    await Promise.all([
      supabase
        .from("memberships")
        .select("*")
        .eq("user_id", userId)
        .eq("organisation_id", organisationId)
        .eq("status", "active")
        .maybeSingle(),
      supabase
        .from("organisations")
        .select("*")
        .eq("id", organisationId)
        .maybeSingle(),
      supabase
        .from("audit_events")
        .select("*")
        .eq("organisation_id", organisationId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  if (!membershipRow || !organisationRow) {
    return null;
  }

  return {
    membership: mapMembership(membershipRow),
    organisation: mapOrganisation(organisationRow),
    auditEvents: (auditRows ?? []).map((row) => mapAuditEvent(row)),
  };
}
