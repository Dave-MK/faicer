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
import {
  findMockPolicyById,
  listMockAcknowledgementsForPolicy,
  findMockAcknowledgement,
} from "@/lib/data/mock-registry";
import {
  getSupabasePolicy,
  getSupabasePolicyAcknowledgement,
} from "@/lib/supabase/policies";
import { acknowledgePolicyAction } from "@/app/actions/policies";

const statusTone = (s: string) =>
  (
    {
      active: "success",
      under_review: "info",
      draft: "muted",
      archived: "muted",
    } as const
  )[s] ?? ("muted" as const);

function fmt(d: string | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

function renderMarkdown(body: string) {
  return body
    .split("\n")
    .map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="mt-6 text-xl font-semibold text-white">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="mt-4 text-base font-semibold text-white">
            {line.slice(4)}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <li key={i} className="ml-4 text-sm text-[var(--ai-text-secondary)]">
            {line.slice(2)}
          </li>
        );
      }
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }
      return (
        <p key={i} className="text-sm leading-7 text-[var(--ai-text-secondary)]">
          {line.replace(/\*\*(.+?)\*\*/g, "$1")}
        </p>
      );
    });
}

export default async function PolicyDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { id } = await params;
  const sp = await searchParams;

  const [policy, acks, userAck] = await Promise.all([
    isSupabaseAuthEnabled()
      ? getSupabasePolicy(context.organisation.id, id)
      : findMockPolicyById(id),
    listMockAcknowledgementsForPolicy(id),
    isSupabaseAuthEnabled()
      ? getSupabasePolicyAcknowledgement(context.user.id, id)
      : findMockAcknowledgement(context.user.id, id),
  ]);

  if (!policy || policy.organisationId !== context.organisation.id) {
    notFound();
  }

  const canEdit = context.permissions.canManageOrganisation;
  const canAcknowledge = policy.status === "active" && !userAck;

  return (
    <AppShell
      current="policies"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="Policies"
        title={policy.title}
        description={`Version ${policy.version} · Effective ${fmt(policy.effectiveDate)}`}
        actions={
          canEdit ? (
            <Link
              href={`/policies/${id}/edit`}
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Edit
            </Link>
          ) : null
        }
      />

      {sp.message === "created" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          Policy created successfully.
        </div>
      )}
      {sp.message === "updated" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          Policy updated.
        </div>
      )}
      {sp.message === "acknowledged" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          Policy acknowledged. Thank you.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <WorkspacePanel>
          <div className="prose prose-sm max-w-none space-y-1">{renderMarkdown(policy.body)}</div>
        </WorkspacePanel>

        <div className="space-y-5">
          <WorkspacePanel>
            <p className="text-sm text-[var(--ai-text-secondary)]">Status</p>
            <div className="mt-3">
              <StatusPill
                label={policy.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                tone={statusTone(policy.status)}
              />
            </div>
          </WorkspacePanel>

          {canAcknowledge && (
            <WorkspacePanel>
              <p className="text-sm font-semibold text-white">Acknowledge this policy</p>
              <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
                Confirm you have read and understood this policy.
              </p>
              <form action={acknowledgePolicyAction} className="mt-4">
                <input type="hidden" name="policyId" value={id} />
                <button
                  type="submit"
                  className="brand-button-primary inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold"
                >
                  Acknowledge this policy
                </button>
              </form>
            </WorkspacePanel>
          )}

          {userAck && (
            <WorkspacePanel>
              <StatusPill label="Acknowledged" tone="success" />
              <p className="mt-2 text-xs text-[var(--ai-text-muted)]">
                {fmt(userAck.acknowledgedAt)}
              </p>
            </WorkspacePanel>
          )}

          {canEdit && (
            <WorkspacePanel>
              <p className="text-sm font-semibold text-white">
                Acknowledgements ({acks.length})
              </p>
              <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
                {acks.length} team member{acks.length !== 1 ? "s have" : " has"} acknowledged
                this policy.
              </p>
            </WorkspacePanel>
          )}
        </div>
      </div>
    </AppShell>
  );
}
