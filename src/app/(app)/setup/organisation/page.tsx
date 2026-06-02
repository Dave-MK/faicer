import { AppShell } from "@/app/(app)/_components/app-shell";
import { createOrganisationAction } from "@/app/actions/organisation";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function OrganisationSetupPage() {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const supabaseEnabled = isSupabaseAuthEnabled();

  return (
    <AppShell
      current="setup"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
      eyebrow="Organisation setup"
      title="Create another organisation"
      description={
        supabaseEnabled
          ? "This now writes into your real Supabase project and creates the initial owner membership."
          : "This form is intentionally lightweight. It proves the Milestone 1 path for owner-level organisation creation without pushing ahead into later governance records."
      }
    >
      <section className="brand-panel rounded-[2rem] p-8">
        <div className="brand-panel-soft rounded-2xl px-4 py-4 text-sm text-muted">
          <span className="brand-eyebrow">Active user</span>
          <p className="mt-3 text-base font-semibold text-ink">
            {context.user.displayName}
          </p>
        </div>

        <form action={createOrganisationAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Organisation name</span>
            <input
              type="text"
              name="name"
              required
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Sector</span>
            <input
              type="text"
              name="sector"
              defaultValue="Marketing agency"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Country</span>
            <input
              type="text"
              name="country"
              defaultValue="United Kingdom"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Employee band</span>
            <select
              name="employeeBand"
              defaultValue="3-10"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="1-2">1-2</option>
              <option value="3-10">3-10</option>
              <option value="11-30">11-30</option>
              <option value="31-100">31-100</option>
            </select>
          </label>
          <button
            type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 font-medium transition md:col-span-2"
          >
            Create organisation
          </button>
        </form>
      </section>
    </AppShell>
  );
}
