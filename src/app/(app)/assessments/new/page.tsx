import { AppShell } from "@/app/(app)/_components/app-shell";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { createAssessmentAction } from "@/app/actions/assessments";
import { listMockToolsForOrganisation, listMockUseCasesForOrganisation, listMockControlsForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseTools } from "@/lib/supabase/tools";
import { listSupabaseUseCases } from "@/lib/supabase/use-cases";
import { listSupabaseControls } from "@/lib/supabase/controls";

export default async function NewAssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const params = await searchParams;
  const [tools, useCases, controls] = await Promise.all([
    isSupabaseAuthEnabled()
      ? listSupabaseTools(context.organisation.id)
      : listMockToolsForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseUseCases(context.organisation.id)
      : listMockUseCasesForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseControls(context.organisation.id)
      : listMockControlsForOrganisation(context.organisation.id),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <AppShell
      current="assessments"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Assessments</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">New assessment</h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Record the outcome of a formal review or audit against your AI tools, use cases, or controls.
        </p>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {params.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">Complete all required fields.</div>
        )}

        <form action={createAssessmentAction} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Entity type</span>
            <select name="entityType" defaultValue="ai_tool" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="ai_tool">AI Tool</option>
              <option value="use_case">Use Case</option>
              <option value="control">Control</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Linked entity</span>
            <select name="entityId" defaultValue="" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="">Select entity</option>
              <optgroup label="AI Tools">
                {tools.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </optgroup>
              <optgroup label="Use Cases">
                {useCases.map((uc) => <option key={uc.id} value={uc.id}>{uc.title}</option>)}
              </optgroup>
              <optgroup label="Controls">
                {controls.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </optgroup>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Assessment date</span>
            <input type="date" name="assessmentDate" required defaultValue={today}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Next assessment</span>
            <input type="date" name="nextAssessmentAt"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Outcome</span>
            <select name="outcome" defaultValue="pass" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="pass">Pass</option>
              <option value="conditional">Conditional</option>
              <option value="fail">Fail</option>
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Findings</span>
            <textarea name="findings" rows={5} required placeholder="Summarise the findings and any actions required."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <button type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2">
            Save assessment
          </button>
        </form>
      </div>
    </AppShell>
  );
}
