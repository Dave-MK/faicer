import { promises as fs } from "node:fs";
import path from "node:path";
import { AILedgerLogo } from "@/components/AILedgerLogo";

export default async function DocsPage() {
  const docPath = path.join(process.cwd(), "docs", "implementation-research.md");
  const content = await fs.readFile(docPath, "utf8");

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10 lg:px-10">
      <section className="brand-panel rounded-[2rem] p-8">
        <div className="mb-8 space-y-4">
          <AILedgerLogo
            variant="lockup"
            tone="gradient"
            className="h-auto w-full max-w-[18rem]"
            priority
          />
          <p className="brand-eyebrow">
            Documentation
          </p>
          <h1 className="text-3xl font-semibold">Implementation research</h1>
        </div>

        <section
          data-theme="light-surface"
          className="rounded-[1.75rem] border border-[var(--panel-border)] bg-[var(--panel-bg)] p-6 shadow-[var(--ai-shadow-panel)]"
        >
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-[var(--copy-secondary)]">
            {content}
          </pre>
        </section>
      </section>
    </main>
  );
}
