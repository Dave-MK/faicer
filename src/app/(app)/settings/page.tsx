import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function SettingsPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="settings"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Settings"
        description="Configure system settings, preferences, and default governance behavior."
      />
      <WorkspacePanel>
        <div className="grid gap-5 xl:grid-cols-[0.32fr_0.68fr]">
          <div className="space-y-2">
            {[
              "General",
              "Users & Access",
              "Notifications",
              "Integrations",
              "Data Retention",
              "Security",
              "Compliance",
              "Appearance",
              "Audit",
            ].map((item, index) => (
              <div
                key={item}
                className={`rounded-2xl px-4 py-3 text-sm ${
                  index === 0
                    ? "bg-[linear-gradient(135deg,#1243d6_0%,#1c65ff_100%)] text-white"
                    : "text-[var(--ai-text-secondary)]"
                }`}
              >
                {item}
              </div>
            ))}
          </div>

          <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["Organisation Name", context.organisation.name],
                ["Industry", context.organisation.sector],
                ["Time Zone", "(UTC+00:00) London"],
                ["Country", context.organisation.country],
                ["Date Format", "May 20, 2024"],
                ["Time Format", "12-hour (AM/PM)"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-[rgba(8,18,34,0.78)] px-4 py-4">
                  <p className="text-sm text-[var(--ai-text-muted)]">{label}</p>
                  <p className="mt-2 text-sm text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[rgba(8,18,34,0.78)] px-4 py-4">
              <p className="text-sm font-semibold text-white">Preferences</p>
              <div className="mt-4 space-y-4">
                {[
                  "Enable email notifications",
                  "Enable weekly digest",
                  "Enable platform updates",
                ].map((item) => (
                  <div key={item} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--ai-text-secondary)]">{item}</span>
                    <span className="h-6 w-11 rounded-full bg-[linear-gradient(135deg,#1c65ff_0%,#7a38ff_100%)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
