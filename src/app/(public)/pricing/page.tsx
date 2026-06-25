import Link from "next/link";
import { AppIcon } from "@/components/AppIcons";
import { PublicChrome } from "@/components/PublicChrome";

const plans = [
  {
    name: "Starter",
    subtitle: "For small teams getting started",
    price: "$19",
    meta: "per user / month",
    features: [
      "AI activity capture",
      "Basic policy templates",
      "Evidence dashboard",
      "Email support",
    ],
  },
  {
    name: "Professional",
    subtitle: "For growing organizations",
    price: "$49",
    meta: "per user / month",
    features: [
      "Everything in Starter",
      "Advanced policies",
      "Risk assessments",
      "Integrations",
      "Priority email support",
    ],
    featured: true,
  },
  {
    name: "Business",
    subtitle: "For scaling teams",
    price: "$89",
    meta: "per user / month",
    features: [
      "Everything in Professional",
      "Advanced controls",
      "Custom reports",
      "SSO & SCIM",
      "Phone support",
    ],
  },
  {
    name: "Enterprise",
    subtitle: "For large organizations",
    price: "Custom",
    meta: "Contact us for pricing",
    features: [
      "Everything in Business",
      "Custom integrations",
      "Dedicated success manager",
      "SLA & uptime guarantees",
      "On-prem / VPC options",
    ],
  },
];

export default function PricingPage() {
  return (
    <PublicChrome current="/pricing">
      <section className="px-5 py-10 lg:px-7">
        <div className="mx-auto max-w-[1040px] text-center">
          <h1 className="text-5xl font-semibold tracking-[-0.04em] text-white">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-[var(--ai-text-secondary)]">
            Choose the right plan for your organization.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--ai-border)] bg-[rgba(11,23,42,0.72)] p-1.5">
            <button className="rounded-full bg-[rgba(17,31,54,0.95)] px-4 py-2 text-sm font-medium text-white">
              Monthly
            </button>
            <button className="rounded-full px-4 py-2 text-sm font-medium text-[var(--ai-text-secondary)]">
              Annual
            </button>
            <span className="rounded-full bg-[rgba(99,102,241,0.12)] px-3 py-2 text-xs font-semibold text-[var(--ai-cyan)]">
              Save 20% with annual billing
            </span>
          </div>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative rounded-[24px] border p-6 ${
                plan.featured
                  ? "border-[rgba(99,102,241,0.50)] bg-[linear-gradient(180deg,rgba(42,15,60,0.95),rgba(20,8,35,0.98))] shadow-[0_18px_50px_rgba(99,102,241,0.24)]"
                  : "border-[var(--ai-border)] bg-[linear-gradient(180deg,rgba(11,23,42,0.98),rgba(8,17,31,0.98))]"
              }`}
            >
              {plan.featured ? (
                <span className="absolute -top-3 left-6 rounded-full bg-[linear-gradient(90deg,#6366F1_0%,#5575F2_100%)] px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              ) : null}
              <p className="text-xl font-semibold text-white">{plan.name}</p>
              <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">{plan.subtitle}</p>
              <div className="mt-6">
                <p className="text-5xl font-semibold text-white">{plan.price}</p>
                <p className="mt-2 text-sm text-[var(--ai-text-secondary)]">{plan.meta}</p>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-[var(--ai-text-secondary)]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(99,102,241,0.12)] text-[var(--ai-cyan)]">
                      <AppIcon name="check" className="h-3 w-3" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  plan.featured ? "brand-button-primary" : "brand-button-secondary"
                }`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Link>
            </article>
          ))}
        </div>

        <div className="brand-panel-soft mt-8 flex flex-wrap items-center justify-center gap-8 rounded-[22px] px-6 py-5 text-sm text-[var(--ai-text-secondary)]">
          <span className="inline-flex items-center gap-2">
            <AppIcon name="shield" className="h-4 w-4 text-[var(--ai-cyan)]" />
            SOC 2 Type II
          </span>
          <span className="inline-flex items-center gap-2">
            <AppIcon name="check" className="h-4 w-4 text-[var(--ai-cyan)]" />
            GDPR Ready
          </span>
          <span className="inline-flex items-center gap-2">
            <AppIcon name="activity" className="h-4 w-4 text-[var(--ai-cyan)]" />
            99.9% Uptime
          </span>
          <span className="inline-flex items-center gap-2">
            <AppIcon name="controls" className="h-4 w-4 text-[var(--ai-cyan)]" />
            Encrypted Data
          </span>
        </div>
      </section>
    </PublicChrome>
  );
}
