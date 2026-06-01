import Link from "next/link";
import { signInAction } from "@/app/actions/auth";
import { isSupabaseConfigured } from "@/lib/config/env";
import { getDemoUsers } from "@/lib/data/mock-store";

export default function SignInPage() {
  const supabaseEnabled = isSupabaseConfigured();
  const demoUsers = getDemoUsers();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:flex-row lg:items-start lg:px-10">
      <section className="w-full rounded-[2rem] border border-line bg-panel p-8 shadow-[var(--shadow)] lg:max-w-xl">
        <div className="space-y-3">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent-strong">
            {supabaseEnabled ? "Supabase authentication" : "Mock authentication"}
          </p>
          <h1 className="text-3xl font-semibold">Sign in to the workspace</h1>
          <p className="text-muted">
            {supabaseEnabled
              ? "This project is connected to your Supabase instance. Use a real email and password to start the workspace flow."
              : "This milestone uses mock users so we can validate layouts, permissions, and flows before wiring a live Supabase project."}
          </p>
        </div>

        <form action={signInAction} className="mt-8 space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-ink">Email</span>
            <input
              type="email"
              name="email"
              required
              placeholder="owner@brightforge.test"
              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
            />
          </label>
          {supabaseEnabled ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-ink">Password</span>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
              />
            </label>
          ) : null}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-accent px-5 py-3 font-medium text-white transition hover:bg-accent-strong"
          >
            {supabaseEnabled ? "Sign in with Supabase" : "Sign in with mock access"}
          </button>
        </form>

        <p className="mt-5 text-sm text-muted">
          Need a fresh account?{" "}
          <Link className="font-medium text-accent-strong" href="/sign-up">
            Create a mock user
          </Link>
        </p>
      </section>

      <section className="w-full rounded-[2rem] border border-line bg-[#132922] p-8 text-white shadow-[var(--shadow)]">
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">
            {supabaseEnabled ? "Project connection" : "Seeded demo users"}
          </h2>
          <div className="grid gap-4">
            {supabaseEnabled ? (
              <article className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
                <p className="font-semibold">Live project enabled</p>
                <p className="mt-2 text-sm text-white/72">
                  The app will use Supabase Auth and your real Postgres tables
                  instead of the in-memory mock store.
                </p>
              </article>
            ) : (
              demoUsers.map((user) => (
                <article
                  key={user.id}
                  className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4"
                >
                  <p className="font-semibold">{user.displayName}</p>
                  <p className="font-mono text-sm text-white/72">{user.email}</p>
                  <p className="mt-2 text-sm text-white/72">{user.summary}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
