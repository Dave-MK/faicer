"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { persistMockRegistryBundle } from "@/lib/data/mock-registry";
import { createMockEvidenceItem } from "@/lib/data/mock-store";
import { createSupabaseEvidence } from "@/lib/supabase/evidence";
import { evidenceSchema } from "@/lib/validation/evidence";

export async function createEvidenceAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const parsed = evidenceSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    linkedEntityType: formData.get("linkedEntityType"),
    linkedEntityId: formData.get("linkedEntityId"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    redirect("/evidence/new?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabaseEvidence({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      ...parsed.data,
    });
    if (!created) redirect("/evidence/new?error=save-failed");
    redirect(`/evidence/${created.id}?message=created`);
  }

  const created = createMockEvidenceItem({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle({
    evidenceItem: created.evidenceItem,
    auditEvent: created.auditEvent,
  });

  redirect(`/evidence/${created.evidenceItem.id}?message=created`);
}
