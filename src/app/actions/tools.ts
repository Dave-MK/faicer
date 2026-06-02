"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { persistMockRegistryBundle, findMockToolById } from "@/lib/data/mock-registry";
import { createMockTool, updateMockTool } from "@/lib/data/mock-store";
import { createSupabaseTool, updateSupabaseTool } from "@/lib/supabase/tools";
import { toolSchema } from "@/lib/validation/tool";

function getOptionalString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : undefined;
}

function parseToolInput(formData: FormData) {
  return toolSchema.safeParse({
    name: formData.get("name"),
    vendor: formData.get("vendor"),
    websiteUrl: getOptionalString(formData, "websiteUrl"),
    category: formData.get("category"),
    approvalStatus: formData.get("approvalStatus"),
    privacyPolicyUrl: getOptionalString(formData, "privacyPolicyUrl"),
    dataProcessingNotes: getOptionalString(formData, "dataProcessingNotes"),
    notes: getOptionalString(formData, "notes"),
    nextReviewAt: formData.get("nextReviewAt"),
  });
}

export async function createToolAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const parsed = parseToolInput(formData);

  if (!parsed.success) {
    redirect("/tools/new?error=invalid-form");
  }

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabaseTool({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      accountOwnerUserId: context.user.id,
      businessOwnerUserId: context.user.id,
      ...parsed.data,
    });

    if (!created) {
      redirect("/tools/new?error=save-failed");
    }

    redirect(`/tools/${created.id}?message=created`);
  }

  const created = createMockTool({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    accountOwnerUserId: context.user.id,
    businessOwnerUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle(created);
  redirect(`/tools/${created.tool.id}?message=created`);
}

export async function updateToolAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const toolId = getOptionalString(formData, "toolId");

  if (!toolId) {
    redirect("/tools?error=missing-tool");
  }

  const parsed = parseToolInput(formData);

  if (!parsed.success) {
    redirect(`/tools/${toolId}?error=invalid-form`);
  }

  if (isSupabaseAuthEnabled()) {
    const updated = await updateSupabaseTool({
      toolId,
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      ...parsed.data,
    });

    if (!updated) {
      redirect(`/tools/${toolId}?error=save-failed`);
    }

    redirect(`/tools/${toolId}?message=updated`);
  }

  const existing = await findMockToolById(toolId);

  if (!existing || existing.organisationId !== context.organisation.id) {
    redirect("/tools");
  }

  const updated = updateMockTool(existing, {
    actorUserId: context.user.id,
    ...parsed.data,
  });

  await persistMockRegistryBundle(updated);
  redirect(`/tools/${toolId}?message=updated`);
}
