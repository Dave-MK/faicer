import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { governanceHighlights } from "@/lib/reference-content";

export default async function GovernancePage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="governance"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Governance Workflows"
        description="End-to-end governance management with guided workflows, policy authoring, team oversight, and training compliance."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">1. Risk assessment</p>
          <h2 className="text-2xl font-semibold text-white">Identify and evaluate risks</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {[
                "Assessment name",
                "Business unit",
                "Assessment owner",
                "Framework",
              ].map((item) => (
                <div key={item} className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm text-white">
                  {item}
                </div>
              ))}
            </div>
            <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm text-[var(--ai-text-secondary)]">Progress</p>
              <p className="mt-4 text-4xl font-semibold text-white">25%</p>
              <div className="mt-4 space-y-3 text-sm text-[var(--ai-text-secondary)]">
                <p>AI/ML systems</p>
                <p>Data assets</p>
                <p>Third-party services</p>
              </div>
            </div>
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">2. Policy builder</p>
          <h2 className="text-2xl font-semibold text-white">Create and manage policies</h2>
          <div className="mt-5 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="flex flex-wrap gap-6 border-b border-[var(--ai-border)] pb-4 text-sm">
              <span className="font-medium text-[var(--ai-blue)]">Editor</span>
              <span className="text-[var(--ai-text-secondary)]">Settings</span>
              <span className="text-[var(--ai-text-secondary)]">Approvals</span>
              <span className="text-[var(--ai-text-secondary)]">Review</span>
            </div>
            <div className="mt-5 space-y-5 text-sm">
              <p className="text-xl font-semibold text-white">1. Purpose</p>
              <p className="text-[var(--ai-text-secondary)]">
                This policy defines how AI Ledger collects, processes, and protects
                personal data in compliance with applicable privacy laws.
              </p>
              <p className="text-xl font-semibold text-white">2. Scope</p>
              <p className="text-[var(--ai-text-secondary)]">
                This policy applies to employees, contractors, and third parties who
                access or process personal data on behalf of AI Ledger.
              </p>
            </div>
          </div>
        </WorkspacePanel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">3. Policy versions</p>
          <h2 className="text-2xl font-semibold text-white">Version history</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Version 1.2.0", "Active"],
              ["Version 1.1.0", "Superseded"],
              ["Version 1.0.0", "Superseded"],
              ["Version 0.9.0", "Draft"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="text-sm text-white">{label}</span>
                <span className="text-sm text-[var(--ai-text-secondary)]">{value}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">4. Team members</p>
          <h2 className="text-2xl font-semibold text-white">Manage access and roles</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Alex Kim", "Administrator"],
              ["Jordan Lee", "Administrator"],
              ["Taylor Morgan", "Contributor"],
              ["Riya Wong", "Viewer"],
            ].map(([name, role]) => (
              <div key={name} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="text-sm text-white">{name}</span>
                <span className="text-sm text-[var(--ai-text-secondary)]">{role}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">5. Training status</p>
          <h2 className="text-2xl font-semibold text-white">Monitor completion</h2>
          <div className="mt-5 space-y-3">
            {[
              ["AI Privacy Basics", "83%"],
              ["Secure AI Practices", "90%"],
              ["Data Handling", "80%"],
              ["Policy Acknowledgement", "92%"],
            ].map(([name, completion]) => (
              <div key={name} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="text-sm text-white">{name}</span>
                <span className="text-sm text-[var(--ai-text-secondary)]">{completion}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-5">
        {governanceHighlights.map((item) => (
          <div
            key={item.title}
            className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.82)] px-5 py-5"
          >
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
              {item.copy}
            </p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
