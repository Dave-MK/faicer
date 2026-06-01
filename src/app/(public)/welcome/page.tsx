import Link from "next/link";
import { getSessionSnapshot } from "@/lib/auth/session";
import { isSupabaseConfigured } from "@/lib/config/env";

export default async function WelcomePage() {
  const session = await getSessionSnapshot();
  const supabaseEnabled = isSupabaseConfigured();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-10 lg:px-10">
      <section className="rounded-[2rem] border border-line bg-panel/90 p-8 shadow-[var(--shadow)] backdrop-blur sm:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-5">
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent-strong">
              AI Ledger Milestone 0
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Mock-first governance scaffold for smaller teams using AI.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              This foundation implements the Milestone 0 architecture and a
              Milestone 1-ready auth and tenancy shell. It runs on mock data
              today, with Supabase SSR utilities and SQL migrations already
              wired for the production path.
            </p>
          </div>
          <div className="rounded-3xl border border-accent-soft bg-accent-soft px-5 py-4 text-sm text-accent-strong">
            <p className="font-semibold">Current mode</p>
            <p>
              {session
                ? `Signed in as ${session.email}`
                : supabaseEnabled
                  ? "Live Supabase project connected"
                  : "Mock mode with no external services required"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-line bg-panel p-8 shadow-[var(--shadow)]">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold">What is included</h2>
            <ul className="grid gap-4 text-muted">
              <li className="rounded-2xl border border-line bg-panel-strong px-4 py-4">
                {supabaseEnabled
                  ? "Supabase Auth-backed sign-in and sign-up with the same role-aware workspace shell."
                  : "Role-aware mock authentication with owner, admin, and staff demo users."}
              </li>
              <li className="rounded-2xl border border-line bg-panel-strong px-4 py-4">
                Organisation workspace shell, permission helpers, and audit event
                plumbing.
              </li>
              <li className="rounded-2xl border border-line bg-panel-strong px-4 py-4">
                Supabase SSR client utilities, `src/proxy.ts`, migrations,
                seed placeholders, and test harness setup.
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-line bg-[#173228] p-8 text-white shadow-[var(--shadow)]">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold">Get moving</h2>
            <p className="leading-7 text-white/78">
              Explore the app shell, use one of the seeded demo users, and then
              continue into the tool register only after auth, tenancy, and test
              coverage have been reviewed.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={session ? "/dashboard" : "/sign-in"}
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 font-medium text-[#173228] transition hover:bg-[#f5efe3]"
              >
                {session ? "Open dashboard" : "Sign in with demo users"}
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 font-medium text-white transition hover:bg-white/8"
              >
                Review implementation notes
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
