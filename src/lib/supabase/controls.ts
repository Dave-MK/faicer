import "server-only";

import type { WorkspaceControl } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapControl(row: Record<string, unknown>): WorkspaceControl {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    title: String(row.title),
    description: String(row.description ?? ""),
    type: row.type as WorkspaceControl["type"],
    status: row.status as WorkspaceControl["status"],
    linkedRiskIds: Array.isArray(row.linked_risk_ids)
      ? (row.linked_risk_ids as string[])
      : [],
    ownerUserId: String(row.owner_user_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listSupabaseControls(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("controls")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => mapControl(row));
}

export async function getSupabaseControl(organisationId: string, controlId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("controls")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("id", controlId)
    .maybeSingle();
  return data ? mapControl(data) : null;
}

export async function createSupabaseControl(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  type: WorkspaceControl["type"];
  status: WorkspaceControl["status"];
  linkedRiskIds: string[];
  ownerUserId: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("controls")
    .insert({
      organisation_id: input.organisationId,
      title: input.title,
      description: input.description,
      type: input.type,
      status: input.status,
      linked_risk_ids: input.linkedRiskIds,
      owner_user_id: input.ownerUserId,
    })
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "control.created",
    entity_type: "control",
    entity_id: data.id,
    metadata_json: { title: input.title, type: input.type },
  });

  return mapControl(data);
}

export async function updateSupabaseControl(input: {
  controlId: string;
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  type: WorkspaceControl["type"];
  status: WorkspaceControl["status"];
  ownerUserId: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("controls")
    .update({
      title: input.title,
      description: input.description,
      type: input.type,
      status: input.status,
      owner_user_id: input.ownerUserId,
      updated_at: new Date().toISOString(),
    })
    .eq("organisation_id", input.organisationId)
    .eq("id", input.controlId)
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "control.updated",
    entity_type: "control",
    entity_id: input.controlId,
    metadata_json: { status: input.status },
  });

  return mapControl(data);
}
