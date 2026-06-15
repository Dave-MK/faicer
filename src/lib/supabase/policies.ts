import "server-only";

import type { WorkspacePolicy, WorkspacePolicyAcknowledgement } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapPolicy(row: Record<string, unknown>): WorkspacePolicy {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    title: String(row.title),
    body: String(row.body ?? ""),
    version: String(row.version ?? "1.0"),
    status: row.status as WorkspacePolicy["status"],
    effectiveDate: row.effective_date ? String(row.effective_date) : null,
    linkedToolIds: Array.isArray(row.linked_tool_ids)
      ? (row.linked_tool_ids as string[])
      : [],
    createdByUserId: String(row.created_by_user_id),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapAck(row: Record<string, unknown>): WorkspacePolicyAcknowledgement {
  return {
    id: String(row.id),
    policyId: String(row.policy_id),
    organisationId: String(row.organisation_id),
    userId: String(row.user_id),
    acknowledgedAt: String(row.acknowledged_at),
  };
}

export async function listSupabasePolicies(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("policies")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => mapPolicy(row));
}

export async function getSupabasePolicy(organisationId: string, policyId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("policies")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("id", policyId)
    .maybeSingle();
  return data ? mapPolicy(data) : null;
}

export async function listSupabasePolicyAcknowledgementsForUser(userId: string, organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("policy_acknowledgements")
    .select("*")
    .eq("user_id", userId)
    .eq("organisation_id", organisationId);
  return (data ?? []).map((row) => mapAck(row));
}

export async function getSupabasePolicyAcknowledgement(userId: string, policyId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("policy_acknowledgements")
    .select("*")
    .eq("user_id", userId)
    .eq("policy_id", policyId)
    .maybeSingle();
  return data ? mapAck(data) : null;
}

export async function createSupabasePolicy(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  body: string;
  version: string;
  status: WorkspacePolicy["status"];
  effectiveDate?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("policies")
    .insert({
      organisation_id: input.organisationId,
      created_by_user_id: input.actorUserId,
      title: input.title,
      body: input.body,
      version: input.version,
      status: input.status,
      effective_date: input.effectiveDate ?? null,
    })
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "policy.created",
    entity_type: "policy",
    entity_id: data.id,
    metadata_json: { title: input.title, status: input.status },
  });

  return mapPolicy(data);
}

export async function updateSupabasePolicy(input: {
  policyId: string;
  organisationId: string;
  actorUserId: string;
  title: string;
  body: string;
  version: string;
  status: WorkspacePolicy["status"];
  effectiveDate?: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("policies")
    .update({
      title: input.title,
      body: input.body,
      version: input.version,
      status: input.status,
      effective_date: input.effectiveDate ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("organisation_id", input.organisationId)
    .eq("id", input.policyId)
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "policy.updated",
    entity_type: "policy",
    entity_id: input.policyId,
    metadata_json: { title: input.title, status: input.status },
  });

  return mapPolicy(data);
}

export async function acknowledgeSupabasePolicy(input: {
  policyId: string;
  organisationId: string;
  userId: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("policy_acknowledgements")
    .upsert(
      {
        policy_id: input.policyId,
        organisation_id: input.organisationId,
        user_id: input.userId,
        acknowledged_at: new Date().toISOString(),
      },
      { onConflict: "policy_id,user_id" },
    )
    .select("*")
    .single();

  if (error || !data) return null;
  return mapAck(data);
}
