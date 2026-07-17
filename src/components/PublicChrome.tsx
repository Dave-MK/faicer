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
    <div className="min-h-screen bg-[#07111d]">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-30 border-b border-[rgba(36,52,75,0.78)] bg-[rgba(7,17,29,0.88)] backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex min-w-0 items-center gap-8">
              <Link href="/welcome" aria-label="FAICER home" className="transition hover:opacity-90">
                <FaicerLogo variant="lockup" tone="on-dark" className="h-auto" priority />
              </Link>
              <nav className="hidden items-center gap-6 lg:flex">
                {publicNavigation.map((item) => {
                  const isCurrent = current === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm font-medium transition ${
                        isCurrent ? "text-white" : "text-[rgba(175,189,209,0.78)] hover:text-white"
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
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-[rgba(175,189,209,0.78)] transition hover:text-white"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="brand-button-primary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
              >
                Request demo
                <AppIcon name="arrow-right" className="h-4 w-4" />
              </Link>
            </div>
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
    <main className="mx-auto flex min-h-screen max-w-[1240px] items-center px-4 py-4 sm:px-6">
      <div className="grid w-full overflow-hidden rounded-[28px] border border-[var(--ai-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] shadow-[0_24px_80px_rgba(1,8,20,0.42)] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative overflow-hidden border-b border-[var(--ai-border)] bg-[radial-gradient(circle_at_18%_18%,rgba(94,141,222,0.18),transparent_24%),linear-gradient(180deg,#081321_0%,#0c1625_100%)] px-8 py-10 lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
          <div className="relative z-10 max-w-[400px] space-y-8">
            <FaicerLogo variant="lockup" tone="on-dark" className="h-auto w-[174px]" priority />
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--ai-cyan)]">
                {subtitle}
              </p>
              <h1 className="text-4xl font-semibold leading-[1.06] text-white sm:text-5xl">
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
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-[rgba(94,141,222,0.35)] bg-[rgba(18,33,52,0.9)] text-[var(--ai-cyan)]">
                    <AppIcon name="check" className="h-3 w-3" />
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[linear-gradient(180deg,#081321_0%,#0c1625_100%)] px-8 py-10 lg:px-10 lg:py-12">
          {children}
        </section>
      </div>
    </main>
  );
}
