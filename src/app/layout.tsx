import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Ledger",
  description: "Mock-first scaffold for AI governance, policy, and evidence workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-canvas text-ink">{children}</body>
    </html>
  );
}
