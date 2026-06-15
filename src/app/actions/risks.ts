"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { persistMockRegistryBundle, findMockRiskById } from "@/lib/data/mock-registry";
import { createMockRisk, updateMockRisk } from "@/lib/data/mock-store";
import { createSupabaseRisk, updateSupabaseRisk } from "@/lib/supabase/risks";
import { riskSchema } from "@/lib/validation/risk";

function parseInput(formData: FormData) {
  return riskSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    entityType: formData.get("entityType"),
    entityId: formData.get("entityId"),
    severity: formData.get("severity"),
    likelihood: formData.get("likelihood"),
    mitigation: formData.get("mitigation"),
    ownerUserId: formData.get("ownerUserId"),
    status: formData.get("status"),
  });
}

export async function createRiskAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const parsed = parseInput(formData);

  if (!parsed.success) {
    redirect("/risks/new?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabaseRisk({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      ...parsed.data,
    });
    if (!created) redirect("/risks/new?error=save-failed");
    redirect(`/risks/${created.id}?message=created`);
  }

  const created = createMockRisk({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle({ risk: created.risk, auditEvent: created.auditEvent });
  redirect(`/risks/${created.risk.id}?message=created`);
}

export async function updateRiskAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const riskId = formData.get("riskId");

  if (typeof riskId !== "string" || !riskId) {
    redirect("/risks?error=missing");
  }

  const parsed = parseInput(formData);

  if (!parsed.success) {
    redirect(`/risks/${riskId}?error=invalid-form`);
  }

  if (isSupabaseAuthEnabled()) {
    const updated = await updateSupabaseRisk({
      riskId,
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      ...parsed.data,
    });
    if (!updated) redirect(`/risks/${riskId}?error=save-failed`);
    redirect(`/risks/${riskId}?message=updated`);
  }

  const existing = await findMockRiskById(riskId);

  if (!existing || existing.organisationId !== context.organisation.id) {
    redirect("/risks");
  }

  const updated = updateMockRisk(existing, {
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle({ risk: updated.risk, auditEvent: updated.auditEvent });
  redirect(`/risks/${riskId}?message=updated`);
}
