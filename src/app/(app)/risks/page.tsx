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
import { listMockRisksForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseRisks } from "@/lib/supabase/risks";

const levelTone = (l: string) =>
  (
    { low: "success", medium: "warning", high: "danger", critical: "danger" } as const
  )[l as "low" | "medium" | "high" | "critical"] ?? ("muted" as const);

const statusTone = (s: string) =>
  (
    { open: "warning", mitigated: "success", accepted: "info", closed: "muted" } as const
  )[s as "open" | "mitigated" | "accepted" | "closed"] ?? ("muted" as const);

export default async function RisksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; level?: string; status?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const risks = isSupabaseAuthEnabled()
    ? await listSupabaseRisks(context.organisation.id)
    : await listMockRisksForOrganisation(context.organisation.id);

  const query = params.q?.trim().toLowerCase() ?? "";
  const levelFilter = params.level ?? "all";
  const statusFilter = params.status ?? "all";

  const filtered = risks.filter((r) => {
    if (query && !r.title.toLowerCase().includes(query)) return false;
    if (levelFilter !== "all" && r.riskLevel !== levelFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    return true;
  });

  const totals = {
    total: risks.length,
    critical: risks.filter((r) => r.riskLevel === "critical").length,
    high: risks.filter((r) => r.riskLevel === "high").length,
    medium: risks.filter((r) => r.riskLevel === "medium").length,
    open: risks.filter((r) => r.status === "open").length,
  };

  return (
    <AppShell
      current="risks"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Risk Register"
        description="Identify, score, and track risks linked to AI tools and use cases."
        actions={
          context.permissions.canReviewRecords ? (
            <Link
              href="/risks/new"
              className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="plus" className="h-4 w-4" />
              Add risk
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
              placeholder="Search risks..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <select
            name="level"
            defaultValue={levelFilter}
            className="brand-input h-11 rounded-xl px-4 text-sm outline-none"
          >
            <option value="all">Risk level</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            name="status"
            defaultValue={statusFilter}
            className="brand-input h-11 rounded-xl px-4 text-sm outline-none"
          >
            <option value="all">Status</option>
            <option value="open">Open</option>
            <option value="mitigated">Mitigated</option>
            <option value="accepted">Accepted</option>
            <option value="closed">Closed</option>
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
            { label: "Total", value: totals.total },
            { label: "Critical", value: totals.critical },
            { label: "High", value: totals.high },
            { label: "Medium", value: totals.medium },
            { label: "Open", value: totals.open },
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
                <th>Risk</th>
                <th>Entity</th>
                <th>Score</th>
                <th>Level</th>
                <th>Status</th>
                <th>Residual</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((risk) => (
                <tr key={risk.id}>
                  <td>
                    <Link
                      href={`/risks/${risk.id}`}
                      className="font-medium text-white transition hover:text-[var(--ai-cyan)]"
                    >
                      {risk.title}
                    </Link>
                  </td>
                  <td className="capitalize">{risk.entityType.replace(/_/g, " ")}</td>
                  <td>
                    <span className="font-semibold text-white">{risk.riskScore}</span>
                    <span className="text-[var(--ai-text-muted)]"> / 25</span>
                  </td>
                  <td>
                    <StatusPill
                      label={risk.riskLevel.charAt(0).toUpperCase() + risk.riskLevel.slice(1)}
                      tone={levelTone(risk.riskLevel)}
                    />
                  </td>
                  <td>
                    <StatusPill
                      label={risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                      tone={statusTone(risk.status)}
                    />
                  </td>
                  <td>
                    <span className="font-semibold text-white">{risk.residualScore}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="border-t border-[var(--ai-border)] px-4 py-6 text-sm text-[var(--ai-text-secondary)]">
              No risks found.{" "}
              {context.permissions.canReviewRecords && (
                <Link href="/risks/new" className="text-[var(--ai-cyan)]">
                  Add your first risk.
                </Link>
              )}
            </div>
          )}
        </div>
        <p className="mt-4 text-sm text-[var(--ai-text-muted)]">
          Showing {filtered.length} of {risks.length} risks
        </p>
      </WorkspacePanel>
    </AppShell>
  );
}
