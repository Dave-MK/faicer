import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function HelpPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="help"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Help & Support"
        description="Guides, FAQs, and support paths for responsible AI use."
      />
      <div className="grid gap-5 xl:grid-cols-3">
        {[
          [
            "Getting started",
            "Learn the basics of approved AI use inside your organisation.",
          ],
          [
            "Policies and training",
            "Review required policies and complete AI literacy modules.",
          ],
          [
            "Request support",
            "Need a new tool or have a concern? Contact the governance team.",
          ],
        ].map(([title, copy]) => (
          <WorkspacePanel key={title}>
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
              {copy}
            </p>
          </WorkspacePanel>
        ))}
      </div>
    </AppShell>
  );
}
