import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function MyPoliciesPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="my-policies"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="AI Acceptable Use Policy"
        description="Please review and acknowledge this policy to continue."
      />
      <WorkspacePanel>
        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
            <h2 className="text-lg font-semibold text-white">Key points</h2>
            <div className="mt-5 space-y-3 text-sm">
              {[
                "Use AI tools responsibly and ethically.",
                "Protect confidential and personal data.",
                "Follow all company policies and applicable laws.",
                "Report issues or concerns promptly.",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-[rgba(8,18,34,0.78)] px-4 py-4 text-white"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
            <label className="flex items-start gap-3 text-sm text-[var(--ai-text-secondary)]">
              <input type="checkbox" className="mt-1 h-4 w-4" />
              <span>I have read and understood the AI Acceptable Use Policy.</span>
            </label>
            <button
              type="button"
              className="brand-button-primary mt-6 inline-flex w-full justify-center rounded-xl px-4 py-3 text-sm font-semibold"
            >
              Acknowledge
            </button>
            <p className="mt-4 text-sm text-[var(--ai-text-muted)]">
              Your acknowledgement will be recorded and may be audited.
            </p>
          </div>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
