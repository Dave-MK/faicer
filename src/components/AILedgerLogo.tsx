import Image from "next/image";

type LogoProps = {
  variant?: "lockup" | "mark";
  tone?: "gradient" | "white" | "dark";
  className?: string;
  priority?: boolean;
};

/**
 * Locked AI Ledger logo component.
 *
 * The wordmark text is intentionally hardcoded in the supplied SVG asset.
 * Do not add a productName prop and do not replace the asset with dynamic text.
 */
export function AILedgerLogo({
  variant = "lockup",
  tone = "gradient",
  className = "",
  priority = false,
}: LogoProps) {
  const file =
    variant === "mark"
      ? `/brand/ai-ledger-mark-${tone}.svg`
      : `/brand/ai-ledger-lockup-${tone}.svg`;

  return (
    <Image
      src={file}
      alt="AI Ledger"
      width={variant === "mark" ? 240 : 1120}
      height={variant === "mark" ? 230 : 260}
      className={className}
      priority={priority}
    />
  );
}
