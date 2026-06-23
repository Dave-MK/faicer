import { AppShell } from "@/app/(app)/_components/app-shell";
import { createPolicyAction } from "@/app/actions/policies";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function NewPolicyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const params = await searchParams;

  return (
    <AppShell
      current="policies"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Policies</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
          New policy
        </h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Write a governance policy for your organisation. Drafts are invisible to staff
          until you set status to Active.
        </p>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {params.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">
            Complete all required fields before saving.
          </div>
        )}

        <form action={createPolicyAction} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Title</span>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. AI Acceptable Use Policy"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Status</span>
            <select
              name="status"
              defaultValue="draft"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="draft">Draft</option>
              <option value="under_review">Under review</option>
              <option value="active">Active</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Effective date</span>
            <input
              type="date"
              name="effectiveDate"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Policy body</span>
            <p className="text-xs text-[var(--ai-text-muted)]">
              Use Markdown: ## for headings, **bold**, - for bullet lists.
            </p>
            <textarea
              name="body"
              rows={20}
              required
              placeholder="## 1. Purpose&#10;&#10;This policy defines...&#10;&#10;## 2. Scope&#10;&#10;Applies to all staff..."
              className="brand-input w-full rounded-2xl px-4 py-3 font-mono text-sm outline-none transition"
            />
          </label>

          <button
            type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2"
          >
            Create policy
          </button>
        </form>
      </div>
    </AppShell>
  );
}
