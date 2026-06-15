import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { AppIcon } from "@/components/AppIcons";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { listMockToolsForOrganisation } from "@/lib/data/mock-registry";

export default async function ApprovedToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const allTools = await listMockToolsForOrganisation(context.organisation.id);

  const query = params.q?.trim().toLowerCase() ?? "";
  const approvedTools = allTools.filter((t) => t.approvalStatus === "approved");
  const filtered = approvedTools.filter(
    (t) => !query || t.name.toLowerCase().includes(query) || t.vendor.toLowerCase().includes(query),
  );

  return (
    <AppShell
      current="approved-tools"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Approved Tools"
        description="These AI tools have been reviewed and approved for use in your organisation."
      />

      <WorkspacePanel>
        <form className="flex gap-3">
          <label className="relative flex-1">
            <AppIcon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ai-text-muted)]"
            />
            <input
              type="search"
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search approved tools..."
              className="brand-input h-11 w-full rounded-xl pl-11 pr-4 text-sm outline-none"
            />
          </label>
          <button type="submit" className="brand-button-secondary inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold">
            <AppIcon name="filter" className="h-4 w-4" />Search
          </button>
        </form>

        <div className="mt-5 grid gap-4 xl:grid-cols-3">
          {[
            { label: "Approved tools", value: approvedTools.length },
            { label: "Total in register", value: allTools.length },
            { label: "Restricted / prohibited", value: allTools.length - approvedTools.length },
          ].map((card) => (
            <article key={card.label} className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.85)] px-4 py-4">
              <p className="text-sm text-[var(--ai-text-secondary)]">{card.label}</p>
              <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">{card.value}</p>
            </article>
          ))}
        </div>

        <div className="mt-5 space-y-3">
          {filtered.map((tool) => (
            <div
              key={tool.id}
              className="flex flex-col gap-4 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold text-white">{tool.name}</p>
                <p className="mt-1 text-sm text-[var(--ai-text-secondary)]">
                  {tool.vendor} · {tool.dataProcessingNotes || tool.notes}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill label="Approved" tone="success" />
                <span className="rounded-full border border-[var(--ai-border)] px-3 py-1 text-xs capitalize text-[var(--ai-text-secondary)]">
                  {tool.category.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-sm text-[var(--ai-text-secondary)]">No approved tools found.</p>
          )}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
