import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { AppIcon } from "@/components/AppIcons";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockToolsForOrganisation } from "@/lib/data/mock-registry";
import {
  formatToolReviewDate,
  getToolApprovalMeta,
  getToolCategoryLabel,
  toolApprovalOptions,
  toolCategoryOptions,
} from "@/lib/tools/catalog";
import { listSupabaseTools } from "@/lib/supabase/tools";

function getFeedback(error?: string) {
  if (error === "missing-tool") {
    return "That tool record is no longer available in this workspace.";
  }

  return null;
}

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    category?: string;
    review?: string;
    error?: string;
  }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const feedback = getFeedback(params.error);

  const tools = isSupabaseAuthEnabled()
    ? await listSupabaseTools(context.organisation.id)
    : await listMockToolsForOrganisation(context.organisation.id);

  const query = params.q?.trim().toLowerCase() ?? "";
  const status = params.status ?? "all";
  const category = params.category ?? "all";
  const review = params.review ?? "all";
  const todayDate = new Date();
  const today = todayDate.toISOString().slice(0, 10);
  const soonThreshold = new Date(todayDate.getTime() + 45 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const filteredTools = tools.filter((tool) => {
    if (
      query &&
      !`${tool.name} ${tool.vendor} ${getToolCategoryLabel(tool.category)}`
        .toLowerCase()
        .includes(query)
    ) {
      return false;
    }

    if (status !== "all" && tool.approvalStatus !== status) {
      return false;
    }

    if (category !== "all" && tool.category !== category) {
      return false;
    }

    if (review === "overdue" && (!tool.nextReviewAt || tool.nextReviewAt >= today)) {
      return false;
    }

    if (
      review === "due-soon" &&
      (!tool.nextReviewAt ||
        tool.nextReviewAt < today ||
        tool.nextReviewAt > soonThreshold)
    ) {
      return false;
    }

    return true;
  });

  const totals = {
    total: tools.length,
    approved: tools.filter((tool) => tool.approvalStatus === "approved").length,
    restricted: tools.filter((tool) => tool.approvalStatus === "restricted").length,
    prohibited: tools.filter((tool) => tool.approvalStatus === "prohibited").length,
    dueSoon: tools.filter(
      (tool) =>
        typeof tool.nextReviewAt === "string" &&
        tool.nextReviewAt >= today &&
        tool.nextReviewAt <= soonThreshold,
    ).length,
  };

  return (
    <AppShell
      current="register"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="AI inventory"
        title="AI System Register"
        description="Maintain a governed inventory of AI tools and systems, with review status, provider ownership, and approval controls in one place."
        actions={
          <>
            <button
              type="button"
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="download" className="h-4 w-4" />
              Import register
            </button>
            {context.permissions.canManageOrganisation ? (
              <Link
                href="/tools/new"
                className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                <AppIcon name="plus" className="h-4 w-4" />
                Add system
              </Link>
            ) : null}
          </>
        }
      />

      {feedback ? (
        <div className="brand-status-warning mb-5 rounded-2xl px-4 py-4 text-sm">
          {feedback}
        </div>
      ) : null}

      <WorkspacePanel>
        <form className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,0.8fr))]">
          <label className="relative block">
            <AppIcon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ai-text-muted)]"
            />
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search tools..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>

          <select
            name="status"
            defaultValue={status}
            className="brand-input h-11 rounded-xl px-4 text-sm outline-none"
          >
            <option value="all">Status</option>
            {toolApprovalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            name="review"
            defaultValue={review}
            className="brand-input h-11 rounded-xl px-4 text-sm outline-none"
          >
            <option value="all">Review timing</option>
            <option value="due-soon">Due soon</option>
            <option value="overdue">Overdue</option>
          </select>

          <div className="flex gap-3">
            <select
              name="category"
              defaultValue={category}
              className="brand-input h-11 min-w-0 flex-1 rounded-xl px-4 text-sm outline-none"
            >
              <option value="all">Category</option>
              {toolCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="brand-button-secondary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold"
            >
              <AppIcon name="filter" className="h-4 w-4" />
              Apply
            </button>
          </div>
        </form>

        <div className="mt-5 grid gap-4 xl:grid-cols-5">
          {[
            { label: "Registered systems", value: totals.total, delta: "Active inventory", tone: "success" },
            { label: "Approved", value: totals.approved, delta: "Ready for use", tone: "success" },
            {
              label: "Restricted",
              value: totals.restricted,
              delta: "Additional oversight",
              tone: "warning",
            },
            {
              label: "Prohibited",
              value: totals.prohibited,
              delta: "Blocked from use",
              tone: "danger",
            },
            {
              label: "Due for review",
              value: totals.dueSoon,
              delta: "Next 45 days",
              tone: "info",
            },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.85)] px-4 py-4"
            >
              <p className="text-sm text-[var(--ai-text-secondary)]">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">
                {card.value}
              </p>
              <p
                className={`mt-3 text-sm font-medium ${
                  card.tone === "danger"
                    ? "text-[var(--ai-danger)]"
                    : card.tone === "warning"
                      ? "text-[var(--ai-warning)]"
                      : card.tone === "info"
                        ? "text-[var(--ai-blue)]"
                        : "text-[var(--ai-success)]"
                }`}
              >
                {card.delta}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 table-shell">
          <table>
            <thead>
              <tr>
                <th>System name</th>
                <th>Provider</th>
                <th>Category</th>
                <th>Status</th>
                <th>Next review</th>
                <th>Website</th>
              </tr>
            </thead>
            <tbody>
              {filteredTools.map((tool) => {
                const approval = getToolApprovalMeta(tool.approvalStatus);

                return (
                  <tr key={tool.id}>
                    <td>
                      <Link
                        href={`/tools/${tool.id}`}
                        className="font-medium text-white transition hover:text-[var(--ai-cyan)]"
                      >
                        {tool.name}
                      </Link>
                    </td>
                    <td>{tool.vendor}</td>
                    <td>{getToolCategoryLabel(tool.category)}</td>
                    <td>
                      <StatusPill
                        label={approval.label}
                        tone={
                          tool.approvalStatus === "approved"
                            ? "success"
                            : tool.approvalStatus === "restricted"
                              ? "warning"
                              : "danger"
                        }
                      />
                    </td>
                    <td>{formatToolReviewDate(tool.nextReviewAt)}</td>
                    <td>
                      {tool.websiteUrl ? (
                        <a
                          href={tool.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--ai-cyan)] transition hover:text-white"
                        >
                          Open
                        </a>
                      ) : (
                        "Not set"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredTools.length === 0 ? (
            <div className="border-t border-[var(--ai-border)] px-4 py-6 text-sm text-[var(--ai-text-secondary)]">
              No tools matched the current filters.
            </div>
          ) : null}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-[var(--ai-text-muted)]">
          <p>
            Showing {filteredTools.length} of {tools.length} tools
          </p>
          <div className="flex items-center gap-2 text-white">
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-[var(--ai-border)] bg-[rgba(16,30,52,0.84)] px-2">
              1
            </span>
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-transparent px-2">
              2
            </span>
            <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-transparent px-2">
              3
            </span>
          </div>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
