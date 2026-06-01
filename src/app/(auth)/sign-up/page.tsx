import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/config/env";

export default function SignUpPage() {
  const supabaseEnabled = isSupabaseConfigured();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-10 lg:px-10">
      <section className="w-full rounded-[2rem] border border-line bg-panel p-8 shadow-[var(--shadow)]">
        <div className="space-y-3">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent-strong">
            {supabaseEnabled ? "Supabase onboarding" : "Mock onboarding"}
          </p>
          <h1 className="text-3xl font-semibold">Create a mock account</h1>
          <p className="max-w-2xl text-muted">
            {supabaseEnabled
              ? "Create a real auth user in Supabase. After sign-up, you will complete organisation creation inside the app."
              : "This flow creates an in-memory user and a starter organisation so we can exercise Milestone 1 paths without a live Supabase project."}
          </p>
        </div>

        <form action={signUpAction} className="mt-8 grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-ink">Your name</span>
            <input
              type="text"
              name="displayName"
              required
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          <label className="block space-y-2 md:col-span-1">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
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
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
          ) : (
            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Organisation name</span>
              <input
                type="text"
                name="organisationName"
                required
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
          )}
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-full bg-accent px-5 py-3 font-medium text-white transition hover:bg-accent-strong md:col-span-2"
          >
            {supabaseEnabled
              ? "Create account"
              : "Create account and workspace"}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted">
          Already have access?{" "}
          <Link className="font-medium text-accent-strong" href="/sign-in">
            Go to sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
