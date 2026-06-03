import Link from "next/link";
import { AppIcon } from "@/components/AppIcons";
import { PublicChrome } from "@/components/PublicChrome";
import { getSessionSnapshot } from "@/lib/auth/session";

const featureCards = [
  {
    title: "Capture AI Activity",
    copy: "Automatically collect and centralize AI use across tools and teams.",
  },
  {
    title: "Enforce Policy",
    copy: "Apply guardrails and controls that reflect your risk posture.",
  },
  {
    title: "Prove Compliance",
    copy: "Generate audit-ready evidence and maintain continuous compliance.",
  },
  {
    title: "Build Trust",
    copy: "Demonstrate responsible AI use to stakeholders, auditors, and customers.",
  },
];

const trustLogos = [
  "Acme Global",
  "TrustBank",
  "Nexus Cloud",
  "DataCore",
  "Vertex Systems",
];

export default async function WelcomePage() {
  const session = await getSessionSnapshot();

  return (
    <PublicChrome current="/welcome">
      <section className="grid gap-8 px-5 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-7 lg:py-8">
        <div className="space-y-8">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(76,104,255,0.34)] bg-[rgba(19,36,61,0.9)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ai-cyan)]">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(0,212,255,0.14)] text-[var(--ai-cyan)]">
                <AppIcon name="shield" className="h-3 w-3" />
              </span>
              AI governance platform
            </span>
            <h1 className="max-w-[620px] text-[3.55rem] font-semibold leading-[1.04] tracking-[-0.04em] text-white">
              Governance. Evidence. Trust.
            </h1>
            <p className="max-w-[560px] text-xl leading-8 text-[var(--ai-text-secondary)]">
              Record and govern AI use across your organization. AI Ledger helps
              security, risk, and compliance teams capture activity, manage
              policy, and prove accountability.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={session ? "/dashboard" : "/sign-up"}
              className="brand-button-primary inline-flex items-center rounded-xl px-5 py-3.5 text-sm font-semibold transition"
            >
              {session ? "Open dashboard" : "Get Started"}
            </Link>
            <Link
              href="/pricing"
              className="brand-button-secondary inline-flex items-center rounded-xl px-5 py-3.5 text-sm font-semibold transition"
            >
              Request a Demo
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="brand-panel-soft rounded-[22px] px-5 py-5"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(76,104,255,0.16)] text-[var(--ai-cyan)]">
                  <AppIcon name="controls" className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-white">{card.title}</h2>
                <p className="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">
                  {card.copy}
                </p>
              </article>
            ))}
          </div>

          <div className="brand-panel-soft rounded-[22px] px-5 py-5">
            <p className="text-sm text-[var(--ai-text-secondary)]">
              Trusted by security, risk, and compliance teams
            </p>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-white/86">
              {trustLogos.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="brand-panel-highlight rounded-[28px] p-5 lg:p-6">
          <div className="overflow-hidden rounded-[24px] border border-[rgba(42,75,115,0.64)] bg-[linear-gradient(180deg,#071120_0%,#091527_100%)]">
            <div className="flex items-center justify-between border-b border-[var(--ai-border)] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[rgba(17,31,54,0.88)]">
                  <AppIcon name="overview" className="h-4 w-4 text-[var(--ai-cyan)]" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">AI Ledger</p>
                  <p className="text-xs text-[var(--ai-text-muted)]">Acme Global</p>
                </div>
              </div>
              <AppIcon name="chevron" className="h-4 w-4 text-[var(--ai-text-muted)]" />
            </div>

            <div className="grid gap-4 p-4">
              <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                <div className="brand-panel-soft rounded-[22px] px-5 py-5">
                  <p className="text-sm text-[var(--ai-text-secondary)]">Governance Health</p>
                  <div className="mt-5 flex items-center gap-5">
                    <div className="dashboard-ring h-32 w-32">
                      <div className="text-center">
                        <p className="text-4xl font-semibold text-white">91</p>
                        <p className="text-sm text-[var(--ai-text-secondary)]">/100</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-base font-semibold text-[var(--ai-success)]">
                        Excellent
                      </p>
                      <p className="text-sm text-[var(--ai-success)]">+16 vs last 30 days</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  {[
                    ["Policies", "156"],
                    ["Controls", "412"],
                    ["Evidence Items", "3,677"],
                  ].map(([label, value]) => (
                    <article
                      key={label}
                      className="brand-panel-soft rounded-[22px] px-5 py-4"
                    >
                      <p className="text-sm text-[var(--ai-text-secondary)]">{label}</p>
                      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
                      <p className="mt-1 text-sm text-[var(--ai-success)]">+ 18%</p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <article className="brand-panel-soft rounded-[22px] px-5 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">Evidence Status</p>
                      <p className="mt-1 text-sm text-[var(--ai-text-secondary)]">
                        Total evidence items
                      </p>
                    </div>
                    <p className="text-xl font-semibold text-white">3,677</p>
                  </div>
                  <div className="mt-4 h-3 rounded-full bg-[rgba(20,33,57,0.92)]">
                    <div className="h-3 w-[72%] rounded-full bg-[linear-gradient(90deg,#00d4ff_0%,#1c65ff_100%)]" />
                  </div>
                </article>

                <article className="brand-panel-soft rounded-[22px] px-5 py-5">
                  <div className="flex items-center gap-5">
                    <div className="dashboard-ring h-28 w-28">
                      <div className="text-center">
                        <p className="text-3xl font-semibold text-white">83%</p>
                        <p className="text-sm text-[var(--ai-text-secondary)]">Overall</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-[var(--ai-text-secondary)]">
                      <p>Data Privacy 91%</p>
                      <p>Access Control 86%</p>
                      <p>Vendor Management 80%</p>
                      <p>Change Management 76%</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicChrome>
  );
}
