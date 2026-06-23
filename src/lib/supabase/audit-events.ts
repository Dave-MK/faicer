import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

type AuditEventRow = {
  id: string;
  organisationId: string;
  actorUserId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
};

function mapEvent(row: Record<string, unknown>): AuditEventRow {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    actorUserId: row.actor_user_id ? String(row.actor_user_id) : null,
    action: String(row.action),
    entityType: String(row.entity_type),
    entityId: String(row.entity_id),
    createdAt: String(row.created_at),
  };
}

export async function listSupabaseAuditEventsForUser(
  userId: string,
  organisationId: string,
  limit = 20,
) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("audit_events")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("actor_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((row) => mapEvent(row));
}

export async function listSupabaseAuditEvents(organisationId: string, limit = 50) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("audit_events")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map((row) => mapEvent(row));
}
