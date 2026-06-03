import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function ReportsPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="reports"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Export History"
        description="View and manage exported reports, evidence packs, and audit downloads."
      />
      <WorkspacePanel>
        <div className="mb-5 grid gap-4 xl:grid-cols-4">
          {[
            ["Exports", "42", "+ 27%"],
            ["Successful", "39", "+ 93%"],
            ["Failed", "3", "- 7%"],
            ["Data exported", "12.6 GB", "+ 10%"],
          ].map(([label, value, delta], index) => (
            <div
              key={label}
              className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4"
            >
              <p className="text-sm text-[var(--ai-text-secondary)]">{label}</p>
              <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              <p
                className={`mt-2 text-sm ${
                  index === 2 ? "text-[var(--ai-danger)]" : "text-[var(--ai-success)]"
                }`}
              >
                {delta}
              </p>
            </div>
          ))}
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Export name</th>
                <th>Type</th>
                <th>Format</th>
                <th>Requested by</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Q2 Risk Report 2024", "Report", "PDF", "A. Kumar", "May 20, 2024", "Completed"],
                ["Vendor Evidence Pack", "Evidence", "ZIP", "M. Patel", "May 19, 2024", "Completed"],
                ["Access Review Results", "Report", "CSV", "J. Anderson", "May 18, 2024", "Completed"],
                ["Policy Compliance Report", "Report", "PDF", "R. Kim", "May 17, 2024", "Failed"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, index) => (
                    <td key={`${row[0]}-${index}`} className={index === 0 ? "text-white" : ""}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
