import "server-only";

import type { WorkspaceEvidenceItem } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapEvidence(row: Record<string, unknown>): WorkspaceEvidenceItem {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    title: String(row.title),
    type: row.type as WorkspaceEvidenceItem["type"],
    fileUrl: row.file_url ? String(row.file_url) : null,
    linkedEntityType: String(row.linked_entity_type ?? "organisation"),
    linkedEntityId: String(row.linked_entity_id ?? ""),
    uploadedByUserId: String(row.uploaded_by_user_id),
    notes: String(row.notes ?? ""),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listSupabaseEvidence(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("evidence_items")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => mapEvidence(row));
}

export async function getSupabaseEvidence(organisationId: string, evidenceId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("evidence_items")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("id", evidenceId)
    .maybeSingle();
  return data ? mapEvidence(data) : null;
}

export async function createSupabaseEvidence(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  type: WorkspaceEvidenceItem["type"];
  linkedEntityType: string;
  linkedEntityId: string;
  notes?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("evidence_items")
    .insert({
      organisation_id: input.organisationId,
      uploaded_by_user_id: input.actorUserId,
      title: input.title,
      type: input.type,
      linked_entity_type: input.linkedEntityType,
      linked_entity_id: input.linkedEntityId,
      notes: input.notes ?? "",
    })
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "evidence_item.created",
    entity_type: "evidence_item",
    entity_id: data.id,
    metadata_json: { title: input.title, type: input.type },
  });

  return mapEvidence(data);
}
