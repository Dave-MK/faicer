import { redirect } from "next/navigation";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  RingScore,
  StatusPill,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { useCaseRows } from "@/lib/reference-content";

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default async function UseCaseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { slug } = await params;
  const useCase = useCaseRows.find((row) => slugify(row.title) === slug);

  if (!useCase) {
    redirect("/use-cases");
  }

  const riskScore = useCase.risk === "High" ? 78 : useCase.risk === "Medium" ? 48 : 28;

  return (
    <AppShell
      current="use-cases"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
              {useCase.title}
            </h1>
            <StatusPill
              label={useCase.status}
              tone={
                useCase.status === "Approved"
                  ? "success"
                  : useCase.status === "Restricted"
                    ? "warning"
                    : "danger"
              }
            />
          </div>
          <p className="mt-2 text-lg text-[var(--ai-text-secondary)]">
            {useCase.tool} · {useCase.unit}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="brand-button-secondary inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            Edit
          </button>
          <button
            type="button"
            className="brand-button-secondary inline-flex rounded-xl px-4 py-2.5 text-sm font-semibold"
          >
            Actions
          </button>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap gap-6 border-b border-[var(--ai-border)] pb-4 text-sm">
        {[
          "Overview",
          "Assessments (1)",
          "Controls",
          "Evidence",
          "Risks",
          "Activity",
        ].map((item, index) => (
          <span
            key={item}
            className={
              index === 0
                ? "border-b-2 border-[var(--ai-blue)] pb-4 font-medium text-[var(--ai-blue)]"
                : "pb-4 text-[var(--ai-text-secondary)]"
            }
          >
            {item}
          </span>
        ))}
      </div>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_1fr_0.9fr]">
        <WorkspacePanel>
          <h2 className="text-lg font-semibold text-white">Use case summary</h2>
          <div className="mt-5 space-y-4 text-sm">
            {[
              ["Description", "Create and refine business-ready outputs with appropriate review."],
              ["Business unit", useCase.unit],
              ["Tool", useCase.tool],
              ["Risk level", useCase.risk],
              ["Owner", useCase.owner],
              ["Last review", useCase.review],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <p className="text-[var(--ai-text-muted)]">{label}</p>
                <p className="mt-2 text-white">{value}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <h2 className="text-lg font-semibold text-white">Risk & compliance</h2>
          <div className="mt-5 flex items-center gap-6">
            <RingScore score={String(riskScore)} label="/100" size="medium" />
            <div>
              <p className="text-sm text-[var(--ai-text-secondary)]">Current rating</p>
              <p className="mt-2 text-2xl font-semibold text-white">{useCase.risk}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-sm">
            {[
              ["Content accuracy", useCase.risk],
              ["Brand & IP", "Low"],
              ["Data privacy", "Medium"],
              ["Bias & fairness", "Low"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[var(--ai-text-secondary)]">{label}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <h2 className="text-lg font-semibold text-white">Policy alignment</h2>
          <div className="mt-5 space-y-3">
            {[
              "Acceptable Use Policy",
              "Data Classification Policy",
              "AI Usage Policy",
              "Privacy Policy",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="text-sm text-white">{item}</span>
                <StatusPill label="Compliant" tone="success" />
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <h2 className="text-lg font-semibold text-white">Key controls</h2>
          <div className="mt-5 space-y-3 text-sm text-white">
            {[
              "Human review before publication",
              "No confidential data in prompts",
              "Output must be fact checked",
              "Use only approved accounts",
            ].map((item) => (
              <div key={item} className="rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                {item}
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <h2 className="text-lg font-semibold text-white">Evidence</h2>
          <div className="mt-5 space-y-3 text-sm">
            {[
              "Content review checklist",
              "Prompt examples",
              "Quarterly approval log",
              "Usage sample audit",
            ].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="text-white">{item}</span>
                <span className="text-[var(--ai-text-secondary)]">May {18 - index}, 2024</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <h2 className="text-lg font-semibold text-white">Activity</h2>
          <div className="mt-5 space-y-3 text-sm">
            {[
              "Approved",
              "Human review required",
              "Created",
            ].map((item, index) => (
              <div key={item} className="flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <span className="text-white">{item}</span>
                <span className="text-[var(--ai-text-secondary)]">Apr {19 - index}, 2024</span>
              </div>
            ))}
          </div>
        </WorkspacePanel>
      </section>
    </AppShell>
  );
}
