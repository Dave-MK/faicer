import { PublicChrome } from "@/components/PublicChrome";

const publicCards = [
  { title: "Landing page", href: "/welcome" },
  { title: "Pricing page", href: "/pricing" },
  { title: "Log in page", href: "/sign-in" },
  { title: "Sign up page", href: "/sign-up" },
  { title: "Password reset page", href: "/reset-password" },
];

const appCards = [
  { title: "Organisation setup / onboarding", href: "/setup/organisation" },
  { title: "AI tool register list", href: "/tools" },
  { title: "Tool detail page", href: "/tools/tool-chatgpt-brightforge" },
  { title: "AI use cases list", href: "/use-cases" },
  { title: "Governance workflows", href: "/governance" },
  { title: "Evidence & operations suite", href: "/evidence" },
];

function PreviewFrame({ title, href }: { title: string; href: string }) {
  return (
    <article className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(90deg,#6366F1_0%,#5575F2_100%)] text-base font-semibold text-white">
          {title[0]}
        </span>
        <div>
          <p className="text-lg font-semibold text-white">{title}</p>
          <p className="text-sm text-[var(--ai-text-secondary)]">{href}</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-[24px] border border-[var(--ai-border)] bg-[rgba(7,17,32,0.9)] p-3">
        <div className="overflow-hidden rounded-[18px] border border-[rgba(42,45,80,0.56)] bg-[#07091A]">
          <iframe
            src={href}
            title={title}
            className="h-[430px] w-full bg-[#07091A]"
          />
        </div>
      </div>
    </article>
  );
}

export default function DocsPage() {
  return (
    <PublicChrome current="/docs">
      <section className="space-y-12 px-5 py-8 lg:px-7 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div className="space-y-3">
            <p className="brand-eyebrow">Public & app pages</p>
            <h1 className="text-5xl font-semibold tracking-[-0.04em] text-white">
              Design system overview
            </h1>
          </div>
          <p className="max-w-[520px] text-lg leading-8 text-[var(--ai-text-secondary)] lg:justify-self-end">
            A cohesive set of public, authentication, and product pages built with
            the FAICER design system and aligned to the current application
            functionality.
          </p>
        </div>

        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--ai-cyan)]">
            1. Public & auth pages
          </p>
          <div className="grid gap-8 xl:grid-cols-2">
            {publicCards.map((card) => (
              <PreviewFrame key={card.href} title={card.title} href={card.href} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.26em] text-[var(--ai-cyan)]">
            2. Core app workflow
          </p>
          <div className="grid gap-8 xl:grid-cols-2">
            {appCards.map((card) => (
              <PreviewFrame key={card.href} title={card.title} href={card.href} />
            ))}
          </div>
        </section>
      </section>
    </PublicChrome>
  );
}
