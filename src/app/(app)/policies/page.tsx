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
  listMockPoliciesForOrganisation,
  listMockAcknowledgementsForUser,
} from "@/lib/data/mock-registry";
import { listSupabasePolicies, listSupabasePolicyAcknowledgementsForUser } from "@/lib/supabase/policies";

const statusTone = (s: string) =>
  (
    {
      active: "success",
      under_review: "info",
      draft: "muted",
      archived: "muted",
    } as const
  )[s] ?? ("muted" as const);

function fmt(d: string | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export default async function PoliciesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;

  const [policies, userAcks] = await Promise.all([
    isSupabaseAuthEnabled()
      ? listSupabasePolicies(context.organisation.id)
      : listMockPoliciesForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabasePolicyAcknowledgementsForUser(context.user.id, context.organisation.id)
      : listMockAcknowledgementsForUser(context.user.id, context.organisation.id),
  ]);

  const ackedSet = new Set(userAcks.map((a) => a.policyId));
  const query = params.q?.trim().toLowerCase() ?? "";
  const statusFilter = params.status ?? "all";

  const filtered = policies.filter((p) => {
    if (query && !p.title.toLowerCase().includes(query)) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const totals = {
    total: policies.length,
    active: policies.filter((p) => p.status === "active").length,
    draft: policies.filter((p) => p.status === "draft").length,
    underReview: policies.filter((p) => p.status === "under_review").length,
  };

  return (
    <AppShell
      current="policies"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Policy Builder"
        description="Create, publish, and manage AI governance policies for your organisation."
        actions={
          context.permissions.canManageOrganisation ? (
            <Link
              href="/policies/new"
              className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="plus" className="h-4 w-4" />
              New policy
            </Link>
          ) : null
        }
      />

      <WorkspacePanel>
        <form className="grid gap-3 xl:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,0.7fr))]">
          <label className="relative block">
            <AppIcon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ai-text-muted)]"
            />
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search policies..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <select
            name="status"
            defaultValue={statusFilter}
            className="brand-input h-11 rounded-xl px-4 text-sm outline-none"
          >
            <option value="all">Status</option>
            <option value="active">Active</option>
            <option value="under_review">Under review</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button
            type="submit"
            className="brand-button-secondary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold"
          >
            <AppIcon name="filter" className="h-4 w-4" />
            Apply
          </button>
        </form>

        <div className="mt-5 grid gap-4 xl:grid-cols-4">
          {[
            { label: "Total policies", value: totals.total },
            { label: "Active", value: totals.active },
            { label: "Under review", value: totals.underReview },
            { label: "Drafts", value: totals.draft },
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
                <th>Policy title</th>
                <th>Version</th>
                <th>Status</th>
                <th>Effective date</th>
                <th>Your acknowledgement</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((policy) => (
                <tr key={policy.id}>
                  <td>
                    <Link
                      href={`/policies/${policy.id}`}
                      className="font-medium text-white transition hover:text-[var(--ai-cyan)]"
                    >
                      {policy.title}
                    </Link>
                  </td>
                  <td>v{policy.version}</td>
                  <td>
                    <StatusPill
                      label={policy.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      tone={statusTone(policy.status)}
                    />
                  </td>
                  <td>{fmt(policy.effectiveDate)}</td>
                  <td>
                    {policy.status === "active" ? (
                      <StatusPill
                        label={ackedSet.has(policy.id) ? "Acknowledged" : "Pending"}
                        tone={ackedSet.has(policy.id) ? "success" : "warning"}
                      />
                    ) : (
                      <span className="text-[var(--ai-text-muted)]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="border-t border-[var(--ai-border)] px-4 py-6 text-sm text-[var(--ai-text-secondary)]">
              No policies found.{" "}
              {context.permissions.canManageOrganisation && (
                <Link href="/policies/new" className="text-[var(--ai-cyan)]">
                  Create your first policy.
                </Link>
              )}
            </div>
          )}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
