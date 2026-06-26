import Link from "next/link";
import { AppIcon } from "@/components/AppIcons";
import { FaicerLogo } from "@/components/FaicerLogo";
import { publicNavigation } from "@/lib/reference-content";

type PublicChromeProps = {
  children: React.ReactNode;
  current?: string;
};

export function PublicChrome({ children, current }: PublicChromeProps) {
  return (
    <div className="min-h-screen" style={{ background: "#080A18" }}>
      <div className="mx-auto max-w-[1480px]">
        <header
          className="flex flex-wrap items-center justify-between gap-6 border-b px-6 py-4 lg:px-10"
          style={{ borderColor: "rgba(42,45,80,0.55)" }}
        >
          <div className="flex items-center gap-10">
            <Link href="/welcome" aria-label="FAICER home" className="transition hover:brightness-110">
              <FaicerLogo variant="lockup" tone="on-dark" className="h-auto" priority />
            </Link>
            <nav className="hidden items-center gap-7 lg:flex">
              {publicNavigation.map((item) => {
                const isCurrent = current === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-[13.5px] font-medium transition ${
                      isCurrent ? "text-white" : "text-[rgba(168,176,204,0.7)] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="rounded-[11px] px-4 py-2.5 text-[13.5px] font-medium text-[rgba(168,176,204,0.7)] transition hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-[11px] px-4 py-2.5 text-[13.5px] font-semibold text-white transition hover:brightness-110"
              style={{
                background: "linear-gradient(90deg,#5B6CF0 0%,#6172E6 100%)",
                boxShadow: "0 6px 24px rgba(99, 102, 241,0.30)",
              }}
            >
              Get Started
            </Link>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

type AuthShellProps = {
  title: string;
  subtitle: string;
  lead: string;
  points: string[];
  children: React.ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  lead,
  points,
  children,
}: AuthShellProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1280px] items-center px-4 py-4 lg:px-6 lg:py-6">
      <div className="grid w-full overflow-hidden rounded-[28px] border border-[var(--ai-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] shadow-[0_24px_80px_rgba(1,8,20,0.55)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden border-b border-[var(--ai-border)] bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.12),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.14),transparent_30%),linear-gradient(180deg,#07091A_0%,#0A0D1C_100%)] px-8 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <div className="absolute left-[-40px] top-[-30px] h-56 w-56 rounded-full border border-[rgba(99,102,241,0.14)]" />
            <div className="absolute left-8 top-10 h-72 w-72 rounded-full border border-[rgba(99,102,241,0.12)]" />
            <div className="absolute left-18 top-18 h-80 w-80 rounded-full border border-[rgba(79,124,245,0.10)]" />
            <div className="absolute left-22 top-24 h-52 w-52 rounded-[28px] border border-[rgba(99,102,241,0.12)] [clip-path:polygon(25%_6%,75%_6%,100%_50%,75%_94%,25%_94%,0_50%)]" />
          </div>

          <div className="relative z-10 max-w-[380px] space-y-8">
            <FaicerLogo
              variant="lockup"
              tone="on-dark"
              className="h-auto w-[174px]"
              priority
            />
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--ai-cyan)]">
                {subtitle}
              </p>
              <h1 className="text-5xl font-semibold leading-[1.04] text-white">
                {title}
              </h1>
              <p className="text-lg leading-8 text-[var(--ai-text-secondary)]">
                {lead}
              </p>
            </div>
            <ul className="space-y-3">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm text-[var(--ai-text-secondary)]"
                >
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(99,102,241,0.35)] bg-[rgba(19,36,61,0.9)] text-[var(--ai-cyan)]">
                    <AppIcon name="check" className="h-3 w-3" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#07091A_0%,#0A0D1C_100%)] px-8 py-10 lg:px-10 lg:py-12">
          {children}
        </section>
      </div>
    </main>
  );
}
