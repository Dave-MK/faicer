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
import { listMockAssessmentsForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseAssessments } from "@/lib/supabase/assessments";

const outcomeTone = (o: string) =>
  ({ pass: "success", fail: "danger", conditional: "warning" } as const)[
    o as "pass" | "fail" | "conditional"
  ] ?? ("muted" as const);

export default async function AssessmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; outcome?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const assessments = isSupabaseAuthEnabled()
    ? await listSupabaseAssessments(context.organisation.id)
    : await listMockAssessmentsForOrganisation(context.organisation.id);

  const query = params.q?.trim().toLowerCase() ?? "";
  const outcomeFilter = params.outcome ?? "all";

  const filtered = assessments.filter((a) => {
    if (query && !a.findings.toLowerCase().includes(query) && !a.entityType.toLowerCase().includes(query)) return false;
    if (outcomeFilter !== "all" && a.outcome !== outcomeFilter) return false;
    return true;
  });

  const totals = {
    total: assessments.length,
    pass: assessments.filter((a) => a.outcome === "pass").length,
    fail: assessments.filter((a) => a.outcome === "fail").length,
    conditional: assessments.filter((a) => a.outcome === "conditional").length,
  };

  return (
    <AppShell
      current="assessments"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Assessments"
        description="Record and track formal assessments of tools, use cases, and organisational practices."
        actions={
          context.permissions.canReviewRecords ? (
            <Link
              href="/assessments/new"
              className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="plus" className="h-4 w-4" />
              New assessment
            </Link>
          ) : null
        }
      />

      <WorkspacePanel>
        <form className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.8fr))]">
          <label className="relative block">
            <AppIcon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ai-text-muted)]"
            />
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search assessments..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <select name="outcome" defaultValue={outcomeFilter} className="brand-input h-11 rounded-xl px-4 text-sm outline-none">
            <option value="all">Outcome</option>
            <option value="pass">Pass</option>
            <option value="conditional">Conditional</option>
            <option value="fail">Fail</option>
          </select>
          <button type="submit" className="brand-button-secondary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold">
            <AppIcon name="filter" className="h-4 w-4" />Apply
          </button>
        </form>

        <div className="mt-5 grid gap-4 xl:grid-cols-4">
          {[
            { label: "Total assessments", value: totals.total },
            { label: "Passed", value: totals.pass },
            { label: "Conditional", value: totals.conditional },
            { label: "Failed", value: totals.fail },
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
                <th>Entity</th>
                <th>Date</th>
                <th>Outcome</th>
                <th>Next review</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>
                    <span className="font-medium text-white capitalize">
                      {a.entityType.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="text-[var(--ai-text-secondary)]">
                    {new Date(a.assessmentDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <StatusPill
                      label={a.outcome.charAt(0).toUpperCase() + a.outcome.slice(1)}
                      tone={outcomeTone(a.outcome)}
                    />
                  </td>
                  <td className="text-[var(--ai-text-secondary)]">
                    {a.nextAssessmentAt
                      ? new Date(a.nextAssessmentAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                  <td>
                    <Link href={`/assessments/${a.id}`} className="text-sm text-[var(--ai-cyan)] hover:text-white">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="border-t border-[var(--ai-border)] px-4 py-6 text-sm text-[var(--ai-text-secondary)]">
              No assessments found.{" "}
              {context.permissions.canReviewRecords && (
                <Link href="/assessments/new" className="text-[var(--ai-cyan)]">Add your first assessment.</Link>
              )}
            </div>
          )}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
