import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockAuditEvents, listMockCompletionsForUser, listMockAcknowledgementsForUser } from "@/lib/data/mock-registry";
import { listSupabaseAuditEventsForUser } from "@/lib/supabase/audit-events";
import { listSupabaseCompletionsForUser } from "@/lib/supabase/training";
import { listSupabasePolicyAcknowledgementsForUser } from "@/lib/supabase/policies";

export default async function MyActivityPage() {
  const context = await requireWorkspaceContext();
  const supabaseEnabled = isSupabaseAuthEnabled();
  const [myEvents, completions, acks] = await Promise.all([
    supabaseEnabled
      ? listSupabaseAuditEventsForUser(context.user.id, context.organisation.id)
      : listMockAuditEvents(context.organisation.id).then((events) =>
          events
            .filter((e) => e.actorUserId === context.user.id)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
            .slice(0, 20),
        ),
    supabaseEnabled
      ? listSupabaseCompletionsForUser(context.user.id, context.organisation.id)
      : listMockCompletionsForUser(context.user.id, context.organisation.id),
    supabaseEnabled
      ? listSupabasePolicyAcknowledgementsForUser(context.user.id, context.organisation.id)
      : listMockAcknowledgementsForUser(context.user.id, context.organisation.id),
  ]);

  const actionLabel = (action: string) =>
    action
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <AppShell
      current="my-activity"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="My Activity"
        description="A record of your actions, acknowledgements, and training completions."
      />

      <div className="grid gap-5 xl:grid-cols-3 mb-5">
        {[
          { label: "Actions recorded", value: myEvents.length },
          { label: "Policies acknowledged", value: acks.length },
          { label: "Courses completed", value: completions.length },
        ].map((card) => (
          <article key={card.label} className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.85)] px-4 py-4">
            <p className="text-sm text-[var(--ai-text-secondary)]">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">{card.value}</p>
          </article>
        ))}
      </div>

      <WorkspacePanel>
        {myEvents.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--ai-text-secondary)]">No activity recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {myEvents.map((event) => (
              <div key={event.id} className="flex flex-col gap-3 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium text-white">{actionLabel(event.action)}</p>
                  <p className="mt-1 text-sm capitalize text-[var(--ai-text-secondary)]">
                    {event.entityType.replace(/_/g, " ")}
                  </p>
                </div>
                <span className="text-sm text-[var(--ai-text-muted)]">
                  {new Date(event.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </WorkspacePanel>
    </AppShell>
  );
}
