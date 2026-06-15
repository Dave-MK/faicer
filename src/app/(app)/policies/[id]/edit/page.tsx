import { notFound } from "next/navigation";
import { AppShell } from "@/app/(app)/_components/app-shell";
import { updatePolicyAction } from "@/app/actions/policies";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { findMockPolicyById } from "@/lib/data/mock-registry";

export default async function EditPolicyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const { id } = await params;
  const sp = await searchParams;
  const policy = await findMockPolicyById(id);

  if (!policy || policy.organisationId !== context.organisation.id) {
    notFound();
  }

  return (
    <AppShell
      current="policies"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">Policies</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
          Edit policy
        </h1>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {sp.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">
            Complete all required fields before saving.
          </div>
        )}

        <form action={updatePolicyAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="policyId" value={policy.id} />

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Policy title</span>
            <input
              type="text"
              name="title"
              required
              defaultValue={policy.title}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Status</span>
            <select
              name="status"
              defaultValue={policy.status}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="draft">Draft</option>
              <option value="under_review">Under review</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Effective date</span>
            <input
              type="date"
              name="effectiveDate"
              defaultValue={policy.effectiveDate ?? ""}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Policy body</span>
            <textarea
              name="body"
              rows={20}
              required
              defaultValue={policy.body}
              className="brand-input w-full rounded-2xl px-4 py-3 font-mono text-sm outline-none transition"
            />
          </label>

          <button
            type="submit"
            className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition md:col-span-2"
          >
            Save changes
          </button>
        </form>
      </div>
    </AppShell>
  );
}
