import "server-only";

import type { WorkspaceRisk } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function computeLevel(score: number): WorkspaceRisk["riskLevel"] {
  if (score >= 20) return "critical";
  if (score >= 12) return "high";
  if (score >= 6) return "medium";
  return "low";
}

function mapRisk(row: Record<string, unknown>): WorkspaceRisk {
  const severity = Number(row.severity) as 1 | 2 | 3 | 4 | 5;
  const likelihood = Number(row.likelihood) as 1 | 2 | 3 | 4 | 5;
  const riskScore = Number(row.risk_score ?? severity * likelihood);
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    title: String(row.title),
    description: String(row.description ?? ""),
    entityType: String(row.entity_type ?? "organisation"),
    entityId: String(row.entity_id ?? ""),
    severity,
    likelihood,
    riskScore,
    riskLevel: (row.risk_level as WorkspaceRisk["riskLevel"]) ?? computeLevel(riskScore),
    mitigation: String(row.mitigation ?? ""),
    residualScore: Number(row.residual_score ?? riskScore),
    ownerUserId: String(row.owner_user_id),
    status: row.status as WorkspaceRisk["status"],
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listSupabaseRisks(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("risks")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("risk_score", { ascending: false });
  return (data ?? []).map((row) => mapRisk(row));
}

export async function getSupabaseRisk(organisationId: string, riskId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("risks")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("id", riskId)
    .maybeSingle();
  return data ? mapRisk(data) : null;
}

export async function createSupabaseRisk(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  severity: number;
  likelihood: number;
  mitigation: string;
  ownerUserId: string;
  status: WorkspaceRisk["status"];
}) {
  const supabase = await createSupabaseServerClient();
  const riskScore = input.severity * input.likelihood;
  const riskLevel = computeLevel(riskScore);
  const { data, error } = await supabase
    .from("risks")
    .insert({
      organisation_id: input.organisationId,
      title: input.title,
      description: input.description,
      entity_type: input.entityType,
      entity_id: input.entityId,
      severity: input.severity,
      likelihood: input.likelihood,
      risk_level: riskLevel,
      mitigation: input.mitigation,
      residual_score: riskScore,
      owner_user_id: input.ownerUserId,
      status: input.status,
    })
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "risk.created",
    entity_type: "risk",
    entity_id: data.id,
    metadata_json: { title: input.title, riskLevel },
  });

  return mapRisk(data);
}

export async function updateSupabaseRisk(input: {
  riskId: string;
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  severity: number;
  likelihood: number;
  mitigation: string;
  status: WorkspaceRisk["status"];
  ownerUserId: string;
  entityType: string;
  entityId: string;
}) {
  const supabase = await createSupabaseServerClient();
  const riskScore = input.severity * input.likelihood;
  const riskLevel = computeLevel(riskScore);
  const { data, error } = await supabase
    .from("risks")
    .update({
      title: input.title,
      description: input.description,
      severity: input.severity,
      likelihood: input.likelihood,
      risk_level: riskLevel,
      mitigation: input.mitigation,
      residual_score: riskScore,
      owner_user_id: input.ownerUserId,
      status: input.status,
      entity_type: input.entityType,
      entity_id: input.entityId,
      updated_at: new Date().toISOString(),
    })
    .eq("organisation_id", input.organisationId)
    .eq("id", input.riskId)
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "risk.updated",
    entity_type: "risk",
    entity_id: input.riskId,
    metadata_json: { status: input.status, riskLevel },
  });

  return mapRisk(data);
}
