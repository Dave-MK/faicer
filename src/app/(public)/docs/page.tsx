import { promises as fs } from "node:fs";
import path from "node:path";

export default async function DocsPage() {
  const docPath = path.join(process.cwd(), "docs", "implementation-research.md");
  const content = await fs.readFile(docPath, "utf8");

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-10 lg:px-10">
      <section className="rounded-[2rem] border border-line bg-panel p-8 shadow-[var(--shadow)]">
        <div className="mb-6 space-y-2">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent-strong">
            Documentation
          </p>
          <h1 className="text-3xl font-semibold">Implementation research</h1>
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-muted">
          {content}
        </pre>
      </section>
    </main>
  );
}
