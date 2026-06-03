import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function PoliciesPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="policies"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Policy Builder"
        description="Create and manage policies with a rich editor and structured guidance."
      />
      <WorkspacePanel>
        <div className="mb-5 flex flex-wrap gap-6 border-b border-[var(--ai-border)] pb-4 text-sm">
          <span className="font-medium text-[var(--ai-blue)]">Editor</span>
          <span className="text-[var(--ai-text-secondary)]">Settings</span>
          <span className="text-[var(--ai-text-secondary)]">Approvals</span>
          <span className="text-[var(--ai-text-secondary)]">Review</span>
        </div>
        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
            <div className="mb-5 flex flex-wrap gap-3">
              {["Heading", "Bold", "Italic", "List", "Link"].map((item) => (
                <span key={item} className="rounded-xl border border-[var(--ai-border)] px-3 py-2 text-sm text-white">
                  {item}
                </span>
              ))}
            </div>
            <div className="space-y-6 text-sm leading-7">
              <div>
                <h2 className="text-2xl font-semibold text-white">1. Purpose</h2>
                <p className="mt-3 text-[var(--ai-text-secondary)]">
                  This policy defines how AI Ledger collects, processes, and protects
                  personal data in compliance with applicable privacy laws and regulations.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">2. Scope</h2>
                <p className="mt-3 text-[var(--ai-text-secondary)]">
                  This policy applies to all employees, contractors, and third parties who
                  access or process personal data on behalf of AI Ledger.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">3. Policy Statement</h2>
                <p className="mt-3 text-[var(--ai-text-secondary)]">
                  We are committed to protecting personal data and ensuring privacy by
                  design and by default in AI systems.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
            <h3 className="text-lg font-semibold text-white">Policy sections</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                "Purpose",
                "Scope",
                "Policy Statement",
                "Data Collection",
                "Data Use",
                "Data Retention",
                "Data Sharing",
                "Security Measures",
                "Compliance",
              ].map((item, index) => (
                <div key={item} className="flex items-center justify-between rounded-2xl bg-[rgba(8,18,34,0.78)] px-4 py-4">
                  <span className="text-white">
                    {index + 1}. {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
