import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import { requireWorkspaceContext, summarizeWorkspace } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockToolsForOrganisation } from "@/lib/data/mock-registry";
import {
  formatToolReviewDate,
  getToolApprovalMeta,
} from "@/lib/tools/catalog";
import { listSupabaseTools } from "@/lib/supabase/tools";

export default async function DashboardPage() {
  const context = await requireWorkspaceContext();
  const summary = summarizeWorkspace(context);
  const tools = isSupabaseAuthEnabled()
    ? await listSupabaseTools(context.organisation.id)
    : await listMockToolsForOrganisation(context.organisation.id);

  const counts = {
    total: tools.length,
    approved: tools.filter((tool) => tool.approvalStatus === "approved").length,
    restricted: tools.filter((tool) => tool.approvalStatus === "restricted").length,
    prohibited: tools.filter((tool) => tool.approvalStatus === "prohibited").length,
  };

  return (
    <AppShell
      current="dashboard"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
      eyebrow="Workspace dashboard"
      title={context.organisation.name}
      description={`Signed in as ${context.user.displayName}. The Milestone 2 tool register now sits on top of the same membership checks and audit trail foundation we already verified.`}
      actions={
        context.permissions.canManageOrganisation ? (
          <Link
            href="/tools/new"
            className="brand-button-primary rounded-full px-5 py-3 text-center font-medium transition"
          >
            Add AI tool
          </Link>
        ) : null
      }
    >
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <article
            key={item.label}
            className="brand-panel rounded-[1.6rem] px-6 py-5"
          >
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-ink">{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="brand-panel rounded-[2rem] p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="brand-eyebrow">Delivery focus</p>
              <h2 className="text-2xl font-semibold">Tool register snapshot</h2>
              <p className="mt-2 max-w-2xl text-muted">
                The first live product record is now the AI tool register:
                vendor, approval status, review date, and audit history.
              </p>
            </div>
            <Link
              href="/tools"
              className="brand-button-secondary rounded-full px-5 py-3 font-medium transition"
            >
              Open register
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="brand-panel-soft rounded-2xl px-4 py-4">
              <p className="text-sm text-muted">Total tools</p>
              <p className="mt-2 text-3xl font-semibold">{counts.total}</p>
            </article>
            <article className="brand-panel-soft rounded-2xl px-4 py-4">
              <p className="text-sm text-muted">Approved / restricted / prohibited</p>
              <p className="mt-2 text-2xl font-semibold">
                {counts.approved} / {counts.restricted} / {counts.prohibited}
              </p>
            </article>
          </div>

          <div className="mt-6 grid gap-4">
            {tools.length > 0 ? (
              tools.slice(0, 3).map((tool) => {
                const approval = getToolApprovalMeta(tool.approvalStatus);
                return (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="brand-panel-soft rounded-2xl px-4 py-4 transition hover:border-[var(--ai-border-strong)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-ink">{tool.name}</p>
                        <p className="mt-1 text-sm text-muted">{tool.vendor}</p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${approval.tone}`}
                      >
                        {approval.label}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-muted">
                      Next review: {formatToolReviewDate(tool.nextReviewAt)}
                    </p>
                  </Link>
                );
              })
            ) : (
              <div className="brand-panel-soft rounded-2xl border-dashed px-4 py-5 text-sm text-muted">
                No tools have been recorded yet.
              </div>
            )}
          </div>
        </article>

        <article className="brand-panel-highlight rounded-[2rem] p-8 text-white">
          <p className="brand-eyebrow">Permissions</p>
          <h2 className="text-2xl font-semibold">Current permissions</h2>
          <dl className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
              <dt className="text-sm uppercase tracking-[0.22em] text-white/62">
                Manage register
              </dt>
              <dd className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
                {context.permissions.canManageOrganisation
                  ? "Can add new AI tools and update approval statuses or review dates."
                  : "Can view the register but cannot create or edit organisation-level records."}
              </dd>
            </div>
            <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4">
              <dt className="text-sm uppercase tracking-[0.22em] text-white/62">
                Audit trail
              </dt>
              <dd className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
                Every tool create or update action is designed to land in the same
                audit stream as the earlier tenancy work.
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </AppShell>
  );
}
