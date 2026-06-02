import Link from "next/link";
import { AILedgerLogo } from "@/components/AILedgerLogo";
import { signInAction } from "@/app/actions/auth";
import { getAuthMode, isSupabaseAuthEnabled } from "@/lib/config/env";
import { getCombinedMockUsers } from "@/lib/data/mock-registry";

function getFeedback(
  params: { message?: string; error?: string },
  supabaseEnabled: boolean,
) {
  if (params.message === "check-email") {
    return {
      tone: "success" as const,
      text: "Your account was created. Check your email and confirm it before trying to sign in.",
    };
  }

  if (params.error === "invalid-credentials") {
    return {
      tone: "error" as const,
      text: supabaseEnabled
        ? "Supabase rejected that email or password. If you just signed up, confirm the email first."
        : "That mock account was not found. Use one of the demo users or create a new mock user first.",
    };
  }

  if (params.error === "invalid-form") {
    return {
      tone: "error" as const,
      text: "Please complete the required sign-in fields.",
    };
  }

  return null;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const params = await searchParams;
  const supabaseEnabled = isSupabaseAuthEnabled();
  const authMode = getAuthMode();
  const demoUsers = await getCombinedMockUsers();
  const feedback = getFeedback(params, supabaseEnabled);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:px-10">
      <section className="brand-panel w-full rounded-[2rem] p-8 lg:max-w-xl">
        <div className="space-y-5">
          <AILedgerLogo
            variant="lockup"
            tone="gradient"
            className="h-auto w-full max-w-[17rem]"
            priority
          />
          <p className="brand-eyebrow">
            {supabaseEnabled ? "Supabase authentication" : "Mock authentication"}
          </p>
          <h1 className="text-3xl font-semibold">Sign in to the workspace</h1>
          <p className="text-muted">
            {supabaseEnabled
              ? "This project is connected to your Supabase instance. Use a real email and password to start the workspace flow."
              : authMode === "mock"
                ? "Local development is currently using mock auth so you can keep working without hosted email-confirmation issues."
                : "This milestone uses mock users so we can validate layouts, permissions, and flows before wiring a live Supabase project."}
          </p>
        </div>

        {feedback ? (
          <div
            className={`mt-6 rounded-2xl px-4 py-4 text-sm ${
              feedback.tone === "error"
                ? "brand-status-danger"
                : "brand-status-success"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}

        <form action={signInAction} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="owner@brightforge.test"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          {supabaseEnabled ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                name="password"
                required
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>
          ) : null}
          <button
            type="submit"
            className="brand-button-primary inline-flex w-full items-center justify-center rounded-full px-5 py-3 font-medium transition"
          >
            {supabaseEnabled ? "Sign in with Supabase" : "Sign in with mock access"}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted">
          Need a fresh account?{" "}
          <Link className="brand-link font-medium" href="/sign-up">
            Create a mock user
          </Link>
        </p>
      </section>

      <section className="brand-panel-highlight w-full rounded-[2rem] p-8 text-white">
        <div className="space-y-5">
          <p className="brand-eyebrow">Access overview</p>
          <h2 className="text-2xl font-semibold">
            {supabaseEnabled ? "Project connection" : "Available mock users"}
          </h2>
          <div className="grid gap-4">
            {supabaseEnabled ? (
              <article className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
                <p className="font-semibold">Live project enabled</p>
                <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
                  The app will use Supabase Auth and your real Postgres tables
                  instead of the in-memory mock store.
                </p>
                <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
                  New email-password accounts must confirm their email before
                  Supabase allows sign-in.
                </p>
              </article>
            ) : (
              demoUsers.map((user) => (
                <article
                  key={user.id}
                  className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4"
                >
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="font-mono text-sm text-[var(--ai-text-secondary)]">
                    {user.email}
                  </p>
                  <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
                    {user.summary}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
