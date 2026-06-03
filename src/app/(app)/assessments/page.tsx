import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function AssessmentsPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="assessments"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Review Calendar"
        description="Schedule and oversee reviews, audits, and recurring governance checkpoints."
      />
      <WorkspacePanel>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex gap-2">
            {["Month", "Week", "List"].map((item, index) => (
              <span
                key={item}
                className={`rounded-xl px-3 py-2 text-sm ${
                  index === 0
                    ? "bg-[linear-gradient(135deg,#1243d6_0%,#1c65ff_100%)] text-white"
                    : "border border-[var(--ai-border)] text-[var(--ai-text-secondary)]"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <span className="text-sm text-[var(--ai-text-secondary)]">May 2024</span>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs text-[var(--ai-text-secondary)]">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span key={day}>{day}</span>
          ))}
          {Array.from({ length: 35 }, (_, index) => (
            <div
              key={index}
              className={`rounded-xl px-2 py-4 ${
                [3, 10, 16, 22, 29].includes(index)
                  ? "bg-[rgba(28,101,255,0.22)] text-white"
                  : "bg-[rgba(255,255,255,0.03)]"
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
