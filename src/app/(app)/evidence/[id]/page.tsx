import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { findMockEvidenceById } from "@/lib/data/mock-registry";
import { getSupabaseEvidence } from "@/lib/supabase/evidence";

const typeTone = (t: string) =>
  ({
    document: "info",
    screenshot: "muted",
    audit_log: "warning",
    assessment: "success",
    other: "muted",
  } as const)[t as "document" | "screenshot" | "audit_log" | "assessment" | "other"] ?? ("muted" as const);

export default async function EvidenceDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ message?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const { id } = await params;
  const sp = await searchParams;
  const item = isSupabaseAuthEnabled()
    ? await getSupabaseEvidence(context.organisation.id, id)
    : await findMockEvidenceById(id);

  if (!item || item.organisationId !== context.organisation.id) notFound();

  return (
    <AppShell
      current="evidence"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        eyebrow="Evidence Pack"
        title={item.title}
        description={`Linked to ${item.linkedEntityType.replace(/_/g, " ")} · Added ${new Date(item.createdAt).toLocaleDateString("en-GB")}`}
        actions={
          context.permissions.canReviewRecords ? (
            <Link href="/evidence/new"
              className="brand-button-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold">
              Add more
            </Link>
          ) : null
        }
      />

      {sp.message === "created" && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">Evidence item saved.</div>
      )}

      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <WorkspacePanel>
          {item.notes ? (
            <>
              <p className="text-sm font-semibold text-white">Notes</p>
              <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">{item.notes}</p>
            </>
          ) : (
            <p className="text-sm text-[var(--ai-text-secondary)]">No notes recorded for this evidence item.</p>
          )}

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[
              { label: "Entity type", value: item.linkedEntityType.replace(/_/g, " ") },
              { label: "Added", value: new Date(item.createdAt).toLocaleDateString("en-GB") },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-4 py-4">
                <p className="text-xs uppercase tracking-wider text-[var(--ai-text-muted)]">{label}</p>
                <p className="mt-2 text-sm font-medium capitalize text-white">{value}</p>
              </div>
            ))}
          </div>
        </WorkspacePanel>

        <div className="space-y-5">
          <WorkspacePanel>
            <p className="text-sm text-[var(--ai-text-secondary)]">Type</p>
            <div className="mt-3">
              <StatusPill
                label={item.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                tone={typeTone(item.type)}
              />
            </div>
          </WorkspacePanel>
          {item.fileUrl && (
            <WorkspacePanel>
              <p className="text-sm font-semibold text-white">File</p>
              <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
                className="mt-3 block text-sm text-[var(--ai-cyan)] hover:text-white">
                Download →
              </a>
            </WorkspacePanel>
          )}
        </div>
      </div>
    </AppShell>
  );
}
