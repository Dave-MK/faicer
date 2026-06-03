import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function EvidencePage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="evidence"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Evidence & Operations Suite"
        description="Comprehensive pages for governance, evidence management and audit operations."
      />

      <div className="grid gap-5 xl:grid-cols-3">
        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">1. Incident register</p>
          <h2 className="text-2xl font-semibold text-white">Track and manage incidents</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[
              ["Open", "32"],
              ["In progress", "27"],
              ["Investigating", "18"],
              ["Resolved", "51"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-3 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ai-text-muted)]">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">2. Review calendar</p>
          <h2 className="text-2xl font-semibold text-white">Schedule and oversee reviews</h2>
          <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs text-[var(--ai-text-secondary)]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
            {Array.from({ length: 35 }, (_, index) => (
              <div
                key={index}
                className={`rounded-xl px-2 py-3 ${
                  [4, 11, 18, 23, 27].includes(index)
                    ? "bg-[rgba(28,101,255,0.2)] text-white"
                    : "bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">3. Evidence pack preview</p>
          <h2 className="text-2xl font-semibold text-white">Vendor risk assessment pack</h2>
          <div className="mt-5 space-y-3 text-sm">
            {[
              ["Policy", "Vendor Management"],
              ["Source", "OneTrust"],
              ["Collected on", "May 20, 2024"],
              ["Items", "24"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="text-[var(--ai-text-secondary)]">{label}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">4. Export history</p>
          <h2 className="text-2xl font-semibold text-white">Reports and evidence exports</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Q2 Risk Report 2024", "Completed"],
              ["Vendor Evidence Pack", "Completed"],
              ["Access Review Results", "Completed"],
              ["Policy Compliance Report", "Failed"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm">
                <span className="text-white">{label}</span>
                <span className="text-[var(--ai-text-secondary)]">{value}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">5. Audit log</p>
          <h2 className="text-2xl font-semibold text-white">System and user activity</h2>
          <div className="mt-5 space-y-3">
            {[
              ["Exported Report", "Success"],
              ["Downloaded Evidence", "Success"],
              ["Updated Policy", "Success"],
              ["Deleted Evidence", "Failed"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm">
                <span className="text-white">{label}</span>
                <span className="text-[var(--ai-text-secondary)]">{value}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="mb-4 text-sm font-semibold text-[var(--ai-blue)]">6. Settings</p>
          <h2 className="text-2xl font-semibold text-white">Preferences and controls</h2>
          <div className="mt-5 space-y-3 text-sm">
            {[
              "Enable email notifications",
              "Enable weekly digest",
              "Enable platform updates",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="text-white">{item}</span>
                <span className="h-6 w-11 rounded-full bg-[linear-gradient(135deg,#1c65ff_0%,#7a38ff_100%)]" />
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </div>
    </AppShell>
  );
}
