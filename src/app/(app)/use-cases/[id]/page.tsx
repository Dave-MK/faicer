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
  findMockUseCaseById,
  listMockToolsForOrganisation,
} from "@/lib/data/mock-registry";
import { getSupabaseUseCase } from "@/lib/supabase/use-cases";
import { listSupabaseTools } from "@/lib/supabase/tools";

const statusTone = (s: string) =>
  (
    {
      approved: "success",
      restricted: "warning",
      prohibited: "danger",
      draft: "muted",
      archived: "muted",
    } as const
  )[s] ?? ("muted" as const);

const riskTone = (l: string) =>
  (
    { low: "success", medium: "warning", high: "danger", critical: "danger" } as const
  )[l as "low" | "medium" | "high" | "critical"] ?? ("muted" as const);

function fmt(d: string | null) {
  if (!d) return "Not set";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(d));
}

export default async function UseCaseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { id } = await params;
  const sp = await searchParams;

  const [useCase, tools] = await Promise.all([
    isSupabaseAuthEnabled()
      ? getSupabaseUseCase(context.organisation.id, id)
      : findMockUseCaseById(id),
    isSupabaseAuthEnabled()
      ? listSupabaseTools(context.organisation.id)
      : listMockToolsForOrganisation(context.organisation.id),
  ]);

  if (!useCase || useCase.organisationId !== context.organisation.id) {
    notFound();
  }

  const toolName = tools.find((t) => t.id === useCase.toolId)?.name ?? useCase.toolId;
  const canEdit = context.permissions.canManageOrganisation;

  return (
    <AppShell
      current="use-cases"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="AI Use Cases"
        title={useCase.title}
        description={useCase.description}
        actions={
          canEdit ? (
            <Link
              href={`/use-cases/${id}/edit`}
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              Edit
            </Link>
          ) : null
        }
      />

      {sp.message === "created" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          Use case created successfully.
        </div>
      )}
      {sp.message === "updated" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          Use case updated.
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <WorkspacePanel>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { label: "Tool", value: toolName },
              { label: "Business unit", value: useCase.businessUnit },
              { label: "Last reviewed", value: fmt(useCase.lastReviewedAt) },
              { label: "Next review", value: fmt(useCase.nextReviewAt) },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4"
              >
                <p className="text-sm text-[var(--ai-text-muted)]">{label}</p>
                <p className="mt-2 text-sm font-medium text-white">{value}</p>
              </div>
            ))}
          </div>

          {useCase.dataInvolved && (
            <div className="mt-5 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm font-semibold text-white">Data involved</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
                {useCase.dataInvolved}
              </p>
            </div>
          )}

          {useCase.mitigations && (
            <div className="mt-5 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm font-semibold text-white">Mitigations</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
                {useCase.mitigations}
              </p>
            </div>
          )}
        </WorkspacePanel>

        <div className="space-y-5">
          <WorkspacePanel>
            <p className="text-sm text-[var(--ai-text-secondary)]">Status</p>
            <div className="mt-3">
              <StatusPill
                label={useCase.status.charAt(0).toUpperCase() + useCase.status.slice(1)}
                tone={statusTone(useCase.status)}
              />
            </div>
          </WorkspacePanel>

          <WorkspacePanel>
            <p className="text-sm text-[var(--ai-text-secondary)]">Risk level</p>
            <div className="mt-3">
              <StatusPill
                label={useCase.riskLevel.charAt(0).toUpperCase() + useCase.riskLevel.slice(1)}
                tone={riskTone(useCase.riskLevel)}
              />
            </div>
          </WorkspacePanel>

          <WorkspacePanel>
            <p className="text-sm font-semibold text-white">Quick links</p>
            <div className="mt-3 space-y-2">
              <Link
                href={`/tools/${useCase.toolId}`}
                className="block text-sm text-[var(--ai-cyan)] transition hover:text-white"
              >
                View tool record →
              </Link>
              <Link
                href="/risks"
                className="block text-sm text-[var(--ai-cyan)] transition hover:text-white"
              >
                View linked risks →
              </Link>
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </AppShell>
  );
}
