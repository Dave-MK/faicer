import type { Metadata, Viewport } from "next";
import { Orbitron } from "next/font/google";
import "@/styles/fonts.css";
import "@/styles/theme.css";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://faicer.site"),
  title: {
    default: "FAICER — AI Compliance & Education Register",
    template: "%s · FAICER",
  },
  description: "Fundamental AI Compliance & Education Register. Comply. Educate. Record. Prove.",
  applicationName: "FAICER",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://faicer.site",
    siteName: "FAICER",
    title: "FAICER — AI Compliance & Education Register",
    description: "Govern your AI use cases, prove compliance, and train your team. Comply. Educate. Record. Prove.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAICER — AI Compliance & Education Register",
    description: "Govern your AI use cases, prove compliance, and train your team.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0E1320",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${orbitron.variable}`}>
      <body
        data-theme="dark-app"
        className="min-h-full bg-canvas text-ink selection:bg-[rgba(99,102,241,0.24)]"
      >
        {children}
      </body>
    </html>
  );
}
