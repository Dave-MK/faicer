import { createOrganisationAction } from "@/app/actions/organisation";
import { isSupabaseConfigured } from "@/lib/config/env";
import { requireSignedInUser } from "@/lib/auth/workspace";

export default async function OrganisationSetupPage() {
  const user = await requireSignedInUser();
  const supabaseEnabled = isSupabaseConfigured();

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-10 lg:px-10">
      <section className="rounded-[2rem] border border-line bg-panel p-8 shadow-[var(--shadow)]">
        <div className="space-y-3">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent-strong">
            Organisation setup
          </p>
          <h1 className="text-3xl font-semibold">Create another organisation</h1>
          <p className="max-w-2xl text-muted">
            {supabaseEnabled
              ? "This now writes into your real Supabase project and creates the initial owner membership."
              : "This form is intentionally lightweight. It proves the Milestone 1 path for owner-level organisation creation without pushing ahead into later governance records."}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-accent-soft bg-accent-soft px-4 py-4 text-sm text-accent-strong">
          Active user: {user.displayName}
        </div>

        <form action={createOrganisationAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Organisation name</span>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Sector</span>
            <input
              type="text"
              name="sector"
              defaultValue="Marketing agency"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Country</span>
            <input
              type="text"
              name="country"
              defaultValue="United Kingdom"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Employee band</span>
            <select
              name="employeeBand"
              defaultValue="3-10"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            >
              <option value="1-2">1-2</option>
              <option value="3-10">3-10</option>
              <option value="11-30">11-30</option>
              <option value="31-100">31-100</option>
            </select>
          </label>
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 font-medium text-white transition hover:bg-accent-strong md:col-span-2"
          >
            Create organisation
          </button>
        </form>
      </section>
    </main>
  );
}
