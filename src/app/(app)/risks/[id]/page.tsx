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
import { findMockRiskById } from "@/lib/data/mock-registry";
import { getSupabaseRisk } from "@/lib/supabase/risks";
import { updateRiskAction } from "@/app/actions/risks";

const levelTone = (l: string) =>
  (
    { low: "success", medium: "warning", high: "danger", critical: "danger" } as const
  )[l as "low" | "medium" | "high" | "critical"] ?? ("muted" as const);

const statusTone = (s: string) =>
  (
    { open: "warning", mitigated: "success", accepted: "info", closed: "muted" } as const
  )[s as "open" | "mitigated" | "accepted" | "closed"] ?? ("muted" as const);

export default async function RiskDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string; edit?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { id } = await params;
  const sp = await searchParams;
  const risk = isSupabaseAuthEnabled()
    ? await getSupabaseRisk(context.organisation.id, id)
    : await findMockRiskById(id);

  if (!risk || risk.organisationId !== context.organisation.id) {
    notFound();
  }

  const canEdit = context.permissions.canReviewRecords;
  const isEditing = sp.edit === "1" && canEdit;

  return (
    <AppShell
      current="risks"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="Risk Register"
        title={risk.title}
        description={`Score: ${risk.riskScore}/25 · Residual: ${risk.residualScore}/25`}
        actions={
          canEdit && !isEditing ? (
            <Link
              href={`/risks/${id}?edit=1`}
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Edit
            </Link>
          ) : null
        }
      />

      {sp.message === "created" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          Risk created successfully.
        </div>
      )}
      {sp.message === "updated" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          Risk updated.
        </div>
      )}

      {isEditing ? (
        <div className="brand-panel rounded-[2rem] p-8">
          <form action={updateRiskAction} className="grid gap-4 md:grid-cols-2">
            <input type="hidden" name="riskId" value={risk.id} />

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Risk title</span>
              <input
                type="text"
                name="title"
                required
                defaultValue={risk.title}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Severity (1–5)</span>
              <select
                name="severity"
                defaultValue={String(risk.severity)}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              >
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={String(v)}>{v}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Likelihood (1–5)</span>
              <select
                name="likelihood"
                defaultValue={String(risk.likelihood)}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              >
                {[1, 2, 3, 4, 5].map((v) => (
                  <option key={v} value={String(v)}>{v}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Status</span>
              <select
                name="status"
                defaultValue={risk.status}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              >
                <option value="open">Open</option>
                <option value="mitigated">Mitigated</option>
                <option value="accepted">Accepted</option>
                <option value="closed">Closed</option>
              </select>
            </label>

            <input type="hidden" name="ownerUserId" value={risk.ownerUserId} />
            <input type="hidden" name="entityType" value={risk.entityType} />
            <input type="hidden" name="entityId" value={risk.entityId} />

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Description</span>
              <textarea
                name="description"
                rows={3}
                defaultValue={risk.description}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Mitigation</span>
              <textarea
                name="mitigation"
                rows={3}
                defaultValue={risk.mitigation}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <div className="flex gap-3 md:col-span-2">
              <button
                type="submit"
                className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition"
              >
                Save changes
              </button>
              <Link
                href={`/risks/${id}`}
                className="brand-button-secondary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
          <WorkspacePanel>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Severity", value: `${risk.severity} / 5` },
                { label: "Likelihood", value: `${risk.likelihood} / 5` },
                { label: "Risk score", value: `${risk.riskScore} / 25` },
                { label: "Residual score", value: `${risk.residualScore} / 25` },
                { label: "Entity type", value: risk.entityType.replace(/_/g, " ") },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4"
                >
                  <p className="text-sm text-[var(--ai-text-muted)] capitalize">{label}</p>
                  <p className="mt-2 text-sm font-medium capitalize text-white">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm font-semibold text-white">Description</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
                {risk.description}
              </p>
            </div>

            <div className="mt-5 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm font-semibold text-white">Mitigation</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
                {risk.mitigation}
              </p>
            </div>
          </WorkspacePanel>

          <div className="space-y-5">
            <WorkspacePanel>
              <p className="text-sm text-[var(--ai-text-secondary)]">Risk level</p>
              <div className="mt-3">
                <StatusPill
                  label={risk.riskLevel.charAt(0).toUpperCase() + risk.riskLevel.slice(1)}
                  tone={levelTone(risk.riskLevel)}
                />
              </div>
            </WorkspacePanel>
            <WorkspacePanel>
              <p className="text-sm text-[var(--ai-text-secondary)]">Status</p>
              <div className="mt-3">
                <StatusPill
                  label={risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                  tone={statusTone(risk.status)}
                />
              </div>
            </WorkspacePanel>
            <WorkspacePanel>
              <p className="text-sm font-semibold text-white">Quick links</p>
              <div className="mt-3 space-y-2">
                <Link
                  href="/controls"
                  className="block text-sm text-[var(--ai-cyan)] hover:text-white"
                >
                  View controls →
                </Link>
                <Link
                  href="/evidence"
                  className="block text-sm text-[var(--ai-cyan)] hover:text-white"
                >
                  Add evidence →
                </Link>
              </div>
            </WorkspacePanel>
          </div>
        </div>
      )}
    </AppShell>
  );
}
