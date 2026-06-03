import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function IntegrationsPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="integrations"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Integrations"
        description="Connect the systems that feed your evidence, reviews, and audit trail."
      />
      <div className="grid gap-5 xl:grid-cols-3">
        {[
          ["Microsoft 365", "Connected", "Document and collaboration evidence"],
          ["Okta", "Connected", "Identity and access review data"],
          ["Jira Service Management", "Pending", "Incident and change management records"],
          ["SharePoint", "Connected", "Policy and evidence document source"],
          ["OneTrust", "Pending", "Vendor assessments and privacy inventory"],
          ["Slack", "Planned", "Notification and acknowledgement workflows"],
        ].map(([name, status, copy]) => (
          <WorkspacePanel key={name}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">{name}</h2>
              <span className="text-sm text-[var(--ai-text-secondary)]">{status}</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">{copy}</p>
          </WorkspacePanel>
        ))}
      </div>
    </AppShell>
  );
}
