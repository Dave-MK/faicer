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
    <div className="min-h-screen" style={{ background: "#080A18" }}>
      <div
        className="mx-auto flex min-h-screen max-w-[1680px]"
        style={{
          border: "1px solid rgba(42,45,80,0.55)",
          borderRadius: 0,
        }}
      >
        {/* ── Sidebar ── */}
        <aside
          className="flex w-[270px] shrink-0 flex-col"
          style={{
            background:
              "radial-gradient(circle at 30% 10%, rgba(178,77,255,0.07) 0%, transparent 45%)," +
              "linear-gradient(180deg, #0A0C1C 0%, #080A18 100%)",
            borderRight: "1px solid rgba(42,45,80,0.55)",
          }}
        >
          {/* Logo */}
          <div className="px-5 pt-7 pb-6">
            <FaicerLogo variant="lockup" tone="on-dark" tagline className="h-auto" />
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
                            "linear-gradient(90deg, #C849AA 0%, #9B4DFF 100%)",
                          boxShadow: "0 6px 24px rgba(200,73,170,0.30)",
                        }
                      : undefined
                  }
                  onMouseEnter={undefined}
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
                  "radial-gradient(circle at top left, rgba(255,77,184,0.10), transparent 60%)," +
                  "linear-gradient(135deg, rgba(20,14,40,0.97), rgba(14,10,30,0.97))",
                border: "1px solid rgba(178,77,255,0.25)",
              }}
            >
              <div className="mb-2 flex items-center gap-2.5">
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-[10px] text-base"
                  style={{
                    background: "rgba(178,77,255,0.18)",
                    border: "1px solid rgba(178,77,255,0.3)",
                  }}
                >
                  👑
                </span>
                <p
                  className="text-[13.5px] font-semibold"
                  style={{ color: "#FF4DB8" }}
                >
                  Upgrade to Pro
                </p>
              </div>
              <p className="mb-3.5 text-[12px] leading-relaxed text-[rgba(168,176,204,0.65)]">
                Unlock advanced analytics, custom frameworks, and unlimited users.
              </p>
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-1.5 rounded-[10px] border py-2.5 text-[12.5px] font-semibold transition hover:bg-[rgba(255,77,184,0.08)]"
                style={{
                  borderColor: "rgba(255,77,184,0.55)",
                  color: "#FF4DB8",
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
                background: "linear-gradient(135deg, #FF4DB8 0%, #7B4DFF 100%)",
                boxShadow: "0 2px 10px rgba(255,77,184,0.30)",
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
            background: "linear-gradient(180deg, #0B0E1F 0%, #0D1126 100%)",
          }}
        >
          {/* Top header bar */}
          <header
            className="flex items-center justify-end gap-2.5 border-b px-6 py-3.5"
            style={{ borderColor: "rgba(42,45,80,0.55)" }}
          >
            {/* Search */}
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] border text-[rgba(168,176,204,0.6)] transition hover:border-[rgba(178,77,255,0.4)] hover:text-white"
              style={{
                borderColor: "rgba(42,45,80,0.65)",
                background: "rgba(11,14,31,0.6)",
              }}
            >
              <AppIcon name="search" className="h-[15px] w-[15px]" />
            </button>

            {/* Bell */}
            <button
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-[11px] border text-[rgba(168,176,204,0.6)] transition hover:border-[rgba(178,77,255,0.4)] hover:text-white"
              style={{
                borderColor: "rgba(42,45,80,0.65)",
                background: "rgba(11,14,31,0.6)",
              }}
            >
              <AppIcon name="bell" className="h-[15px] w-[15px]" />
              <span
                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white"
                style={{
                  background: "#FF4DB8",
                  boxShadow: "0 0 8px rgba(255,77,184,0.6)",
                }}
              >
                3
              </span>
            </button>

            {/* Help */}
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] border text-[rgba(168,176,204,0.6)] transition hover:border-[rgba(178,77,255,0.4)] hover:text-white"
              style={{
                borderColor: "rgba(42,45,80,0.65)",
                background: "rgba(11,14,31,0.6)",
              }}
            >
              <AppIcon name="help" className="h-[15px] w-[15px]" />
            </button>

            {/* Divider */}
            <span
              className="mx-1 h-6 w-px"
              style={{ background: "rgba(42,45,80,0.8)" }}
            />

            {/* Org switcher */}
            <button
              className="flex items-center gap-2 rounded-[11px] border px-3.5 py-2 text-[13px] font-medium text-white transition hover:border-[rgba(178,77,255,0.4)]"
              style={{
                borderColor: "rgba(42,45,80,0.65)",
                background: "rgba(11,14,31,0.6)",
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
              className="flex items-center gap-2 rounded-[11px] border px-3.5 py-2 text-[13px] font-medium text-white transition hover:border-[rgba(178,77,255,0.4)]"
              style={{
                borderColor: "rgba(42,45,80,0.65)",
                background: "rgba(11,14,31,0.6)",
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
          <div className="flex-1 px-6 py-6 lg:px-8 lg:py-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
