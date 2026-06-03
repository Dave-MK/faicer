import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function TrainingPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="training"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="AI Literacy 101"
        description="Great AI use starts with good judgement."
      />
      <WorkspacePanel>
        <div className="mb-5 flex items-center justify-between text-sm">
          <span className="text-[var(--ai-text-secondary)]">Lesson 3 of 5</span>
          <span className="text-white">60%</span>
        </div>
        <div className="mb-6 h-2 rounded-full bg-[rgba(18,31,53,0.95)]">
          <div className="h-2 w-[60%] rounded-full bg-[linear-gradient(90deg,#00d4ff_0%,#1c65ff_100%)]" />
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <div>
            <h2 className="text-2xl font-semibold text-white">Using AI Responsibly</h2>
            <div className="mt-5 space-y-3 text-sm">
              {[
                "Understand what data you can and cannot share.",
                "Be transparent about AI use in your work.",
                "Review AI output for accuracy and bias.",
                "Report misuse or unexpected results.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4 text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[22px] border border-[var(--ai-border)] bg-[radial-gradient(circle_at_center,rgba(28,101,255,0.18),transparent_55%),rgba(255,255,255,0.03)] p-5">
            <div className="mx-auto flex h-52 w-52 items-center justify-center rounded-[28px] border border-[rgba(42,75,115,0.64)] bg-[rgba(7,17,32,0.72)] text-7xl text-[var(--ai-cyan)]">
              AI
            </div>
          </div>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
