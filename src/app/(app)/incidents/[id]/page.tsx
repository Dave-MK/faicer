import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { findMockIncidentById } from "@/lib/data/mock-registry";
import { getSupabaseIncident } from "@/lib/supabase/incidents";
import { updateIncidentAction } from "@/app/actions/incidents";

const severityTone = (s: string) =>
  ({ low: "success", medium: "warning", high: "danger", critical: "danger" } as const)[
    s as "low" | "medium" | "high" | "critical"
  ] ?? ("muted" as const);

const statusTone = (s: string) =>
  ({ open: "warning", investigating: "info", resolved: "success", closed: "muted" } as const)[
    s as "open" | "investigating" | "resolved" | "closed"
  ] ?? ("muted" as const);

export default async function IncidentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string; edit?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { id } = await params;
  const sp = await searchParams;
  const incident = isSupabaseAuthEnabled()
    ? await getSupabaseIncident(context.organisation.id, id)
    : await findMockIncidentById(id);

  if (!incident || incident.organisationId !== context.organisation.id) notFound();

  const canEdit = context.permissions.canReviewRecords;
  const isEditing = sp.edit === "1" && canEdit;

  return (
    <AppShell
      current="incidents"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="Incidents"
        title={incident.title}
        description={`Reported ${new Date(incident.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
        actions={
          canEdit && !isEditing ? (
            <Link href={`/incidents/${id}?edit=1`}
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
              Edit
            </Link>
          ) : null
        }
      />

      {sp.message === "created" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">Incident reported successfully.</div>
      )}
      {sp.message === "updated" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">Incident updated.</div>
      )}

      {isEditing ? (
        <div className="brand-panel rounded-[2rem] p-8">
          <form action={updateIncidentAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="incidentId" value={incident.id} />

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Title</span>
              <input type="text" name="title" required defaultValue={incident.title}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Severity</span>
              <select name="severity" defaultValue={incident.severity} className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Status</span>
              <select name="status" defaultValue={incident.status} className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Description</span>
              <textarea name="description" rows={4} defaultValue={incident.description}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button type="submit"
                className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition">
                Save changes
              </button>
              <Link href={`/incidents/${id}`}
                className="brand-button-secondary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <WorkspacePanel>
            <p className="text-sm font-semibold text-white">Description</p>
            <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">{incident.description}</p>
          </WorkspacePanel>

          <div className="space-y-5">
            <WorkspacePanel>
              <p className="text-sm text-[var(--ai-text-secondary)]">Severity</p>
              <div className="mt-3">
                <StatusPill
                  label={incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                  tone={severityTone(incident.severity)}
                />
              </div>
            </WorkspacePanel>
            <WorkspacePanel>
              <p className="text-sm text-[var(--ai-text-secondary)]">Status</p>
              <div className="mt-3">
                <StatusPill
                  label={incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                  tone={statusTone(incident.status)}
                />
              </div>
            </WorkspacePanel>
            <WorkspacePanel>
              <p className="text-sm font-semibold text-white">Actions</p>
              <div className="mt-3 space-y-2">
                <Link href="/evidence/new" className="block text-sm text-[var(--ai-cyan)] hover:text-white">
                  Attach evidence →
                </Link>
                {canEdit && (
                  <Link href={`/incidents/${id}?edit=1`} className="block text-sm text-[var(--ai-cyan)] hover:text-white">
                    Update status →
                  </Link>
                )}
              </div>
            </WorkspacePanel>
          </div>
        </div>
      )}
    </AppShell>
  );
}
