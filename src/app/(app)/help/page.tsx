import Link from "next/link";
import { AppShell } from "@/app/(app)/_components/app-shell";
import { WorkspaceHeader, WorkspacePanel } from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { isSupabaseAuthEnabled } from "@/lib/config/env";
import { listMockPoliciesForOrganisation, listMockCoursesForOrganisation, listMockCompletionsForUser } from "@/lib/data/mock-registry";
import { listSupabasePolicies } from "@/lib/supabase/policies";
import { listSupabaseCourses, listSupabaseCompletionsForUser } from "@/lib/supabase/training";

export default async function HelpPage() {
  const context = await requireWorkspaceContext();
  const supabaseEnabled = isSupabaseAuthEnabled();
  const [policies, courses, completions] = await Promise.all([
    supabaseEnabled
      ? listSupabasePolicies(context.organisation.id)
      : listMockPoliciesForOrganisation(context.organisation.id),
    supabaseEnabled
      ? listSupabaseCourses(context.organisation.id)
      : listMockCoursesForOrganisation(context.organisation.id),
    supabaseEnabled
      ? listSupabaseCompletionsForUser(context.user.id, context.organisation.id)
      : listMockCompletionsForUser(context.user.id, context.organisation.id),
  ]);

  const activePolicies = policies.filter((p) => p.status === "active");
  const completedIds = new Set(completions.map((c) => c.courseId));
  const pendingCourses = courses.filter(
    (c) => c.requiredForRoles.includes(context.membership.role) && !completedIds.has(c.id),
  );

  return (
    <AppShell
      current="help"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Help & Support"
        description="Guides, FAQs, and support paths for responsible AI use."
      />

      {pendingCourses.length > 0 && (
        <div className="mb-5 brand-status-warning rounded-2xl px-4 py-4 text-sm">
          You have <strong>{pendingCourses.length}</strong> required training {pendingCourses.length === 1 ? "course" : "courses"} to complete.{" "}
          <Link href="/training" className="text-white underline">Go to training →</Link>
        </div>
      )}

      <div className="grid gap-5 xl:grid-cols-3">
        <WorkspacePanel>
          <p className="text-sm font-semibold text-[var(--ai-blue)]">Getting started</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Using AI at work</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            Learn the basics of approved AI use. Only use tools listed in the Approved Tools register, and follow your organisation&apos;s policies at all times.
          </p>
          <Link href="/approved-tools" className="mt-4 block text-sm text-[var(--ai-cyan)] hover:text-white">
            View approved tools →
          </Link>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="text-sm font-semibold text-[var(--ai-blue)]">Policies & training</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Stay compliant</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            {activePolicies.length > 0
              ? `There are ${activePolicies.length} active policies you may need to acknowledge. Complete any required training modules to maintain your compliance status.`
              : "No active policies at the moment. Check back or contact your governance team."}
          </p>
          <div className="mt-4 space-y-2">
            <Link href="/my-policies" className="block text-sm text-[var(--ai-cyan)] hover:text-white">
              Review my policies →
            </Link>
            <Link href="/training" className="block text-sm text-[var(--ai-cyan)] hover:text-white">
              Go to training →
            </Link>
          </div>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="text-sm font-semibold text-[var(--ai-blue)]">Report a concern</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Something doesn&apos;t look right?</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            If you&apos;ve seen an AI tool behave unexpectedly, produce biased output, or used in a way that feels wrong — report it. You will not be penalised for raising concerns.
          </p>
          <Link href="/incidents/new" className="mt-4 block text-sm text-[var(--ai-cyan)] hover:text-white">
            Report an incident →
          </Link>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="text-sm font-semibold text-[var(--ai-blue)]">Data & privacy</p>
          <h2 className="mt-2 text-xl font-semibold text-white">What data can I share?</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            Never share personal data, client data, confidential information, or credentials with AI tools unless explicitly authorised. When in doubt, check with the governance team before proceeding.
          </p>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="text-sm font-semibold text-[var(--ai-blue)]">Request a tool</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Need a new AI tool?</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            If you need access to an AI tool that isn&apos;t in the approved list, submit a request to your governance team. Do not use unapproved tools — even free or personal ones — for work purposes.
          </p>
        </WorkspacePanel>

        <WorkspacePanel>
          <p className="text-sm font-semibold text-[var(--ai-blue)]">My activity</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Your governance trail</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">
            View a record of your policy acknowledgements, training completions, and actions taken in the platform.
          </p>
          <Link href="/my-activity" className="mt-4 block text-sm text-[var(--ai-cyan)] hover:text-white">
            View my activity →
          </Link>
        </WorkspacePanel>
      </div>
    </AppShell>
  );
}
