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
  listMockControlsForOrganisation,
  listMockAssessmentsForOrganisation,
  listMockRisksForOrganisation,
  listMockPoliciesForOrganisation,
} from "@/lib/data/mock-registry";
import { listSupabaseControls } from "@/lib/supabase/controls";
import { listSupabaseAssessments } from "@/lib/supabase/assessments";
import { listSupabaseRisks } from "@/lib/supabase/risks";
import { listSupabasePolicies } from "@/lib/supabase/policies";

export default async function GovernancePage() {
  const context = await requireWorkspaceContext();
  const [controls, assessments, risks, policies] = await Promise.all([
    isSupabaseAuthEnabled()
      ? listSupabaseControls(context.organisation.id)
      : listMockControlsForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseAssessments(context.organisation.id)
      : listMockAssessmentsForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabaseRisks(context.organisation.id)
      : listMockRisksForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabasePolicies(context.organisation.id)
      : listMockPoliciesForOrganisation(context.organisation.id),
  ]);

  const activeControls = controls.filter((c) => c.status === "active");
  const passedAssessments = assessments.filter((a) => a.outcome === "pass");
  const openRisks = risks.filter((r) => r.status === "open");
  const highRisks = risks.filter((r) => ["high", "critical"].includes(r.riskLevel));
  const activePolicies = policies.filter((p) => p.status === "active");

  const now = new Date().toISOString();
  const overdueAssessments = assessments.filter(
    (a) => a.nextAssessmentAt && a.nextAssessmentAt < now,
  );

  const controlEffectiveness =
    assessments.length > 0 ? Math.round((passedAssessments.length / assessments.length) * 100) : 0;

  return (
    <AppShell
      current="governance"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Governance"
        description="A real-time view of your AI governance posture: controls, assessments, and risk exposure."
      />

      <div className="mb-5 grid gap-4 xl:grid-cols-4">
        {[
          { label: "Active controls", value: activeControls.length, href: "/controls" },
          { label: "Passed assessments", value: passedAssessments.length, href: "/assessments" },
          { label: "Open risks", value: openRisks.length, href: "/risks" },
          { label: "Active policies", value: activePolicies.length, href: "/policies" },
        ].map((card) => (
          <Link key={card.label} href={card.href}
            className="block rounded-[22px] border border-[var(--ai-border)] bg-[rgba(8,18,34,0.85)] px-4 py-4 hover:border-[var(--ai-cyan)] transition-colors">
            <p className="text-sm text-[var(--ai-text-secondary)]">{card.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <WorkspacePanel>
            <p className="text-sm font-semibold text-white">Control effectiveness</p>
            <div className="mt-3 flex items-center gap-4">
              <div className="flex-1">
                <div className="h-3 rounded-full bg-[rgba(18,31,53,0.95)]">
                  <div
                    className="h-3 rounded-full bg-[linear-gradient(90deg,#00d4ff_0%,#1c65ff_100%)] transition-all"
                    style={{ width: `${controlEffectiveness}%` }}
                  />
                </div>
              </div>
              <span className="text-xl font-semibold text-white">{controlEffectiveness}%</span>
            </div>
            <p className="mt-2 text-xs text-[var(--ai-text-muted)]">
              {passedAssessments.length} of {assessments.length} assessments passed
            </p>
          </WorkspacePanel>

          <WorkspacePanel>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">High &amp; critical risks</p>
              <Link href="/risks" className="text-sm text-[var(--ai-cyan)] hover:text-white">View all →</Link>
            </div>
            <div className="mt-4 space-y-2">
              {highRisks.slice(0, 5).map((r) => (
                <Link key={r.id} href={`/risks/${r.id}`}
                  className="flex items-center justify-between rounded-2xl border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 hover:border-[var(--ai-cyan)] transition-colors">
                  <span className="text-sm text-white">{r.title}</span>
                  <StatusPill
                    label={r.riskLevel.charAt(0).toUpperCase() + r.riskLevel.slice(1)}
                    tone={r.riskLevel === "critical" || r.riskLevel === "high" ? "danger" : "warning"}
                  />
                </Link>
              ))}
              {highRisks.length === 0 && (
                <p className="py-4 text-sm text-[var(--ai-text-secondary)]">No high or critical risks. Good governance.</p>
              )}
            </div>
          </WorkspacePanel>
        </div>

        <div className="space-y-5">
          {overdueAssessments.length > 0 && (
            <WorkspacePanel>
              <p className="text-sm text-[var(--ai-danger)]">Overdue assessments</p>
              <div className="mt-3 space-y-2">
                {overdueAssessments.slice(0, 3).map((a) => (
                  <Link key={a.id} href={`/assessments/${a.id}`}
                    className="block rounded-2xl border border-[rgba(255,80,80,0.3)] bg-[rgba(255,80,80,0.05)] px-3 py-3 text-sm text-white hover:text-[var(--ai-cyan)]">
                    {a.entityType.replace(/_/g, " ")} · overdue {new Date(a.nextAssessmentAt!).toLocaleDateString("en-GB")}
                  </Link>
                ))}
              </div>
            </WorkspacePanel>
          )}
          <WorkspacePanel>
            <p className="text-sm font-semibold text-white">Quick navigation</p>
            <div className="mt-3 space-y-2">
              {[
                { label: "Add a control", href: "/controls/new" },
                { label: "New assessment", href: "/assessments/new" },
                { label: "Log a risk", href: "/risks/new" },
                { label: "Add evidence", href: "/evidence/new" },
                { label: "View reports", href: "/reports" },
              ].map(({ label, href }) => (
                <Link key={href} href={href} className="block text-sm text-[var(--ai-cyan)] hover:text-white">
                  {label} →
                </Link>
              ))}
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </AppShell>
  );
}
