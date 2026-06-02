import Link from "next/link";
import { AILedgerLogo } from "@/components/AILedgerLogo";
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
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10 lg:px-10">
      <section className="brand-panel w-full rounded-[2rem] p-8">
        <div className="space-y-5">
          <AILedgerLogo
            variant="lockup"
            tone="gradient"
            className="h-auto w-full max-w-[17rem]"
            priority
          />
          <p className="brand-eyebrow">
            {supabaseEnabled ? "Supabase onboarding" : "Mock onboarding"}
          </p>
          <h1 className="text-3xl font-semibold">Create a mock account</h1>
          <p className="max-w-2xl text-muted">
            {supabaseEnabled
              ? "Create a real auth user in Supabase. Use a real email you can access, because this project sends a confirmation email before the account can sign in."
              : authMode === "mock"
                ? "Local development is currently using mock auth. This creates an in-memory user and workspace so you can keep building."
                : "This flow creates an in-memory user and a starter organisation so we can exercise Milestone 1 paths without a live Supabase project."}
          </p>
        </div>

        {errorMessage ? (
          <div className="brand-status-danger mt-6 rounded-2xl px-4 py-4 text-sm">
            {errorMessage}
          </div>
        ) : null}

        <form action={signUpAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-ink">Your name</span>
            <input
              type="text"
              name="displayName"
              required
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          <label className="block space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              name="email"
              required
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>
          {supabaseEnabled ? (
            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>
          ) : (
            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Organisation name</span>
              <input
                type="text"
                name="organisationName"
                required
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>
          )}
          <button
            type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 font-medium transition md:col-span-2"
          >
            {supabaseEnabled ? "Create account" : "Create account and workspace"}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted">
          Already have access?{" "}
          <Link className="brand-link font-medium" href="/sign-in">
            Go to sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
