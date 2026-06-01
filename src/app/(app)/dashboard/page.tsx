import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import {
  requireWorkspaceContext,
  summarizeWorkspace,
} from "@/lib/auth/workspace";

export default async function DashboardPage() {
  const context = await requireWorkspaceContext();
  const summary = summarizeWorkspace(context);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10 lg:px-10">
      <section className="rounded-[2rem] border border-line bg-panel p-8 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent-strong">
              Workspace dashboard
            </p>
            <h1 className="text-3xl font-semibold">
              {context.organisation.name}
            </h1>
            <p className="max-w-2xl text-muted">
              Signed in as {context.user.displayName} with the{" "}
              <span className="font-medium text-ink">{context.membership.role}</span>{" "}
              role. This dashboard is driven by the same membership checks that
              future tool, use-case, and policy features will depend on.
            </p>
          </div>
          <form action={signOutAction}>
            <button
              type="submit"
              className="rounded-full border border-line px-5 py-3 font-medium text-ink transition hover:bg-panel-strong"
            >
              Sign out
            </button>
          </form>
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <article
            key={item.label}
            className="rounded-[1.6rem] border border-line bg-panel px-6 py-5 shadow-[var(--shadow)]"
          >
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-line bg-panel p-8 shadow-[var(--shadow)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Milestone 1 scope</h2>
              <p className="mt-2 text-muted">
                We are stopping at auth, tenancy, and permission scaffolding
                before moving into the tool register.
              </p>
            </div>
            <Link
              href="/setup/organisation"
              className="rounded-full bg-accent px-5 py-3 font-medium text-white transition hover:bg-accent-strong"
            >
              Create organisation
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 text-muted">
            <li className="rounded-2xl border border-line bg-panel-strong px-4 py-4">
              Supabase SSR utilities and `proxy.ts` are in place for the real
              backend path.
            </li>
            <li className="rounded-2xl border border-line bg-panel-strong px-4 py-4">
              The session layer and workspace checks are already centralized in
              `src/lib/auth`.
            </li>
            <li className="rounded-2xl border border-line bg-panel-strong px-4 py-4">
              SQL migrations and unit tests are ready to grow with the first real
              database integration.
            </li>
          </ul>
        </article>

        <article className="rounded-[2rem] border border-line bg-[#173228] p-8 text-white shadow-[var(--shadow)]">
          <h2 className="text-2xl font-semibold">Permission snapshot</h2>
          <dl className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
              <dt className="text-sm uppercase tracking-[0.22em] text-white/62">
                Current role
              </dt>
              <dd className="mt-2 text-xl font-semibold">
                {context.membership.role}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
              <dt className="text-sm uppercase tracking-[0.22em] text-white/62">
                Allowed actions
              </dt>
              <dd className="mt-2 text-sm leading-7 text-white/78">
                {context.permissions.canManageOrganisation
                  ? "Can manage organisation settings, create organisations, and review milestone foundations."
                  : "Can view the workspace shell but cannot manage organisation-level records."}
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  );
}
