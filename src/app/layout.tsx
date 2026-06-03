import type { Metadata, Viewport } from "next";
import "@/styles/fonts.css";
import "@/styles/theme.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Ledger",
  description: "AI governance, evidence, and trust workspace.",
  applicationName: "AI Ledger",
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#071120",
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
        className="min-h-full bg-canvas text-ink selection:bg-[rgba(0,212,255,0.24)]"
      >
        {children}
      </body>
    </html>
  );
}
