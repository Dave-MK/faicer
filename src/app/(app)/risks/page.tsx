import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function RisksPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="risks"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Risk Assessment"
        description="Identify and evaluate risks with guided assessments."
      />
      <WorkspacePanel>
        <div className="mb-5 flex flex-wrap gap-6 border-b border-[var(--ai-border)] pb-4 text-sm">
          <span className="font-medium text-[var(--ai-blue)]">1. Scope</span>
          <span className="text-[var(--ai-text-secondary)]">2. Questions</span>
          <span className="text-[var(--ai-text-secondary)]">3. Review</span>
          <span className="text-[var(--ai-text-secondary)]">4. Results</span>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
          <div className="grid gap-4 md:grid-cols-2">
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
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm text-white md:col-span-2">
              Quarterly assessment of AI/ML systems and supporting processes.
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm text-[var(--ai-text-secondary)]">Progress</p>
              <p className="mt-3 text-4xl font-semibold text-white">25%</p>
            </div>
            <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm text-[var(--ai-text-secondary)]">In scope</p>
              <div className="mt-4 space-y-3 text-sm text-white">
                <p>AI/ML systems</p>
                <p>Data assets</p>
                <p>Third-party services</p>
                <p>People & processes</p>
              </div>
            </div>
          </div>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
