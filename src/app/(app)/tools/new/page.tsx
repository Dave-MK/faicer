import { AppShell } from "@/app/(app)/_components/app-shell";
import { createToolAction } from "@/app/actions/tools";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import {
  toolApprovalOptions,
  toolCategoryOptions,
} from "@/lib/tools/catalog";

function getFeedback(params: { error?: string }) {
  if (params.error === "invalid-form") {
    return "Complete the required tool fields before saving.";
  }

  if (params.error === "save-failed") {
    return "The tool could not be saved. Please try again.";
  }

  return null;
}

export default async function NewToolPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const params = await searchParams;
  const feedback = getFeedback(params);

  return (
    <AppShell
      current="register"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">AI tool register</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
          Add a new AI tool
        </h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Create the first governance record for an AI product your team uses.
          The current user becomes both the account owner and business owner for
          this initial milestone.
        </p>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="brand-panel rounded-[2rem] p-8">
        {feedback ? (
          <div className="brand-status-danger rounded-2xl px-4 py-4 text-sm">
            {feedback}
          </div>
        ) : null}

        <form action={createToolAction} className="mt-2 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Tool name</span>
            <input
              type="text"
              name="name"
              required
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Vendor</span>
            <input
              type="text"
              name="vendor"
              required
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Website URL</span>
            <input
              type="url"
              name="websiteUrl"
              placeholder="https://example.com"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Category</span>
            <select
              name="category"
              defaultValue="general_chatbot"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              {toolCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Approval status</span>
            <select
              name="approvalStatus"
              defaultValue="approved"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              {toolApprovalOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Next review date</span>
            <input
              type="date"
              name="nextReviewAt"
              required
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Privacy policy URL</span>
            <input
              type="url"
              name="privacyPolicyUrl"
              placeholder="https://example.com/privacy"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Data-processing notes</span>
            <textarea
              name="dataProcessingNotes"
              rows={4}
              placeholder="Summarise what data may be entered and what must never be entered."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Internal notes</span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Capture approval conditions, human-review requirements, or rollout notes."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <button
            type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2"
          >
            Save tool record
          </button>
        </form>
        </div>

        <aside className="brand-panel-highlight rounded-[2rem] p-8 text-white">
          <p className="brand-eyebrow">What gets captured</p>
          <h2 className="mt-2 text-2xl font-semibold">Approval-ready from the start</h2>
          <div className="mt-6 space-y-4">
            {[
              "Provider and category classification",
              "Review timing for lifecycle oversight",
              "Privacy and data processing notes",
              "Internal approval conditions and rollout notes",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--ai-cyan)]" />
                <p className="text-sm text-[var(--ai-text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-[22px] border border-white/12 bg-white/5 px-5 py-5">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--ai-cyan)]">
              Best practice
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
              Start with the vendor, intended category, review date, and basic
              handling notes. We can layer in use cases, controls, evidence, and
              risk posture once the register baseline is live.
            </p>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
