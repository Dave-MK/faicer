import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

export default async function ApprovedToolsPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="approved-tools"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Approved Tools"
        description="These tools have been reviewed and approved for use."
      />
      <WorkspacePanel>
        <div className="mb-5 grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_0.8fr]">
          <input
            type="search"
            placeholder="Search tools..."
            className="brand-input h-11 rounded-xl px-4 text-sm outline-none"
          />
          <button
            type="button"
            className="brand-input inline-flex h-11 items-center justify-between rounded-xl px-4 text-sm text-[var(--ai-text-secondary)]"
          >
            <span>All categories</span>
          </button>
        </div>
        <div className="space-y-3">
          {[
            [
              "Microsoft Copilot",
              "AI assistant for productivity, content generation, and insights.",
              "Productivity",
            ],
            [
              "OpenAI ChatGPT (Enterprise)",
              "Conversational AI for drafting, research, and problem solving.",
              "Research",
            ],
            ["Notion AI", "AI features for summarizing, writing, and organizing.", "Productivity"],
            ["Grammarly", "AI writing assistance and tone suggestions.", "Writing"],
            ["DALL-E 3", "AI image generation for presentations and creative work.", "Creative"],
          ].map(([name, copy, tag]) => (
            <div
              key={name}
              className="flex flex-col gap-4 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-white">{name}</h2>
                <p className="mt-2 max-w-[720px] text-sm leading-7 text-[var(--ai-text-secondary)]">
                  {copy}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill label="Approved" tone="success" />
                <span className="rounded-full border border-[var(--ai-border)] px-3 py-1 text-xs text-[var(--ai-text-secondary)]">
                  {tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
