import "@/styles/fonts.css";
import "@/styles/theme.css";
import { AILedgerLogo } from "@/components/AILedgerLogo";

export default function ExampleShell() {
  return (
    <main data-theme="dark-app" className="min-h-screen bg-[var(--page-bg)] text-[var(--copy)]">
      <aside className="w-64 border-r border-[var(--panel-border)] bg-[var(--ai-bg-deep)] p-5">
        <AILedgerLogo variant="lockup" className="h-auto w-48" priority />
      </aside>
    </main>
  );
}
