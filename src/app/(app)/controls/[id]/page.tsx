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
import { findMockControlById, listMockRisksForOrganisation } from "@/lib/data/mock-registry";
import { getSupabaseControl } from "@/lib/supabase/controls";
import { listSupabaseRisks } from "@/lib/supabase/risks";
import { updateControlAction } from "@/app/actions/controls";

const typeTone = (t: string) =>
  (
    { technical: "info", policy: "success", training: "warning", process: "muted" } as const
  )[t as "technical" | "policy" | "training" | "process"] ?? ("muted" as const);

export default async function ControlDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; edit?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { id } = await params;
  const sp = await searchParams;
  const [control, risks] = await Promise.all([
    isSupabaseAuthEnabled()
      ? getSupabaseControl(context.organisation.id, id)
      : findMockControlById(id),
    isSupabaseAuthEnabled()
      ? listSupabaseRisks(context.organisation.id)
      : listMockRisksForOrganisation(context.organisation.id),
  ]);

  if (!control || control.organisationId !== context.organisation.id) notFound();

  const linkedRisks = risks.filter((r) => control.linkedRiskIds.includes(r.id));
  const canEdit = context.permissions.canManageOrganisation;
  const isEditing = sp.edit === "1" && canEdit;

  return (
    <AppShell
      current="controls"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="Controls"
        title={control.title}
        description={control.description}
        actions={
          canEdit && !isEditing ? (
            <Link href={`/controls/${id}?edit=1`}
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
              Edit
            </Link>
          ) : null
        }
      />

      {sp.message === "created" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">Control created.</div>
      )}
      {sp.message === "updated" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">Control updated.</div>
      )}

      {isEditing ? (
        <div className="brand-panel rounded-[2rem] p-8">
          <form action={updateControlAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="controlId" value={control.id} />
            <input type="hidden" name="ownerUserId" value={control.ownerUserId} />

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Title</span>
              <input type="text" name="title" required defaultValue={control.title}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Type</span>
              <select name="type" defaultValue={control.type} className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
                <option value="technical">Technical</option>
                <option value="policy">Policy</option>
                <option value="training">Training</option>
                <option value="process">Process</option>
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Status</span>
              <select name="status" defaultValue={control.status} className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition">
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="retired">Retired</option>
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Description</span>
              <textarea name="description" rows={4} defaultValue={control.description}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition" />
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button type="submit"
                className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition">
                Save changes
              </button>
              <Link href={`/controls/${id}`}
                className="brand-button-secondary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <WorkspacePanel>
            <p className="text-sm leading-7 text-[var(--ai-text-secondary)]">{control.description}</p>
            {linkedRisks.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-semibold text-white">Linked risks</p>
                <div className="mt-3 space-y-2">
                  {linkedRisks.map((r) => (
                    <Link key={r.id} href={`/risks/${r.id}`}
                      className="block rounded-2xl border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white hover:text-[var(--ai-cyan)]">
                      {r.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </WorkspacePanel>
          <div className="space-y-5">
            <WorkspacePanel>
              <p className="text-sm text-[var(--ai-text-secondary)]">Type</p>
              <div className="mt-3">
                <StatusPill label={control.type.charAt(0).toUpperCase() + control.type.slice(1)} tone={typeTone(control.type)} />
              </div>
            </WorkspacePanel>
            <WorkspacePanel>
              <p className="text-sm text-[var(--ai-text-secondary)]">Status</p>
              <div className="mt-3">
                <StatusPill
                  label={control.status.charAt(0).toUpperCase() + control.status.slice(1)}
                  tone={control.status === "active" ? "success" : "muted"}
                />
              </div>
            </WorkspacePanel>
          </div>
        </div>
      )}
    </AppShell>
  );
}
