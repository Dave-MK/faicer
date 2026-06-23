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
  title: "FAICER",
  description: "Fundamental AI Compliance & Education Register. Comply. Educate. Record. Prove.",
  applicationName: "FAICER",
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0B0F1F",
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
        className="min-h-full bg-canvas text-ink selection:bg-[rgba(255,77,184,0.24)]"
      >
        {children}
      </body>
    </html>
  );
}
