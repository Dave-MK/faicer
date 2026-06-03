import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function MyActivityPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="my-activity"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="My Activity"
        description="A record of your acknowledgements, training, and approved tool usage."
      />
      <WorkspacePanel>
        <div className="space-y-3">
          {[
            ["Policy acknowledged", "AI Acceptable Use Policy", "May 20, 2024"],
            ["Training progress", "AI Literacy 101", "May 20, 2024"],
            ["Tool used", "Microsoft Copilot", "May 20, 2024"],
            ["Tool used", "OpenAI ChatGPT (Enterprise)", "May 18, 2024"],
          ].map(([label, value, date]) => (
            <div
              key={`${label}-${value}`}
              className="flex flex-col gap-3 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-white">{label}</p>
                <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">{value}</p>
              </div>
              <span className="text-sm text-[var(--ai-text-muted)]">{date}</span>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
