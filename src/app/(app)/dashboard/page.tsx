import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  FilterChip,
  RingScore,
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { AppIcon } from "@/components/AppIcons";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import {
  listMockEvidenceForOrganisation,
  listMockAuditEvents,
  getMockDashboardStats,
  listMockCompletionsForUser,
  listMockCoursesForOrganisation,
} from "@/lib/data/mock-registry";

function toneClass(tone: string) {
  return (
    {
      info: "bg-[var(--ai-cyan)]",
      cyan: "bg-[var(--ai-cyan)]",
      blue: "bg-[var(--ai-blue)]",
      violet: "bg-[var(--ai-violet)]",
      warning: "bg-[var(--ai-warning)]",
      danger: "bg-[var(--ai-danger)]",
    }[tone] ?? "bg-[var(--ai-blue)]"
  );
}

function riskTone(level: string) {
  return (
    {
      critical: "brand-status-danger",
      high: "brand-status-danger",
      medium: "brand-status-warning",
      low: "brand-status-success",
    }[level] ?? "brand-status-muted"
  );
}

function computeHealthScore(stats: Awaited<ReturnType<typeof getMockDashboardStats>>) {
  let score = 40;
  if (stats.tools.approved > 0) score += 15;
  if (stats.policies.active > 0) score += 15;
  if (stats.risks.total > 0) score += 10;
  if (stats.evidence.total > 0) score += 10;
  if (stats.controls.total > 0) score += 5;
  if (stats.assessments.total > 0) score += 5;
  return Math.min(score, 100);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function StaffDashboard({
  organisationName,
  userDisplayName,
  role,
  approvedToolCount,
  trainingComplete,
  trainingTotal,
  pendingPolicies,
  recentActivity,
}: {
  organisationName: string;
  userDisplayName: string;
  role: "staff";
  approvedToolCount: number;
  trainingComplete: number;
  trainingTotal: number;
  pendingPolicies: number;
  recentActivity: Array<{ label: string; value: string; date: string }>;
}) {
  const trainingPct =
    trainingTotal > 0 ? `${Math.round((trainingComplete / trainingTotal) * 100)}%` : "0%";

  return (
    <AppShell
      current="overview"
      organisationName={organisationName}
      userDisplayName={userDisplayName}
      role="staff"
    >
      <WorkspaceHeader
        title={`Welcome back, ${userDisplayName.split(" ")[0]}`}
        description="Here's what you need today."
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <WorkspacePanel>
          <div className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm text-[var(--ai-text-secondary)]">My Policy Status</p>
              {pendingPolicies === 0 ? (
                <>
                  <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(19,231,132,0.14)] text-[var(--ai-success)]">
                    <AppIcon name="check" className="h-8 w-8" />
                  </div>
                  <p className="mt-4 text-sm text-white">You&apos;re all set</p>
                </>
              ) : (
                <>
                  <p className="mt-6 text-5xl font-semibold tracking-[-0.04em] text-[var(--ai-warning)]">
                    {pendingPolicies}
                  </p>
                  <p className="mt-3 text-sm text-[var(--ai-text-secondary)]">
                    {pendingPolicies === 1 ? "policy" : "policies"} to acknowledge
                  </p>
                </>
              )}
            </article>
            <article className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm text-[var(--ai-text-secondary)]">Training Progress</p>
              <div className="mt-5">
                <RingScore score={trainingPct} label="Complete" size="medium" />
              </div>
            </article>
            <article className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm text-[var(--ai-text-secondary)]">Approved Tools</p>
              <p className="mt-6 text-5xl font-semibold tracking-[-0.04em] text-white">
                {approvedToolCount}
              </p>
              <p className="mt-3 text-sm text-[var(--ai-text-secondary)]">tools approved</p>
            </article>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              {recentActivity.length > 0 ? (
                <div className="mt-5 space-y-4 text-sm">
                  {recentActivity.map((item) => (
                    <div key={item.label + item.date} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-white">{item.label}</p>
                        <p className="mt-1 text-[var(--ai-text-secondary)]">{item.value}</p>
                      </div>
                      <span className="text-[var(--ai-text-muted)]">{item.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 text-sm text-[var(--ai-text-secondary)]">No recent activity yet.</p>
              )}
            </article>
            <article className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <h2 className="text-lg font-semibold text-white">Need help?</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
                Visit the Help Center for guides, FAQs, and how-to articles.
              </p>
              <Link
                href="/help"
                className="brand-button-secondary mt-6 inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold"
              >
                Go to Help Center
              </Link>
            </article>
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <h2 className="text-2xl font-semibold text-white">Built for responsible AI use</h2>
          <div className="mt-5 space-y-4">
            {[
              "Clear guidance. Trusted tools. Safer outcomes.",
              "Simple steps and clear actions.",
              "Only reviewed tools you can trust.",
              "Build skills and stay confident.",
              "Your data and privacy come first.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm text-white"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3">
            <Link
              href="/my-policies"
              className="block rounded-2xl border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white transition hover:text-[var(--ai-cyan)]"
            >
              My Policies →
            </Link>
            <Link
              href="/training"
              className="block rounded-2xl border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white transition hover:text-[var(--ai-cyan)]"
            >
              My Training →
            </Link>
            <Link
              href="/approved-tools"
              className="block rounded-2xl border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-white transition hover:text-[var(--ai-cyan)]"
            >
              Approved Tools →
            </Link>
          </div>
        </WorkspacePanel>
      </div>
    </AppShell>
  );
}

export default async function DashboardPage() {
  const context = await requireWorkspaceContext();
  const orgId = context.organisation.id;

  const [stats, evidence, auditEvents, courses, completions] = await Promise.all([
    getMockDashboardStats(orgId),
    listMockEvidenceForOrganisation(orgId),
    listMockAuditEvents(orgId),
    listMockCoursesForOrganisation(orgId),
    listMockCompletionsForUser(context.user.id, orgId),
  ]);

  if (context.membership.role === "staff") {
    const activePolicies = stats.policies.active;
    const userAcks = completions.length;
    const pendingPolicies = Math.max(0, activePolicies - userAcks);

    const recentActivity = auditEvents
      .filter((e) => e.actorUserId === context.user.id)
      .slice(0, 3)
      .map((e) => ({
        label: e.action.replace(".", " ").replace(/_/g, " "),
        value: e.entityType,
        date: formatDate(e.createdAt),
      }));

    return (
      <StaffDashboard
        organisationName={context.organisation.name}
        userDisplayName={context.user.displayName}
        role="staff"
        approvedToolCount={stats.tools.approved}
        trainingComplete={completions.length}
        trainingTotal={courses.length}
        pendingPolicies={pendingPolicies}
        recentActivity={recentActivity}
      />
    );
  }

  const healthScore = computeHealthScore(stats);
  const recentEvidence = evidence.slice(0, 5);

  const coverageDomains = [
    {
      label: "Tool governance",
      value:
        stats.tools.total > 0
          ? `${Math.round((stats.tools.approved / stats.tools.total) * 100)}%`
          : "0%",
      tone: "cyan",
    },
    {
      label: "Policy coverage",
      value: stats.policies.active > 0 ? `${stats.policies.active} active` : "None",
      tone: "blue",
    },
    {
      label: "Risk management",
      value:
        stats.risks.total > 0
          ? `${stats.risks.total - stats.risks.high} managed`
          : "No risks",
      tone: "violet",
    },
    {
      label: "Controls",
      value: stats.controls.total > 0 ? `${stats.controls.total} active` : "None",
      tone: "warning",
    },
    {
      label: "Assessments",
      value:
        stats.assessments.total > 0 ? `${stats.assessments.total} completed` : "None",
      tone: stats.assessments.total > 0 ? "info" : "danger",
    },
  ];

  const recentAuditEvents = auditEvents.slice(0, 5);

  return (
    <AppShell
      current="overview"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Governance Health"
        description="Enterprise-wide overview"
        actions={<FilterChip label="Current state" />}
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
        <WorkspacePanel className="xl:col-span-1">
          <p className="text-sm text-[var(--ai-text-secondary)]">Health Score</p>
          <div className="mt-6 flex items-center gap-6">
            <RingScore score={String(healthScore)} label="/100" />
            <div className="space-y-3">
              <p className={`flex items-center gap-2 text-xl font-semibold ${healthScore >= 70 ? "text-[var(--ai-success)]" : healthScore >= 40 ? "text-[var(--ai-warning)]" : "text-[var(--ai-danger)]"}`}>
                <span className={`h-3 w-3 rounded-full ${healthScore >= 70 ? "bg-[var(--ai-success)]" : healthScore >= 40 ? "bg-[var(--ai-warning)]" : "bg-[var(--ai-danger)]"}`} />
                {healthScore >= 70 ? "Good" : healthScore >= 40 ? "Building" : "Early stage"}
              </p>
              <p className="text-base text-[var(--ai-text-secondary)]">
                {stats.tools.total} tools registered
              </p>
            </div>
          </div>
        </WorkspacePanel>

        {[
          { label: "Policies", value: String(stats.policies.active), sub: "active" },
          { label: "Controls", value: String(stats.controls.total), sub: "in place" },
          { label: "Evidence Items", value: String(stats.evidence.total), sub: "recorded" },
          { label: "Assessments", value: String(stats.assessments.total), sub: "completed" },
        ].map((item) => (
          <WorkspacePanel key={item.label}>
            <p className="text-sm text-[var(--ai-text-secondary)]">{item.label}</p>
            <p className="mt-7 text-5xl font-semibold tracking-[-0.04em] text-white">
              {item.value}
            </p>
            <p className="mt-4 text-lg font-medium text-[var(--ai-text-muted)]">{item.sub}</p>
          </WorkspacePanel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_1.25fr_1.1fr]">
        <WorkspacePanel>
          <p className="text-[2rem] font-semibold text-white">Evidence Status</p>
          <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">Total evidence items</p>
          <div className="mt-6 flex items-center gap-3">
            <p className="text-5xl font-semibold text-white">{stats.evidence.total}</p>
          </div>
          <div className="mt-5 h-3 rounded-full bg-[rgba(18,31,53,0.95)]">
            <div
              className="h-3 rounded-full bg-[linear-gradient(90deg,#00d4ff_0%,#1c65ff_100%)]"
              style={{ width: stats.evidence.total > 0 ? "67%" : "0%" }}
            />
          </div>
          <div className="mt-6 space-y-3">
            {[
              { label: "Verified", value: String(stats.evidence.total), tone: "info" },
              { label: "Tools registered", value: String(stats.tools.total), tone: "violet" },
              { label: "Use cases", value: String(stats.useCases.total), tone: "warning" },
              { label: "Open incidents", value: String(stats.incidents.open), tone: "danger" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <p className="flex items-center gap-3 text-[var(--ai-text-secondary)]">
                  <span className={`h-3 w-3 rounded-full ${toneClass(item.tone)}`} />
                  {item.label}
                </p>
                <span className="text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="text-[2rem] font-semibold text-white">Policy Coverage</p>
          <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">Coverage across key domains</p>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
            <RingScore
              score={
                stats.policies.active > 0
                  ? `${Math.min(100, stats.policies.active * 20)}%`
                  : "0%"
              }
              label="Overall"
              size="medium"
            />
            <div className="min-w-0 flex-1 space-y-3">
              {coverageDomains.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-3 text-sm text-[var(--ai-text-secondary)]">
                    <span className={`h-3 w-3 rounded-full ${toneClass(item.tone)}`} />
                    {item.label}
                  </p>
                  <span className="text-sm font-medium text-white">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="text-[2rem] font-semibold text-white">Risk Posture</p>
          <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">Active and emerging risks</p>
          <div className="mt-6 space-y-3">
            {[
              {
                label: "High / Critical",
                value: stats.risks.high,
                description: `${stats.risks.high} risk${stats.risks.high !== 1 ? "s" : ""} require attention`,
                level: "high",
              },
              {
                label: "Medium",
                value: stats.risks.medium,
                description: `${stats.risks.medium} risk${stats.risks.medium !== 1 ? "s" : ""} require monitoring`,
                level: "medium",
              },
              {
                label: "Low",
                value: stats.risks.low,
                description: `${stats.risks.low} risk${stats.risks.low !== 1 ? "s" : ""} under control`,
                level: "low",
              },
            ].map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-4 ${riskTone(row.level)}`}
              >
                <span className="text-base font-semibold">{row.label}</span>
                <span className="text-sm">{row.description}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/risks" className="text-base font-semibold text-[var(--ai-blue)]">
              View all risks
            </Link>
          </div>
        </WorkspacePanel>
      </div>

      <WorkspacePanel className="mt-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[2rem] font-semibold text-white">Recent Activity</p>
            <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
              Actions recorded across the governance platform
            </p>
          </div>
          <Link href="/evidence" className="text-base font-semibold text-[var(--ai-blue)]">
            View evidence
          </Link>
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity type</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAuditEvents.map((row) => (
                <tr key={row.id}>
                  <td className="text-white">{row.action.replace(/\./g, " ").replace(/_/g, " ")}</td>
                  <td>{row.entityType.replace(/_/g, " ")}</td>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>
                    <StatusPill label="Recorded" tone="success" />
                  </td>
                </tr>
              ))}
              {recentAuditEvents.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-[var(--ai-text-muted)]">
                    No activity recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
