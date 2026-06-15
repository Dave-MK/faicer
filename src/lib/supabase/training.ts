import "server-only";

import type { WorkspaceTrainingCourse, WorkspaceTrainingCompletion, MembershipRole } from "@/lib/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function mapCourse(row: Record<string, unknown>): WorkspaceTrainingCourse {
  return {
    id: String(row.id),
    organisationId: String(row.organisation_id),
    title: String(row.title),
    description: String(row.description ?? ""),
    requiredForRoles: Array.isArray(row.required_for_roles)
      ? (row.required_for_roles as MembershipRole[])
      : ["owner", "admin", "reviewer", "staff"],
    durationMinutes: Number(row.duration_minutes ?? 30),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

function mapCompletion(row: Record<string, unknown>): WorkspaceTrainingCompletion {
  return {
    id: String(row.id),
    courseId: String(row.course_id),
    organisationId: String(row.organisation_id),
    userId: String(row.user_id),
    completedAt: String(row.completed_at),
    certificateUrl: row.certificate_url ? String(row.certificate_url) : null,
  };
}

export async function listSupabaseCourses(organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("training_courses")
    .select("*")
    .eq("organisation_id", organisationId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((row) => mapCourse(row));
}

export async function getSupabaseCourse(organisationId: string, courseId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("training_courses")
    .select("*")
    .eq("organisation_id", organisationId)
    .eq("id", courseId)
    .maybeSingle();
  return data ? mapCourse(data) : null;
}

export async function listSupabaseCompletionsForUser(userId: string, organisationId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("training_completions")
    .select("*")
    .eq("user_id", userId)
    .eq("organisation_id", organisationId);
  return (data ?? []).map((row) => mapCompletion(row));
}

export async function createSupabaseCourse(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  durationMinutes: number;
  requiredForRoles: MembershipRole[];
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("training_courses")
    .insert({
      organisation_id: input.organisationId,
      title: input.title,
      description: input.description,
      duration_minutes: input.durationMinutes,
      required_for_roles: input.requiredForRoles,
    })
    .select("*")
    .single();

  if (error || !data) return null;

  await supabase.from("audit_events").insert({
    organisation_id: input.organisationId,
    actor_user_id: input.actorUserId,
    action: "training_course.created",
    entity_type: "training_course",
    entity_id: data.id,
    metadata_json: { title: input.title },
  });

  return mapCourse(data);
}

export async function markSupabaseCourseComplete(input: {
  courseId: string;
  organisationId: string;
  userId: string;
}) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("training_completions")
    .upsert(
      {
        course_id: input.courseId,
        organisation_id: input.organisationId,
        user_id: input.userId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "course_id,user_id" },
    )
    .select("*")
    .single();

  if (error || !data) return null;
  return mapCompletion(data);
}
