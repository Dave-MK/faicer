import { AppShell } from "@/app/(app)/_components/app-shell";
import { createUseCaseAction } from "@/app/actions/use-cases";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { listMockToolsForOrganisation } from "@/lib/data/mock-registry";
import { euAiActTierOptions } from "@/lib/frameworks/eu-ai-act";

export default async function NewUseCasePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const params = await searchParams;
  const tools = await listMockToolsForOrganisation(context.organisation.id);

  return (
    <AppShell
      current="use-cases"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">AI Use Cases</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
          Add a new use case
        </h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Document how a specific AI tool is being used, who owns it, what data is involved,
          and the risk level.
        </p>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {params.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">
            Complete all required fields before saving.
          </div>
        )}

        <form action={createUseCaseAction} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Title</span>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Draft marketing content with ChatGPT"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">AI Tool</span>
            <select
              name="toolId"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="">Select a tool</option>
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Business unit</span>
            <input
              type="text"
              name="businessUnit"
              required
              placeholder="e.g. Marketing, Engineering"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Risk level</span>
            <select
              name="riskLevel"
              defaultValue="low"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">EU AI Act risk tier</span>
            <select
              name="euAiActTier"
              defaultValue="unclassified"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              {euAiActTierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="block text-xs text-[var(--ai-text-muted)]">
              Decision-support, not legal advice. Confirm the tier with a competent person.
            </span>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Status</span>
            <select
              name="status"
              defaultValue="draft"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="restricted">Restricted</option>
              <option value="prohibited">Prohibited</option>
            </select>
          </label>

          <input type="hidden" name="ownerUserId" value={context.user.id} />

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Description</span>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Describe how and why this tool is used in this context."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Data involved</span>
            <textarea
              name="dataInvolved"
              rows={3}
              placeholder="Describe what data may be entered and any restrictions."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Mitigations</span>
            <textarea
              name="mitigations"
              rows={3}
              placeholder="Describe controls or review steps applied to reduce risk."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Next review date</span>
            <input
              type="date"
              name="nextReviewAt"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <div className="flex items-end md:col-span-2">
            <button
              type="submit"
              className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition"
            >
              Save use case
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
