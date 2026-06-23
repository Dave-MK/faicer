import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import {
  getMockDashboardStats,
  listMockRisksForOrganisation,
  listMockControlsForOrganisation,
  listMockAssessmentsForOrganisation,
  listMockPoliciesForOrganisation,
  listMockCoursesForOrganisation,
} from "@/lib/data/mock-registry";
import { listSupabaseRisks } from "@/lib/supabase/risks";
import { listSupabaseControls } from "@/lib/supabase/controls";
import { listSupabaseAssessments } from "@/lib/supabase/assessments";
import { listSupabasePolicies } from "@/lib/supabase/policies";
import { listSupabaseCourses } from "@/lib/supabase/training";

export default async function ReportsPage() {
  const context = await requireWorkspaceContext(["owner", "admin", "reviewer"]);
  const orgId = context.organisation.id;

  const [stats, risks, controls, assessments, policies, courses] = await Promise.all([
    getMockDashboardStats(orgId),
    isSupabaseAuthEnabled()
      ? listSupabaseRisks(orgId)
      : listMockRisksForOrganisation(orgId),
    isSupabaseAuthEnabled()
      ? listSupabaseControls(orgId)
      : listMockControlsForOrganisation(orgId),
    isSupabaseAuthEnabled()
      ? listSupabaseAssessments(orgId)
      : listMockAssessmentsForOrganisation(orgId),
    isSupabaseAuthEnabled()
      ? listSupabasePolicies(orgId)
      : listMockPoliciesForOrganisation(orgId),
    isSupabaseAuthEnabled()
      ? listSupabaseCourses(orgId)
      : listMockCoursesForOrganisation(orgId),
  ]);

  const openRisks = risks.filter((r) => r.status === "open");
  const highRisks = risks.filter((r) => ["high", "critical"].includes(r.riskLevel));
  const activeControls = controls.filter((c) => c.status === "active");
  const passedAssessments = assessments.filter((a) => a.outcome === "pass");
  const activePolicies = policies.filter((p) => p.status === "active");

  let healthScore = 40;
  if (stats.tools.total > 0) healthScore += 8;
  if (stats.useCases.total > 0) healthScore += 8;
  if (stats.policies.active > 0) healthScore += 8;
  if (stats.risks.total > 0) healthScore += 8;
  if (stats.controls.total > 0) healthScore += 8;
  if (stats.assessments.total > 0) healthScore += 8;
  if (stats.evidence.total > 0) healthScore += 6;
  if (courses.length > 0) healthScore += 6;
  healthScore = Math.min(healthScore, 100);

  const healthColour =
    healthScore >= 80 ? "text-[var(--ai-success)]" : healthScore >= 60 ? "text-[var(--ai-warning)]" : "text-[var(--ai-danger)]";

  return (
    <AppShell
      current="reports"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Governance Report"
        description={`A summary of ${context.organisation.name}'s AI governance health.`}
      />

      <div className="mb-5 brand-panel rounded-[2rem] p-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-[var(--ai-text-secondary)]">Overall governance health score</p>
            <p className={`mt-2 text-5xl font-semibold tracking-[-0.04em] ${healthColour}`}>{healthScore}<span className="text-2xl text-[var(--ai-text-muted)]">/100</span></p>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-3 rounded-full bg-[rgba(18,31,53,0.95)]">
              <div
                className="h-3 rounded-full bg-[linear-gradient(90deg,#FF4DB8_0%,#B24DFF_100%)] transition-all"
                style={{ width: `${healthScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <WorkspacePanel>
          <p className="text-sm font-semibold text-white">Module coverage</p>
          <div className="mt-4 space-y-3">
            {[
              { label: "AI Register", value: `${stats.tools.total} tools registered` },
              { label: "Use Cases", value: `${stats.useCases.total} use cases` },
              { label: "Policies", value: `${activePolicies.length} active policies` },
              { label: "Risks", value: `${openRisks.length} open · ${highRisks.length} high/critical` },
              { label: "Controls", value: `${activeControls.length} active controls` },
              { label: "Assessments", value: `${passedAssessments.length} passed of ${assessments.length}` },
              { label: "Evidence", value: `${stats.evidence.total} items` },
              { label: "Incidents", value: `${stats.incidents.total} total` },
              { label: "Training", value: `${courses.length} courses available` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-2xl border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3">
                <span className="text-sm text-[var(--ai-text-secondary)]">{label}</span>
                <span className="text-sm font-medium text-white">{value}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <div className="space-y-5">
          <WorkspacePanel>
            <p className="text-sm font-semibold text-white">Risk posture</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Critical", value: risks.filter((r) => r.riskLevel === "critical").length, cls: "text-[var(--ai-danger)]" },
                { label: "High", value: risks.filter((r) => r.riskLevel === "high").length, cls: "text-[var(--ai-danger)]" },
                { label: "Medium", value: risks.filter((r) => r.riskLevel === "medium").length, cls: "text-[var(--ai-warning)]" },
                { label: "Low", value: risks.filter((r) => r.riskLevel === "low").length, cls: "text-[var(--ai-success)]" },
              ].map(({ label, value, cls }) => (
                <div key={label} className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                  <p className="text-xs text-[var(--ai-text-muted)]">{label}</p>
                  <p className={`mt-2 text-3xl font-semibold ${cls}`}>{value}</p>
                </div>
              ))}
            </div>
          </WorkspacePanel>
          <WorkspacePanel>
            <p className="text-sm font-semibold text-white">Next steps</p>
            <div className="mt-3 space-y-2 text-sm">
              {openRisks.length > 0 && (
                <Link href="/risks" className="block text-[var(--ai-cyan)] hover:text-white">
                  → Review {openRisks.length} open risk{openRisks.length !== 1 ? "s" : ""}
                </Link>
              )}
              {activeControls.length === 0 && (
                <Link href="/controls/new" className="block text-[var(--ai-cyan)] hover:text-white">
                  → Add your first control
                </Link>
              )}
              {activePolicies.length === 0 && (
                <Link href="/policies/new" className="block text-[var(--ai-cyan)] hover:text-white">
                  → Publish your first policy
                </Link>
              )}
              <Link href="/governance" className="block text-[var(--ai-cyan)] hover:text-white">
                → View full governance summary
              </Link>
            </div>
          </WorkspacePanel>
        </div>
      </div>
    </AppShell>
  );
}
