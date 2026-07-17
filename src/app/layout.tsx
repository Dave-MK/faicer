import type { Metadata, Viewport } from "next";
import "@/styles/fonts.css";
import "@/styles/theme.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://faicer.site"),
  title: {
    default: "FAICER | AI Governance Platform",
    template: "%s | FAICER",
  },
  description:
    "Govern AI with evidence, not assumptions. FAICER helps organisations manage AI systems, controls, approvals, evidence, and audit readiness.",
  applicationName: "FAICER",
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: "https://faicer.site",
    siteName: "FAICER",
    title: "FAICER | AI Governance Platform",
    description:
      "Manage AI systems, assess risk, assign ownership, collect evidence, and strengthen regulatory readiness.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAICER | AI Governance Platform",
    description: "Govern AI with evidence, not assumptions.",
  },
};

export const viewport: Viewport = {
  themeColor: "#09111f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        data-theme="dark-app"
        className="min-h-full bg-canvas text-ink selection:bg-[rgba(94,141,222,0.24)]"
      >
        {children}
      </body>
    </html>
  );
}
