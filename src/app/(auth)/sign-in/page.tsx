import Link from "next/link";
import { AppIcon } from "@/components/AppIcons";
import { FaicerLogo } from "@/components/FaicerLogo";
import { AuthShell } from "@/components/PublicChrome";
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

  if (params.message === "reset-sent") {
    return {
      tone: "success" as const,
      text: "If that email is registered, you'll receive a reset link shortly. Check your inbox.",
    };
  }

  if (params.message === "password-updated") {
    return {
      tone: "success" as const,
      text: "Your password has been updated. Sign in with your new password.",
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
    <AuthShell
      title="Secure access to AI governance"
      subtitle="Log in"
      lead="Sign in to access your FAICER governance platform."
      points={[
        "Enterprise-grade security",
        "SSO and MFA support",
        "Audit-ready by design",
      ]}
    >
      <div className="mx-auto max-w-[430px] rounded-[26px] border border-[var(--ai-border)] bg-[linear-gradient(180deg,rgba(11,23,42,0.98),rgba(8,17,31,0.98))] p-7 shadow-[0_16px_46px_rgba(1,8,20,0.38)]">
        <FaicerLogo
          variant="lockup"
          tone="on-dark"
          className="h-auto w-[150px]"
          priority
        />
        <h1 className="mt-8 text-[2rem] font-semibold text-white">Welcome back</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
          {supabaseEnabled
            ? "Sign in with your real account credentials."
            : authMode === "mock"
              ? "Mock authentication is enabled for local development."
              : "Use the demo users to access the workspace shell."}
        </p>

        {feedback ? (
          <div
            className={`mt-5 rounded-2xl px-4 py-4 text-sm ${
              feedback.tone === "error"
                ? "brand-status-danger"
                : "brand-status-success"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}

        <form action={signInAction} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Email address</span>
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          {supabaseEnabled ? (
            <label className="block space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">Password</span>
                <Link href="/reset-password" className="text-xs font-medium text-[var(--ai-blue)]">
                  Forgot password?
                </Link>
              </div>
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
            className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition"
          >
            {supabaseEnabled ? "Log in" : "Sign in with mock access"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-4">
          <span className="h-px flex-1 bg-[var(--ai-border)]" />
          <span className="text-xs uppercase tracking-[0.22em] text-[var(--ai-text-muted)]">
            or
          </span>
          <span className="h-px flex-1 bg-[var(--ai-border)]" />
        </div>

        <button className="brand-button-secondary inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition">
          <AppIcon name="shield" className="h-4 w-4" />
          Sign in with SSO
        </button>

        <p className="mt-6 text-center text-sm text-[var(--ai-text-secondary)]">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-[var(--ai-blue)]">
            Sign up
          </Link>
        </p>

        {!supabaseEnabled ? (
          <div className="mt-8 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(7,17,32,0.7)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ai-cyan)]">
              Mock authentication
            </p>
            <div className="mt-3 space-y-3">
              {demoUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="rounded-2xl border border-[rgba(42,75,115,0.55)] bg-[rgba(19,36,61,0.78)] px-4 py-3">
                  <p className="font-medium text-white">{user.displayName}</p>
                  <p className="mt-1 text-sm text-[var(--ai-text-secondary)]">
                    {user.email}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </AuthShell>
  );
}
