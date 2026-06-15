"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { persistMockRegistryBundle, findMockIncidentById } from "@/lib/data/mock-registry";
import { createMockIncident, updateMockIncident } from "@/lib/data/mock-store";
import { createSupabaseIncident, updateSupabaseIncident } from "@/lib/supabase/incidents";
import { incidentSchema } from "@/lib/validation/incident";

function parseInput(formData: FormData) {
  return incidentSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    severity: formData.get("severity"),
    status: formData.get("status") || "open",
    linkedToolId: formData.get("linkedToolId") || undefined,
    linkedUseCaseId: formData.get("linkedUseCaseId") || undefined,
    assignedToUserId: formData.get("assignedToUserId") || undefined,
  });
}

export async function createIncidentAction(formData: FormData) {
  const context = await requireWorkspaceContext();
  const parsed = parseInput(formData);

  if (!parsed.success) {
    redirect("/incidents/new?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabaseIncident({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      severity: parsed.data.severity,
      linkedToolId: parsed.data.linkedToolId,
      linkedUseCaseId: parsed.data.linkedUseCaseId,
    });
    if (!created) redirect("/incidents/new?error=save-failed");
    redirect(`/incidents/${created.id}?message=created`);
  }

  const created = createMockIncident({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    severity: parsed.data.severity,
    linkedToolId: parsed.data.linkedToolId,
    linkedUseCaseId: parsed.data.linkedUseCaseId,
  });

  await persistMockRegistryBundle({
    incident: created.incident,
    auditEvent: created.auditEvent,
  });

  redirect(`/incidents/${created.incident.id}?message=created`);
}

export async function updateIncidentAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const incidentId = formData.get("incidentId");

  if (typeof incidentId !== "string" || !incidentId) {
    redirect("/incidents?error=missing");
  }

  const parsed = parseInput(formData);

  if (!parsed.success) {
    redirect(`/incidents/${incidentId}?error=invalid-form`);
  }

  if (isSupabaseAuthEnabled()) {
    const updated = await updateSupabaseIncident({
      incidentId,
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      severity: parsed.data.severity,
      status: parsed.data.status,
      assignedToUserId: parsed.data.assignedToUserId,
    });
    if (!updated) redirect(`/incidents/${incidentId}?error=save-failed`);
    redirect(`/incidents/${incidentId}?message=updated`);
  }

  const existing = await findMockIncidentById(incidentId);

  if (!existing || existing.organisationId !== context.organisation.id) {
    redirect("/incidents");
  }

  const updated = updateMockIncident(existing, {
    actorUserId: context.user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    severity: parsed.data.severity,
    status: parsed.data.status,
    assignedToUserId: parsed.data.assignedToUserId,
  });

  await persistMockRegistryBundle({
    incident: updated.incident,
    auditEvent: updated.auditEvent,
  });

  redirect(`/incidents/${incidentId}?message=updated`);
}
