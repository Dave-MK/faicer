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
import { listMockIncidentsForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseIncidents } from "@/lib/supabase/incidents";

const severityTone = (s: string) =>
  ({ low: "success", medium: "warning", high: "danger", critical: "danger" } as const)[
    s as "low" | "medium" | "high" | "critical"
  ] ?? ("muted" as const);

const statusTone = (s: string) =>
  ({ open: "warning", investigating: "info", resolved: "success", closed: "muted" } as const)[
    s as "open" | "investigating" | "resolved" | "closed"
  ] ?? ("muted" as const);

export default async function IncidentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; severity?: string; status?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const incidents = isSupabaseAuthEnabled()
    ? await listSupabaseIncidents(context.organisation.id)
    : await listMockIncidentsForOrganisation(context.organisation.id);

  const query = params.q?.trim().toLowerCase() ?? "";
  const severityFilter = params.severity ?? "all";
  const statusFilter = params.status ?? "all";

  const filtered = incidents.filter((i) => {
    if (query && !i.title.toLowerCase().includes(query)) return false;
    if (severityFilter !== "all" && i.severity !== severityFilter) return false;
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    return true;
  });

  const totals = {
    total: incidents.length,
    open: incidents.filter((i) => i.status === "open").length,
    investigating: incidents.filter((i) => i.status === "investigating").length,
    resolved: incidents.filter((i) => ["resolved", "closed"].includes(i.status)).length,
  };

  return (
    <AppShell
      current="incidents"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Incidents"
        description="Log and track AI-related incidents, near-misses, and governance failures."
        actions={
          <Link
            href="/incidents/new"
            className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            <AppIcon name="plus" className="h-4 w-4" />
            Report incident
          </Link>
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
              placeholder="Search incidents..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <select name="severity" defaultValue={severityFilter} className="brand-input h-11 rounded-xl px-4 text-sm outline-none">
            <option value="all">Severity</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select name="status" defaultValue={statusFilter} className="brand-input h-11 rounded-xl px-4 text-sm outline-none">
            <option value="all">Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button type="submit" className="brand-button-secondary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold">
            <AppIcon name="filter" className="h-4 w-4" />Apply
          </button>
        </form>

        <div className="mt-5 grid gap-4 xl:grid-cols-4">
          {[
            { label: "Total incidents", value: totals.total },
            { label: "Open", value: totals.open },
            { label: "Investigating", value: totals.investigating },
            { label: "Resolved", value: totals.resolved },
          ].map((card) => (
            <article key={card.label} className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.85)] px-4 py-4">
              <p className="text-sm text-[var(--ai-text-secondary)]">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">{card.value}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 table-shell">
          <table>
            <thead>
              <tr>
                <th>Incident</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reported</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td>
                    <Link href={`/incidents/${i.id}`} className="font-medium text-white hover:text-[var(--ai-cyan)]">
                      {i.title}
                    </Link>
                  </td>
                  <td>
                    <StatusPill
                      label={i.severity.charAt(0).toUpperCase() + i.severity.slice(1)}
                      tone={severityTone(i.severity)}
                    />
                  </td>
                  <td>
                    <StatusPill
                      label={i.status.charAt(0).toUpperCase() + i.status.slice(1)}
                      tone={statusTone(i.status)}
                    />
                  </td>
                  <td className="text-[var(--ai-text-secondary)]">
                    {new Date(i.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <Link href={`/incidents/${i.id}`} className="text-sm text-[var(--ai-cyan)] hover:text-white">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="border-t border-[var(--ai-border)] px-4 py-6 text-sm text-[var(--ai-text-secondary)]">
              No incidents reported.{" "}
              <Link href="/incidents/new" className="text-[var(--ai-cyan)]">Report the first one.</Link>
            </div>
          )}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
