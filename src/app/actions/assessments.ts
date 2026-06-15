"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { persistMockRegistryBundle } from "@/lib/data/mock-registry";
import { createMockAssessment } from "@/lib/data/mock-store";
import { createSupabaseAssessment } from "@/lib/supabase/assessments";
import { assessmentSchema } from "@/lib/validation/assessment";

export async function createAssessmentAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const parsed = assessmentSchema.safeParse({
    entityType: formData.get("entityType"),
    entityId: formData.get("entityId"),
    assessmentDate: formData.get("assessmentDate"),
    findings: formData.get("findings"),
    outcome: formData.get("outcome"),
    nextAssessmentAt: formData.get("nextAssessmentAt") || undefined,
  });

  if (!parsed.success) {
    redirect("/assessments/new?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabaseAssessment({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      ...parsed.data,
    });
    if (!created) redirect("/assessments/new?error=save-failed");
    redirect(`/assessments/${created.id}?message=created`);
  }

  const created = createMockAssessment({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle({
    assessment: created.assessment,
    auditEvent: created.auditEvent,
  });

  redirect(`/assessments/${created.assessment.id}?message=created`);
}
