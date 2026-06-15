import { AppShell } from "@/app/(app)/_components/app-shell";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { createCourseAction } from "@/app/actions/training";

export default async function NewTrainingCoursePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const params = await searchParams;

  return (
    <AppShell
      current="training"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Training</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">Create a course</h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Build a training module for your team to complete as part of AI governance compliance.
        </p>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {params.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">Complete all required fields.</div>
        )}

        <form action={createCourseAction} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Course title</span>
            <input type="text" name="title" required placeholder="e.g. AI Literacy for Marketing Teams"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Duration (minutes)</span>
            <input type="number" name="durationMinutes" required min="1" max="480" defaultValue="30"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Required for roles</span>
            <input type="text" name="requiredForRoles" required defaultValue="owner,admin,reviewer,staff"
              placeholder="owner, admin, reviewer, staff"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
            <p className="text-xs text-[var(--ai-text-muted)]">Comma-separated. Values: owner, admin, reviewer, staff</p>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Description</span>
            <textarea name="description" rows={4} required placeholder="What will learners understand after completing this course?"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <button type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2">
            Create course
          </button>
        </form>
      </div>
    </AppShell>
  );
}
