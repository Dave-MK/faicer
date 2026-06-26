import type { ReactNode } from "react";

export type IconName =
  | "overview"
  | "register"
  | "use-cases"
  | "governance"
  | "policies"
  | "evidence"
  | "risks"
  | "assessments"
  | "controls"
  | "reports"
  | "integrations"
  | "settings"
  | "search"
  | "bell"
  | "chevron"
  | "plus"
  | "filter"
  | "download"
  | "dots"
  | "arrow-right"
  | "check"
  | "shield"
  | "training"
  | "calendar"
  | "activity"
  | "incidents"
  | "help"
  | "records"
  | "audits";

type AppIconProps = {
  name: IconName;
  className?: string;
};

function stroke(children: ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function AppIcon({ name, className = "h-5 w-5" }: AppIconProps) {
  const icon = {
    overview: stroke(
      <>
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </>,
    ),
    register: stroke(
      <>
        <rect x="4" y="7" width="16" height="10" rx="2" />
        <path d="M8 7V5M12 7V5M16 7V5" />
        <path d="M8 17v2M12 17v2M16 17v2" />
        <path d="M4 10H2M4 14H2M20 10h2M20 14h2" />
      </>,
    ),
    "use-cases": stroke(
      <>
        <path d="M7 5.5h10v13H7z" />
        <path d="M9.5 9H14M9.5 12H14M9.5 15H12.5" />
        <path d="M7 5.5 5 7v13.5h10.5" />
      </>,
    ),
    governance: stroke(
      <>
        <path d="m12 3 8 4.5V12c0 4.5-3.2 7.7-8 9-4.8-1.3-8-4.5-8-9V7.5L12 3Z" />
        <path d="m9.2 12 1.8 1.8 3.8-3.8" />
      </>,
    ),
    policies: stroke(
      <>
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>,
    ),
    evidence: stroke(
      <>
        <path d="M7 4.5h7l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19V6A1.5 1.5 0 0 1 7.5 4.5Z" />
        <path d="M14 4.5V9h4" />
      </>,
    ),
    risks: stroke(
      <>
        <path d="M12 4 21 19H3L12 4Z" />
        <path d="M12 9v4.5" />
        <circle cx="12" cy="16.5" r=".8" fill="currentColor" stroke="none" />
      </>,
    ),
    assessments: stroke(
      <>
        <path d="M8 7.5h8" />
        <path d="M8 12h8" />
        <path d="M8 16.5h5" />
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
      </>,
    ),
    controls: stroke(
      <>
        <path d="M12 3.5 19.5 7v5c0 4-2.7 6.8-7.5 8.5C7.2 18.8 4.5 16 4.5 12V7L12 3.5Z" />
        <path d="M9.5 12.2 11.2 14l3.5-4" />
      </>,
    ),
    reports: stroke(
      <>
        <path d="M6 18V10" />
        <path d="M12 18V6" />
        <path d="M18 18v-4" />
        <path d="M4 18h16" />
      </>,
    ),
    integrations: stroke(
      <>
        <circle cx="6.5" cy="12" r="2.5" />
        <circle cx="17.5" cy="6.5" r="2.5" />
        <circle cx="17.5" cy="17.5" r="2.5" />
        <path d="M8.8 10.7 15 7.8M8.8 13.3l6.2 2.9" />
      </>,
    ),
    settings: stroke(
      <>
        <circle cx="12" cy="12" r="2.8" />
        <path d="M19.4 13.5a1 1 0 0 0 .2 1.1l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V18a2 2 0 0 1-4 0v-.2a1 1 0 0 0-.7-.9 1 1 0 0 0-1 .2l-.2.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H6a2 2 0 0 1 0-4h.2a1 1 0 0 0 .9-.7 1 1 0 0 0-.2-1l-.1-.2a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2h.1a1 1 0 0 0 .6-.9V6a2 2 0 0 1 4 0v.2a1 1 0 0 0 .7.9 1 1 0 0 0 1-.2l.2-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.1a1 1 0 0 0 .9.6h.2a2 2 0 0 1 0 4H20a1 1 0 0 0-.6.7Z" />
      </>,
    ),
    search: stroke(
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="m16 16 4 4" />
      </>,
    ),
    bell: stroke(
      <>
        <path d="M9 19a3 3 0 0 0 6 0" />
        <path d="M5.5 16.5H18c-1.2-1.1-2-2.7-2-4.5V10a4 4 0 1 0-8 0v2c0 1.8-.8 3.4-2.5 4.5Z" />
      </>,
    ),
    chevron: stroke(<path d="m8 10 4 4 4-4" />),
    plus: stroke(
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>,
    ),
    filter: stroke(
      <>
        <path d="M4 6h16" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </>,
    ),
    download: stroke(
      <>
        <path d="M12 4.5V15" />
        <path d="m8.5 11.5 3.5 3.5 3.5-3.5" />
        <path d="M5 19.5h14" />
      </>,
    ),
    dots: stroke(
      <>
        <circle cx="5" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
        <circle cx="19" cy="12" r="1.1" fill="currentColor" stroke="none" />
      </>,
    ),
    "arrow-right": stroke(<path d="M5 12h14M13 6l6 6-6 6" />),
    check: stroke(<path d="m5 12 4.2 4.2L19 6.8" />),
    shield: stroke(
      <>
        <path d="M12 3.5 19.5 7v5c0 4-2.7 6.8-7.5 8.5C7.2 18.8 4.5 16 4.5 12V7L12 3.5Z" />
      </>,
    ),
    training: stroke(
      <>
        <path d="M12 6.5 4.5 10 12 13.5 19.5 10 12 6.5Z" />
        <path d="M7 11.2v4.1c0 1.1 2.1 2 5 2s5-.9 5-2v-4.1" />
      </>,
    ),
    calendar: stroke(
      <>
        <rect x="4" y="5" width="16" height="15" rx="2.2" />
        <path d="M8 3.8v3.5M16 3.8v3.5M4 9.2h16" />
      </>,
    ),
    activity: stroke(
      <>
        <path d="M4 12h3l2-5 4 10 2-5h5" />
      </>,
    ),
    incidents: stroke(
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v5" />
        <circle cx="12" cy="15.5" r=".8" fill="currentColor" stroke="none" />
      </>,
    ),
    help: stroke(
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M9.8 9.5a2.5 2.5 0 1 1 4.3 1.7c-.6.6-1.3 1-1.8 1.4-.5.4-.8.8-.8 1.4v.5" />
        <circle cx="12" cy="17.2" r=".7" fill="currentColor" stroke="none" />
      </>,
    ),
    records: stroke(
      <>
        <path d="M4 6.5h16v13a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19.5V6.5Z" />
        <path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.5H2V4Z" />
        <path d="M9 12h6M9 15.5h4" />
      </>,
    ),
    audits: stroke(
      <>
        <path d="M9 11l2.5 2.5L15.5 9" />
        <rect x="4" y="4" width="16" height="16" rx="2.5" />
        <path d="M8 4V2M16 4V2" />
      </>,
    ),
  }[name];

  return <span className={`inline-flex shrink-0 ${className}`}>{icon}</span>;
}
