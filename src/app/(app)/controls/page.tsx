import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function ControlsPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="controls"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Control Library"
        description="Define and monitor the operational controls that support safe AI use."
      />
      <div className="grid gap-5 xl:grid-cols-3">
        <WorkspacePanel>
          <h2 className="text-2xl font-semibold text-white">Prompt hygiene</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            Keep secrets, passwords, and unapproved personal data out of prompts.
          </p>
        </WorkspacePanel>
        <WorkspacePanel>
          <h2 className="text-2xl font-semibold text-white">Human review</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            Require review before outputs are shared externally or used in client work.
          </p>
        </WorkspacePanel>
        <WorkspacePanel>
          <h2 className="text-2xl font-semibold text-white">Account access</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            Restrict use to approved accounts, roles, and managed vendor contracts.
          </p>
        </WorkspacePanel>
      </div>
      <WorkspacePanel className="mt-5">
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Control</th>
                <th>Type</th>
                <th>Coverage</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Prompt hygiene checklist", "Preventive", "Enterprise", "Security", "Active"],
                ["Quarterly review cadence", "Detective", "Enterprise", "Governance", "Active"],
                ["Approved tool allowlist", "Preventive", "All staff", "IT", "Active"],
                ["Output fact-check guidance", "Corrective", "Marketing", "Compliance", "Draft"],
              ].map(([name, type, coverage, owner, status]) => (
                <tr key={name}>
                  <td className="text-white">{name}</td>
                  <td>{type}</td>
                  <td>{coverage}</td>
                  <td>{owner}</td>
                  <td>{status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
