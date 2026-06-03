import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { AppIcon } from "@/components/AppIcons";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { useCaseRows } from "@/lib/reference-content";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function UseCasesPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="use-cases"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="AI Use Cases"
        description="Manage and govern how AI tools are used across your organisation."
        actions={
          <>
            <button
              type="button"
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Import
            </button>
            <button
              type="button"
              className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <AppIcon name="plus" className="h-4 w-4" />
              Add use case
            </button>
          </>
        }
      />

      <WorkspacePanel>
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,0.72fr))]">
          <label className="relative block">
            <AppIcon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ai-text-muted)]"
            />
            <input
              type="search"
              placeholder="Search use cases..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          {["Status", "Risk level", "Business unit", "Tool"].map((item) => (
            <button
              key={item}
              type="button"
              className="brand-input inline-flex h-11 items-center justify-between rounded-xl px-4 text-sm text-[var(--ai-text-secondary)]"
            >
              <span>{item}</span>
              <AppIcon name="chevron" className="h-4 w-4" />
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-5">
          {[
            ["Total use cases", "64", "+ 23%"],
            ["Approved", "34", "+ 17%"],
            ["In review", "15", "+ 25%"],
            ["Restricted", "9", "+ 10%"],
            ["Prohibited", "6", "+ 0%"],
          ].map(([label, value, delta], index) => (
            <article
              key={label}
              className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.85)] px-4 py-4"
            >
              <p className="text-sm text-[var(--ai-text-secondary)]">{label}</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">
                {value}
              </p>
              <p
                className={`mt-3 text-sm font-medium ${
                  index === 4 ? "text-[var(--ai-danger)]" : "text-[var(--ai-success)]"
                }`}
              >
                {delta}
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
                <th>Owner</th>
                <th>Last review</th>
              </tr>
            </thead>
            <tbody>
              {useCaseRows.map((row) => (
                <tr key={row.title}>
                  <td>
                    <Link
                      href={`/use-cases/${slugify(row.title)}`}
                      className="font-medium text-white transition hover:text-[var(--ai-cyan)]"
                    >
                      {row.title}
                    </Link>
                  </td>
                  <td>{row.tool}</td>
                  <td>{row.unit}</td>
                  <td
                    className={
                      row.risk === "High"
                        ? "text-[var(--ai-danger)]"
                        : row.risk === "Medium"
                          ? "text-[var(--ai-warning)]"
                          : "text-[var(--ai-success)]"
                    }
                  >
                    {row.risk}
                  </td>
                  <td>
                    <StatusPill
                      label={row.status}
                      tone={
                        row.status === "Approved"
                          ? "success"
                          : row.status === "Restricted"
                            ? "warning"
                            : "danger"
                      }
                    />
                  </td>
                  <td>{row.owner}</td>
                  <td>{row.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
