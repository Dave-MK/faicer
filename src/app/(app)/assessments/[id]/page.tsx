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
import { findMockAssessmentById } from "@/lib/data/mock-registry";
import { getSupabaseAssessment } from "@/lib/supabase/assessments";

const outcomeTone = (o: string) =>
  ({ pass: "success", fail: "danger", conditional: "warning" } as const)[
    o as "pass" | "fail" | "conditional"
  ] ?? ("muted" as const);

export default async function AssessmentDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { id } = await params;
  const sp = await searchParams;
  const assessment = isSupabaseAuthEnabled()
    ? await getSupabaseAssessment(context.organisation.id, id)
    : await findMockAssessmentById(id);

  if (!assessment || assessment.organisationId !== context.organisation.id) notFound();

  return (
    <AppShell
      current="assessments"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="Assessments"
        title={`${assessment.entityType.replace(/_/g, " ")} assessment`.replace(/\b\w/g, (c) => c.toUpperCase())}
        description={`Assessed on ${new Date(assessment.assessmentDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}`}
        actions={
          context.permissions.canReviewRecords ? (
            <Link href="/assessments/new"
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
              New assessment
            </Link>
          ) : null
        }
      />

      {sp.message === "created" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">Assessment recorded successfully.</div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <WorkspacePanel>
          <p className="text-sm font-semibold text-white">Findings</p>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">{assessment.findings}</p>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              { label: "Entity type", value: assessment.entityType.replace(/_/g, " ") },
              { label: "Assessment date", value: new Date(assessment.assessmentDate).toLocaleDateString("en-GB") },
              ...(assessment.nextAssessmentAt
                ? [{ label: "Next assessment", value: new Date(assessment.nextAssessmentAt).toLocaleDateString("en-GB") }]
                : []),
            ].map(({ label, value }) => (
              <div key={label} className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <p className="text-xs uppercase tracking-wider text-[var(--ai-text-muted)]">{label}</p>
                <p className="mt-2 text-sm font-medium capitalize text-white">{value}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <div className="space-y-5">
          <WorkspacePanel>
            <p className="text-sm text-[var(--ai-text-secondary)]">Outcome</p>
            <div className="mt-3">
              <StatusPill
                label={assessment.outcome.charAt(0).toUpperCase() + assessment.outcome.slice(1)}
                tone={outcomeTone(assessment.outcome)}
              />
            </div>
          </WorkspacePanel>
          <WorkspacePanel>
            <p className="text-sm font-semibold text-white">Actions</p>
            <div className="mt-3 space-y-2">
              <Link href="/evidence/new" className="block text-sm text-[var(--ai-cyan)] hover:text-white">
                Attach evidence →
              </Link>
              <Link href="/controls" className="block text-sm text-[var(--ai-cyan)] hover:text-white">
                View controls →
              </Link>
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </AppShell>
  );
}
