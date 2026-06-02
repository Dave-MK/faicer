export const aiLedgerTheme = {
  brand: {
    name: "AI Ledger", // locked
    tagline: "Governance. Evidence. Trust.",
  },
  colors: {
    background: "#071120",
    backgroundDeep: "#040B16",
    surface: "#0B172A",
    surfaceRaised: "#101F36",
    surfaceSoft: "#13243D",
    surfaceHover: "#172B49",
    border: "#203552",
    borderStrong: "#2A4B73",
    textPrimary: "#FFFFFF",
    textSecondary: "#A7B6CD",
    textMuted: "#6F829E",
    cyan: "#00D4FF",
    blue: "#0099FF",
    indigo: "#4C68FF",
    violet: "#7A38FF",
    purple: "#A854FF",
    success: "#24D17E",
    warning: "#FFB020",
    danger: "#FF5A63",
    info: "#3B82F6",
  },
  gradients: {
    brand:
      "linear-gradient(135deg, #00D4FF 0%, #0099FF 28%, #4C68FF 56%, #7A38FF 78%, #A854FF 100%)",
    button:
      "linear-gradient(135deg, #0099FF 0%, #4C68FF 55%, #7A38FF 100%)",
  },
} as const;
