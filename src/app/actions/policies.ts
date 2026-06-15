"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import {
  persistMockRegistryBundle,
  findMockPolicyById,
  findMockAcknowledgement,
} from "@/lib/data/mock-registry";
import {
  createMockPolicy,
  updateMockPolicy,
  createMockPolicyAcknowledgement,
} from "@/lib/data/mock-store";
import {
  createSupabasePolicy,
  updateSupabasePolicy,
  acknowledgeSupabasePolicy,
  getSupabasePolicyAcknowledgement,
} from "@/lib/supabase/policies";
import { policySchema } from "@/lib/validation/policy";

export async function createPolicyAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const parsed = policySchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    status: formData.get("status") || "draft",
    effectiveDate: formData.get("effectiveDate") || undefined,
  });

  if (!parsed.success) {
    redirect("/policies/new?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabasePolicy({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      version: "1.0",
      ...parsed.data,
    });
    if (!created) redirect("/policies/new?error=save-failed");
    redirect(`/policies/${created.id}?message=created`);
  }

  const created = createMockPolicy({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle({
    policy: created.policy,
    auditEvent: created.auditEvent,
  });

  redirect(`/policies/${created.policy.id}?message=created`);
}

export async function updatePolicyAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const policyId = formData.get("policyId");

  if (typeof policyId !== "string" || !policyId) {
    redirect("/policies?error=missing");
  }

  const parsed = policySchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    status: formData.get("status") || "draft",
    effectiveDate: formData.get("effectiveDate") || undefined,
  });

  if (!parsed.success) {
    redirect(`/policies/${policyId}?error=invalid-form`);
  }

  if (isSupabaseAuthEnabled()) {
    const updated = await updateSupabasePolicy({
      policyId,
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      version: String(formData.get("version") || "1.0"),
      ...parsed.data,
    });
    if (!updated) redirect(`/policies/${policyId}?error=save-failed`);
    redirect(`/policies/${policyId}?message=updated`);
  }

  const existing = await findMockPolicyById(policyId);

  if (!existing || existing.organisationId !== context.organisation.id) {
    redirect("/policies");
  }

  const updated = updateMockPolicy(existing, {
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle({
    policy: updated.policy,
    auditEvent: updated.auditEvent,
  });

  redirect(`/policies/${policyId}?message=updated`);
}

export async function acknowledgePolicyAction(formData: FormData) {
  const context = await requireWorkspaceContext();
  const policyId = formData.get("policyId");

  if (typeof policyId !== "string" || !policyId) {
    redirect("/my-policies?error=missing");
  }

  if (isSupabaseAuthEnabled()) {
    const existing = await getSupabasePolicyAcknowledgement(context.user.id, policyId);
    if (existing) redirect("/my-policies?message=already-acknowledged");
    await acknowledgeSupabasePolicy({
      policyId,
      organisationId: context.organisation.id,
      userId: context.user.id,
    });
    redirect("/my-policies?message=acknowledged");
  }

  const existing = await findMockAcknowledgement(context.user.id, policyId);
  if (existing) {
    redirect(`/my-policies?message=already-acknowledged`);
  }

  const { acknowledgement } = createMockPolicyAcknowledgement({
    policyId,
    organisationId: context.organisation.id,
    userId: context.user.id,
  });

  await persistMockRegistryBundle({ policyAcknowledgement: acknowledgement });
  redirect(`/my-policies?message=acknowledged`);
}
