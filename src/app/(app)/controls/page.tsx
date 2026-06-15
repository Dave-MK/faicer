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
import { listMockControlsForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseControls } from "@/lib/supabase/controls";

const typeTone = (t: string) =>
  (
    {
      technical: "info",
      policy: "success",
      training: "warning",
      process: "muted",
    } as const
  )[t as "technical" | "policy" | "training" | "process"] ?? ("muted" as const);

const statusTone = (s: string) =>
  ({ active: "success", draft: "muted", retired: "warning" } as const)[
    s as "active" | "draft" | "retired"
  ] ?? ("muted" as const);

export default async function ControlsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; status?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const controls = isSupabaseAuthEnabled()
    ? await listSupabaseControls(context.organisation.id)
    : await listMockControlsForOrganisation(context.organisation.id);

  const query = params.q?.trim().toLowerCase() ?? "";
  const typeFilter = params.type ?? "all";
  const statusFilter = params.status ?? "all";

  const filtered = controls.filter((c) => {
    if (query && !c.title.toLowerCase().includes(query)) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const totals = {
    total: controls.length,
    active: controls.filter((c) => c.status === "active").length,
    technical: controls.filter((c) => c.type === "technical").length,
    policy: controls.filter((c) => c.type === "policy").length,
  };

  return (
    <AppShell
      current="controls"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Controls"
        description="Map technical, policy, and process safeguards to identified risks."
        actions={
          context.permissions.canManageOrganisation ? (
            <Link
              href="/controls/new"
              className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="plus" className="h-4 w-4" />
              Add control
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
              placeholder="Search controls..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <select name="type" defaultValue={typeFilter} className="brand-input h-11 rounded-xl px-4 text-sm outline-none">
            <option value="all">Type</option>
            <option value="technical">Technical</option>
            <option value="policy">Policy</option>
            <option value="training">Training</option>
            <option value="process">Process</option>
          </select>
          <select name="status" defaultValue={statusFilter} className="brand-input h-11 rounded-xl px-4 text-sm outline-none">
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="retired">Retired</option>
          </select>
          <button type="submit" className="brand-button-secondary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold">
            <AppIcon name="filter" className="h-4 w-4" />Apply
          </button>
        </form>

        <div className="mt-5 grid gap-4 xl:grid-cols-4">
          {[
            { label: "Total controls", value: totals.total },
            { label: "Active", value: totals.active },
            { label: "Technical", value: totals.technical },
            { label: "Policy", value: totals.policy },
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
                <th>Control</th>
                <th>Type</th>
                <th>Status</th>
                <th>Linked risks</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <Link href={`/controls/${c.id}`} className="font-medium text-white hover:text-[var(--ai-cyan)]">
                      {c.title}
                    </Link>
                  </td>
                  <td>
                    <StatusPill
                      label={c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                      tone={typeTone(c.type)}
                    />
                  </td>
                  <td>
                    <StatusPill
                      label={c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      tone={statusTone(c.status)}
                    />
                  </td>
                  <td>{c.linkedRiskIds.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="border-t border-[var(--ai-border)] px-4 py-6 text-sm text-[var(--ai-text-secondary)]">
              No controls found.{" "}
              {context.permissions.canManageOrganisation && (
                <Link href="/controls/new" className="text-[var(--ai-cyan)]">Add your first control.</Link>
              )}
            </div>
          )}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
