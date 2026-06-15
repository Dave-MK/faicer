import "server-only";

import type { WorkspaceAssessment } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapAssessment(row: Record<string, unknown>): WorkspaceAssessment {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    entityType: String(row.entity_type),
    entityId: String(row.entity_id),
    assessorUserId: String(row.assessor_user_id),
    assessmentDate: String(row.assessment_date),
    findings: String(row.findings ?? ""),
    outcome: row.outcome as WorkspaceAssessment["outcome"],
    nextAssessmentAt: row.next_assessment_at ? String(row.next_assessment_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function listSupabaseAssessments(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("assessments")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("assessment_date", { ascending: false });
  return (data ?? []).map((row) => mapAssessment(row));
}

export async function getSupabaseAssessment(organisationId: string, assessmentId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("assessments")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("id", assessmentId)
    .maybeSingle();
  return data ? mapAssessment(data) : null;
}

export async function createSupabaseAssessment(input: {
  organisationId: string;
  actorUserId: string;
  entityType: string;
  entityId: string;
  assessmentDate: string;
  findings: string;
  outcome: WorkspaceAssessment["outcome"];
  nextAssessmentAt?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("assessments")
    .insert({
      organisation_id: input.organisationId,
      assessor_user_id: input.actorUserId,
      entity_type: input.entityType,
      entity_id: input.entityId,
      assessment_date: input.assessmentDate,
      findings: input.findings,
      outcome: input.outcome,
      next_assessment_at: input.nextAssessmentAt ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "assessment.created",
    entity_type: "assessment",
    entity_id: data.id,
    metadata_json: { outcome: input.outcome, entityType: input.entityType },
  });

  return mapAssessment(data);
}
