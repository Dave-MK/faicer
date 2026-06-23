import Link from "next/link";
import { AppIcon } from "@/components/AppIcons";
import { FaicerLogo } from "@/components/FaicerLogo";
import { AuthShell } from "@/components/PublicChrome";
import { signUpAction } from "@/app/actions/auth";
import { getAuthMode, isSupabaseAuthEnabled } from "@/lib/config/env";

function getErrorMessage(error?: string) {
  if (error === "invalid-email") {
    return "Supabase rejected that email address. Use a real, valid email address rather than a placeholder domain.";
  }

  if (error === "email-rate-limit") {
    return "Supabase is rate-limiting confirmation emails right now. Wait a little, then try again, or use the confirmation email from your last successful sign-up attempt.";
  }

  if (error === "invalid-form") {
    return "Please complete all required fields. Passwords must be at least 8 characters.";
  }

  if (error === "sign-up-failed") {
    return "Supabase could not create the account. Try again, and if it still fails we can inspect the auth logs.";
  }

  return null;
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabaseEnabled = isSupabaseAuthEnabled();
  const authMode = getAuthMode();
  const errorMessage = getErrorMessage(params.error);

  return (
    <AuthShell
      title="Get started with FAICER"
      subtitle="Sign up"
      lead="Create your account and start governing AI use across your organization."
      points={[
        "Quick setup",
        "No credit card required",
        "Start in minutes",
      ]}
    >
      <div className="mx-auto max-w-[460px] rounded-[26px] border border-[var(--ai-border)] bg-[linear-gradient(180deg,rgba(11,23,42,0.98),rgba(8,17,31,0.98))] p-7 shadow-[0_16px_46px_rgba(1,8,20,0.38)]">
        <FaicerLogo
          variant="lockup"
          tone="on-dark"
          className="h-auto w-[150px]"
          priority
        />
        <h1 className="mt-8 text-[2rem] font-semibold text-white">Create your account</h1>
        <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-[var(--ai-blue)]">
            Log in
          </Link>
        </p>

        {errorMessage ? (
          <div className="brand-status-danger mt-5 rounded-2xl px-4 py-4 text-sm">
            {errorMessage}
          </div>
        ) : null}

        <form action={signUpAction} className="mt-6 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Full name</span>
            <input
              type="text"
              name="displayName"
              required
              placeholder="Jane Cooper"
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-white">Work email</span>
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
              <span className="text-sm font-medium text-white">Password</span>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>
          ) : (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-white">Company name</span>
              <input
                type="text"
                name="organisationName"
                required
                placeholder="Acme Global"
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>
          )}

          <label className="flex items-start gap-3 rounded-2xl border border-[var(--ai-border)] bg-[rgba(7,17,32,0.62)] px-4 py-3 text-sm text-[var(--ai-text-secondary)]">
            <input type="checkbox" required className="mt-1 h-4 w-4 rounded border-[var(--ai-border)] bg-transparent" />
            <span>
              I agree to the Terms of Service and Privacy Policy.
            </span>
          </label>

          <button
            type="submit"
            className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition"
          >
            {supabaseEnabled ? "Sign up" : "Create account and workspace"}
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
          Sign up with SSO
        </button>

        <p className="mt-6 text-sm text-[var(--ai-text-secondary)]">
          {supabaseEnabled
            ? "Create a real auth user in Supabase. Use a real email you can access because confirmation email may be required before sign-in."
            : authMode === "mock"
              ? "Local development is using mock auth, so this will create a local account and starter workspace immediately."
              : "This flow uses mock data so we can validate onboarding before rolling into hosted auth."}
        </p>
      </div>
    </AuthShell>
  );
}
