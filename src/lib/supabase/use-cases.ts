import "server-only";

import type { WorkspaceUseCase } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapUseCase(row: Record<string, unknown>): WorkspaceUseCase {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    toolId: row.tool_id ? String(row.tool_id) : "",
    title: String(row.title),
    description: String(row.description ?? ""),
    businessUnit: String(row.business_unit ?? ""),
    ownerUserId: String(row.owner_user_id),
    riskLevel: row.risk_level as WorkspaceUseCase["riskLevel"],
    status: row.status as WorkspaceUseCase["status"],
    dataInvolved: String(row.data_involved ?? ""),
    mitigations: String(row.mitigations ?? ""),
    lastReviewedAt: row.last_reviewed_at ? String(row.last_reviewed_at) : null,
    nextReviewAt: row.next_review_at ? String(row.next_review_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listSupabaseUseCases(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("use_cases")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => mapUseCase(row));
}

export async function getSupabaseUseCase(organisationId: string, useCaseId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("use_cases")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("id", useCaseId)
    .maybeSingle();
  return data ? mapUseCase(data) : null;
}

export async function createSupabaseUseCase(input: {
  organisationId: string;
  actorUserId: string;
  toolId: string;
  title: string;
  description: string;
  businessUnit: string;
  ownerUserId: string;
  riskLevel: WorkspaceUseCase["riskLevel"];
  status: WorkspaceUseCase["status"];
  dataInvolved: string;
  mitigations: string;
  nextReviewAt?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("use_cases")
    .insert({
      organisation_id: input.organisationId,
      tool_id: input.toolId || null,
      title: input.title,
      description: input.description,
      business_unit: input.businessUnit,
      owner_user_id: input.ownerUserId,
      risk_level: input.riskLevel,
      status: input.status,
      data_involved: input.dataInvolved,
      mitigations: input.mitigations,
      next_review_at: input.nextReviewAt ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "use_case.created",
    entity_type: "use_case",
    entity_id: data.id,
    metadata_json: { title: input.title },
  });

  return mapUseCase(data);
}

export async function updateSupabaseUseCase(input: {
  useCaseId: string;
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  businessUnit: string;
  ownerUserId: string;
  riskLevel: WorkspaceUseCase["riskLevel"];
  status: WorkspaceUseCase["status"];
  dataInvolved: string;
  mitigations: string;
  nextReviewAt?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("use_cases")
    .update({
      title: input.title,
      description: input.description,
      business_unit: input.businessUnit,
      owner_user_id: input.ownerUserId,
      risk_level: input.riskLevel,
      status: input.status,
      data_involved: input.dataInvolved,
      mitigations: input.mitigations,
      next_review_at: input.nextReviewAt ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("organisation_id", input.organisationId)
    .eq("id", input.useCaseId)
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "use_case.updated",
    entity_type: "use_case",
    entity_id: input.useCaseId,
    metadata_json: { title: input.title, status: input.status },
  });

  return mapUseCase(data);
}
