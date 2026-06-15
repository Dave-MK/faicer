import { AppShell } from "@/app/(app)/_components/app-shell";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { createEvidenceAction } from "@/app/actions/evidence";
import { listMockToolsForOrganisation, listMockUseCasesForOrganisation, listMockRisksForOrganisation, listMockControlsForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseTools } from "@/lib/supabase/tools";
import { listSupabaseUseCases } from "@/lib/supabase/use-cases";
import { listSupabaseRisks } from "@/lib/supabase/risks";
import { listSupabaseControls } from "@/lib/supabase/controls";

export default async function NewEvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const params = await searchParams;
  const [tools, useCases, risks, controls] = await Promise.all([
    isSupabaseAuthEnabled()
      ? listSupabaseTools(context.organisation.id)
      : listMockToolsForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseUseCases(context.organisation.id)
      : listMockUseCasesForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseRisks(context.organisation.id)
      : listMockRisksForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseControls(context.organisation.id)
      : listMockControlsForOrganisation(context.organisation.id),
  ]);

  return (
    <AppShell
      current="evidence"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Evidence Pack</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">Add evidence</h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Link documents, screenshots, or audit records to your governance framework.
        </p>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {params.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">Complete all required fields.</div>
        )}

        <form action={createEvidenceAction} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Title</span>
            <input type="text" name="title" required placeholder="e.g. Vendor Data Processing Agreement – OpenAI"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Evidence type</span>
            <select name="type" defaultValue="document" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="document">Document</option>
              <option value="screenshot">Screenshot</option>
              <option value="audit_log">Audit log</option>
              <option value="assessment">Assessment</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Linked entity type</span>
            <select name="linkedEntityType" defaultValue="ai_tool" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="ai_tool">AI Tool</option>
              <option value="use_case">Use Case</option>
              <option value="risk">Risk</option>
              <option value="control">Control</option>
              <option value="organisation">Organisation</option>
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Linked entity</span>
            <select name="linkedEntityId" defaultValue="" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="">Select entity</option>
              <optgroup label="AI Tools">
                {tools.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </optgroup>
              <optgroup label="Use Cases">
                {useCases.map((uc) => <option key={uc.id} value={uc.id}>{uc.title}</option>)}
              </optgroup>
              <optgroup label="Risks">
                {risks.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
              </optgroup>
              <optgroup label="Controls">
                {controls.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </optgroup>
              <option value={context.organisation.id}>{context.organisation.name} (org-wide)</option>
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Notes</span>
            <textarea name="notes" rows={4} placeholder="Optional context, source, or expiry date."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <button type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2">
            Save evidence
          </button>
        </form>
      </div>
    </AppShell>
  );
}
