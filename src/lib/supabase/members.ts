import "server-only";

import type { WorkspaceMembership, MembershipRole } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapMembership(row: Record<string, unknown>): WorkspaceMembership {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    userId: String(row.user_id),
    role: row.role as MembershipRole,
    status: row.status as WorkspaceMembership["status"],
    invitedAt: String(row.invited_at),
    joinedAt: row.joined_at ? String(row.joined_at) : null,
  };
}

export async function listSupabaseMembers(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("memberships")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("invited_at", { ascending: true });
  return (data ?? []).map((row) => mapMembership(row));
}

export async function updateSupabaseMemberRole(input: {
  membershipId: string;
  organisationId: string;
  actorUserId: string;
  role: MembershipRole;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("memberships")
    .update({ role: input.role })
    .eq("id", input.membershipId)
    .eq("organisation_id", input.organisationId)
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "membership.role_updated",
    entity_type: "membership",
    entity_id: input.membershipId,
    metadata_json: { role: input.role },
  });

  return mapMembership(data);
}

export async function deactivateSupabaseMember(input: {
  membershipId: string;
  organisationId: string;
  actorUserId: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("memberships")
    .update({ status: "suspended" })
    .eq("id", input.membershipId)
    .eq("organisation_id", input.organisationId)
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "membership.deactivated",
    entity_type: "membership",
    entity_id: input.membershipId,
    metadata_json: {},
  });

  return mapMembership(data);
}
