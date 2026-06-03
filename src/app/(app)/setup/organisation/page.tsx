import { AppShell } from "@/app/(app)/_components/app-shell";
import { createOrganisationAction } from "@/app/actions/organisation";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function OrganisationSetupPage() {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const supabaseEnabled = isSupabaseAuthEnabled();

  return (
    <AppShell
      current="overview"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Organisation setup / onboarding</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
          Welcome to AI Ledger
        </h1>
        <p className="mt-3 max-w-[760px] text-lg leading-8 text-[var(--ai-text-secondary)]">
          Set up your organisation to get started.
        </p>
      </section>

      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        {["Organisation", "Governance", "Integrations", "Review"].map(
          (label, index) => (
            <div
              key={label}
              className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.82)] px-4 py-4"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                    index === 0
                      ? "bg-[linear-gradient(135deg,#1c65ff_0%,#7a38ff_100%)] text-white"
                      : "bg-[rgba(255,255,255,0.06)] text-[var(--ai-text-secondary)]"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-white">{label}</span>
              </div>
            </div>
          ),
        )}
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="brand-panel rounded-[2rem] p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white">Organisation details</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
              These details will be used across your AI governance program.
            </p>
          </div>

          <form action={createOrganisationAction} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Organisation name</span>
              <input
                type="text"
                name="name"
                required
                defaultValue={context.organisation.name}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Industry</span>
              <input
                type="text"
                name="sector"
                defaultValue={context.organisation.sector}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Country</span>
              <input
                type="text"
                name="country"
                defaultValue={context.organisation.country}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Employee band</span>
              <select
                name="employeeBand"
                defaultValue={context.organisation.employeeBand}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              >
                <option value="1-2">1-2</option>
                <option value="3-10">3-10</option>
                <option value="11-30">11-30</option>
                <option value="31-100">31-100</option>
                <option value="101-250">101-250</option>
              </select>
            </label>
            <button
              type="submit"
              className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2"
            >
              Save and continue
            </button>
          </form>
        </div>

        <aside className="grid gap-5">
          <div className="brand-panel-highlight rounded-[2rem] p-8 text-white">
            <p className="brand-eyebrow">What&apos;s included</p>
            <div className="mt-5 space-y-4">
              {[
                "AI tool register",
                "Use case management",
                "Risk and compliance views",
                "Evidence tracking",
                "Reporting and audit trails",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(19,231,132,0.16)] text-[var(--ai-success)]">
                    ✓
                  </span>
                  <span className="text-sm text-[var(--ai-text-secondary)]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="brand-panel rounded-[2rem] p-8">
            <p className="brand-eyebrow">Your plan</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {supabaseEnabled ? "Enterprise" : "Starter workspace"}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--ai-text-secondary)]">
              {supabaseEnabled
                ? "Connected to your live Supabase project with real organisation membership creation."
                : "Running in a safe local workspace so we can shape the flow before turning on the live stack."}
            </p>
            <p className="mt-6 text-sm font-medium text-[var(--ai-cyan)]">
              View plan details
            </p>
          </div>

          <div className="brand-panel-soft rounded-[2rem] px-5 py-5">
            <span className="brand-eyebrow">Active user</span>
            <p className="mt-3 text-base font-semibold text-white">
              {context.user.displayName}
            </p>
            <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
              Owner-level access for setup and governance configuration.
            </p>
          </div>
        </aside>
      </section>
    </AppShell>
  );
}
