import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
} from "@/app/(app)/_components/workspace-primitives";
import { AppIcon } from "@/components/AppIcons";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockCoursesForOrganisation, listMockCompletionsForUser } from "@/lib/data/mock-registry";
import { listSupabaseCourses, listSupabaseCompletionsForUser } from "@/lib/supabase/training";

export default async function TrainingPage() {
  const context = await requireWorkspaceContext();
  const [courses, completions] = await Promise.all([
    isSupabaseAuthEnabled()
      ? listSupabaseCourses(context.organisation.id)
      : listMockCoursesForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseCompletionsForUser(context.user.id, context.organisation.id)
      : listMockCompletionsForUser(context.user.id, context.organisation.id),
  ]);

  const completedIds = new Set(completions.map((c) => c.courseId));
  const myRequired = courses.filter((c) => c.requiredForRoles.includes(context.membership.role));
  const completedCount = myRequired.filter((c) => completedIds.has(c.id)).length;
  const progress = myRequired.length > 0 ? Math.round((completedCount / myRequired.length) * 100) : 100;

  return (
    <AppShell
      current="training"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Training"
        description="Complete required AI governance training to maintain your certification status."
        actions={
          context.permissions.canManageOrganisation ? (
            <Link
              href="/training/new"
              className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="plus" className="h-4 w-4" />
              Add course
            </Link>
          ) : null
        }
      />

      <div className="mb-5 brand-panel rounded-[2rem] p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-white">Your progress</span>
          <span className="text-[var(--ai-cyan)]">{completedCount} / {myRequired.length} required courses complete</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-[rgba(18,31,53,0.95)]">
          <div
            className="h-2 rounded-full bg-[linear-gradient(90deg,#FF4DB8_0%,#B24DFF_100%)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-right text-sm font-semibold text-white">{progress}%</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {courses.map((course) => {
          const done = completedIds.has(course.id);
          const required = course.requiredForRoles.includes(context.membership.role);
          return (
            <Link key={course.id} href={`/training/${course.id}`}
              className="block rounded-[2rem] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.025)] p-6 hover:border-[var(--ai-cyan)] transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{course.title}</p>
                  <p className="mt-1 text-sm text-[var(--ai-text-secondary)]">{course.description}</p>
                </div>
                {done
                  ? <StatusPill label="Complete" tone="success" />
                  : required
                    ? <StatusPill label="Required" tone="warning" />
                    : <StatusPill label="Optional" tone="muted" />}
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-[var(--ai-text-muted)]">
                <span>{course.durationMinutes} min</span>
                <span>·</span>
                <span>Required for: {course.requiredForRoles.join(", ")}</span>
              </div>
            </Link>
          );
        })}
        {courses.length === 0 && (
          <div className="col-span-2 rounded-[2rem] border border-[var(--ai-border)] px-6 py-10 text-center text-sm text-[var(--ai-text-secondary)]">
            No training courses available yet.{" "}
            {context.permissions.canManageOrganisation && (
              <Link href="/training/new" className="text-[var(--ai-cyan)]">Create the first course.</Link>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
