import { AppShell } from "@/app/(app)/_components/app-shell";
import { createRiskAction } from "@/app/actions/risks";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import {
  listMockToolsForOrganisation,
  listMockUseCasesForOrganisation,
} from "@/lib/data/mock-registry";
import { listSupabaseTools } from "@/lib/supabase/tools";
import { listSupabaseUseCases } from "@/lib/supabase/use-cases";

export default async function NewRiskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const params = await searchParams;
  const [tools, useCases] = await Promise.all([
    isSupabaseAuthEnabled()
      ? listSupabaseTools(context.organisation.id)
      : listMockToolsForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseUseCases(context.organisation.id)
      : listMockUseCasesForOrganisation(context.organisation.id),
  ]);

  return (
    <AppShell
      current="risks"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Risk Register</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
          Add a new risk
        </h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Score the risk by severity and likelihood — the risk level is computed automatically.
        </p>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {params.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">
            Complete all required fields before saving.
          </div>
        )}

        <form action={createRiskAction} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Title</span>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Accidental data leak via AI tool"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Entity type</span>
            <select
              name="entityType"
              defaultValue="ai_tool"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="ai_tool">Tool</option>
              <option value="use_case">Use Case</option>
              <option value="organisation">Organisation</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Linked entity</span>
            <select
              name="entityId"
              defaultValue=""
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="">Select entity</option>
              <optgroup label="AI Tools">
                {tools.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </optgroup>
              <optgroup label="Use Cases">
                {useCases.map((uc) => (
                  <option key={uc.id} value={uc.id}>{uc.title}</option>
                ))}
              </optgroup>
              <option value={context.organisation.id}>
                {context.organisation.name} (org-wide)
              </option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Severity</span>
            <select
              name="severity"
              defaultValue="3"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="1">1 – Negligible</option>
              <option value="2">2 – Minor</option>
              <option value="3">3 – Moderate</option>
              <option value="4">4 – Significant</option>
              <option value="5">5 – Severe</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Likelihood</span>
            <select
              name="likelihood"
              defaultValue="3"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="1">1 – Rare</option>
              <option value="2">2 – Unlikely</option>
              <option value="3">3 – Possible</option>
              <option value="4">4 – Likely</option>
              <option value="5">5 – Almost certain</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Status</span>
            <select
              name="status"
              defaultValue="open"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="open">Open</option>
              <option value="mitigated">Mitigated</option>
              <option value="accepted">Accepted</option>
              <option value="closed">Closed</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Owner</span>
            <input type="hidden" name="ownerUserId" value={context.user.id} />
            <input
              type="text"
              readOnly
              value={context.user.displayName}
              className="brand-input w-full rounded-2xl px-4 py-3 opacity-70 outline-none"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Description</span>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Describe the nature of the risk and potential impact."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Mitigation</span>
            <textarea
              name="mitigation"
              rows={3}
              required
              placeholder="Describe controls or steps in place to reduce this risk."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <button
            type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2"
          >
            Save risk
          </button>
        </form>
      </div>
    </AppShell>
  );
}
