import Link from "next/link";
import { AILedgerLogo } from "@/components/AILedgerLogo";
import { getSessionSnapshot } from "@/lib/auth/session";
import { getAuthMode, isSupabaseAuthEnabled } from "@/lib/config/env";

export default async function WelcomePage() {
  const session = await getSessionSnapshot();
  const supabaseEnabled = isSupabaseAuthEnabled();
  const authMode = getAuthMode();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-12 px-6 py-10 lg:px-10">
      <section className="brand-panel overflow-hidden rounded-[2rem] p-8 sm:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <AILedgerLogo
              variant="lockup"
              tone="gradient"
              className="h-auto w-full max-w-[20rem] sm:max-w-[24rem]"
              priority
            />
            <p className="brand-eyebrow">
              AI Ledger Milestones 0 to 2
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Mock-first governance scaffold for smaller teams using AI.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted">
              This foundation now covers the auth, tenancy, and first tool-register
              workflow. It still runs comfortably on mock data in local development,
              with Supabase SSR utilities and SQL migrations ready for the hosted path.
            </p>
          </div>
          <div className="brand-panel-soft max-w-sm rounded-3xl px-5 py-5 text-sm text-muted">
            <p className="brand-eyebrow">Current mode</p>
            <p className="mt-3 leading-7 text-ink">
              {session
                ? `Signed in as ${session.email}`
                : supabaseEnabled
                  ? "Live Supabase project connected"
                  : authMode === "mock"
                    ? "Mock auth enabled for local development"
                    : "Mock mode with no external services required"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="brand-panel rounded-[2rem] p-8">
          <div className="space-y-5">
            <h2 className="text-2xl font-semibold">What is included</h2>
            <ul className="grid gap-4 text-muted">
              <li className="brand-panel-soft rounded-2xl px-4 py-4">
                {supabaseEnabled
                  ? "Supabase Auth-backed sign-in and sign-up with the same role-aware workspace shell."
                  : "Role-aware mock authentication with owner, admin, and staff demo users."}
              </li>
              <li className="brand-panel-soft rounded-2xl px-4 py-4">
                Organisation workspace shell, permission helpers, and audit event
                plumbing, now extended into the tool register.
              </li>
              <li className="brand-panel-soft rounded-2xl px-4 py-4">
                Supabase SSR client utilities, `src/proxy.ts`, migrations,
                seed placeholders, and test harness setup.
              </li>
            </ul>
          </div>
        </div>

        <div className="brand-panel-highlight rounded-[2rem] p-8 text-white">
          <div className="space-y-5">
            <p className="brand-eyebrow">Trusted start</p>
            <h2 className="text-2xl font-semibold">Get moving</h2>
            <p className="leading-7 text-[var(--ai-text-secondary)]">
              Explore the app shell, use one of the seeded demo users, and start
              recording AI tools with review dates and approval states before we
              move on to use cases and policy generation.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href={session ? "/dashboard" : "/sign-in"}
                className="brand-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 font-medium transition"
              >
                {session ? "Open dashboard" : "Sign in with demo users"}
              </Link>
              <Link
                href="/docs"
                className="brand-button-secondary inline-flex items-center justify-center rounded-full px-5 py-3 font-medium transition"
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
