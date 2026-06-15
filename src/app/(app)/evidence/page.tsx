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
import { listMockEvidenceForOrganisation } from "@/lib/data/mock-registry";
import { listSupabaseEvidence } from "@/lib/supabase/evidence";

const typeTone = (t: string) =>
  ({
    document: "info",
    screenshot: "muted",
    audit_log: "warning",
    assessment: "success",
    other: "muted",
  } as const)[t as "document" | "screenshot" | "audit_log" | "assessment" | "other"] ??
  ("muted" as const);

export default async function EvidencePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const items = isSupabaseAuthEnabled()
    ? await listSupabaseEvidence(context.organisation.id)
    : await listMockEvidenceForOrganisation(context.organisation.id);

  const query = params.q?.trim().toLowerCase() ?? "";
  const typeFilter = params.type ?? "all";

  const filtered = items.filter((e) => {
    if (query && !e.title.toLowerCase().includes(query)) return false;
    if (typeFilter !== "all" && e.type !== typeFilter) return false;
    return true;
  });

  const totals = {
    total: items.length,
    document: items.filter((e) => e.type === "document").length,
    assessment: items.filter((e) => e.type === "assessment").length,
    auditLog: items.filter((e) => e.type === "audit_log").length,
  };

  return (
    <AppShell
      current="evidence"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Evidence Pack"
        description="Collect and organise evidence of your AI governance practices for audit and review."
        actions={
          context.permissions.canReviewRecords ? (
            <Link
              href="/evidence/new"
              className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="plus" className="h-4 w-4" />
              Add evidence
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
              placeholder="Search evidence..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <select name="type" defaultValue={typeFilter} className="brand-input h-11 rounded-xl px-4 text-sm outline-none">
            <option value="all">Type</option>
            <option value="document">Document</option>
            <option value="screenshot">Screenshot</option>
            <option value="audit_log">Audit log</option>
            <option value="assessment">Assessment</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="brand-button-secondary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold">
            <AppIcon name="filter" className="h-4 w-4" />Apply
          </button>
        </form>

        <div className="mt-5 grid gap-4 xl:grid-cols-4">
          {[
            { label: "Total items", value: totals.total },
            { label: "Documents", value: totals.document },
            { label: "Assessments", value: totals.assessment },
            { label: "Audit logs", value: totals.auditLog },
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
                <th>Title</th>
                <th>Type</th>
                <th>Linked entity</th>
                <th>Added</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id}>
                  <td>
                    <Link href={`/evidence/${e.id}`} className="font-medium text-white hover:text-[var(--ai-cyan)]">
                      {e.title}
                    </Link>
                  </td>
                  <td>
                    <StatusPill
                      label={e.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      tone={typeTone(e.type)}
                    />
                  </td>
                  <td className="capitalize text-[var(--ai-text-secondary)]">
                    {e.linkedEntityType.replace(/_/g, " ")}
                  </td>
                  <td className="text-[var(--ai-text-secondary)]">
                    {new Date(e.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td>
                    <Link href={`/evidence/${e.id}`} className="text-sm text-[var(--ai-cyan)] hover:text-white">
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="border-t border-[var(--ai-border)] px-4 py-6 text-sm text-[var(--ai-text-secondary)]">
              No evidence items found.{" "}
              {context.permissions.canReviewRecords && (
                <Link href="/evidence/new" className="text-[var(--ai-cyan)]">Add your first item.</Link>
              )}
            </div>
          )}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
