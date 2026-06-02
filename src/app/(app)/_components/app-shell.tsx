import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { AILedgerLogo } from "@/components/AILedgerLogo";
import type { MembershipRole } from "@/lib/types";

type AppShellProps = {
  current: "dashboard" | "tools" | "setup";
  organisationName: string;
  userDisplayName: string;
  role: MembershipRole;
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const navigation = [
  { key: "dashboard", href: "/dashboard", label: "Dashboard" },
  { key: "tools", href: "/tools", label: "Tool register" },
  { key: "setup", href: "/setup/organisation", label: "Organisation" },
] as const;

export function AppShell({
  current,
  organisationName,
  userDisplayName,
  role,
  eyebrow,
  title,
  description,
  actions,
  children,
}: AppShellProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-10 lg:px-10">
      <section className="brand-panel rounded-[2rem] p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[var(--ai-border-strong)] bg-[var(--ai-surface-raised)] shadow-[var(--ai-shadow-glow)]">
                <AILedgerLogo
                  variant="mark"
                  tone="gradient"
                  className="h-9 w-9"
                  priority
                />
              </span>
              <div className="space-y-2">
                <p className="brand-eyebrow">{eyebrow}</p>
                <p className="text-sm text-[var(--ai-text-secondary)]">
                  Governance. Evidence. Trust.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold">{title}</h1>
              <p className="max-w-2xl text-muted">{description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="brand-panel-soft rounded-full px-3 py-2">
                {organisationName}
              </span>
              <span className="brand-panel-soft rounded-full px-3 py-2">
                {userDisplayName}
              </span>
              <span className="brand-status-muted rounded-full px-3 py-2 capitalize">
                {role}
              </span>
            </div>

            <nav className="flex flex-wrap gap-3">
              {navigation.map((item) => {
                const isActive = item.key === current;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "brand-button-primary text-white"
                        : "brand-button-secondary"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col items-stretch gap-3 xl:items-end">
            {actions}
            <form action={signOutAction}>
              <button
                type="submit"
                className="brand-button-secondary rounded-full px-5 py-3 font-medium transition"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="mt-8">{children}</section>
    </main>
  );
}
