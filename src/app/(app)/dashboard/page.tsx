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
  dashboardCoverageDomains,
  dashboardEvidenceBreakdown,
  dashboardHealthMetrics,
  dashboardRiskRows,
  recentEvidenceRows,
} from "@/lib/reference-content";

function toneClass(tone: string) {
  return {
    info: "bg-[var(--ai-cyan)]",
    violet: "bg-[var(--ai-violet)]",
    warning: "bg-[var(--ai-warning)]",
    danger: "bg-[var(--ai-danger)]",
  }[tone] ?? "bg-[var(--ai-blue)]";
}

function riskTone(tone: string) {
  return {
    danger: "brand-status-danger",
    warning: "brand-status-warning",
    success: "brand-status-success",
    info: "brand-status-info",
  }[tone] ?? "brand-status-muted";
}

function StaffDashboard({
  organisationName,
  userDisplayName,
}: {
  organisationName: string;
  userDisplayName: string;
}) {
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
              <div className="mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(19,231,132,0.14)] text-[var(--ai-success)]">
                <AppIcon name="check" className="h-8 w-8" />
              </div>
              <p className="mt-4 text-sm text-white">You&apos;re all set</p>
            </article>
            <article className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm text-[var(--ai-text-secondary)]">Training Progress</p>
              <div className="mt-5">
                <RingScore score="60%" label="Complete" size="medium" />
              </div>
            </article>
            <article className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <p className="text-sm text-[var(--ai-text-secondary)]">Approved Tools</p>
              <p className="mt-6 text-5xl font-semibold tracking-[-0.04em] text-white">
                12
              </p>
              <p className="mt-3 text-sm text-[var(--ai-text-secondary)]">
                tools approved
              </p>
            </article>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              <div className="mt-5 space-y-4 text-sm">
                {[
                  ["Policy acknowledged", "AI Acceptable Use Policy", "May 20, 2024"],
                  ["Training progress", "AI Literacy 101", "May 20, 2024"],
                  ["Tool used", "Microsoft Copilot", "May 20, 2024"],
                ].map(([label, value, date]) => (
                  <div key={label} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-white">{label}</p>
                      <p className="mt-1 text-[var(--ai-text-secondary)]">{value}</p>
                    </div>
                    <span className="text-[var(--ai-text-muted)]">{date}</span>
                  </div>
                ))}
              </div>
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
        </WorkspacePanel>
      </div>
    </AppShell>
  );
}

export default async function DashboardPage() {
  const context = await requireWorkspaceContext();

  if (context.membership.role === "staff") {
    return (
      <StaffDashboard
        organisationName={context.organisation.name}
        userDisplayName={context.user.displayName}
      />
    );
  }

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
        actions={<FilterChip label="Last 30 days" />}
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
        <WorkspacePanel className="xl:col-span-1">
          <p className="text-sm text-[var(--ai-text-secondary)]">Health Score</p>
          <div className="mt-6 flex items-center gap-6">
            <RingScore score="91" label="/100" />
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-xl font-semibold text-[var(--ai-success)]">
                <span className="h-3 w-3 rounded-full bg-[var(--ai-success)]" />
                Excellent
              </p>
              <p className="text-base text-[var(--ai-success)]">+ 16 vs last 30 days</p>
            </div>
          </div>
        </WorkspacePanel>

        {dashboardHealthMetrics.map((item) => (
          <WorkspacePanel key={item.label}>
            <p className="text-sm text-[var(--ai-text-secondary)]">{item.label}</p>
            <p className="mt-7 text-5xl font-semibold tracking-[-0.04em] text-white">
              {item.value}
            </p>
            <p className="mt-4 text-lg font-medium text-[var(--ai-success)]">
              {item.delta}
            </p>
          </WorkspacePanel>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_1.25fr_1.1fr]">
        <WorkspacePanel>
          <p className="text-[2rem] font-semibold text-white">Evidence Status</p>
          <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
            Total evidence items
          </p>
          <div className="mt-6 flex items-center gap-3">
            <p className="text-5xl font-semibold text-white">3,677</p>
            <p className="text-lg font-medium text-[var(--ai-success)]">+ 19%</p>
          </div>
          <div className="mt-5 h-3 rounded-full bg-[rgba(18,31,53,0.95)]">
            <div className="h-3 w-[67%] rounded-full bg-[linear-gradient(90deg,#00d4ff_0%,#1c65ff_100%)]" />
          </div>
          <div className="mt-6 space-y-3">
            {dashboardEvidenceBreakdown.map((item) => (
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
          <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
            Coverage across key domains
          </p>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-center">
            <RingScore score="83%" label="Overall" size="medium" />
            <div className="min-w-0 flex-1 space-y-3">
              {dashboardCoverageDomains.map((item) => (
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
          <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
            Active and emerging risks
          </p>
          <div className="mt-6 space-y-3">
            {dashboardRiskRows.map((row) => (
              <div
                key={row.label}
                className={`flex items-center justify-between gap-4 rounded-2xl px-4 py-4 ${riskTone(row.tone)}`}
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
            <p className="text-[2rem] font-semibold text-white">Recent Evidence</p>
            <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">
              Evidence recorded across the governance platform
            </p>
          </div>
          <Link href="/evidence" className="text-base font-semibold text-[var(--ai-blue)]">
            View all
          </Link>
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Evidence</th>
                <th>Type</th>
                <th>Policy</th>
                <th>Source</th>
                <th>Status</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentEvidenceRows.map((row) => (
                <tr key={row.evidence}>
                  <td className="text-white">{row.evidence}</td>
                  <td>{row.type}</td>
                  <td>{row.policy}</td>
                  <td>{row.source}</td>
                  <td>
                    <StatusPill
                      label={row.status}
                      tone={row.status === "Pending Review" ? "warning" : "success"}
                    />
                  </td>
                  <td>{row.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
