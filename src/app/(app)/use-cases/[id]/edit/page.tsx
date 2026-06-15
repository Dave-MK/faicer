import { notFound } from "next/navigation";
import { AppShell } from "@/app/(app)/_components/app-shell";
import { updateUseCaseAction } from "@/app/actions/use-cases";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import {
  findMockUseCaseById,
  listMockToolsForOrganisation,
} from "@/lib/data/mock-registry";

export default async function EditUseCasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const context = await requireWorkspaceContext(["owner", "admin"]);
  const { id } = await params;
  const sp = await searchParams;

  const [useCase, tools] = await Promise.all([
    findMockUseCaseById(id),
    listMockToolsForOrganisation(context.organisation.id),
  ]);

  if (!useCase || useCase.organisationId !== context.organisation.id) {
    notFound();
  }

  return (
    <AppShell
      current="use-cases"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <section className="mb-6">
        <p className="brand-eyebrow">AI Use Cases</p>
        <h1 className="mt-2 text-[2.7rem] font-semibold tracking-[-0.04em] text-white">
          Edit use case
        </h1>
      </section>

      <div className="brand-panel rounded-[2rem] p-8">
        {sp.error === "invalid-form" && (
          <div className="mb-5 brand-status-danger rounded-2xl px-4 py-4 text-sm">
            Complete all required fields before saving.
          </div>
        )}

        <form action={updateUseCaseAction} className="grid gap-4 md:grid-cols-2">
          <input type="hidden" name="useCaseId" value={useCase.id} />
          <input type="hidden" name="ownerUserId" value={useCase.ownerUserId} />

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Title</span>
            <input
              type="text"
              name="title"
              required
              defaultValue={useCase.title}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">AI Tool</span>
            <select
              name="toolId"
              defaultValue={useCase.toolId}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              {tools.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Business unit</span>
            <input
              type="text"
              name="businessUnit"
              required
              defaultValue={useCase.businessUnit}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Risk level</span>
            <select
              name="riskLevel"
              defaultValue={useCase.riskLevel}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Status</span>
            <select
              name="status"
              defaultValue={useCase.status}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            >
              <option value="draft">Draft</option>
              <option value="approved">Approved</option>
              <option value="restricted">Restricted</option>
              <option value="prohibited">Prohibited</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Description</span>
            <textarea
              name="description"
              rows={3}
              required
              defaultValue={useCase.description}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Data involved</span>
            <textarea
              name="dataInvolved"
              rows={3}
              defaultValue={useCase.dataInvolved}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-ink">Mitigations</span>
            <textarea
              name="mitigations"
              rows={3}
              defaultValue={useCase.mitigations}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-ink">Next review date</span>
            <input
              type="date"
              name="nextReviewAt"
              defaultValue={useCase.nextReviewAt ?? ""}
              className="brand-input w-full rounded-2xl px-4 py-3 outline-none transition"
            />
          </label>

          <div className="flex items-end md:col-span-2">
            <button
              type="submit"
              className="brand-button-primary inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
