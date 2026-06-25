import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { AppIcon } from "@/components/AppIcons";
import { FaicerLogo } from "@/components/FaicerLogo";
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
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const navigation = role === "staff" ? staffNavigation : appNavigation;

  return (
    <div className="min-h-screen" style={{ background: "#0A0E18" }}>
      <div className="mx-auto flex min-h-screen max-w-[1680px] border border-[rgba(40,49,67,0.55)]">
        {/* Mobile nav toggle (CSS-only drawer) */}
        <input
          type="checkbox"
          id="faicer-nav"
          className="peer sr-only"
          aria-label="Toggle navigation menu"
        />
        {/* Mobile overlay */}
        <label
          htmlFor="faicer-nav"
          aria-hidden="true"
          className="fixed inset-0 z-30 hidden bg-black/55 backdrop-blur-sm peer-checked:block lg:!hidden"
        />

        {/* ── Sidebar ── */}
        <aside
          className="fixed inset-y-0 left-0 z-40 flex w-[270px] max-w-[82vw] shrink-0 -translate-x-full flex-col overflow-y-auto transition-transform duration-200 ease-out peer-checked:translate-x-0 lg:static lg:max-w-none lg:translate-x-0"
          style={{
            background:
              "radial-gradient(circle at 30% 10%, rgba(99,102,241,0.07) 0%, transparent 45%)," +
              "linear-gradient(180deg, #0B0F1C 0%, #0A0E18 100%)",
            borderRight: "1px solid rgba(40,49,67,0.55)",
          }}
        >
          {/* Logo */}
          <div className="flex items-start justify-between gap-2 px-5 pt-7 pb-6">
            <FaicerLogo variant="lockup" tone="on-dark" className="h-auto" />
            <label
              htmlFor="faicer-nav"
              aria-label="Close navigation menu"
              className="-mr-1 mt-1 inline-flex h-8 w-8 items-center justify-center rounded-[10px] text-[rgba(168,176,204,0.6)] hover:text-white lg:hidden"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </label>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5 px-3">
            {navigation.map((item) => {
              const isActive = item.key === current;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-[14px] px-4 py-3 text-[13.5px] font-medium transition-all duration-150 ${
                    isActive
                      ? "text-white"
                      : "text-[rgba(168,176,204,0.7)] hover:text-white"
                  }`}
                  style={
                    isActive
                      ? {
                          background:
                            "linear-gradient(90deg, #5B6CF0 0%, #4F7CF5 100%)",
                          boxShadow: "0 6px 24px rgba(79,124,245,0.28)",
                        }
                      : undefined
                  }
                >
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-[rgba(255,255,255,0.05)] text-[rgba(168,176,204,0.55)] group-hover:bg-[rgba(255,255,255,0.08)] group-hover:text-white"
                    }`}
                  >
                    <AppIcon name={item.icon} className="h-[15px] w-[15px]" />
                  </span>
                  <span className="leading-none">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Upgrade to Pro */}
          <div className="mx-3 mt-6 mb-4">
            <div
              className="rounded-[18px] p-4"
              style={{
                background:
                  "radial-gradient(circle at top left, rgba(99,102,241,0.10), transparent 60%)," +
                  "linear-gradient(135deg, rgba(20,14,40,0.97), rgba(14,10,30,0.97))",
                border: "1px solid rgba(99,102,241,0.25)",
              }}
            >
              <div className="mb-2 flex items-center gap-2.5">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[10px] text-base"
                  style={{
                    background: "rgba(99,102,241,0.18)",
                    border: "1px solid rgba(99,102,241,0.3)",
                  }}
                >
                  👑
                </span>
                <p
                  className="text-[13.5px] font-semibold"
                  style={{ color: "#6366F1" }}
                >
                  Upgrade to Pro
                </p>
              </div>
              <p className="mb-3.5 text-[12px] leading-relaxed text-[rgba(168,176,204,0.65)]">
                Unlock advanced analytics, custom frameworks, and unlimited users.
              </p>
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-1.5 rounded-[10px] border py-2.5 text-[12.5px] font-semibold transition hover:bg-[rgba(99,102,241,0.08)]"
                style={{
                  borderColor: "rgba(99,102,241,0.55)",
                  color: "#6366F1",
                }}
              >
                Upgrade Now
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>
          </div>

          {/* User profile */}
          <div
            className="flex items-center gap-3 border-t px-4 py-4"
            style={{ borderColor: "rgba(42,45,80,0.55)" }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #6366F1 0%, #4F7CF5 100%)",
                boxShadow: "0 2px 10px rgba(99,102,241,0.30)",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-white">
                {userDisplayName}
              </p>
              <p className="truncate text-[11px] text-[rgba(168,176,204,0.5)]">
                {organisationName}
              </p>
            </div>
            <button className="inline-flex text-[rgba(168,176,204,0.4)] transition hover:text-white">
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M6 12l4-4-4-4" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ── Main column ── */}
        <div
          className="flex min-w-0 flex-1 flex-col"
          style={{
            background: "linear-gradient(180deg, #0E1320 0%, #11182A 100%)",
          }}
        >
          {/* Top header bar */}
          <header
            className="flex items-center gap-2.5 border-b px-4 py-3 sm:px-6 sm:py-3.5"
            style={{ borderColor: "rgba(40,49,67,0.55)" }}
          >
            {/* Mobile: hamburger + compact logo */}
            <label
              htmlFor="faicer-nav"
              aria-label="Open navigation menu"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border text-[rgba(168,176,204,0.7)] transition hover:text-white lg:hidden"
              style={{ borderColor: "rgba(40,49,67,0.65)", background: "rgba(21,27,43,0.6)" }}
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M2 4h12M2 8h12M2 12h12" />
              </svg>
            </label>
            <FaicerLogo variant="mark" tone="on-dark" className="h-8 w-8 shrink-0 lg:hidden" />

            {/* Spacer pushes actions to the right */}
            <div className="flex-1" />

            {/* Search */}
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] border text-[rgba(168,176,204,0.6)] transition hover:border-[rgba(99,102,241,0.4)] hover:text-white"
              style={{
                borderColor: "rgba(40,49,67,0.65)",
                background: "rgba(21,27,43,0.6)",
              }}
            >
              <AppIcon name="search" className="h-[15px] w-[15px]" />
            </button>

            {/* Bell */}
            <button
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-[11px] border text-[rgba(168,176,204,0.6)] transition hover:border-[rgba(99,102,241,0.4)] hover:text-white"
              style={{
                borderColor: "rgba(40,49,67,0.65)",
                background: "rgba(21,27,43,0.6)",
              }}
            >
              <AppIcon name="bell" className="h-[15px] w-[15px]" />
              <span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{
                  background: "#6366F1",
                  boxShadow: "0 0 8px rgba(99,102,241,0.6)",
                }}
              >
                3
              </span>
            </button>

            {/* Help */}
            <button
              className="hidden h-9 w-9 items-center justify-center rounded-[11px] border text-[rgba(168,176,204,0.6)] transition hover:border-[rgba(99,102,241,0.4)] hover:text-white sm:inline-flex"
              style={{
                borderColor: "rgba(40,49,67,0.65)",
                background: "rgba(21,27,43,0.6)",
              }}
            >
              <AppIcon name="help" className="h-[15px] w-[15px]" />
            </button>

            {/* Divider */}
            <span
              className="mx-1 hidden h-6 w-px sm:block"
              style={{ background: "rgba(40,49,67,0.8)" }}
            />

            {/* Org switcher */}
            <button
              className="hidden items-center gap-2 rounded-[11px] border px-3.5 py-2 text-[13px] font-medium text-white transition hover:border-[rgba(99,102,241,0.4)] sm:flex"
              style={{
                borderColor: "rgba(40,49,67,0.65)",
                background: "rgba(21,27,43,0.6)",
              }}
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-[rgba(168,176,204,0.5)]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <rect x="2" y="3" width="12" height="10" rx="1.5"/>
                <path d="M5 3V2M11 3V2M2 7h12"/>
              </svg>
              <span className="max-w-[140px] truncate">{organisationName}</span>
              <AppIcon name="chevron" className="h-3.5 w-3.5 shrink-0 text-[rgba(168,176,204,0.4)]" />
            </button>

            {/* Date range */}
            <button
              className="hidden items-center gap-2 rounded-[11px] border px-3.5 py-2 text-[13px] font-medium text-white transition hover:border-[rgba(99,102,241,0.4)] xl:flex"
              style={{
                borderColor: "rgba(40,49,67,0.65)",
                background: "rgba(21,27,43,0.6)",
              }}
            >
              <AppIcon name="calendar" className="h-3.5 w-3.5 shrink-0 text-[rgba(168,176,204,0.5)]" />
              <span>May 12 – May 18, 2024</span>
              <AppIcon name="chevron" className="h-3.5 w-3.5 shrink-0 text-[rgba(168,176,204,0.4)]" />
            </button>

            {/* Sign-out (hidden, accessible via user profile) */}
            <form action={signOutAction} className="hidden">
              <button type="submit" aria-label="Sign out" />
            </form>
          </header>

          {/* Page content */}
          <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
