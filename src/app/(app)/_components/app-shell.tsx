import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { AppIcon } from "@/components/AppIcons";
import { AILedgerLogo } from "@/components/AILedgerLogo";
import { appNavigation, staffNavigation } from "@/lib/reference-content";
import type { MembershipRole } from "@/lib/types";

type AppShellProps = {
  current:
    | "overview"
    | "register"
    | "use-cases"
    | "governance"
    | "policies"
    | "evidence"
    | "risks"
    | "assessments"
    | "controls"
    | "incidents"
    | "reports"
    | "integrations"
    | "approved-tools"
    | "my-policies"
    | "training"
    | "my-activity"
    | "help"
    | "settings";
  organisationName: string;
  userDisplayName: string;
  role: MembershipRole;
  children: React.ReactNode;
};

export function AppShell({
  current,
  organisationName,
  userDisplayName,
  role,
  children,
}: AppShellProps) {
  const initials = userDisplayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const navigation = role === "staff" ? staffNavigation : appNavigation;

  return (
    <div className="app-frame min-h-screen p-4 lg:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1480px] overflow-hidden rounded-[28px] border border-[var(--ai-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] shadow-[0_24px_80px_rgba(1,8,20,0.55)] lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="border-r border-[var(--ai-border)] bg-[radial-gradient(circle_at_top_left,rgba(0,153,255,0.08),transparent_34%),linear-gradient(180deg,#061020_0%,#040b16_100%)] px-4 py-6">
          <div className="px-2">
            <AILedgerLogo
              variant="lockup"
              tone="on-dark"
              className="h-auto w-[164px]"
              priority
            />
          </div>

          <nav className="mt-10 space-y-1">
            {navigation.map((item) => {
              const isActive = item.key === current;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-[linear-gradient(135deg,#1243d6_0%,#1c65ff_100%)] text-white shadow-[0_18px_40px_rgba(28,101,255,0.26)]"
                      : "text-[var(--ai-text-secondary)] hover:bg-[rgba(20,33,57,0.85)] hover:text-white"
                  }`}
                >
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border ${
                      isActive
                        ? "border-white/12 bg-white/10"
                        : "border-[rgba(42,75,115,0.55)] bg-[rgba(13,23,42,0.88)]"
                    }`}
                  >
                    <AppIcon name={item.icon} className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-[var(--ai-border)] px-3 pt-6">
            <div className="rounded-[22px] border border-[rgba(42,75,115,0.6)] bg-[linear-gradient(180deg,rgba(19,36,61,0.94),rgba(11,23,42,0.94))] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ai-cyan)]">
                Governance. Evidence. Trust.
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--ai-text-secondary)]">
                Centralized register, clear review controls, and audit-ready oversight.
              </p>
            </div>
          </div>
        </aside>

        <div className="min-w-0 bg-[linear-gradient(180deg,#071120_0%,#091527_100%)]">
          <header className="flex items-center justify-between border-b border-[var(--ai-border)] px-5 py-4 lg:px-7">
            <button className="inline-flex items-center gap-3 rounded-2xl border border-[rgba(42,75,115,0.64)] bg-[rgba(7,17,32,0.72)] px-4 py-3 text-sm font-medium text-white transition hover:border-[var(--ai-border-strong)]">
              <span>{organisationName}</span>
              <AppIcon name="chevron" className="h-4 w-4 text-[var(--ai-text-secondary)]" />
            </button>

            <div className="flex items-center gap-3">
              <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(42,75,115,0.64)] bg-[rgba(7,17,32,0.72)] text-[var(--ai-text-secondary)] transition hover:border-[var(--ai-border-strong)] hover:text-white">
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--ai-blue)]" />
                <AppIcon name="bell" className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 rounded-full border border-[rgba(42,75,115,0.64)] bg-[rgba(7,17,32,0.72)] px-2 py-1.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1c65ff_0%,#7a38ff_100%)] text-sm font-semibold text-white">
                  {initials}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{userDisplayName}</p>
                  <p className="text-xs capitalize text-[var(--ai-text-muted)]">{role}</p>
                </div>
                <AppIcon name="chevron" className="mr-1 h-4 w-4 text-[var(--ai-text-secondary)]" />
              </div>

              <form action={signOutAction}>
                <button className="inline-flex items-center rounded-full border border-[rgba(42,75,115,0.64)] bg-[rgba(7,17,32,0.72)] px-4 py-2.5 text-sm font-medium text-[var(--ai-text-secondary)] transition hover:border-[var(--ai-border-strong)] hover:text-white">
                  Sign out
                </button>
              </form>
            </div>
          </header>

          <div className="px-5 py-6 lg:px-7 lg:py-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
