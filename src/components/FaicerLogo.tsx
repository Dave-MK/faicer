type LogoProps = {
  variant?: "lockup" | "mark";
  tone?: "gradient" | "white" | "dark" | "on-dark" | "app-dark" | "app-light";
  className?: string;
  priority?: boolean;
  tagline?: boolean;
};

const INDIGO = "#3e6fd8";
const BLUE = "#4d8cec";
const MID = "#5b8def";

function FaicerIcon({ tone }: { tone: string }) {
  const isDark = tone === "dark" || tone === "app-light";
  const gId = tone.replace(/[^a-z]/g, "");
  const shieldFill = isDark ? "rgba(241, 246, 251, 0.94)" : "rgba(10, 18, 31, 0.94)";
  const barColor1 = isDark ? "#3563B2" : "#7EB5FF";
  const barColor2 = isDark ? "#244D90" : BLUE;
  const dotColor = isDark ? "#244D90" : MID;
  const docStroke = isDark ? "#3563B2" : "#7EB5FF";
  const checkFill = isDark ? INDIGO : "#244D90";

  return (
    <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`bar-${gId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={barColor1} stopOpacity="0.95" />
          <stop offset="100%" stopColor={barColor2} stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={`shield-${gId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={INDIGO} />
          <stop offset="50%" stopColor={MID} />
          <stop offset="100%" stopColor={BLUE} />
        </linearGradient>
      </defs>

      <rect x="10" y="6" width="4.5" height="9" rx="1.5" fill={`url(#bar-${gId})`} opacity="0.7" />
      <rect x="16" y="3" width="4.5" height="13" rx="1.5" fill={`url(#bar-${gId})`} opacity="0.82" />
      <rect x="21.8" y="0" width="4.5" height="16" rx="1.5" fill={`url(#bar-${gId})`} />
      <rect x="27.5" y="3" width="4.5" height="13" rx="1.5" fill={`url(#bar-${gId})`} opacity="0.82" />
      <rect x="33.5" y="6" width="4.5" height="9" rx="1.5" fill={`url(#bar-${gId})`} opacity="0.7" />

      <path
        d="M24 13L40 20V32C40 41 32.5 47 24 51C15.5 47 8 41 8 32V20L24 13Z"
        fill={shieldFill}
        stroke={`url(#shield-${gId})`}
        strokeWidth="1.6"
      />

      <path
        d="M24 17L37 22.5V32C37 39.5 31 44.5 24 48C17 44.5 11 39.5 11 32V22.5L24 17Z"
        fill="none"
        stroke={BLUE}
        strokeWidth="0.6"
        opacity="0.28"
      />

      <rect
        x="16.5"
        y="23"
        width="15"
        height="18"
        rx="2.5"
        fill="rgba(77,140,236,0.08)"
        stroke={docStroke}
        strokeWidth="1"
      />
      <line x1="19.5" y1="28" x2="28.5" y2="28" stroke={docStroke} strokeWidth="1" strokeLinecap="round" />
      <line x1="19.5" y1="32" x2="28.5" y2="32" stroke={docStroke} strokeWidth="1" strokeLinecap="round" />
      <line x1="19.5" y1="36" x2="25.5" y2="36" stroke={docStroke} strokeWidth="1" strokeLinecap="round" />

      <circle cx="36" cy="42" r="6.5" fill={checkFill} />
      <path
        d="M33 42 L35.4 44.4 L39.5 39.5"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="3.5" cy="24" r="2" fill={dotColor} opacity="0.9" />
      <circle cx="3.5" cy="33" r="2" fill={dotColor} opacity="0.9" />
      <line x1="3.5" y1="24" x2="8" y2="24" stroke={dotColor} strokeWidth="0.8" opacity="0.7" />
      <line x1="3.5" y1="33" x2="8" y2="33" stroke={dotColor} strokeWidth="0.8" opacity="0.7" />

      <circle cx="44.5" cy="24" r="2" fill={dotColor} opacity="0.9" />
      <circle cx="44.5" cy="33" r="2" fill={dotColor} opacity="0.9" />
      <line x1="44.5" y1="24" x2="40" y2="24" stroke={dotColor} strokeWidth="0.8" opacity="0.7" />
      <line x1="44.5" y1="33" x2="40" y2="33" stroke={dotColor} strokeWidth="0.8" opacity="0.7" />
    </svg>
  );
}

export function FaicerLogo({
  variant = "lockup",
  tone = "gradient",
  className = "",
}: LogoProps) {
  const isDark = tone === "dark" || tone === "app-light";
  const baseColor = isDark ? "#112033" : "#ffffff";
  const subColor = isDark ? "#5c6c80" : "rgba(214,224,236,0.72)";

  if (variant === "mark") {
    return (
      <span className={`inline-flex items-center ${className}`} aria-label="FAICER">
        <FaicerIcon tone={tone} />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="FAICER">
      <span className="inline-flex h-11 w-[42px] shrink-0">
        <FaicerIcon tone={tone} />
      </span>
      <span className="flex min-w-0 flex-col justify-center gap-1">
        <span
          style={{ color: baseColor }}
          className="text-[19px] font-bold leading-none tracking-[-0.03em]"
          aria-hidden="true"
        >
          FAICER
        </span>
        <span
          className="text-[9px] font-semibold uppercase leading-snug tracking-[0.12em]"
          style={{ color: subColor }}
          aria-hidden="true"
        >
          AI Governance
          <br className="hidden sm:inline" />
          <span className="sm:hidden"> </span>Platform
        </span>
      </span>
    </span>
  );
}
