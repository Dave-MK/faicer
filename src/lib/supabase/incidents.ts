import "server-only";

import type { WorkspaceIncident } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapIncident(row: Record<string, unknown>): WorkspaceIncident {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    title: String(row.title),
    description: String(row.description ?? ""),
    severity: row.severity as WorkspaceIncident["severity"],
    status: row.status as WorkspaceIncident["status"],
    linkedToolId: row.linked_tool_id ? String(row.linked_tool_id) : null,
    linkedUseCaseId: row.linked_use_case_id ? String(row.linked_use_case_id) : null,
    reporterUserId: String(row.reporter_user_id),
    assignedToUserId: row.assigned_to_user_id ? String(row.assigned_to_user_id) : null,
    resolvedAt: row.resolved_at ? String(row.resolved_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listSupabaseIncidents(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("incidents")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => mapIncident(row));
}

export async function getSupabaseIncident(organisationId: string, incidentId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("incidents")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("id", incidentId)
    .maybeSingle();
  return data ? mapIncident(data) : null;
}

export async function createSupabaseIncident(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  severity: WorkspaceIncident["severity"];
  linkedToolId?: string;
  linkedUseCaseId?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("incidents")
    .insert({
      organisation_id: input.organisationId,
      reporter_user_id: input.actorUserId,
      title: input.title,
      description: input.description,
      severity: input.severity,
      status: "open",
      linked_tool_id: input.linkedToolId ?? null,
      linked_use_case_id: input.linkedUseCaseId ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "incident.created",
    entity_type: "incident",
    entity_id: data.id,
    metadata_json: { severity: input.severity },
  });

  return mapIncident(data);
}

export async function updateSupabaseIncident(input: {
  incidentId: string;
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  severity: WorkspaceIncident["severity"];
  status: WorkspaceIncident["status"];
  assignedToUserId?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const resolvedAt =
    input.status === "resolved"
      ? new Date().toISOString()
      : null;

  const { data, error } = await supabase
    .from("incidents")
    .update({
      title: input.title,
      description: input.description,
      severity: input.severity,
      status: input.status,
      assigned_to_user_id: input.assignedToUserId ?? null,
      resolved_at: resolvedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("organisation_id", input.organisationId)
    .eq("id", input.incidentId)
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "incident.updated",
    entity_type: "incident",
    entity_id: input.incidentId,
    metadata_json: { status: input.status, severity: input.severity },
  });

  return mapIncident(data);
}
