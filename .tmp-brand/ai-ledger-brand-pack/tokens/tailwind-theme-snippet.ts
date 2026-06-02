// Merge into tailwind.config.ts if Tailwind is used.
export const aiLedgerTailwindTheme = {
  extend: {
    colors: {
      ai: {
        bg: "#071120",
        "bg-deep": "#040B16",
        surface: "#0B172A",
        raised: "#101F36",
        soft: "#13243D",
        hover: "#172B49",
        border: "#203552",
        "border-strong": "#2A4B73",
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
    },
    fontFamily: {
      sans: ['"Plus Jakarta Sans"', "Inter", "Arial", "sans-serif"],
    },
    backgroundImage: {
      "ai-gradient":
        "linear-gradient(135deg, #00D4FF 0%, #0099FF 28%, #4C68FF 56%, #7A38FF 78%, #A854FF 100%)",
    },
  },
};
