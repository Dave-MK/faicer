import Image from "next/image";

type LogoProps = {
  variant?: "lockup" | "mark";
  tone?: "gradient" | "white" | "dark" | "on-dark" | "app-dark" | "app-light";
  className?: string;
  priority?: boolean;
};

const logoSources = {
  lockup: {
    gradient: "/brand/ai-ledger-lockup-gradient.svg",
    white: "/brand/ai-ledger-lockup-white.svg",
    dark: "/brand/ai-ledger-lockup-dark.svg",
    "on-dark": "/brand/ai-ledger-lockup-on-dark.svg",
    "app-dark": "/brand/ai-ledger-lockup-on-dark.svg",
    "app-light": "/brand/ai-ledger-lockup-dark.svg",
  },
  mark: {
    gradient: "/brand/ai-ledger-mark-gradient.svg",
    white: "/brand/ai-ledger-mark-white.svg",
    dark: "/brand/ai-ledger-mark-dark.svg",
    "on-dark": "/brand/ai-ledger-mark-white.svg",
    "app-dark": "/brand/ai-ledger-mark-app-dark.svg",
    "app-light": "/brand/ai-ledger-mark-app-light.svg",
  },
} as const;

export function AILedgerLogo({
  variant = "lockup",
  tone = "gradient",
  className = "",
  priority = false,
}: LogoProps) {
  return (
    <Image
      src={logoSources[variant][tone]}
      alt="AI Ledger"
      width={variant === "lockup" ? 288 : 64}
      height={variant === "lockup" ? 64 : 64}
      className={className}
      priority={priority}
    />
  );
}
