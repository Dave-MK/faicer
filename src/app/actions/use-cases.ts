"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { persistMockRegistryBundle, findMockUseCaseById } from "@/lib/data/mock-registry";
import { createMockUseCase, updateMockUseCase } from "@/lib/data/mock-store";
import { createSupabaseUseCase, updateSupabaseUseCase, getSupabaseUseCase } from "@/lib/supabase/use-cases";
import { useCaseSchema } from "@/lib/validation/use-case";

function parseInput(formData: FormData) {
  return useCaseSchema.safeParse({
    toolId: formData.get("toolId"),
    title: formData.get("title"),
    description: formData.get("description"),
    businessUnit: formData.get("businessUnit"),
    ownerUserId: formData.get("ownerUserId"),
    riskLevel: formData.get("riskLevel"),
    status: formData.get("status"),
    dataInvolved: formData.get("dataInvolved"),
    mitigations: formData.get("mitigations"),
    nextReviewAt: formData.get("nextReviewAt") || undefined,
  });
}

export async function createUseCaseAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const parsed = parseInput(formData);

  if (!parsed.success) {
    redirect("/use-cases/new?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabaseUseCase({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      ...parsed.data,
    });
    if (!created) redirect("/use-cases/new?error=save-failed");
    redirect(`/use-cases/${created.id}?message=created`);
  }

  const created = createMockUseCase({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle({
    useCase: created.useCase,
    auditEvent: created.auditEvent,
  });

  redirect(`/use-cases/${created.useCase.id}?message=created`);
}

export async function updateUseCaseAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const useCaseId = formData.get("useCaseId");

  if (typeof useCaseId !== "string" || !useCaseId) {
    redirect("/use-cases?error=missing");
  }

  const parsed = parseInput(formData);

  if (!parsed.success) {
    redirect(`/use-cases/${useCaseId}?error=invalid-form`);
  }

  if (isSupabaseAuthEnabled()) {
    const updated = await updateSupabaseUseCase({
      useCaseId,
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      ...parsed.data,
    });
    if (!updated) redirect(`/use-cases/${useCaseId}?error=save-failed`);
    redirect(`/use-cases/${useCaseId}?message=updated`);
  }

  const existing = await findMockUseCaseById(useCaseId);

  if (!existing || existing.organisationId !== context.organisation.id) {
    redirect("/use-cases");
  }

  const updated = updateMockUseCase(existing, {
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle({
    useCase: updated.useCase,
    auditEvent: updated.auditEvent,
  });

  redirect(`/use-cases/${useCaseId}?message=updated`);
}
