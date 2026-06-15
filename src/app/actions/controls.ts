"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { persistMockRegistryBundle, findMockControlById } from "@/lib/data/mock-registry";
import { createMockControl, updateMockControl } from "@/lib/data/mock-store";
import { createSupabaseControl, updateSupabaseControl } from "@/lib/supabase/controls";
import { controlSchema } from "@/lib/validation/control";

function parseInput(formData: FormData) {
  return controlSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
    status: formData.get("status"),
    ownerUserId: formData.get("ownerUserId"),
    linkedRiskIds: formData.get("linkedRiskIds") || undefined,
  });
}

function parseLinkedRiskIds(raw?: string): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createControlAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const parsed = parseInput(formData);

  if (!parsed.success) {
    redirect("/controls/new?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabaseControl({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type,
      status: parsed.data.status ?? "planned",
      linkedRiskIds: parseLinkedRiskIds(parsed.data.linkedRiskIds),
      ownerUserId: parsed.data.ownerUserId,
    });
    if (!created) redirect("/controls/new?error=save-failed");
    redirect(`/controls/${created.id}?message=created`);
  }

  const created = createMockControl({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    type: parsed.data.type,
    ownerUserId: parsed.data.ownerUserId,
    linkedRiskIds: parseLinkedRiskIds(parsed.data.linkedRiskIds),
  });

  await persistMockRegistryBundle({ control: created.control, auditEvent: created.auditEvent });
  redirect(`/controls/${created.control.id}?message=created`);
}

export async function updateControlAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const controlId = formData.get("controlId");

  if (typeof controlId !== "string" || !controlId) {
    redirect("/controls?error=missing");
  }

  const parsed = parseInput(formData);

  if (!parsed.success) {
    redirect(`/controls/${controlId}?error=invalid-form`);
  }

  if (isSupabaseAuthEnabled()) {
    const updated = await updateSupabaseControl({
      controlId,
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      type: parsed.data.type,
      status: parsed.data.status ?? "planned",
      ownerUserId: parsed.data.ownerUserId,
    });
    if (!updated) redirect(`/controls/${controlId}?error=save-failed`);
    redirect(`/controls/${controlId}?message=updated`);
  }

  const existing = await findMockControlById(controlId);

  if (!existing || existing.organisationId !== context.organisation.id) {
    redirect("/controls");
  }

  const updated = updateMockControl(existing, {
    actorUserId: context.user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    type: parsed.data.type,
    status: parsed.data.status,
    ownerUserId: parsed.data.ownerUserId,
    linkedRiskIds: parseLinkedRiskIds(parsed.data.linkedRiskIds),
  });

  await persistMockRegistryBundle({ control: updated.control, auditEvent: updated.auditEvent });
  redirect(`/controls/${controlId}?message=updated`);
}
