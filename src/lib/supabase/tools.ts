import "server-only";

import type { WorkspaceAITool, WorkspaceAuditEvent } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapTool(row: Record<string, unknown>): WorkspaceAITool {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    name: String(row.name),
    vendor: String(row.vendor),
    websiteUrl: row.website_url ? String(row.website_url) : null,
    category: row.category as WorkspaceAITool["category"],
    approvalStatus: row.approval_status as WorkspaceAITool["approvalStatus"],
    accountOwnerUserId: String(row.account_owner_user_id),
    businessOwnerUserId: String(row.business_owner_user_id),
    privacyPolicyUrl: row.privacy_policy_url
      ? String(row.privacy_policy_url)
      : null,
    dataProcessingNotes: String(row.data_processing_notes ?? ""),
    notes: String(row.notes ?? ""),
    lastReviewedAt: row.last_reviewed_at ? String(row.last_reviewed_at) : null,
    nextReviewAt: row.next_review_at ? String(row.next_review_at) : null,
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
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

export async function listSupabaseTools(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("ai_tools")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => mapTool(row));
}

export async function getSupabaseToolDetail(
  organisationId: string,
  toolId: string,
) {
  const supabase = await createSupabaseServerClient();
  const [{ data: toolRow }, { data: auditRows }] = await Promise.all([
    supabase
      .from("ai_tools")
      .select("*")
      .eq("organisation_id", organisationId)
      .eq("id", toolId)
      .maybeSingle(),
    supabase
      .from("audit_events")
      .select("*")
      .eq("organisation_id", organisationId)
      .eq("entity_type", "ai_tool")
      .eq("entity_id", toolId)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  if (!toolRow) {
    return null;
  }

  return {
    tool: mapTool(toolRow),
    auditEvents: (auditRows ?? []).map((row) => mapAuditEvent(row)),
  };
}

export async function createSupabaseTool(input: {
  organisationId: string;
  actorUserId: string;
  accountOwnerUserId: string;
  businessOwnerUserId: string;
  name: string;
  vendor: string;
  websiteUrl?: string;
  category: WorkspaceAITool["category"];
  approvalStatus: WorkspaceAITool["approvalStatus"];
  privacyPolicyUrl?: string;
  dataProcessingNotes?: string;
  notes?: string;
  nextReviewAt: string;
}) {
  const supabase = await createSupabaseServerClient();
  const reviewedOn = new Date().toISOString().slice(0, 10);
  const { data: tool, error } = await supabase
    .from("ai_tools")
    .insert({
      organisation_id: input.organisationId,
      name: input.name,
      vendor: input.vendor,
      website_url: input.websiteUrl ?? null,
      category: input.category,
      approval_status: input.approvalStatus,
      account_owner_user_id: input.accountOwnerUserId,
      business_owner_user_id: input.businessOwnerUserId,
      privacy_policy_url: input.privacyPolicyUrl ?? null,
      data_processing_notes: input.dataProcessingNotes ?? "",
      notes: input.notes ?? "",
      last_reviewed_at: reviewedOn,
      next_review_at: input.nextReviewAt,
    })
    .select("*")
    .single();

  if (error || !tool) {
    return null;
  }

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "ai_tool.created",
    entity_type: "ai_tool",
    entity_id: tool.id,
    metadata_json: {
      name: input.name,
      approvalStatus: input.approvalStatus,
    },
  });

  return mapTool(tool);
}

export async function updateSupabaseTool(input: {
  toolId: string;
  organisationId: string;
  actorUserId: string;
  name: string;
  vendor: string;
  websiteUrl?: string;
  category: WorkspaceAITool["category"];
  approvalStatus: WorkspaceAITool["approvalStatus"];
  privacyPolicyUrl?: string;
  dataProcessingNotes?: string;
  notes?: string;
  nextReviewAt: string;
}) {
  const supabase = await createSupabaseServerClient();
  const reviewedOn = new Date().toISOString().slice(0, 10);
  const { data: tool, error } = await supabase
    .from("ai_tools")
    .update({
      name: input.name,
      vendor: input.vendor,
      website_url: input.websiteUrl ?? null,
      category: input.category,
      approval_status: input.approvalStatus,
      privacy_policy_url: input.privacyPolicyUrl ?? null,
      data_processing_notes: input.dataProcessingNotes ?? "",
      notes: input.notes ?? "",
      last_reviewed_at: reviewedOn,
      next_review_at: input.nextReviewAt,
      updated_at: new Date().toISOString(),
    })
    .eq("organisation_id", input.organisationId)
    .eq("id", input.toolId)
    .select("*")
    .single();

  if (error || !tool) {
    return null;
  }

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "ai_tool.updated",
    entity_type: "ai_tool",
    entity_id: input.toolId,
    metadata_json: {
      name: input.name,
      approvalStatus: input.approvalStatus,
    },
  });

  return mapTool(tool);
}
