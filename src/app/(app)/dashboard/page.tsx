import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import { StatusPill } from "@/app/(app)/_components/workspace-primitives";
import { AppIcon } from "@/components/AppIcons";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import {
  getMockDashboardStats,
  listMockCompletionsForUser,
  listMockCoursesForOrganisation,
} from "@/lib/data/mock-registry";

/* ── Helpers ── */

function computeHealthScore(stats: Awaited<ReturnType<typeof getMockDashboardStats>>) {
  let s = 40;
  if (stats.tools.approved > 0) s += 15;
  if (stats.policies.active > 0) s += 15;
  if (stats.risks.total > 0) s += 10;
  if (stats.evidence.total > 0) s += 10;
  if (stats.controls.total > 0) s += 5;
  if (stats.assessments.total > 0) s += 5;
  return Math.min(s, 100);
}

/* ── Sparkline ── */
function Sparkline({ id, up = true }: { id: string; up?: boolean }) {
  const line = up
    ? "M0 24 C12 22, 24 20, 36 16 C48 12, 60 8, 72 4 C76 2, 78 2, 80 2"
    : "M0 10 C12 12, 24 14, 36 16 C48 18, 60 20, 72 18 C76 17, 78 14, 80 12";
  const area = up
    ? `${line} L80 28 L0 28 Z`
    : `${line} L80 28 L0 28 Z`;
  return (
    <svg viewBox="0 0 80 28" className="h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`spk-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spk-${id})`} />
      <path d={line} fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Panel wrapper ── */
function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[20px] p-5 ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(14,17,38,0.98) 0%, rgba(10,13,30,0.98) 100%)",
        border: "1px solid rgba(42,45,80,0.65)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Compliance Score ring card ── */
function ComplianceRingCard({ score }: { score: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Building" : "Early";
  return (
    <Panel>
      <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-[rgba(168,176,204,0.55)]">Compliance Score</p>
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center" style={{ width: 110, height: 110 }}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(42,45,80,0.8)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={r} fill="none"
              stroke="url(#ringGrad)" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
            />
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#4F7CF5" />
              </linearGradient>
            </defs>
          </svg>
          <div className="relative flex flex-col items-center">
            <span className="text-[22px] font-bold text-white leading-none">{score}%</span>
            <span className="mt-0.5 text-[11px]" style={{ color: "#5575F2" }}>{label}</span>
          </div>
        </div>
        <p className="mt-2 text-[12px]" style={{ color: "rgba(52,211,153,0.9)" }}>
          ↑ 18% vs last month
        </p>
      </div>
    </Panel>
  );
}

/* ── Stat card with sparkline ── */
function StatCard({
  icon,
  label,
  value,
  delta,
  deltaUp,
  sparkId,
}: {
  icon: Parameters<typeof AppIcon>[0]["name"];
  label: string;
  value: string | number;
  delta: string;
  deltaUp: boolean;
  sparkId: string;
}) {
  return (
    <Panel className="flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-[9px]"
          style={{ background: "rgba(99,102,241,0.12)", color: "#6366F1" }}
        >
          <AppIcon name={icon} className="h-3.5 w-3.5" />
        </span>
        <p className="text-[12px] text-[rgba(168,176,204,0.6)]">{label}</p>
      </div>
      <p className="text-[32px] font-bold tracking-[-0.03em] text-white leading-none">{value}</p>
      <p
        className="mt-1.5 mb-4 text-[12px] font-medium"
        style={{ color: deltaUp ? "rgba(52,211,153,0.9)" : "rgba(168,176,204,0.5)" }}
      >
        {deltaUp ? "↑ " : ""}{delta}
      </p>
      <div className="mt-auto -mx-5 -mb-5 px-0 pb-0 overflow-hidden rounded-b-[20px]">
        <Sparkline id={sparkId} up={deltaUp} />
      </div>
    </Panel>
  );
}

/* ── Risk Level card ── */
function RiskLevelCard({ high, medium }: { high: number; medium: number }) {
  const level = high > 2 ? "High" : high > 0 || medium > 2 ? "Moderate" : medium > 0 ? "Low" : "Minimal";
  const levelColor = level === "High" ? "#6366F1" : level === "Moderate" ? "#5575F2" : "#4F7CF5";
  const barPct = level === "High" ? 85 : level === "Moderate" ? 55 : level === "Low" ? 30 : 10;
  const actions = high + Math.ceil(medium / 2);

  return (
    <Panel className="flex flex-col items-center text-center">
      <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-[rgba(168,176,204,0.55)] self-start">Risk Level</p>
      <div
        className="my-2 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke={levelColor} strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7" aria-hidden="true">
          <path d="M12 3.5 19.5 7v5c0 4-2.7 6.8-7.5 8.5C7.2 18.8 4.5 16 4.5 12V7L12 3.5Z" />
        </svg>
      </div>
      <p className="mt-1 text-[22px] font-bold leading-none" style={{ color: levelColor }}>{level}</p>
      <p className="mt-1.5 text-[12px] text-[rgba(168,176,204,0.5)]">{actions} actions required</p>
      <div className="mt-4 w-full">
        <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(42,45,80,0.8)" }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${barPct}%`,
              background: `linear-gradient(90deg, ${levelColor}, #4F7CF5)`,
              boxShadow: `0 0 8px ${levelColor}60`,
            }}
          />
        </div>
      </div>
    </Panel>
  );
}

/* ── Staff Dashboard ── */
function StaffDashboard({
  organisationName,
  userDisplayName,
  approvedToolCount,
  trainingComplete,
  trainingTotal,
  pendingPolicies,
}: {
  organisationName: string;
  userDisplayName: string;
  approvedToolCount: number;
  trainingComplete: number;
  trainingTotal: number;
  pendingPolicies: number;
}) {
  const trainingPct = trainingTotal > 0 ? Math.round((trainingComplete / trainingTotal) * 100) : 0;
  const firstName = userDisplayName.split(" ")[0];

  return (
    <AppShell current="overview" organisationName={organisationName} userDisplayName={userDisplayName} role="staff">
      <h1 className="mb-1 text-[26px] font-bold text-white">Welcome back, {firstName} 👋</h1>
      <p className="mb-6 text-[14px] text-[rgba(168,176,204,0.65)]">Here&apos;s what you need today.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Panel>
          <p className="text-[12px] text-[rgba(168,176,204,0.6)]">My Policy Status</p>
          <p className="mt-3 text-[32px] font-bold text-white">{pendingPolicies === 0 ? "All clear" : pendingPolicies}</p>
          <p className="mt-1 text-[12px] text-[rgba(168,176,204,0.5)]">{pendingPolicies === 0 ? "No pending acknowledgements" : `${pendingPolicies === 1 ? "policy" : "policies"} to acknowledge`}</p>
        </Panel>
        <Panel>
          <p className="text-[12px] text-[rgba(168,176,204,0.6)]">Training Progress</p>
          <p className="mt-3 text-[32px] font-bold text-white">{trainingPct}%</p>
          <p className="mt-1 text-[12px] text-[rgba(168,176,204,0.5)]">{trainingComplete} of {trainingTotal} modules</p>
        </Panel>
        <Panel>
          <p className="text-[12px] text-[rgba(168,176,204,0.6)]">Approved Tools</p>
          <p className="mt-3 text-[32px] font-bold text-white">{approvedToolCount}</p>
          <p className="mt-1 text-[12px] text-[rgba(168,176,204,0.5)]">tools available to you</p>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-3 font-semibold text-white">Quick links</h2>
          <div className="space-y-2">
            {[
              { label: "My Policies", href: "/my-policies" },
              { label: "Training Modules", href: "/training" },
              { label: "Approved Tools", href: "/approved-tools" },
              { label: "Help & Support", href: "/help" },
            ].map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center justify-between rounded-[12px] px-4 py-3 text-[13px] text-[rgba(168,176,204,0.7)] transition hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
                style={{ border: "1px solid rgba(42,45,80,0.5)" }}
              >
                {l.label}
                <AppIcon name="arrow-right" className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </Panel>
        <Panel>
          <h2 className="mb-3 font-semibold text-white">Built for responsible AI</h2>
          <p className="text-[13px] leading-relaxed text-[rgba(168,176,204,0.6)]">
            FAICER gives you clear guidance on which AI tools are approved, what policies govern your use, and how to stay compliant — so you can work with AI confidently.
          </p>
        </Panel>
      </div>
    </AppShell>
  );
}

/* ── Admin Dashboard ── */
export default async function DashboardPage() {
  const context = await requireWorkspaceContext();
  const orgId = context.organisation.id;

  const [stats, courses, completions] = await Promise.all([
    getMockDashboardStats(orgId),
    listMockCoursesForOrganisation(orgId),
    listMockCompletionsForUser(context.user.id, orgId),
  ]);

  if (context.membership.role === "staff") {
    const pendingPolicies = Math.max(0, stats.policies.active - completions.length);
    return (
      <StaffDashboard
        organisationName={context.organisation.name}
        userDisplayName={context.user.displayName}
        approvedToolCount={stats.tools.approved}
        trainingComplete={completions.length}
        trainingTotal={courses.length}
        pendingPolicies={pendingPolicies}
      />
    );
  }

  const healthScore = computeHealthScore(stats);
  const trainingPct = courses.length > 0 ? Math.round((completions.length / courses.length) * 100) : 0;
  const firstName = context.user.displayName.split(" ")[0];
  const openActions = stats.risks.high + stats.incidents.open;

  const topRisks = [
    { icon: "risks" as const, label: "Unreviewed Vendor Models", sub: `${stats.risks.high} models`, level: "high" as const },
    { icon: "assessments" as const, label: "Incomplete DPIA", sub: "2 assessments", level: "medium" as const },
    { icon: "training" as const, label: "Training Gaps", sub: `${Math.max(0, courses.length - completions.length)} team members`, level: "medium" as const },
    { icon: "evidence" as const, label: "Data Governance", sub: "Policy outdated", level: "low" as const },
  ];

  const nextSteps = [
    { icon: "assessments" as const, label: "Complete DPIA for Customer Support Bot", due: "Due May 20", level: "high" as const },
    { icon: "policies" as const, label: "Approve Data Retention Policy", due: "Due May 24", level: "medium" as const },
    { icon: "training" as const, label: "Finish AI Literacy Training – Marketing", due: "Due May 26", level: "low" as const },
  ];

  const recentActivity = [
    { icon: "assessments" as const, type: "Assessment completed", detail: "Vendor Risk Assessment", time: "Today, 10:24 AM" },
    { icon: "training" as const, type: "Training completed", detail: "AI Literacy Basics", time: "Yesterday, 4:15 PM" },
    { icon: "policies" as const, type: "Policy updated", detail: "AI Use Policy v2.1", time: "May 17, 11:02 AM" },
    { icon: "register" as const, type: "New AI asset added", detail: "Invoice Processing AI", time: "May 16, 3:45 PM" },
    { icon: "governance" as const, type: "Audit action closed", detail: "Data Retention Check", time: "May 16, 9:30 AM" },
  ];

  /* Chart constants */
  const chartPts = [
    { x: 50, y: 100 - 38 }, { x: 150, y: 100 - 55 },
    { x: 270, y: 100 - 72 }, { x: 390, y: 100 - 85 },
    { x: 460, y: 100 - healthScore },
  ];
  const toSvgY = (pct: number) => 10 + (1 - pct / 100) * 110;
  const pts = [
    { x: 50,  y: toSvgY(38)         },
    { x: 155, y: toSvgY(55)         },
    { x: 270, y: toSvgY(72)         },
    { x: 385, y: toSvgY(85)         },
    { x: 460, y: toSvgY(healthScore) },
  ];
  const smooth = (points: typeof pts) => {
    return points.map((p, i) => {
      if (i === 0) return `M${p.x},${p.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
    }).join(" ");
  };
  const linePath = smooth(pts);
  const areaPath = `${linePath} L${pts[pts.length - 1].x},130 L${pts[0].x},130 Z`;

  void chartPts; // unused

  return (
    <AppShell
      current="overview"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-white leading-tight">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-[14px] text-[rgba(168,176,204,0.6)]">
          Here&apos;s your AI compliance overview.
        </p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-5">
        <ComplianceRingCard score={healthScore} />

        <StatCard
          icon="assessments"
          label="Assessments"
          value={stats.assessments.total || 27}
          delta="4 new this month"
          deltaUp
          sparkId="assess"
        />
        <StatCard
          icon="training"
          label="Training Completion"
          value={`${trainingPct || 84}%`}
          delta="9% vs last month"
          deltaUp
          sparkId="train"
        />
        <StatCard
          icon="check"
          label="Open Actions"
          value={openActions || 9}
          delta={openActions > 0 ? `${stats.risks.high || 3} high priority` : "All clear"}
          deltaUp={openActions === 0}
          sparkId="actions"
        />
        <RiskLevelCard high={stats.risks.high} medium={stats.risks.medium} />
      </div>

      {/* ── Middle row ── */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_340px_320px]">

        {/* Compliance Overview chart */}
        <Panel>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-white">Compliance Overview</p>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-[10px] border px-3 py-1.5 text-[12px] text-[rgba(168,176,204,0.7)] hover:text-white"
              style={{ borderColor: "rgba(42,45,80,0.7)", background: "rgba(11,14,31,0.5)" }}
            >
              Last 30 Days
              <AppIcon name="chevron" className="h-3.5 w-3.5" />
            </button>
          </div>

          <svg viewBox="0 0 510 140" className="w-full" aria-hidden="true">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#6366F1" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {/* Grid */}
            {[0, 25, 50, 75, 100].map((v) => {
              const y = toSvgY(v);
              return (
                <g key={v}>
                  <line x1="42" y1={y} x2="500" y2={y} stroke="rgba(42,45,80,0.7)" strokeWidth="1" />
                  <text x="38" y={y + 4} fill="rgba(107,114,128,0.9)" fontSize="9" textAnchor="end">{v}%</text>
                </g>
              );
            })}
            {/* Area */}
            <path d={areaPath} fill="url(#areaGrad)" />
            {/* Line */}
            <path d={linePath} fill="none" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Current point marker */}
            <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="5" fill="#6366F1" stroke="#0B0E1F" strokeWidth="2" />
            {/* Tooltip */}
            <rect x={pts[pts.length - 1].x - 30} y={pts[pts.length - 1].y - 44} width="60" height="38" rx="7" fill="rgba(20,14,40,0.95)" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
            <text x={pts[pts.length - 1].x} y={pts[pts.length - 1].y - 28} textAnchor="middle" fill="rgba(168,176,204,0.7)" fontSize="8">May 18</text>
            <text x={pts[pts.length - 1].x} y={pts[pts.length - 1].y - 15} textAnchor="middle" fill="white" fontSize="13" fontWeight="700">{healthScore}%</text>
            {/* X-axis labels */}
            {["Apr 14", "Apr 28", "May 12", "May 26", "Jun 9"].map((label, i) => (
              <text key={label} x={50 + i * 102.5} y="138" fill="rgba(107,114,128,0.9)" fontSize="9" textAnchor="middle">{label}</text>
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-[12px]">
            {[
              { dot: "#22C55E", label: "Excellent 80-100%", count: 18 },
              { dot: "#4ADE80", label: "Good 60-79%", count: 6 },
              { dot: "#EAB308", label: "Needs Work 30-59%", count: 2 },
              { dot: "#6366F1", label: "Poor 0-29%", count: 1 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: item.dot }} />
                <span className="text-[rgba(168,176,204,0.6)]">{item.label}</span>
                <span className="font-semibold text-white">{item.count}</span>
              </div>
            ))}
          </div>

          <Link
            href="/reports"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-[12px] border py-2.5 text-[13px] font-semibold transition hover:bg-[rgba(99,102,241,0.06)]"
            style={{ borderColor: "rgba(99,102,241,0.3)", color: "#6366F1" }}
          >
            View full compliance report
            <AppIcon name="arrow-right" className="h-4 w-4" />
          </Link>
        </Panel>

        {/* Top Risks */}
        <Panel className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-white">Top Risks</p>
            <Link href="/risks" className="text-[12px] font-medium transition hover:text-white" style={{ color: "#6366F1" }}>View all</Link>
          </div>
          <div className="flex-1 space-y-2">
            {topRisks.map((risk) => (
              <div
                key={risk.label}
                className="flex items-start gap-3 rounded-[12px] px-3.5 py-3"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(42,45,80,0.6)" }}
              >
                <span
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
                  style={{
                    background: risk.level === "high" ? "rgba(255,77,77,0.12)" : risk.level === "medium" ? "rgba(255,165,0,0.12)" : "rgba(79,124,245,0.12)",
                    color: risk.level === "high" ? "#FF5555" : risk.level === "medium" ? "#FFA500" : "#4F7CF5",
                  }}
                >
                  <AppIcon name={risk.icon} className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-white leading-tight">{risk.label}</p>
                  <p className="text-[11px] text-[rgba(168,176,204,0.5)]">{risk.sub}</p>
                </div>
                <StatusPill
                  label={risk.level === "high" ? "High" : risk.level === "medium" ? "Medium" : "Low"}
                  tone={risk.level === "high" ? "danger" : risk.level === "medium" ? "warning" : "muted"}
                />
              </div>
            ))}
          </div>
          <Link
            href="/risks"
            className="mt-3 flex items-center justify-center gap-1.5 rounded-[12px] border py-2.5 text-[13px] font-semibold transition hover:bg-[rgba(99,102,241,0.06)]"
            style={{ borderColor: "rgba(99,102,241,0.3)", color: "#6366F1" }}
          >
            View all risks
            <AppIcon name="arrow-right" className="h-4 w-4" />
          </Link>
        </Panel>

        {/* Next Steps */}
        <Panel className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold text-white">Next Steps</p>
            <Link href="/governance" className="text-[12px] font-medium transition hover:text-white" style={{ color: "#6366F1" }}>View all</Link>
          </div>
          <div className="flex-1 space-y-2">
            {nextSteps.map((step) => (
              <div
                key={step.label}
                className="flex items-start gap-3 rounded-[12px] px-3.5 py-3"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(42,45,80,0.6)" }}
              >
                <span
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
                  style={{ background: "rgba(99,102,241,0.12)", color: "#5575F2" }}
                >
                  <AppIcon name={step.icon} className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-white leading-tight">{step.label}</p>
                  <p className="text-[11px] text-[rgba(168,176,204,0.5)]">{step.due}</p>
                </div>
                <StatusPill
                  label={step.level === "high" ? "High" : step.level === "medium" ? "Medium" : "Low"}
                  tone={step.level === "high" ? "danger" : step.level === "medium" ? "warning" : "muted"}
                />
              </div>
            ))}
          </div>
          <Link
            href="/governance"
            className="mt-3 flex items-center justify-center gap-1.5 rounded-[12px] border py-2.5 text-[13px] font-semibold transition hover:bg-[rgba(99,102,241,0.06)]"
            style={{ borderColor: "rgba(99,102,241,0.3)", color: "#6366F1" }}
          >
            View all actions
            <AppIcon name="arrow-right" className="h-4 w-4" />
          </Link>
        </Panel>
      </div>

      {/* ── Recent Activity ── */}
      <div className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-semibold text-white">Recent Activity</p>
          <Link href="/governance" className="text-[12px] font-medium transition hover:text-white" style={{ color: "#6366F1" }}>
            View all activity
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {recentActivity.map((item) => (
            <Panel key={item.type} className="flex items-start gap-3 !p-4">
              <span
                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                style={{ background: "rgba(99,102,241,0.12)", color: "#5575F2" }}
              >
                <AppIcon name={item.icon} className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold text-white leading-tight">{item.type}</p>
                <p className="mt-0.5 text-[11.5px] text-[rgba(168,176,204,0.6)] leading-snug">{item.detail}</p>
                <p className="mt-1 text-[11px] text-[rgba(168,176,204,0.38)]">{item.time}</p>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
