import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockPoliciesForOrganisation, listMockAcknowledgementsForUser } from "@/lib/data/mock-registry";
import { listSupabasePolicies, listSupabasePolicyAcknowledgementsForUser } from "@/lib/supabase/policies";

export default async function MyPoliciesPage() {
  const context = await requireWorkspaceContext();
  const [policies, acks] = await Promise.all([
    isSupabaseAuthEnabled()
      ? listSupabasePolicies(context.organisation.id)
      : listMockPoliciesForOrganisation(context.organisation.id),
    isSupabaseAuthEnabled()
      ? listSupabasePolicyAcknowledgementsForUser(context.user.id, context.organisation.id)
      : listMockAcknowledgementsForUser(context.user.id, context.organisation.id),
  ]);

  const activePolicies = policies.filter((p) => p.status === "active");
  const ackedIds = new Set(acks.map((a) => a.policyId));
  const pendingCount = activePolicies.filter((p) => !ackedIds.has(p.id)).length;

  return (
    <AppShell
      current="my-policies"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="My Policies"
        description="Review and acknowledge the policies that apply to your role."
      />

      {pendingCount > 0 && (
        <div className="mb-5 brand-status-warning rounded-2xl px-4 py-4 text-sm">
          You have <strong>{pendingCount}</strong> {pendingCount === 1 ? "policy" : "policies"} awaiting acknowledgement.
        </div>
      )}
      {pendingCount === 0 && activePolicies.length > 0 && (
        <div className="mb-5 brand-status-success rounded-2xl px-4 py-4 text-sm">
          All policies acknowledged — you are up to date.
        </div>
      )}

      <WorkspacePanel>
        <div className="space-y-3">
          {activePolicies.map((policy) => {
            const ack = acks.find((a) => a.policyId === policy.id);
            return (
              <div key={policy.id} className="flex flex-col gap-4 rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] px-5 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <Link href={`/policies/${policy.id}`} className="font-semibold text-white hover:text-[var(--ai-cyan)]">
                    {policy.title}
                  </Link>
                  <p className="mt-1 text-sm text-[var(--ai-text-secondary)]">
                    Version {policy.version}
                    {policy.effectiveDate && ` · Effective ${new Date(policy.effectiveDate).toLocaleDateString("en-GB")}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {ack ? (
                    <>
                      <StatusPill label="Acknowledged" tone="success" />
                      <span className="text-xs text-[var(--ai-text-muted)]">
                        {new Date(ack.acknowledgedAt).toLocaleDateString("en-GB")}
                      </span>
                    </>
                  ) : (
                    <>
                      <StatusPill label="Pending" tone="warning" />
                      <Link href={`/policies/${policy.id}`}
                        className="brand-button-primary inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium">
                        Review & acknowledge →
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          {activePolicies.length === 0 && (
            <p className="py-6 text-center text-sm text-[var(--ai-text-secondary)]">No active policies to review.</p>
          )}
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
