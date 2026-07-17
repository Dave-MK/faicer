import type { ReactNode } from "react";
import { AppIcon } from "@/components/AppIcons";

export function WorkspaceHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-3">
        {eyebrow ? <p className="brand-eyebrow">{eyebrow}</p> : null}
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-[2.55rem]">
          {title}
        </h1>
        <p className="max-w-[820px] text-base leading-7 text-[var(--ai-text-secondary)] sm:text-lg">
          {description}
        </p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </section>
  );
}

export function WorkspacePanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`brand-panel rounded-[26px] p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function ActionButton({
  label,
  icon,
  tone = "secondary",
}: {
  label: string;
  icon?: Parameters<typeof AppIcon>[0]["name"];
  tone?: "primary" | "secondary";
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
        tone === "primary" ? "brand-button-primary" : "brand-button-secondary"
      }`}
    >
      {icon ? <AppIcon name={icon} className="h-4 w-4" /> : null}
      {label}
    </span>
  );
}

export function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "success" | "warning" | "danger" | "info" | "muted";
}) {
  const classes = {
    success: "brand-status-success",
    warning: "brand-status-warning",
    danger: "brand-status-danger",
    info: "brand-status-info",
    muted: "brand-status-muted",
  }[tone];

  return (
    <span className={`${classes} inline-flex rounded-full px-3 py-1 text-xs font-semibold`}>
      {label}
    </span>
  );
}

export function FilterChip({
  label,
  icon,
}: {
  label: string;
  icon?: Parameters<typeof AppIcon>[0]["name"];
}) {
  return (
    <button className="inline-flex items-center gap-2 rounded-xl border border-[rgba(52,72,98,0.76)] bg-[rgba(10,20,34,0.88)] px-3.5 py-2 text-sm text-[var(--ai-text-secondary)] transition hover:border-[var(--ai-border-strong)] hover:text-white">
      {icon ? <AppIcon name={icon} className="h-4 w-4" /> : null}
      <span>{label}</span>
      <AppIcon name="chevron" className="h-3.5 w-3.5" />
    </button>
  );
}

export function RingScore({
  score,
  label,
  size = "large",
}: {
  score: string;
  label: string;
  size?: "large" | "medium";
}) {
  const dimensions = size === "large" ? "h-40 w-40" : "h-28 w-28";
  const scoreSize = size === "large" ? "text-5xl" : "text-3xl";

  return (
    <div className={`dashboard-ring ${dimensions}`}>
      <div className="text-center">
        <p className={`${scoreSize} font-semibold text-white`}>{score}</p>
        <p className="mt-1 text-sm text-[var(--ai-text-secondary)]">{label}</p>
      </div>
    </div>
  );
}
