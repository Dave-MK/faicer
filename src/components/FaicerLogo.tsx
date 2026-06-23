type LogoProps = {
  variant?: "lockup" | "mark";
  tone?: "gradient" | "white" | "dark" | "on-dark" | "app-dark" | "app-light";
  className?: string;
  priority?: boolean;
  tagline?: boolean;
};

const PINK = "#FF4DB8";
const VIOLET = "#7B4DFF";
const PURPLE = "#B24DFF";

function FaicerIcon({ tone }: { tone: string }) {
  const isDark = tone === "dark" || tone === "app-light";
  const gId = tone.replace(/[^a-z]/g, "");
  const shieldFill = isDark ? "rgba(11,7,26,0.92)" : "rgba(9,8,22,0.94)";
  const barColor1 = isDark ? "#7B4DFF" : "#9B4DFF";
  const barColor2 = isDark ? "#5B2FA0" : VIOLET;
  const dotColor = isDark ? VIOLET : PURPLE;
  const docStroke = isDark ? "#7B4DFF" : "#9B4DFF";
  const checkFill = isDark ? "#5B2FA0" : PINK;

  return (
    <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={`bar-${gId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={barColor1} stopOpacity="0.95" />
          <stop offset="100%" stopColor={barColor2} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`shield-${gId}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={PINK} />
          <stop offset="50%" stopColor={PURPLE} />
          <stop offset="100%" stopColor={VIOLET} />
        </linearGradient>
        <filter id={`glow-${gId}`} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id={`glow2-${gId}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Data bars rising above the shield */}
      <rect x="10" y="6"  width="4.5" height="9"  rx="1.5" fill={`url(#bar-${gId})`} opacity="0.70"/>
      <rect x="16" y="3"  width="4.5" height="13" rx="1.5" fill={`url(#bar-${gId})`} opacity="0.82"/>
      <rect x="21.8" y="0"  width="4.5" height="16" rx="1.5" fill={`url(#bar-${gId})`} opacity="1"/>
      <rect x="27.5" y="3"  width="4.5" height="13" rx="1.5" fill={`url(#bar-${gId})`} opacity="0.82"/>
      <rect x="33.5" y="6"  width="4.5" height="9"  rx="1.5" fill={`url(#bar-${gId})`} opacity="0.70"/>

      {/* Shield body */}
      <path
        d="M24 13L40 20V32C40 41 32.5 47 24 51C15.5 47 8 41 8 32V20L24 13Z"
        fill={shieldFill}
        stroke={`url(#shield-${gId})`}
        strokeWidth="1.4"
        filter={`url(#glow-${gId})`}
      />

      {/* Inner shield bevel (subtle inner line) */}
      <path
        d="M24 17L37 22.5V32C37 39.5 31 44.5 24 48C17 44.5 11 39.5 11 32V22.5L24 17Z"
        fill="none"
        stroke={VIOLET}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* Document inside shield */}
      <rect x="16.5" y="23" width="15" height="18" rx="2.5"
        fill="rgba(123,77,255,0.10)" stroke={docStroke} strokeWidth="0.9"/>
      <line x1="19.5" y1="28" x2="28.5" y2="28" stroke={docStroke} strokeWidth="1" strokeLinecap="round"/>
      <line x1="19.5" y1="32" x2="28.5" y2="32" stroke={docStroke} strokeWidth="1" strokeLinecap="round"/>
      <line x1="19.5" y1="36" x2="25.5" y2="36" stroke={docStroke} strokeWidth="1" strokeLinecap="round"/>

      {/* Check badge */}
      <circle cx="36" cy="42" r="6.5" fill={checkFill} filter={`url(#glow2-${gId})`}/>
      <path d="M33 42 L35.4 44.4 L39.5 39.5"
        stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Circuit dots — left side */}
      <circle cx="3.5" cy="24" r="2" fill={dotColor} opacity="0.9"/>
      <circle cx="3.5" cy="33" r="2" fill={dotColor} opacity="0.9"/>
      <line x1="3.5" y1="24" x2="8" y2="24" stroke={dotColor} strokeWidth="0.8" opacity="0.7"/>
      <line x1="3.5" y1="33" x2="8" y2="33" stroke={dotColor} strokeWidth="0.8" opacity="0.7"/>
      <line x1="3.5" y1="24" x2="3.5" y2="33" stroke={dotColor} strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.5"/>

      {/* Circuit dots — right side */}
      <circle cx="44.5" cy="24" r="2" fill={dotColor} opacity="0.9"/>
      <circle cx="44.5" cy="33" r="2" fill={dotColor} opacity="0.9"/>
      <line x1="44.5" y1="24" x2="40" y2="24" stroke={dotColor} strokeWidth="0.8" opacity="0.7"/>
      <line x1="44.5" y1="33" x2="40" y2="33" stroke={dotColor} strokeWidth="0.8" opacity="0.7"/>
      <line x1="44.5" y1="24" x2="44.5" y2="33" stroke={dotColor} strokeWidth="0.8" strokeDasharray="1.5 1.5" opacity="0.5"/>
    </svg>
  );
}

export function FaicerLogo({
  variant = "lockup",
  tone = "gradient",
  className = "",
  tagline = false,
}: LogoProps) {
  const isDark = tone === "dark" || tone === "app-light";
  const baseColor = isDark ? "#0B0F1F" : "#FFFFFF";

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
      <span className="flex flex-col justify-center gap-0.5">
        <span
          style={{ fontFamily: "var(--font-orbitron, 'Orbitron', sans-serif)" }}
          className="text-[19px] font-black leading-none tracking-tight"
          aria-hidden="true"
        >
          <span style={{ color: baseColor }}>FAIC</span>
          <span style={{ color: "#FF4DB8" }}>ER</span>
        </span>
        {tagline && (
          <span
            className="text-[7px] font-semibold uppercase leading-tight tracking-[0.2em]"
            style={{ color: "rgba(168,176,204,0.45)" }}
            aria-hidden="true"
          >
            Fundamental AI Compliance
            <br />
            &amp; Education Register
          </span>
        )}
      </span>
    </span>
  );
}
