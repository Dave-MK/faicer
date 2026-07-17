import Link from "next/link";
import { AppIcon } from "@/components/AppIcons";
import { PublicChrome } from "@/components/PublicChrome";
import { getSessionSnapshot } from "@/lib/auth/session";

const BRAND = "#4d8cec";
const SUCCESS = "#31b47c";
const WARNING = "#d79b33";
const DANGER = "#d35c5c";

const highlights = [
  {
    value: "92%",
    label: "Governance posture",
    detail: "Live view of readiness, ownership, and open issues.",
  },
  {
    value: "3",
    label: "Frameworks mapped",
    detail: "EU AI Act, NIST AI RMF, and ISO/IEC 42001.",
  },
  {
    value: "14",
    label: "Pending actions",
    detail: "Prioritised across risk, evidence, and approvals.",
  },
  {
    value: "7",
    label: "High-risk systems",
    detail: "Tracked with named owners and review checkpoints.",
  },
];

const outcomes = [
  {
    icon: "register" as const,
    title: "Register AI systems clearly",
    copy: "Maintain a structured inventory with purpose, owner, business area, lifecycle status, and framework relevance.",
  },
  {
    icon: "assessments" as const,
    title: "Assess risk and impact",
    copy: "Run consistent assessments that separate questions, evidence, risk signals, and decisions into a defensible workflow.",
  },
  {
    icon: "governance" as const,
    title: "Assign ownership and oversight",
    copy: "Define accountable owners, approval steps, and human oversight expectations for every system in scope.",
  },
  {
    icon: "controls" as const,
    title: "Map controls to frameworks",
    copy: "Connect policies, controls, and remediation tasks to the governance frameworks your organisation is working toward.",
  },
  {
    icon: "evidence" as const,
    title: "Collect evidence continuously",
    copy: "Store records, policies, assessments, and approvals in one place so audit preparation does not become a scramble.",
  },
  {
    icon: "reports" as const,
    title: "Report with confidence",
    copy: "Generate posture summaries for boards, executives, auditors, and operational teams without rebuilding the story in slides.",
  },
];

const workflow = [
  {
    step: "01",
    title: "Discover and register",
    copy: "Capture every AI system, use case, owner, and business context in a governed register.",
  },
  {
    step: "02",
    title: "Assess and classify",
    copy: "Evaluate risk, impact, oversight needs, and framework obligations using repeatable assessment logic.",
  },
  {
    step: "03",
    title: "Control and evidence",
    copy: "Track policy acknowledgements, control implementation, evidence gaps, and remediation actions.",
  },
  {
    step: "04",
    title: "Approve and report",
    copy: "Document decisions, preserve audit history, and produce executive-ready reporting as posture changes.",
  },
];

const frameworks = [
  {
    name: "EU AI Act",
    copy: "Supports classification, evidence collection, oversight, and readiness activities for regulated AI use cases.",
  },
  {
    name: "NIST AI RMF",
    copy: "Helps organisations map governance, measurement, and management activities to a practical operating model.",
  },
  {
    name: "ISO/IEC 42001",
    copy: "Provides structured records and control mapping that assist organisations building an AI management system.",
  },
];

const trustAreas = [
  "Traceable decisions with timestamps and assigned owners",
  "Consistent assessments across teams and business units",
  "Evidence records linked to controls, systems, and reviews",
  "Approval histories that remain visible for audit and leadership reporting",
];

function MetricCard({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <article className="brand-panel rounded-3xl p-5">
      <p className="text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
      <h3 className="mt-3 text-sm font-semibold text-white">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--ai-text-secondary)]">{detail}</p>
    </article>
  );
}

function DashboardMockup() {
  return (
    <section
      aria-label="FAICER dashboard preview"
      className="overflow-hidden rounded-[28px] border border-[rgba(36,52,75,0.82)] bg-[linear-gradient(180deg,#0c1625_0%,#0a1320_100%)] shadow-[0_26px_70px_rgba(1,8,20,0.38)]"
    >
      <header className="flex items-center justify-between gap-4 border-b border-[rgba(36,52,75,0.78)] px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[rgba(77,140,236,0.3)] bg-[rgba(77,140,236,0.08)] text-[var(--ai-cyan)]">
            <AppIcon name="overview" className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ai-cyan)]">
              Governance dashboard
            </p>
            <h3 className="text-base font-semibold text-white">Organisation posture</h3>
          </div>
        </div>
        <div className="rounded-full border border-[rgba(49,180,124,0.28)] bg-[rgba(49,180,124,0.12)] px-3 py-1 text-xs font-semibold text-[var(--ai-success)]">
          Updated July 16, 2026
        </div>
      </header>

      <div className="grid gap-4 p-5 xl:grid-cols-[1.45fr_0.95fr]">
        <section className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <article className="rounded-[22px] border border-[rgba(36,52,75,0.7)] bg-[rgba(9,17,31,0.92)] p-4 sm:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ai-text-muted)]">
                Governance posture
              </p>
              <div className="mt-4 flex items-center gap-4">
                <svg viewBox="0 0 44 44" className="h-16 w-16" aria-hidden="true">
                  <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(36,52,75,0.82)" strokeWidth="4" />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke={BRAND}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="92 113"
                    transform="rotate(-90 22 22)"
                  />
                  <text x="22" y="24" textAnchor="middle" fill="#eff4fb" fontSize="8" fontWeight="700">
                    81
                  </text>
                </svg>
                <div>
                  <p className="text-2xl font-semibold text-white">Established</p>
                  <p className="mt-1 text-sm text-[var(--ai-text-secondary)]">
                    Strong control adoption with evidence gaps still open.
                  </p>
                </div>
              </div>
            </article>

            {[
              {
                label: "Control coverage",
                value: "74%",
                note: "19 controls partially implemented",
              },
              {
                label: "Evidence completeness",
                value: "68%",
                note: "6 records missing before next review",
              },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-[22px] border border-[rgba(36,52,75,0.7)] bg-[rgba(9,17,31,0.92)] p-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ai-text-muted)]">
                  {item.label}
                </p>
                <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--ai-text-secondary)]">{item.note}</p>
              </article>
            ))}
          </div>

          <article className="rounded-[22px] border border-[rgba(36,52,75,0.7)] bg-[rgba(9,17,31,0.92)] p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ai-text-muted)]">
                  Framework readiness
                </p>
                <h4 className="mt-1 text-lg font-semibold text-white">Evidence and control progress by framework</h4>
              </div>
              <p className="text-sm text-[var(--ai-text-secondary)]">Helps organisations map controls against selected frameworks.</p>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { name: "EU AI Act", value: 78, tone: BRAND },
                { name: "NIST AI RMF", value: 72, tone: WARNING },
                { name: "ISO/IEC 42001", value: 64, tone: SUCCESS },
              ].map((item) => (
                <div key={item.name} className="rounded-2xl border border-[rgba(36,52,75,0.68)] bg-[rgba(12,22,37,0.9)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-white">{item.name}</span>
                    <span className="text-sm font-semibold text-white">{item.value}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-[rgba(36,52,75,0.82)]">
                    <div
                      className="h-2 rounded-full"
                      style={{ background: item.tone, width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4">
          <article className="rounded-[22px] border border-[rgba(36,52,75,0.7)] bg-[rgba(9,17,31,0.92)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ai-text-muted)]">
                  Risk distribution
                </p>
                <h4 className="mt-1 text-lg font-semibold text-white">AI system inventory</h4>
              </div>
              <span className="text-sm text-[var(--ai-text-secondary)]">24 systems</span>
            </div>

            <dl className="mt-4 space-y-3">
              {[
                { label: "High risk", value: "7", tone: DANGER },
                { label: "Limited risk", value: "9", tone: WARNING },
                { label: "Low risk", value: "6", tone: SUCCESS },
                { label: "Under review", value: "2", tone: BRAND },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-2xl border border-[rgba(36,52,75,0.65)] bg-[rgba(12,22,37,0.86)] px-4 py-3">
                  <dt className="text-sm text-[var(--ai-text-secondary)]">{item.label}</dt>
                  <dd className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.tone }} />
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="rounded-[22px] border border-[rgba(36,52,75,0.7)] bg-[rgba(9,17,31,0.92)] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--ai-text-muted)]">
                  Priority actions
                </p>
                <h4 className="mt-1 text-lg font-semibold text-white">What needs attention now</h4>
              </div>
              <span className="rounded-full border border-[rgba(211,92,92,0.24)] bg-[rgba(211,92,92,0.12)] px-3 py-1 text-xs font-semibold text-[var(--ai-danger)]">
                4 overdue
              </span>
            </div>

            <ul className="mt-4 space-y-3">
              {[
                "Approve oversight plan for Citizen Services assistant",
                "Upload testing evidence for recruitment screening workflow",
                "Complete annual review for marketing content generator",
              ].map((item) => (
                <li key={item} className="rounded-2xl border border-[rgba(36,52,75,0.65)] bg-[rgba(12,22,37,0.86)] px-4 py-3 text-sm leading-6 text-[var(--ai-text-secondary)]">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </section>
  );
}

export default async function WelcomePage() {
  const session = await getSessionSnapshot();
  const primaryHref = session ? "/dashboard" : "/sign-up";
  const primaryLabel = session ? "Explore the platform" : "Start governance assessment";

  return (
    <PublicChrome current="/welcome">
      <main className="pb-14 pt-8 sm:pt-10 lg:pt-12">
        <section className="mx-auto grid max-w-[1360px] gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:px-8">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ai-cyan)]">
              AI governance platform
            </p>
            <h1 className="mt-5 max-w-[11ch] text-5xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl">
              Govern AI with evidence, not assumptions.
            </h1>
            <p className="mt-6 max-w-[640px] text-lg leading-8 text-[var(--ai-text-secondary)]">
              FAICER helps organisations identify, assess, control, and demonstrate responsible AI governance across systems, approvals, policies, evidence, and reporting.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={primaryHref}
                className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
              >
                {primaryLabel}
                <AppIcon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(52,72,98,0.8)] bg-[rgba(10,20,34,0.86)] px-5 py-3 text-sm font-semibold text-white transition hover:border-[rgba(77,140,236,0.48)]"
              >
                View product
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-[var(--ai-text-secondary)] transition hover:text-white"
              >
                Request a demonstration
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {highlights.map((item) => (
                <MetricCard key={item.label} {...item} />
              ))}
            </div>
          </div>

          <DashboardMockup />
        </section>

        <section id="platform" className="mx-auto mt-16 max-w-[1360px] px-4 sm:px-6 lg:mt-20 lg:px-8">
          <div className="max-w-[760px]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ai-cyan)]">
              Product overview
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-[2.8rem]">
              Structured outcomes for serious governance teams
            </h2>
            <p className="mt-4 text-lg leading-8 text-[var(--ai-text-secondary)]">
              FAICER keeps the application recognisable as a working governance platform while making the core journeys clearer, calmer, and easier to trust.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {outcomes.map((item) => (
              <article key={item.title} className="brand-panel rounded-3xl p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(77,140,236,0.26)] bg-[rgba(77,140,236,0.08)] text-[var(--ai-cyan)]">
                  <AppIcon name={item.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">{item.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="governance"
          className="mx-auto mt-16 max-w-[1360px] border-t border-[rgba(36,52,75,0.6)] px-4 pt-16 sm:px-6 lg:mt-20 lg:px-8"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ai-cyan)]">
                Governance workflow
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-[2.8rem]">
                A practical path from register to audit-ready reporting
              </h2>
              <p className="mt-4 text-lg leading-8 text-[var(--ai-text-secondary)]">
                The platform is designed for governance, compliance, risk, and executive users who need clarity without losing operational depth.
              </p>
            </div>

            <div className="grid gap-4">
              {workflow.map((item) => (
                <article key={item.step} className="brand-panel grid gap-4 rounded-3xl p-5 sm:grid-cols-[auto_1fr] sm:items-start">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[rgba(77,140,236,0.28)] bg-[rgba(77,140,236,0.1)] text-sm font-semibold text-[var(--ai-cyan)]">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">{item.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="frameworks"
          className="mx-auto mt-16 max-w-[1360px] border-t border-[rgba(36,52,75,0.6)] px-4 pt-16 sm:px-6 lg:mt-20 lg:px-8"
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {frameworks.map((item) => (
              <article key={item.name} className="brand-panel rounded-3xl p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--ai-cyan)]">
                  {item.name}
                </p>
                <p className="mt-4 text-base leading-7 text-[var(--ai-text-secondary)]">
                  {item.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-[1360px] border-t border-[rgba(36,52,75,0.6)] px-4 pt-16 sm:px-6 lg:mt-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ai-cyan)]">
                Trust and evidence
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-[2.8rem]">
                Build a record that stands up to scrutiny
              </h2>
              <p className="mt-4 text-lg leading-8 text-[var(--ai-text-secondary)]">
                FAICER helps teams move away from disconnected spreadsheets and towards a traceable operating system for AI governance.
              </p>
            </div>

            <div className="grid gap-4">
              {trustAreas.map((item) => (
                <article key={item} className="brand-panel flex items-start gap-4 rounded-3xl p-5">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[rgba(49,180,124,0.28)] bg-[rgba(49,180,124,0.1)] text-[var(--ai-success)]">
                    <AppIcon name="check" className="h-4 w-4" />
                  </span>
                  <p className="text-sm leading-7 text-[var(--ai-text-secondary)]">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-[980px] px-4 text-center sm:px-6 lg:mt-20 lg:px-8">
          <div className="brand-panel rounded-[32px] px-6 py-10 sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ai-cyan)]">
              Final call to action
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-[2.8rem]">
              Start assessing your AI governance posture with confidence
            </h2>
            <p className="mx-auto mt-4 max-w-[720px] text-lg leading-8 text-[var(--ai-text-secondary)]">
              Use FAICER to organise AI systems, evidence, ownership, controls, and reporting into one credible operating model.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href={primaryHref}
                className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white"
              >
                {primaryLabel}
                <AppIcon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-[rgba(52,72,98,0.8)] bg-[rgba(10,20,34,0.86)] px-5 py-3 text-sm font-semibold text-white transition hover:border-[rgba(77,140,236,0.48)]"
              >
                Request a demonstration
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-4 flex max-w-[1360px] flex-col gap-6 border-t border-[rgba(36,52,75,0.6)] px-4 py-8 text-sm text-[var(--ai-text-secondary)] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p>© 2026 FAICER. AI governance platform.</p>
        <nav className="flex flex-wrap gap-5">
          <Link href="/welcome#platform" className="transition hover:text-white">
            Platform
          </Link>
          <Link href="/welcome#frameworks" className="transition hover:text-white">
            Frameworks
          </Link>
          <Link href="/pricing" className="transition hover:text-white">
            Pricing
          </Link>
          <Link href="/docs" className="transition hover:text-white">
            Contact
          </Link>
          <Link href="/docs" className="transition hover:text-white">
            Privacy
          </Link>
          <Link href="/docs" className="transition hover:text-white">
            Terms
          </Link>
        </nav>
      </footer>
    </PublicChrome>
  );
}
