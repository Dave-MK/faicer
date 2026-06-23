import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { findMockCourseById, listMockCompletionsForUser } from "@/lib/data/mock-registry";
import { getSupabaseCourse, listSupabaseCompletionsForUser } from "@/lib/supabase/training";
import { markCourseCompleteAction } from "@/app/actions/training";

export default async function TrainingCourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { id } = await params;
  const sp = await searchParams;
  const [course, completions] = await Promise.all([
    isSupabaseAuthEnabled()
      ? getSupabaseCourse(context.organisation.id, id)
      : findMockCourseById(id),
    isSupabaseAuthEnabled()
      ? listSupabaseCompletionsForUser(context.user.id, context.organisation.id)
      : listMockCompletionsForUser(context.user.id, context.organisation.id),
  ]);

  if (!course || course.organisationId !== context.organisation.id) notFound();

  const myCompletion = completions.find((c) => c.courseId === id);
  const isRequired = course.requiredForRoles.includes(context.membership.role);

  return (
    <AppShell
      current="training"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="Training"
        title={course.title}
        description={`${course.durationMinutes} min · Required for: ${course.requiredForRoles.join(", ")}`}
      />

      {sp.message === "created" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">Course created.</div>
      )}
      {sp.message === "complete" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          Course completed.
        </div>
      )}
      {sp.message === "already-complete" && (
        <div className="mb-5 brand-status-info rounded-2xl px-4 py-4 text-sm">
          You have already completed this course.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <WorkspacePanel>
          <p className="text-sm font-semibold text-white">Course overview</p>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">{course.description}</p>

          <div className="mt-5 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--ai-text-muted)]">Learning objectives</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--ai-text-secondary)]">
              <li>Understand organisational AI governance policies</li>
              <li>Identify appropriate and prohibited AI use cases</li>
              <li>Know how to report AI incidents or concerns</li>
              <li>Recognise data handling obligations when using AI tools</li>
            </ul>
          </div>
        </WorkspacePanel>

        <div className="space-y-5">
          <WorkspacePanel>
            <p className="text-sm text-[var(--ai-text-secondary)]">Your status</p>
            <div className="mt-3">
              {myCompletion ? (
                <>
                  <StatusPill label="Complete" tone="success" />
                  <p className="mt-3 text-xs text-[var(--ai-text-muted)]">
                    Completed {new Date(myCompletion.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </>
              ) : (
                <>
                  <StatusPill label={isRequired ? "Required" : "Optional"} tone={isRequired ? "warning" : "muted"} />
                  <form action={markCourseCompleteAction} className="mt-4">
                    <input type="hidden" name="courseId" value={course.id} />
                    <button type="submit"
                      className="brand-button-primary w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition">
                      Mark as complete
                    </button>
                  </form>
                </>
              )}
            </div>
          </WorkspacePanel>
          <WorkspacePanel>
            <p className="text-sm font-semibold text-white">Details</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--ai-text-muted)]">Duration</span>
                <span className="text-white">{course.durationMinutes} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ai-text-muted)]">Required for</span>
                <span className="text-white capitalize">{course.requiredForRoles.join(", ")}</span>
              </div>
            </div>
          </WorkspacePanel>
          <div>
            <Link href="/training"
              className="block text-sm text-[var(--ai-cyan)] hover:text-white">
              ← Back to all courses
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
