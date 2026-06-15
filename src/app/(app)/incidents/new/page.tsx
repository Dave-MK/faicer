import { AppShell } from "@/app/(app)/_components/app-shell";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { createIncidentAction } from "@/app/actions/incidents";
import { listMockToolsForOrganisation, listMockUseCasesForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseTools } from "@/lib/supabase/tools";
import { listSupabaseUseCases } from "@/lib/supabase/use-cases";

export default async function NewIncidentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext();
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
      current="incidents"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Incidents</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">Report an incident</h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Log AI-related incidents, near-misses, or governance failures for investigation and review.
        </p>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {params.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">Complete all required fields.</div>
        )}

        <form action={createIncidentAction} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Incident title</span>
            <input type="text" name="title" required placeholder="e.g. AI tool returned biased output in candidate screening"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Severity</span>
            <select name="severity" defaultValue="medium" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Linked AI tool (optional)</span>
            <select name="linkedToolId" defaultValue="" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="">None</option>
              {tools.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Linked use case (optional)</span>
            <select name="linkedUseCaseId" defaultValue="" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="">None</option>
              {useCases.map((uc) => <option key={uc.id} value={uc.id}>{uc.title}</option>)}
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Description</span>
            <textarea name="description" rows={5} required placeholder="Describe what happened, who was affected, and what data was involved."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <button type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2">
            Submit report
          </button>
        </form>
      </div>
    </AppShell>
  );
}
