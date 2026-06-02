import { redirect } from "next/navigation";
import { AppShell } from "@/app/(app)/_components/app-shell";
import { updateToolAction } from "@/app/actions/tools";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { findMockToolById, listMockAuditEvents } from "@/lib/data/mock-registry";
import {
  formatToolReviewDate,
  getToolApprovalMeta,
  getToolCategoryLabel,
  toolApprovalOptions,
  toolCategoryOptions,
} from "@/lib/tools/catalog";
import { getSupabaseToolDetail } from "@/lib/supabase/tools";

function getFeedback(params: { message?: string; error?: string }) {
  if (params.message === "created") {
    return {
      tone: "success" as const,
      text: "Tool record created and added to the organisation register.",
    };
  }

  if (params.message === "updated") {
    return {
      tone: "success" as const,
      text: "Tool record updated and logged to the audit trail.",
    };
  }

  if (params.error === "invalid-form") {
    return {
      tone: "error" as const,
      text: "Please complete the required tool fields before saving.",
    };
  }

  if (params.error === "save-failed") {
    return {
      tone: "error" as const,
      text: "The tool could not be saved. Please try again.",
    };
  }

  return null;
}

export default async function ToolDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ toolId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { toolId } = await params;
  const query = await searchParams;
  const feedback = getFeedback(query);

  const detail = isSupabaseAuthEnabled()
    ? await getSupabaseToolDetail(context.organisation.id, toolId)
    : await (async () => {
        const tool = await findMockToolById(toolId);

        if (!tool || tool.organisationId !== context.organisation.id) {
          return null;
        }

        const auditEvents = (await listMockAuditEvents(context.organisation.id)).filter(
          (event) => event.entityType === "ai_tool" && event.entityId === toolId,
        );

        return { tool, auditEvents };
      })();

  if (!detail) {
    redirect("/tools");
  }

  const approval = getToolApprovalMeta(detail.tool.approvalStatus);

  return (
    <AppShell
      current="tools"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
      eyebrow="AI tool detail"
      title={detail.tool.name}
      description={`${detail.tool.vendor} - ${getToolCategoryLabel(detail.tool.category)}. This record now holds approval state, review timing, and audit history for the organisation.`}
    >
      {feedback ? (
        <div
          className={`rounded-2xl px-4 py-4 text-sm ${
            feedback.tone === "error"
              ? "brand-status-danger"
              : "brand-status-success"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="brand-panel rounded-[2rem] p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${approval.tone}`}
            >
              {approval.label}
            </span>
            <span className="brand-panel-soft rounded-full px-3 py-1 text-xs font-semibold text-ink">
              {getToolCategoryLabel(detail.tool.category)}
            </span>
          </div>

          <dl className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="brand-panel-soft rounded-2xl px-4 py-4">
              <dt className="text-sm text-muted">Vendor</dt>
              <dd className="mt-2 text-lg font-semibold text-ink">
                {detail.tool.vendor}
              </dd>
            </div>
            <div className="brand-panel-soft rounded-2xl px-4 py-4">
              <dt className="text-sm text-muted">Next review</dt>
              <dd className="mt-2 text-lg font-semibold text-ink">
                {formatToolReviewDate(detail.tool.nextReviewAt)}
              </dd>
            </div>
            <div className="brand-panel-soft rounded-2xl px-4 py-4 md:col-span-2">
              <dt className="text-sm text-muted">Website</dt>
              <dd className="mt-2 text-sm text-ink">
                {detail.tool.websiteUrl ? (
                  <a
                    href={detail.tool.websiteUrl}
                    className="brand-link font-medium underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {detail.tool.websiteUrl}
                  </a>
                ) : (
                  "Not recorded"
                )}
              </dd>
            </div>
            <div className="brand-panel-soft rounded-2xl px-4 py-4 md:col-span-2">
              <dt className="text-sm text-muted">Privacy policy</dt>
              <dd className="mt-2 text-sm text-ink">
                {detail.tool.privacyPolicyUrl ? (
                  <a
                    href={detail.tool.privacyPolicyUrl}
                    className="brand-link font-medium underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {detail.tool.privacyPolicyUrl}
                  </a>
                ) : (
                  "Not recorded"
                )}
              </dd>
            </div>
            <div className="brand-panel-soft rounded-2xl px-4 py-4 md:col-span-2">
              <dt className="text-sm text-muted">Data-processing notes</dt>
              <dd className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink">
                {detail.tool.dataProcessingNotes || "No data notes recorded yet."}
              </dd>
            </div>
            <div className="brand-panel-soft rounded-2xl px-4 py-4 md:col-span-2">
              <dt className="text-sm text-muted">Internal notes</dt>
              <dd className="mt-2 whitespace-pre-wrap text-sm leading-7 text-ink">
                {detail.tool.notes || "No internal notes recorded yet."}
              </dd>
            </div>
          </dl>
        </article>

        <article className="brand-panel-highlight rounded-[2rem] p-8 text-white">
          <p className="brand-eyebrow">Audit trail</p>
          <h2 className="text-2xl font-semibold">Audit trail</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
            Tool-level actions are recorded here so the later evidence pack has a
            clear history of changes.
          </p>
          <div className="mt-6 grid gap-4">
            {detail.auditEvents.length > 0 ? (
              detail.auditEvents.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4"
                >
                  <p className="font-semibold">{event.action}</p>
                  <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
                    {new Intl.DateTimeFormat("en-GB", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(event.createdAt))}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-white/12 bg-white/5 px-4 py-4 text-sm text-[var(--ai-text-secondary)]">
                No tool-level audit events recorded yet.
              </div>
            )}
          </div>
        </article>
      </section>

      {context.permissions.canManageOrganisation ? (
        <section className="brand-panel mt-8 rounded-[2rem] p-8">
          <p className="brand-eyebrow">Update record</p>
          <h2 className="text-2xl font-semibold">Edit tool record</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Update approval status, review timing, or the core notes captured for
            this tool.
          </p>

          <form action={updateToolAction} className="mt-8 grid gap-4 md:grid-cols-2">
            <input type="hidden" name="toolId" value={detail.tool.id} />

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Tool name</span>
              <input
                type="text"
                name="name"
                required
                defaultValue={detail.tool.name}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Vendor</span>
              <input
                type="text"
                name="vendor"
                required
                defaultValue={detail.tool.vendor}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Website URL</span>
              <input
                type="url"
                name="websiteUrl"
                defaultValue={detail.tool.websiteUrl ?? ""}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Category</span>
              <select
                name="category"
                defaultValue={detail.tool.category}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              >
                {toolCategoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Approval status</span>
              <select
                name="approvalStatus"
                defaultValue={detail.tool.approvalStatus}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              >
                {toolApprovalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Next review date</span>
              <input
                type="date"
                name="nextReviewAt"
                required
                defaultValue={detail.tool.nextReviewAt ?? ""}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-ink">Privacy policy URL</span>
              <input
                type="url"
                name="privacyPolicyUrl"
                defaultValue={detail.tool.privacyPolicyUrl ?? ""}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Data-processing notes</span>
              <textarea
                name="dataProcessingNotes"
                rows={4}
                defaultValue={detail.tool.dataProcessingNotes}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-ink">Internal notes</span>
              <textarea
                name="notes"
                rows={4}
                defaultValue={detail.tool.notes}
                className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
              />
            </label>

            <button
              type="submit"
              className="brand-button-primary inline-flex items-center justify-center rounded-full px-5 py-3 font-medium transition md:col-span-2"
            >
              Save changes
            </button>
          </form>
        </section>
      ) : null}
    </AppShell>
  );
}
