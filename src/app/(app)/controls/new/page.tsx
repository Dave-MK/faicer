import { AppShell } from "@/app/(app)/_components/app-shell";
import { createControlAction } from "@/app/actions/controls";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockRisksForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseRisks } from "@/lib/supabase/risks";

export default async function NewControlPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const params = await searchParams;
  const risks = isSupabaseAuthEnabled()
    ? await listSupabaseRisks(context.organisation.id)
    : await listMockRisksForOrganisation(context.organisation.id);

  return (
    <AppShell
      current="controls"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Controls</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">Add a control</h1>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {params.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">Complete all required fields.</div>
        )}

        <form action={createControlAction} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Control title</span>
            <input type="text" name="title" required placeholder="e.g. Mandatory AI data handling training"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Type</span>
            <select name="type" defaultValue="process" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="technical">Technical</option>
              <option value="policy">Policy</option>
              <option value="training">Training</option>
              <option value="process">Process</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Status</span>
            <select name="status" defaultValue="active" className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          <input type="hidden" name="ownerUserId" value={context.user.id} />

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Description</span>
            <textarea name="description" rows={4} required placeholder="Describe the control and how it reduces risk."
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
          </label>

          {risks.length > 0 && (
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Linked risks (IDs, comma-separated)</span>
              <input type="text" name="linkedRiskIds" placeholder="Leave blank or enter risk IDs"
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
              <p className="text-xs text-[var(--ai-text-muted)]">
                Risks: {risks.map((r) => `${r.title} (${r.id.slice(0, 8)})`).join(" · ")}
              </p>
            </label>
          )}

          <button type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2">
            Save control
          </button>
        </form>
      </div>
    </AppShell>
  );
}
