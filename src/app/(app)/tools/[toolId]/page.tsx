import { redirect } from "next/navigation";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  RingScore,
  StatusPill,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { updateToolAction } from "@/app/actions/tools";
import { AppIcon } from "@/components/AppIcons";
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
  const riskScore =
    detail.tool.approvalStatus === "approved"
      ? 34
      : detail.tool.approvalStatus === "restricted"
        ? 62
        : 86;
  const riskLabel =
    detail.tool.approvalStatus === "approved"
      ? "Low"
      : detail.tool.approvalStatus === "restricted"
        ? "Moderate"
        : "High";

  return (
    <AppShell
      current="register"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      {feedback ? (
        <div
          className={`mb-5 rounded-2xl px-4 py-4 text-sm ${
            feedback.tone === "error"
              ? "brand-status-danger"
              : "brand-status-success"
          }`}
        >
          {feedback.text}
        </div>
      ) : null}

      <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
              {detail.tool.name}
            </h1>
            <StatusPill
              label={approval.label}
              tone={
                detail.tool.approvalStatus === "approved"
                  ? "success"
                  : detail.tool.approvalStatus === "restricted"
                    ? "warning"
                    : "danger"
              }
            />
          </div>
          <p className="mt-2 text-lg text-[var(--ai-text-secondary)]">
            {detail.tool.vendor} · {getToolCategoryLabel(detail.tool.category)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {context.permissions.canManageOrganisation ? (
            <a
              href="#edit-record"
              className="brand-button-secondary inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Edit
            </a>
          ) : null}
          <button
            type="button"
            className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            Actions
            <AppIcon name="chevron" className="h-4 w-4" />
          </button>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap gap-6 border-b border-[var(--ai-border)] pb-4 text-sm">
        {[
          "Overview",
          "Use cases (6)",
          "Assessments (2)",
          "Controls",
          "Evidence",
          "Activity",
        ].map((item, index) => (
          <span
            key={item}
            className={
              index === 0
                ? "border-b-2 border-[var(--ai-blue)] pb-4 font-medium text-[var(--ai-blue)]"
                : "pb-4 text-[var(--ai-text-secondary)]"
            }
          >
            {item}
          </span>
        ))}
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.95fr_0.95fr]">
        <WorkspacePanel className="xl:col-span-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Tool summary</h2>
            <span className="text-xs uppercase tracking-[0.18em] text-[var(--ai-text-muted)]">
              {formatToolReviewDate(detail.tool.lastReviewedAt)}
            </span>
          </div>
          <dl className="grid gap-4 text-sm">
            {[
              ["Provider", detail.tool.vendor],
              ["Category", getToolCategoryLabel(detail.tool.category)],
              ["Status", approval.label],
              ["Next review", formatToolReviewDate(detail.tool.nextReviewAt)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[110px_minmax(0,1fr)] gap-4 rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4"
              >
                <dt className="text-[var(--ai-text-muted)]">{label}</dt>
                <dd className="font-medium text-white">{value}</dd>
              </div>
            ))}
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
              <dt className="text-[var(--ai-text-muted)]">Website</dt>
              <dd className="mt-2">
                {detail.tool.websiteUrl ? (
                  <a
                    href={detail.tool.websiteUrl}
                    className="text-[var(--ai-cyan)] transition hover:text-white"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {detail.tool.websiteUrl}
                  </a>
                ) : (
                  <span className="text-white">Not recorded</span>
                )}
              </dd>
            </div>
          </dl>
        </WorkspacePanel>

        <WorkspacePanel>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Risk overview</h2>
              <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
                Top risk indicators based on approval status and review hygiene.
              </p>
            </div>
            <div className="shrink-0">
              <RingScore score={String(riskScore)} label="/100" size="medium" />
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              ["Data privacy", detail.tool.privacyPolicyUrl ? "Medium" : "High"],
              [
                "Prompt leakage",
                detail.tool.dataProcessingNotes ? "Medium" : "High",
              ],
              ["Access review", detail.tool.nextReviewAt ? riskLabel : "High"],
              ["Accuracy", detail.tool.approvalStatus === "approved" ? "Low" : "Medium"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-[var(--ai-text-secondary)]">{label}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <h2 className="text-lg font-semibold text-white">Review & ownership</h2>
          <div className="mt-5 space-y-4 text-sm">
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
              <p className="text-[var(--ai-text-muted)]">Owner</p>
              <p className="mt-2 font-medium text-white">{context.user.displayName}</p>
            </div>
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
              <p className="text-[var(--ai-text-muted)]">Review cadence</p>
              <p className="mt-2 font-medium text-white">
                Next review: {formatToolReviewDate(detail.tool.nextReviewAt)}
              </p>
            </div>
            <div className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
              <p className="text-[var(--ai-text-muted)]">Policy source</p>
              <p className="mt-2 font-medium text-white">
                {detail.tool.privacyPolicyUrl ? "Privacy policy recorded" : "Awaiting link"}
              </p>
            </div>
          </div>
        </WorkspacePanel>

        <WorkspacePanel className="xl:col-span-2">
          <h2 className="text-lg font-semibold text-white">Description</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--ai-text-secondary)]">
            {detail.tool.notes ||
              "No internal description has been recorded for this tool yet."}
          </p>
          <div className="mt-6 rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
            <p className="text-sm text-[var(--ai-text-muted)]">Data processing notes</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white">
              {detail.tool.dataProcessingNotes || "No data handling notes recorded yet."}
            </p>
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <h2 className="text-lg font-semibold text-white">Key controls</h2>
          <div className="mt-5 space-y-3">
            {[
              "Human review before publication",
              "No passwords or secrets in prompts",
              "Quarterly review and approval check",
              "Only approved business use cases",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(19,231,132,0.16)] text-[var(--ai-success)]">
                  <AppIcon name="check" className="h-3 w-3" />
                </span>
                <p className="text-sm text-white">{item}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>

      <WorkspacePanel className="mt-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Activity</h2>
          <span className="text-sm text-[var(--ai-text-secondary)]">Recent audit entries</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {detail.auditEvents.length > 0 ? (
            detail.auditEvents.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4"
              >
                <p className="font-medium text-white">{event.action}</p>
                <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
                  {new Intl.DateTimeFormat("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(event.createdAt))}
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm text-[var(--ai-text-secondary)]">
              No tool-level audit events recorded yet.
            </div>
          )}
        </div>
      </WorkspacePanel>

      {context.permissions.canManageOrganisation ? (
        <section id="edit-record" className="brand-panel mt-5 rounded-[2rem] p-8">
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
              className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2"
            >
              Save changes
            </button>
          </form>
        </section>
      ) : null}
    </AppShell>
  );
}
