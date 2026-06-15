"use server";

import { redirect } from "next/navigation";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import {
  persistMockRegistryBundle,
  findMockCourseById,
  listMockCompletionsForUser,
} from "@/lib/data/mock-registry";
import { createMockCourse, createMockTrainingCompletion } from "@/lib/data/mock-store";
import {
  createSupabaseCourse,
  getSupabaseCourse,
  listSupabaseCompletionsForUser,
  markSupabaseCourseComplete,
} from "@/lib/supabase/training";
import { trainingCourseSchema } from "@/lib/validation/training";
import type { MembershipRole } from "@/lib/types";

export async function createCourseAction(formData: FormData) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const parsed = trainingCourseSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    durationMinutes: formData.get("durationMinutes"),
    requiredForRoles: formData.get("requiredForRoles"),
  });

  if (!parsed.success) {
    redirect("/training/new?error=invalid-form");
  }

  const roles = (parsed.data.requiredForRoles as string)
    .split(",")
    .map((r) => r.trim())
    .filter((r) =>
      ["owner", "admin", "reviewer", "staff"].includes(r),
    ) as MembershipRole[];

  const requiredForRoles =
    roles.length > 0 ? roles : (["owner", "admin", "reviewer", "staff"] as MembershipRole[]);

  if (isSupabaseAuthEnabled()) {
    const created = await createSupabaseCourse({
      organisationId: context.organisation.id,
      actorUserId: context.user.id,
      title: parsed.data.title,
      description: parsed.data.description,
      durationMinutes: parsed.data.durationMinutes,
      requiredForRoles,
    });
    if (!created) redirect("/training/new?error=save-failed");
    redirect(`/training/${created.id}?message=created`);
  }

  const created = createMockCourse({
    organisationId: context.organisation.id,
    actorUserId: context.user.id,
    title: parsed.data.title,
    description: parsed.data.description,
    durationMinutes: parsed.data.durationMinutes,
    requiredForRoles,
  });

  await persistMockRegistryBundle({
    trainingCourse: created.course,
    auditEvent: created.auditEvent,
  });

  redirect(`/training/${created.course.id}?message=created`);
}

export async function markCourseCompleteAction(formData: FormData) {
  const context = await requireWorkspaceContext();
  const courseId = formData.get("courseId");

  if (typeof courseId !== "string" || !courseId) {
    redirect("/training?error=missing");
  }

  if (isSupabaseAuthEnabled()) {
    const course = await getSupabaseCourse(context.organisation.id, courseId);
    if (!course) redirect("/training");
    const existing = await listSupabaseCompletionsForUser(
      context.user.id,
      context.organisation.id,
    );
    if (existing.some((c) => c.courseId === courseId)) {
      redirect(`/training/${courseId}?message=already-complete`);
    }
    await markSupabaseCourseComplete({
      courseId,
      organisationId: context.organisation.id,
      userId: context.user.id,
    });
    redirect(`/training/${courseId}?message=complete`);
  }

  const course = await findMockCourseById(courseId);

  if (!course || course.organisationId !== context.organisation.id) {
    redirect("/training");
  }

  const existing = await listMockCompletionsForUser(
    context.user.id,
    context.organisation.id,
  );

  if (existing.some((c) => c.courseId === courseId)) {
    redirect(`/training/${courseId}?message=already-complete`);
  }

  const { completion } = createMockTrainingCompletion({
    courseId,
    organisationId: context.organisation.id,
    userId: context.user.id,
  });

  await persistMockRegistryBundle({ trainingCompletion: completion });
  redirect(`/training/${courseId}?message=complete`);
}
