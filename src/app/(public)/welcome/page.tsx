import Link from "next/link";
import { AppIcon } from "@/components/AppIcons";
import { FaicerLogo } from "@/components/FaicerLogo";
import { PublicChrome } from "@/components/PublicChrome";
import { getSessionSnapshot } from "@/lib/auth/session";

/* ── Design tokens ── */
const INDIGO = "#6366F1";
const BLUE = "#5575F2";
const SKY = "#4F7CF5";

/* ── Dashboard UI mockup ── */
function DashboardMockup() {
  const navItems = ["Dashboard", "AI Inventory", "Assessments", "Policies", "Training", "Records"];
  const cards = [
    { label: "Assessments", value: "27", delta: "↑ 4 new" },
    { label: "Training", value: "84%", delta: "↑ 9%" },
    { label: "Open Actions", value: "9", delta: "3 high" },
  ];
  const risks = [
    { label: "Vendor Models", level: "High", color: "#FF5555" },
    { label: "Incomplete DPIA", level: "Medium", color: "#FFA500" },
    { label: "Training Gaps", level: "Medium", color: "#FFA500" },
    { label: "Data Governance", level: "Low", color: SKY },
  ];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: 16,
        border: "1px solid rgba(42,45,80,0.8)",
        background: "#080A18",
        boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.08)",
      }}
    >
      {/* Browser chrome bar */}
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{ background: "#0A0C1C", borderColor: "rgba(42,45,80,0.6)" }}
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FF5F56" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#FFBD2E" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#27C93F" }} />
        <div
          className="mx-3 flex flex-1 items-center gap-1.5 rounded-[6px] px-3 py-1"
          style={{ background: "rgba(42,45,80,0.5)", maxWidth: 280 }}
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 shrink-0 text-[rgba(168,176,204,0.4)]" fill="currentColor">
            <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M3.5 6h5M6 3.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="text-[9px] text-[rgba(168,176,204,0.4)]">app.faicer.io/dashboard</span>
        </div>
      </div>

      {/* App layout */}
      <div className="flex" style={{ height: 420 }}>
        {/* Sidebar */}
        <div
          className="flex shrink-0 flex-col border-r"
          style={{ width: 160, background: "#0A0C1C", borderColor: "rgba(42,45,80,0.5)" }}
        >
          {/* Logo */}
          <div className="border-b px-3 py-3" style={{ borderColor: "rgba(42,45,80,0.4)" }}>
            <FaicerLogo variant="lockup" tone="on-dark" className="scale-[0.7] origin-left" />
          </div>
          {/* Nav */}
          <div className="flex-1 space-y-0.5 p-2">
            {navItems.map((name, i) => (
              <div
                key={name}
                className="flex items-center gap-2 rounded-[7px] px-2.5 py-1.5"
                style={
                  i === 0
                    ? { background: "linear-gradient(90deg,#5B6CF0,#6172E6)" }
                    : { background: "transparent" }
                }
              >
                <div
                  className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ background: i === 0 ? "rgba(255,255,255,0.35)" : "rgba(168,176,204,0.15)" }}
                />
                <div
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${[60, 72, 64, 48, 56, 52][i]}%`,
                    background: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(168,176,204,0.18)",
                  }}
                />
              </div>
            ))}
          </div>
          {/* Upgrade card */}
          <div className="m-2 rounded-[8px] p-2" style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)" }}>
            <div className="mb-1 h-1.5 w-16 rounded-full" style={{ background: "rgba(99,102,241,0.5)" }} />
            <div className="mb-1.5 h-1.5 w-20 rounded-full" style={{ background: "rgba(168,176,204,0.2)" }} />
            <div className="h-4 w-full rounded-[5px]" style={{ border: "1px solid rgba(99,102,241,0.4)" }} />
          </div>
          {/* User */}
          <div className="flex items-center gap-2 border-t px-2.5 py-2.5" style={{ borderColor: "rgba(42,45,80,0.5)" }}>
            <div className="h-5 w-5 shrink-0 rounded-full" style={{ background: "linear-gradient(135deg,#6366F1,#4F7CF5)" }} />
            <div className="flex-1">
              <div className="mb-0.5 h-1.5 w-14 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
              <div className="h-1 w-16 rounded-full" style={{ background: "rgba(168,176,204,0.15)" }} />
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col" style={{ background: "#0B0E1F" }}>
          {/* Header */}
          <div
            className="flex items-center justify-end gap-1.5 border-b px-4 py-2"
            style={{ borderColor: "rgba(42,45,80,0.5)" }}
          >
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-5 w-5 rounded-[5px]" style={{ background: "rgba(42,45,80,0.7)" }} />
            ))}
            <div className="mx-1 h-3 w-px" style={{ background: "rgba(42,45,80,0.8)" }} />
            <div className="h-5 w-20 rounded-[5px]" style={{ background: "rgba(42,45,80,0.7)" }} />
            <div className="h-5 w-24 rounded-[5px]" style={{ background: "rgba(42,45,80,0.7)" }} />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden p-4">
            {/* Title */}
            <div className="mb-3">
              <div className="mb-1 h-3.5 w-36 rounded" style={{ background: "rgba(255,255,255,0.2)" }} />
              <div className="h-2 w-48 rounded" style={{ background: "rgba(168,176,204,0.12)" }} />
            </div>

            {/* Stat cards */}
            <div className="mb-3 grid grid-cols-5 gap-2">
              {/* Compliance ring card */}
              <div className="rounded-[8px] p-2.5" style={{ background: "rgba(14,17,38,0.98)", border: "1px solid rgba(42,45,80,0.65)" }}>
                <div className="mb-1.5 h-1.5 w-14 rounded-full" style={{ background: "rgba(168,176,204,0.2)" }} />
                <div className="flex items-center justify-center py-1">
                  <svg viewBox="0 0 36 36" className="h-10 w-10" aria-hidden="true">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(42,45,80,0.8)" strokeWidth="4"/>
                    <circle cx="18" cy="18" r="14" fill="none" stroke="url(#mg)" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray="72 87.96" transform="rotate(-90 18 18)"/>
                    <defs><linearGradient id="mg"><stop stopColor="#6366F1"/><stop offset="1" stopColor="#4F7CF5"/></linearGradient></defs>
                    <text x="18" y="19.5" textAnchor="middle" fill="white" fontSize="7" fontWeight="700">92%</text>
                    <text x="18" y="26" textAnchor="middle" fill={BLUE} fontSize="4.5">Excellent</text>
                  </svg>
                </div>
                <div className="h-1.5 w-14 rounded-full mx-auto" style={{ background: "rgba(52,211,153,0.35)" }} />
              </div>

              {/* Stat cards */}
              {cards.map((c) => (
                <div key={c.label} className="rounded-[8px] p-2.5" style={{ background: "rgba(14,17,38,0.98)", border: "1px solid rgba(42,45,80,0.65)" }}>
                  <div className="mb-1.5 flex items-center gap-1">
                    <div className="h-2 w-2 rounded-[3px]" style={{ background: "rgba(99,102,241,0.3)" }} />
                    <div className="h-1.5 w-10 rounded-full" style={{ background: "rgba(168,176,204,0.2)" }} />
                  </div>
                  <p className="text-[13px] font-bold text-white leading-none">{c.value}</p>
                  <p className="mt-0.5 text-[8px]" style={{ color: "rgba(52,211,153,0.8)" }}>{c.delta}</p>
                  {/* sparkline */}
                  <svg viewBox="0 0 60 16" className="mt-1.5 w-full" preserveAspectRatio="none">
                    <path d="M0 12 C10 10, 20 8, 30 5 C40 2, 50 1, 60 0" fill="none" stroke={INDIGO} strokeWidth="1.2" strokeLinecap="round"/>
                    <path d="M0 12 C10 10, 20 8, 30 5 C40 2, 50 1, 60 0 L60 16 L0 16 Z" fill="rgba(99,102,241,0.08)"/>
                  </svg>
                </div>
              ))}

              {/* Risk level card */}
              <div className="rounded-[8px] p-2.5" style={{ background: "rgba(14,17,38,0.98)", border: "1px solid rgba(42,45,80,0.65)" }}>
                <div className="mb-1 h-1.5 w-10 rounded-full" style={{ background: "rgba(168,176,204,0.2)" }} />
                <div className="flex items-center justify-center my-1">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round">
                    <path d="M12 2.5L20 6.5v7C20 18 16.5 21 12 22.5C7.5 21 4 18 4 13.5v-7L12 2.5Z"/>
                  </svg>
                </div>
                <p className="text-center text-[10px] font-bold" style={{ color: BLUE }}>Moderate</p>
                <div className="mt-1.5 h-1 w-full rounded-full" style={{ background: "rgba(42,45,80,0.8)" }}>
                  <div className="h-1 w-[55%] rounded-full" style={{ background: `linear-gradient(90deg,${INDIGO},${SKY})` }} />
                </div>
              </div>
            </div>

            {/* Bottom panels */}
            <div className="grid grid-cols-3 gap-2">
              {/* Chart */}
              <div className="rounded-[8px] p-2.5" style={{ background: "rgba(14,17,38,0.98)", border: "1px solid rgba(42,45,80,0.65)", height: 140 }}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="h-1.5 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                  <div className="h-3 w-14 rounded-[4px]" style={{ background: "rgba(42,45,80,0.7)" }} />
                </div>
                <svg viewBox="0 0 140 70" className="w-full mt-1" aria-hidden="true">
                  <line x1="10" y1="10" x2="130" y2="10" stroke="rgba(42,45,80,0.5)" strokeWidth="0.5"/>
                  <line x1="10" y1="28" x2="130" y2="28" stroke="rgba(42,45,80,0.5)" strokeWidth="0.5"/>
                  <line x1="10" y1="46" x2="130" y2="46" stroke="rgba(42,45,80,0.5)" strokeWidth="0.5"/>
                  <path d="M10 58 C30 50, 50 42, 70 32 C90 22, 110 14, 130 10" fill="none" stroke={INDIGO} strokeWidth="1.8" strokeLinecap="round"/>
                  <path d="M10 58 C30 50, 50 42, 70 32 C90 22, 110 14, 130 10 L130 65 L10 65 Z" fill="rgba(99,102,241,0.10)"/>
                  <circle cx="130" cy="10" r="3" fill={INDIGO} stroke="#0B0E1F" strokeWidth="1.2"/>
                  {["Apr", "May", "Jun"].map((l, i) => (
                    <text key={l} x={20 + i * 55} y="70" fill="rgba(107,114,128,0.9)" fontSize="7" textAnchor="middle">{l}</text>
                  ))}
                </svg>
                <div className="mt-1 flex gap-2">
                  {[["#22C55E","Excellent"],["#EAB308","Needs Work"]].map(([c, l]) => (
                    <div key={l} className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: c }} />
                      <span className="text-[7px]" style={{ color: "rgba(168,176,204,0.55)" }}>{l}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-1.5 h-4 w-full rounded-[4px]" style={{ border: "1px solid rgba(99,102,241,0.3)" }} />
              </div>

              {/* Top Risks */}
              <div className="rounded-[8px] p-2.5" style={{ background: "rgba(14,17,38,0.98)", border: "1px solid rgba(42,45,80,0.65)", height: 140 }}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="h-1.5 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                  <div className="h-1.5 w-8 rounded-full" style={{ background: "rgba(99,102,241,0.4)" }} />
                </div>
                {risks.map((r) => (
                  <div key={r.label} className="mb-1.5 flex items-center gap-1.5 rounded-[4px] px-1.5 py-1" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(42,45,80,0.5)" }}>
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: r.color }} />
                    <div className="h-1.5 flex-1 rounded-full" style={{ background: "rgba(168,176,204,0.15)" }} />
                    <span
                      className="rounded-[3px] px-1 py-0.5 text-[6px] font-medium"
                      style={{ background: `${r.color}20`, color: r.color }}
                    >{r.level}</span>
                  </div>
                ))}
                <div className="mt-1 h-3.5 w-full rounded-[4px]" style={{ border: "1px solid rgba(99,102,241,0.3)" }} />
              </div>

              {/* Next Steps */}
              <div className="rounded-[8px] p-2.5" style={{ background: "rgba(14,17,38,0.98)", border: "1px solid rgba(42,45,80,0.65)", height: 140 }}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="h-1.5 w-14 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
                  <div className="h-1.5 w-8 rounded-full" style={{ background: "rgba(99,102,241,0.4)" }} />
                </div>
                {[["High","#FF5555"],["Medium","#FFA500"],["Low",SKY]].map(([l,c]) => (
                  <div key={l} className="mb-1.5 flex items-start gap-1.5 rounded-[4px] px-1.5 py-1" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(42,45,80,0.5)" }}>
                    <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-[2px]" style={{ background: `${c}30`, border: `1px solid ${c}` }} />
                    <div className="flex-1">
                      <div className="mb-0.5 h-1.5 w-full rounded-full" style={{ background: "rgba(168,176,204,0.15)" }} />
                      <div className="h-1 w-8 rounded-full" style={{ background: "rgba(168,176,204,0.1)" }} />
                    </div>
                    <span className="rounded-[3px] px-1 py-0.5 text-[6px] font-medium" style={{ background: `${c}20`, color: c }}>{l}</span>
                  </div>
                ))}
                <div className="mt-1 h-3.5 w-full rounded-[4px]" style={{ border: "1px solid rgba(99,102,241,0.3)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow overlay at bottom to fade out */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
        style={{ background: "linear-gradient(to top, rgba(8,10,24,0.9), transparent)" }}
      />
    </div>
  );
}

/* ── Stat bar ── */
const stats = [
  { value: "500+", label: "AI tools registered" },
  { value: "98%", label: "Compliance success rate" },
  { value: "50+", label: "Policy templates" },
  { value: "10+", label: "Frameworks supported" },
];

/* ── Feature cards ── */
const features = [
  {
    icon: "register" as const,
    badge: "Inventory",
    title: "Know what AI you use",
    copy: "Register every AI tool and use case with structured risk classification. Track approvals, business units, and compliance status in a single source of truth.",
    tags: ["Tool register", "Risk mapping", "Approval workflow"],
  },
  {
    icon: "governance" as const,
    badge: "Governance",
    title: "Govern with confidence",
    copy: "Create and enforce AI policies with mandatory staff acknowledgement. Link controls, assign owners, and demonstrate accountability to regulators and auditors.",
    tags: ["Policy builder", "EU AI Act", "ISO 42001"],
  },
  {
    icon: "training" as const,
    badge: "Training",
    title: "Educate your whole team",
    copy: "Role-based AI literacy courses with completion tracking. Staff know what they can use, how to use it safely, and what to report if something goes wrong.",
    tags: ["Courses", "Completions", "Awareness"],
  },
  {
    icon: "evidence" as const,
    badge: "Records",
    title: "Audit-ready at all times",
    copy: "Collect, organise, and version every compliance artefact. When an auditor asks for proof, you have it — indexed, timestamped, and tamper-evident.",
    tags: ["Evidence vault", "Audit trail", "Artefacts"],
  },
  {
    icon: "assessments" as const,
    badge: "Assessment",
    title: "Score and close the gaps",
    copy: "Run structured conformity assessments against EU AI Act, ISO 42001, and your own frameworks. Get scored results and actionable remediation steps.",
    tags: ["Gap analysis", "Scoring", "Remediation"],
  },
  {
    icon: "reports" as const,
    badge: "Reports",
    title: "Prove compliance instantly",
    copy: "Generate board-ready compliance reports and evidence packs at the click of a button. Stop assembling spreadsheets — export a complete audit package.",
    tags: ["Reporting", "Evidence packs", "Dashboards"],
  },
];

/* ── Process steps ── */
const steps = [
  {
    num: "01",
    icon: "register" as const,
    title: "Register",
    copy: "Inventory every AI tool and use case with structured metadata, risk classification, and ownership.",
  },
  {
    num: "02",
    icon: "governance" as const,
    title: "Govern",
    copy: "Apply policies, assign roles, link controls to each use case, and enforce accountability across your organisation.",
  },
  {
    num: "03",
    icon: "evidence" as const,
    title: "Evidence",
    copy: "Collect audit artefacts, track training completion, run assessments, and log incidents with a full activity trail.",
  },
  {
    num: "04",
    icon: "reports" as const,
    title: "Prove",
    copy: "Generate compliance reports and demonstrate accountability to regulators, auditors, and stakeholders — in minutes.",
  },
];

/* ── Pricing tiers ── */
const plans = [
  {
    name: "Starter",
    price: "£49",
    period: "/mo",
    desc: "For small teams getting started with AI governance.",
    cta: "Start free trial",
    ctaHref: "/sign-up",
    primary: false,
    features: [
      "Up to 5 AI tools",
      "Policy library access",
      "Basic risk register",
      "3 training modules",
      "Standard reports",
    ],
  },
  {
    name: "Professional",
    price: "£149",
    period: "/mo",
    desc: "For growing organisations that need full coverage.",
    cta: "Start free trial",
    ctaHref: "/sign-up",
    primary: true,
    features: [
      "Unlimited AI tools",
      "Full policy builder",
      "Advanced risk & assessments",
      "Unlimited training modules",
      "Custom reports & evidence packs",
      "EU AI Act & ISO 42001 templates",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large organisations with complex requirements.",
    cta: "Contact sales",
    ctaHref: "/pricing",
    primary: false,
    features: [
      "Everything in Professional",
      "Multi-entity / group structure",
      "Custom frameworks & workflows",
      "Dedicated account manager",
      "SLA & priority support",
    ],
  },
];

/* ── Page ── */
export default async function WelcomePage() {
  const session = await getSessionSnapshot();

  return (
    <PublicChrome current="/welcome">

      {/* ═══════════════════════════════ HERO ══════════════════════════════════ */}
      <section className="relative overflow-hidden px-6 pb-12 pt-16 lg:px-10 lg:pb-16 lg:pt-20">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${INDIGO}, transparent 70%)`, filter: "blur(60px)" }} />
          <div className="absolute right-1/4 top-10 h-96 w-96 translate-x-1/2 rounded-full opacity-20" style={{ background: `radial-gradient(circle, ${SKY}, transparent 70%)`, filter: "blur(80px)" }} />
        </div>

        <div className="relative mx-auto grid max-w-[1360px] gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Left copy */}
          <div className="flex flex-col gap-7">
            {/* Badge */}
            <span
              className="inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.2em]"
              style={{
                background: "rgba(99,102,241,0.10)",
                border: "1px solid rgba(99,102,241,0.25)",
                color: INDIGO,
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: INDIGO }} />
              Built for AI-forward SMEs
            </span>

            {/* Headline */}
            <h1 className="text-[3.2rem] font-black leading-[1.04] tracking-[-0.04em] text-white lg:text-[4rem]">
              AI Compliance.{" "}
              <span
                className="block bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${INDIGO} 0%, ${BLUE} 50%, ${SKY} 100%)` }}
              >
                Simplified.
              </span>
            </h1>

            {/* Sub-copy */}
            <p className="max-w-[500px] text-[16px] leading-[1.8] text-[rgba(168,176,204,0.75)]">
              FAICER gives SMEs everything they need to govern AI use responsibly — from tool registration and risk assessment to policy management, staff training, and audit-ready evidence. One platform. Permanent compliance readiness.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href={session ? "/dashboard" : "/sign-up"}
                className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3.5 text-[14px] font-bold text-white transition hover:brightness-110"
                style={{
                  background: `linear-gradient(90deg, #5B6CF0 0%, #6172E6 100%)`,
                  boxShadow: "0 8px 32px rgba(99, 102, 241,0.35)",
                }}
              >
                {session ? "Open Dashboard" : "Start for free"}
                <AppIcon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-[12px] border px-6 py-3.5 text-[14px] font-semibold text-white transition hover:border-[rgba(99,102,241,0.5)] hover:bg-[rgba(99,102,241,0.06)]"
                style={{ borderColor: "rgba(42,45,80,0.8)", background: "rgba(11,14,31,0.6)" }}
              >
                View pricing
              </Link>
            </div>

            {/* Framework badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: "EU AI Act", href: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai" },
                { label: "ISO 42001", href: "https://www.iso.org/standard/81230.html" },
                { label: "GDPR", href: "https://gdpr.eu/" },
                { label: "SOC 2", href: "https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2" },
                { label: "UK ICO", href: "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/" },
              ].map((f) => (
                <a
                  key={f.label}
                  href={f.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[rgba(40,49,67,0.7)] bg-white/[0.04] px-3 py-1 text-[11.5px] font-medium text-[rgba(168,176,204,0.65)] transition hover:border-[rgba(99,102,241,0.55)] hover:text-white"
                >
                  {f.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: dashboard mockup */}
          <div className="relative">
            <DashboardMockup />
            {/* Side glow */}
            <div
              className="pointer-events-none absolute -right-12 top-1/2 h-80 w-40 -translate-y-1/2 rounded-full opacity-20"
              style={{ background: `radial-gradient(circle, ${BLUE}, transparent 70%)`, filter: "blur(40px)" }}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ STATS BAR ═════════════════════════════ */}
      <div
        className="border-y"
        style={{ borderColor: "rgba(42,45,80,0.55)", background: "rgba(255,255,255,0.015)" }}
      >
        <div className="mx-auto grid max-w-[1360px] grid-cols-2 divide-x divide-[rgba(42,45,80,0.4)] lg:grid-cols-4 px-6 lg:px-10">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center py-6 px-4 text-center">
              <p
                className="text-[28px] font-black tracking-[-0.04em]"
                style={{ backgroundImage: `linear-gradient(90deg, ${INDIGO}, ${BLUE})`, backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent" }}
              >
                {s.value}
              </p>
              <p className="mt-1 text-[12.5px] text-[rgba(168,176,204,0.55)]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════ FEATURES ══════════════════════════════ */}
      <section id="features" className="px-6 py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: INDIGO }}>
              Platform modules
            </p>
            <h2 className="mb-4 text-[2.2rem] font-black tracking-[-0.03em] text-white">
              Everything you need to govern AI{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${INDIGO}, ${BLUE})` }}>
                responsibly
              </span>
            </h2>
            <p className="mx-auto max-w-[560px] text-[15px] leading-[1.8] text-[rgba(168,176,204,0.65)]">
              Six integrated modules that take you from chaos to compliance — covering every aspect of AI governance your organisation needs.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.title}
                className="group flex flex-col rounded-[20px] p-6 transition-all hover:translate-y-[-2px]"
                style={{
                  background: "linear-gradient(180deg, rgba(14,17,38,0.98) 0%, rgba(10,13,30,0.98) 100%)",
                  border: "1px solid rgba(42,45,80,0.65)",
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-[12px]"
                    style={{
                      background: "rgba(99,102,241,0.10)",
                      border: "1px solid rgba(99,102,241,0.2)",
                    }}
                  >
                    <AppIcon name={f.icon} className="h-5 w-5 text-[#6366F1]" />
                  </div>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em]"
                    style={{ background: "rgba(99,102,241,0.12)", color: BLUE }}
                  >
                    {f.badge}
                  </span>
                </div>
                <h3 className="mb-2 text-[17px] font-bold text-white">{f.title}</h3>
                <p className="mb-5 flex-1 text-[13.5px] leading-[1.7] text-[rgba(168,176,204,0.6)]">{f.copy}</p>
                <div className="flex flex-wrap gap-1.5 border-t pt-4" style={{ borderColor: "rgba(42,45,80,0.5)" }}>
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full px-2.5 py-1 text-[10.5px]"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(42,45,80,0.6)", color: "rgba(168,176,204,0.55)" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              href={session ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 rounded-[12px] px-6 py-3.5 text-[14px] font-bold text-white transition hover:brightness-110"
              style={{
                background: `linear-gradient(90deg, #5B6CF0 0%, #6172E6 100%)`,
                boxShadow: "0 8px 32px rgba(99, 102, 241,0.30)",
              }}
            >
              {session ? "Open Dashboard" : "Get started free"}
              <AppIcon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ PROCESS ═══════════════════════════════ */}
      <section
        id="process"
        className="border-t px-6 py-16 lg:px-10 lg:py-20"
        style={{ borderColor: "rgba(42,45,80,0.55)", background: "rgba(255,255,255,0.012)" }}
      >
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: INDIGO }}>
              How it works
            </p>
            <h2 className="mb-4 text-[2.2rem] font-black tracking-[-0.03em] text-white">
              From setup to{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${INDIGO}, ${BLUE})` }}>
                audit-ready
              </span>{" "}
              in days
            </h2>
            <p className="mx-auto max-w-[480px] text-[15px] leading-[1.8] text-[rgba(168,176,204,0.65)]">
              Four simple stages that build a complete, defensible AI compliance programme — without the complexity.
            </p>
          </div>

          <div className="relative grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {/* Connector line */}
            <div
              className="absolute top-10 left-[12.5%] right-[12.5%] hidden h-px xl:block"
              style={{ background: `linear-gradient(90deg, transparent, ${INDIGO}40, ${BLUE}40, transparent)` }}
            />
            {steps.map((s, i) => (
              <div key={s.num} className="relative flex flex-col items-center text-center">
                <div
                  className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-[18px]"
                  style={{
                    background: `linear-gradient(135deg, ${INDIGO}18, ${SKY}18)`,
                    border: "1px solid rgba(99,102,241,0.25)",
                  }}
                >
                  <AppIcon name={s.icon} className="h-7 w-7 text-[#6366F1]" />
                  <span
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white"
                    style={{ background: `linear-gradient(135deg, ${INDIGO}, ${SKY})` }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-[18px] font-bold text-white">{s.title}</h3>
                <p className="text-[13.5px] leading-[1.7] text-[rgba(168,176,204,0.6)]">{s.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ PRICING ═══════════════════════════════ */}
      <section className="border-t px-6 py-16 lg:px-10 lg:py-20" style={{ borderColor: "rgba(42,45,80,0.55)" }}>
        <div className="mx-auto max-w-[1360px]">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em]" style={{ color: INDIGO }}>
              Pricing
            </p>
            <h2 className="mb-4 text-[2.2rem] font-black tracking-[-0.03em] text-white">
              Simple,{" "}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(90deg, ${INDIGO}, ${BLUE})` }}>
                transparent
              </span>{" "}
              pricing
            </h2>
            <p className="mx-auto max-w-[420px] text-[15px] leading-[1.8] text-[rgba(168,176,204,0.65)]">
              Start with a free trial. No credit card required. Upgrade when you&apos;re ready.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className="relative flex flex-col rounded-[20px] p-6"
                style={{
                  background: plan.primary
                    ? `linear-gradient(180deg, rgba(25,15,50,0.98) 0%, rgba(18,10,40,0.98) 100%)`
                    : "linear-gradient(180deg, rgba(14,17,38,0.98) 0%, rgba(10,13,30,0.98) 100%)",
                  border: plan.primary
                    ? `1px solid rgba(99,102,241,0.45)`
                    : "1px solid rgba(42,45,80,0.65)",
                  boxShadow: plan.primary ? "0 0 40px rgba(99,102,241,0.12)" : "none",
                }}
              >
                {plan.primary && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white"
                    style={{ background: `linear-gradient(90deg, ${INDIGO}, ${BLUE})` }}
                  >
                    Most popular
                  </div>
                )}
                <p className="mb-1 text-[13px] font-semibold text-[rgba(168,176,204,0.7)]">{plan.name}</p>
                <div className="mb-2 flex items-end gap-1">
                  <span className="text-[36px] font-black tracking-[-0.04em] text-white">{plan.price}</span>
                  {plan.period && <span className="mb-1.5 text-[14px] text-[rgba(168,176,204,0.5)]">{plan.period}</span>}
                </div>
                <p className="mb-5 text-[13px] text-[rgba(168,176,204,0.55)]">{plan.desc}</p>
                <ul className="mb-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-[rgba(168,176,204,0.75)]">
                      <span
                        className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)" }}
                      >
                        <AppIcon name="check" className="h-2.5 w-2.5 text-[#6366F1]" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref}
                  className="flex items-center justify-center gap-2 rounded-[12px] py-3 text-[14px] font-bold transition"
                  style={
                    plan.primary
                      ? {
                          background: `linear-gradient(90deg, #5B6CF0 0%, #6172E6 100%)`,
                          color: "#fff",
                          boxShadow: "0 6px 24px rgba(99, 102, 241,0.30)",
                        }
                      : {
                          border: "1px solid rgba(42,45,80,0.8)",
                          color: "rgba(168,176,204,0.8)",
                          background: "rgba(255,255,255,0.03)",
                        }
                  }
                >
                  {plan.cta}
                  <AppIcon name="arrow-right" className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[12.5px] text-[rgba(168,176,204,0.4)]">
            All plans include a 14-day free trial. No credit card required.{" "}
            <Link href="/pricing" className="underline transition hover:text-white" style={{ color: "rgba(168,176,204,0.6)" }}>
              View full feature comparison →
            </Link>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════ CTA BAND ══════════════════════════════ */}
      <section
        className="relative overflow-hidden border-t px-6 py-16 text-center lg:px-10"
        style={{ borderColor: "rgba(42,45,80,0.55)" }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, rgba(99,102,241,0.08), transparent 55%)" }} />
        </div>
        <div className="relative mx-auto max-w-[680px]">
          <FaicerLogo variant="lockup" tone="on-dark" className="mx-auto mb-8 justify-center" />
          <h2 className="mb-4 text-[2rem] font-black tracking-[-0.03em] text-white">
            Start your AI compliance journey today
          </h2>
          <p className="mb-8 text-[15px] leading-[1.8] text-[rgba(168,176,204,0.65)]">
            Join forward-thinking SMEs using FAICER to govern AI use responsibly, stay audit-ready, and demonstrate accountability to regulators and stakeholders.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href={session ? "/dashboard" : "/sign-up"}
              className="inline-flex items-center gap-2 rounded-[12px] px-7 py-4 text-[15px] font-bold text-white transition hover:brightness-110"
              style={{
                background: `linear-gradient(90deg, #5B6CF0 0%, #6172E6 100%)`,
                boxShadow: "0 8px 40px rgba(99, 102, 241,0.35)",
              }}
            >
              {session ? "Open Dashboard" : "Get started — it's free"}
              <AppIcon name="arrow-right" className="h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-[12px] border px-7 py-4 text-[15px] font-semibold text-white transition hover:border-[rgba(99,102,241,0.4)]"
              style={{ borderColor: "rgba(42,45,80,0.8)", background: "rgba(11,14,31,0.6)" }}
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════ FOOTER ════════════════════════════════ */}
      <footer className="border-t px-6 py-8 lg:px-10" style={{ borderColor: "rgba(42,45,80,0.55)" }}>
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <FaicerLogo variant="lockup" tone="on-dark" className="opacity-70" />
            <span className="text-[12px] text-[rgba(168,176,204,0.3)]">© 2025 FAICER. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap gap-6 text-[12.5px] text-[rgba(168,176,204,0.45)]">
            {[
              { label: "Privacy", href: "/docs" },
              { label: "Terms", href: "/docs" },
              { label: "Pricing", href: "/pricing" },
              { label: "Sign in", href: "/sign-in" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="transition hover:text-white">{l.label}</Link>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 text-[11px] text-[rgba(168,176,204,0.35)] uppercase tracking-[0.15em]">
            {["EU AI Act", "ISO 42001", "GDPR Ready", "Audit Ready"].map((b) => (
              <span key={b}>{b}</span>
            ))}
          </div>
        </div>
      </footer>

    </PublicChrome>
  );
}
