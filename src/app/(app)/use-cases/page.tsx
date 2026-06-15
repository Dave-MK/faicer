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
import {
  listMockUseCasesForOrganisation,
  listMockToolsForOrganisation,
} from "@/lib/data/mock-registry";
import { listSupabaseUseCases } from "@/lib/supabase/use-cases";
import { listSupabaseTools } from "@/lib/supabase/tools";

const riskTone = (level: string) =>
  ({ low: "success", medium: "warning", high: "danger", critical: "danger" })[level] as
    | "success"
    | "warning"
    | "danger";

const statusTone = (status: string) =>
  (
    {
      approved: "success",
      restricted: "warning",
      prohibited: "danger",
      draft: "muted",
      archived: "muted",
    } as const
  )[status] ?? "muted";

export default async function UseCasesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; riskLevel?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const [useCases, tools] = await Promise.all([
    isSupabaseAuthEnabled()
      ? listSupabaseUseCases(context.organisation.id)
      : listMockUseCasesForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseTools(context.organisation.id)
      : listMockToolsForOrganisation(context.organisation.id),
  ]);

  const toolMap = new Map(tools.map((t) => [t.id, t.name]));
  const query = params.q?.trim().toLowerCase() ?? "";
  const statusFilter = params.status ?? "all";
  const riskFilter = params.riskLevel ?? "all";

  const filtered = useCases.filter((uc) => {
    if (
      query &&
      !`${uc.title} ${uc.businessUnit} ${toolMap.get(uc.toolId) ?? ""}`.toLowerCase().includes(query)
    )
      return false;
    if (statusFilter !== "all" && uc.status !== statusFilter) return false;
    if (riskFilter !== "all" && uc.riskLevel !== riskFilter) return false;
    return true;
  });

  const totals = {
    total: useCases.length,
    approved: useCases.filter((uc) => uc.status === "approved").length,
    draft: useCases.filter((uc) => uc.status === "draft").length,
    restricted: useCases.filter((uc) => uc.status === "restricted").length,
    high: useCases.filter((uc) => uc.riskLevel === "high" || uc.riskLevel === "critical").length,
  };

  return (
    <AppShell
      current="use-cases"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="AI Use Cases"
        description="Document and govern how AI tools are used across your organisation."
        actions={
          context.permissions.canManageOrganisation ? (
            <Link
              href="/use-cases/new"
              className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="plus" className="h-4 w-4" />
              Add use case
            </Link>
          ) : null
        }
      />

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
              placeholder="Search use cases..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <select
            name="status"
            defaultValue={statusFilter}
            className="brand-input h-11 rounded-xl px-4 text-sm outline-none"
          >
            <option value="all">Status</option>
            <option value="draft">Draft</option>
            <option value="approved">Approved</option>
            <option value="restricted">Restricted</option>
            <option value="prohibited">Prohibited</option>
            <option value="archived">Archived</option>
          </select>
          <select
            name="riskLevel"
            defaultValue={riskFilter}
            className="brand-input h-11 rounded-xl px-4 text-sm outline-none"
          >
            <option value="all">Risk level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <button
            type="submit"
            className="brand-button-secondary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold"
          >
            <AppIcon name="filter" className="h-4 w-4" />
            Apply
          </button>
        </form>

        <div className="mt-5 grid gap-4 xl:grid-cols-5">
          {[
            { label: "Total use cases", value: totals.total, tone: "info" },
            { label: "Approved", value: totals.approved, tone: "success" },
            { label: "Draft", value: totals.draft, tone: "muted" },
            { label: "Restricted", value: totals.restricted, tone: "warning" },
            { label: "High risk", value: totals.high, tone: "danger" },
          ].map((card) => (
            <article
              key={card.label}
              className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.85)] px-4 py-4"
            >
              <p className="text-sm text-[var(--ai-text-secondary)]">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">
                {card.value}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-5 table-shell">
          <table>
            <thead>
              <tr>
                <th>Use case</th>
                <th>Tool</th>
                <th>Business unit</th>
                <th>Risk level</th>
                <th>Status</th>
                <th>Next review</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((uc) => (
                <tr key={uc.id}>
                  <td>
                    <Link
                      href={`/use-cases/${uc.id}`}
                      className="font-medium text-white transition hover:text-[var(--ai-cyan)]"
                    >
                      {uc.title}
                    </Link>
                  </td>
                  <td>{toolMap.get(uc.toolId) ?? uc.toolId}</td>
                  <td>{uc.businessUnit}</td>
                  <td>
                    <StatusPill
                      label={uc.riskLevel.charAt(0).toUpperCase() + uc.riskLevel.slice(1)}
                      tone={riskTone(uc.riskLevel)}
                    />
                  </td>
                  <td>
                    <StatusPill
                      label={uc.status.charAt(0).toUpperCase() + uc.status.slice(1)}
                      tone={statusTone(uc.status)}
                    />
                  </td>
                  <td>
                    {uc.nextReviewAt
                      ? new Intl.DateTimeFormat("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(uc.nextReviewAt))
                      : "Not scheduled"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="border-t border-[var(--ai-border)] px-4 py-6 text-sm text-[var(--ai-text-secondary)]">
              No use cases matched the current filters.{" "}
              {context.permissions.canManageOrganisation && (
                <Link href="/use-cases/new" className="text-[var(--ai-cyan)]">
                  Add your first use case.
                </Link>
              )}
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-[var(--ai-text-muted)]">
          Showing {filtered.length} of {useCases.length} use cases
        </p>
      </WorkspacePanel>
    </AppShell>
  );
}
