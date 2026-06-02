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
      current="tools"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
      eyebrow="AI tool register"
      title="Add a new AI tool"
      description="Create the first governance record for an AI product your team uses. The current user becomes both the account owner and business owner for this initial milestone."
    >
      <section className="brand-panel rounded-[2rem] p-8">
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
            className="brand-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 font-medium transition md:col-span-2"
          >
            Save tool record
          </button>
        </form>
      </section>
    </AppShell>
  );
}
