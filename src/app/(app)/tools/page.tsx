import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockToolsForOrganisation } from "@/lib/data/mock-registry";
import {
  formatToolReviewDate,
  getToolApprovalMeta,
  getToolCategoryLabel,
} from "@/lib/tools/catalog";
import { listSupabaseTools } from "@/lib/supabase/tools";

export default async function ToolsPage() {
  const context = await requireWorkspaceContext();
  const tools = isSupabaseAuthEnabled()
    ? await listSupabaseTools(context.organisation.id)
    : await listMockToolsForOrganisation(context.organisation.id);

  const dueSoon = tools.filter((tool) => {
    if (!tool.nextReviewAt) {
      return false;
    }

    const dueDate = new Date(tool.nextReviewAt);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() + 30);
    return dueDate <= cutoff;
  }).length;

  return (
    <AppShell
      current="tools"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
      eyebrow="AI tool register"
      title="Tool inventory"
      description="Record which AI products the organisation uses, who owns them, how they are approved, and when they need review."
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
      <section className="grid gap-6 md:grid-cols-3">
        <article className="brand-panel rounded-[1.6rem] px-6 py-5">
          <p className="text-sm text-muted">Recorded tools</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{tools.length}</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Inventory records tied to the current organisation.
          </p>
        </article>
        <article className="brand-panel rounded-[1.6rem] px-6 py-5">
          <p className="text-sm text-muted">Reviews due within 30 days</p>
          <p className="mt-3 text-3xl font-semibold text-ink">{dueSoon}</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            These should appear in the later review workflow and reminders.
          </p>
        </article>
        <article className="brand-panel rounded-[1.6rem] px-6 py-5">
          <p className="text-sm text-muted">Editing access</p>
          <p className="mt-3 text-3xl font-semibold text-ink capitalize">
            {context.membership.role}
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            {context.permissions.canManageOrganisation
              ? "Can add and update tool records."
              : "View-only access for organisation records."}
          </p>
        </article>
      </section>

      <section className="brand-panel mt-8 rounded-[2rem] p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="brand-eyebrow">Register</p>
            <h2 className="text-2xl font-semibold">Current register</h2>
            <p className="mt-2 max-w-2xl text-muted">
              A lightweight record of approved, restricted, and prohibited AI
              tools used across the organisation.
            </p>
          </div>
        </div>

        {tools.length > 0 ? (
          <div className="mt-6 grid gap-4">
            {tools.map((tool) => {
              const approval = getToolApprovalMeta(tool.approvalStatus);
              return (
                <Link
                  key={tool.id}
                  href={`/tools/${tool.id}`}
                  className="brand-panel-soft rounded-2xl px-5 py-5 transition hover:border-[var(--ai-border-strong)]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-semibold text-ink">{tool.name}</h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${approval.tone}`}
                        >
                          {approval.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        {tool.vendor} · {getToolCategoryLabel(tool.category)}
                      </p>
                    </div>
                    <div className="grid gap-2 text-sm text-muted lg:text-right">
                      <p>Next review: {formatToolReviewDate(tool.nextReviewAt)}</p>
                      <p>
                        Privacy policy:{" "}
                        {tool.privacyPolicyUrl ? "linked" : "not captured yet"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="brand-panel-soft mt-6 rounded-2xl border-dashed px-6 py-8 text-center text-muted">
            <p className="text-lg font-medium text-ink">No AI tools recorded yet</p>
            <p className="mt-2">
              Start with the main products your team already uses in real work.
            </p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
