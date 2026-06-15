import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";
import { listMockMembershipsForOrganisation, getCombinedMockUsers } from "@/lib/data/mock-registry";
import { inviteMemberAction, updateMemberRoleAction, deactivateMemberAction } from "@/app/actions/members";

const roleTone = (r: string) =>
  ({ owner: "danger", admin: "warning", reviewer: "info", staff: "muted" } as const)[
    r as "owner" | "admin" | "reviewer" | "staff"
  ] ?? ("muted" as const);

const statusTone = (s: string) =>
  ({ active: "success", invited: "info", suspended: "muted" } as const)[
    s as "active" | "invited" | "suspended"
  ] ?? ("muted" as const);

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; message?: string; error?: string }>;
}) {
  const context = await requireWorkspaceContext();
  const params = await searchParams;
  const tab = params.tab ?? "general";
  const canManage = context.permissions.canManageOrganisation;

  const [memberships, allUsers] = await Promise.all([
    listMockMembershipsForOrganisation(context.organisation.id),
    getCombinedMockUsers(),
  ]);
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  return (
    <AppShell
      current="settings"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Settings"
        description="Configure your organisation, team access, and governance preferences."
      />

      <WorkspacePanel>
        <div className="grid gap-5 xl:grid-cols-[0.28fr_0.72fr]">
          <nav className="space-y-1">
            {[
              { key: "general", label: "General" },
              { key: "members", label: "Users & Access" },
              { key: "notifications", label: "Notifications" },
            ].map(({ key, label }) => (
              <a
                key={key}
                href={`/settings?tab=${key}`}
                className={`block rounded-2xl px-4 py-3 text-sm transition-colors ${
                  tab === key
                    ? "bg-[linear-gradient(135deg,#1243d6_0%,#1c65ff_100%)] text-white"
                    : "text-[var(--ai-text-secondary)] hover:text-white"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div>
            {tab === "general" && (
              <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["Organisation Name", context.organisation.name],
                    ["Industry", context.organisation.sector],
                    ["Country", context.organisation.country],
                    ["Team size", context.organisation.employeeBand],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-[rgba(8,18,34,0.78)] px-4 py-4">
                      <p className="text-sm text-[var(--ai-text-muted)]">{label}</p>
                      <p className="mt-2 text-sm text-white">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-2xl bg-[rgba(8,18,34,0.78)] px-4 py-4">
                  <p className="text-sm font-semibold text-white">Your account</p>
                  <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
                    <div>
                      <p className="text-[var(--ai-text-muted)]">Display name</p>
                      <p className="mt-1 text-white">{context.user.displayName}</p>
                    </div>
                    <div>
                      <p className="text-[var(--ai-text-muted)]">Email</p>
                      <p className="mt-1 text-white">{context.user.email}</p>
                    </div>
                    <div>
                      <p className="text-[var(--ai-text-muted)]">Role</p>
                      <p className="mt-1 capitalize text-white">{context.membership.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === "members" && (
              <div className="space-y-5">
                {params.message === "invited" && (
                  <div className="brand-status-success rounded-2xl px-4 py-3 text-sm">Invitation sent.</div>
                )}
                {params.message === "updated" && (
                  <div className="brand-status-success rounded-2xl px-4 py-3 text-sm">Role updated.</div>
                )}
                {params.message === "deactivated" && (
                  <div className="brand-status-warning rounded-2xl px-4 py-3 text-sm">Member deactivated.</div>
                )}

                <div className="table-shell rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)]">
                  <table>
                    <thead>
                      <tr>
                        <th>Member</th>
                        <th>Role</th>
                        <th>Status</th>
                        {canManage && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {memberships.map((m) => {
                        const member = userMap.get(m.userId);
                        return (
                        <tr key={m.id}>
                          <td className="font-medium text-white">
                            <div>{member?.displayName ?? m.userId}</div>
                            {member?.email && <div className="text-xs text-[var(--ai-text-muted)]">{member.email}</div>}
                          </td>
                          <td>
                            <StatusPill
                              label={m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                              tone={roleTone(m.role)}
                            />
                          </td>
                          <td>
                            <StatusPill
                              label={m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                              tone={statusTone(m.status)}
                            />
                          </td>
                          {canManage && (
                            <td>
                              {m.userId !== context.user.id && m.status === "active" && (
                                <div className="flex gap-2">
                                  <form action={updateMemberRoleAction} className="flex gap-2">
                                    <input type="hidden" name="membershipId" value={m.id} />
                                    <select name="role" defaultValue={m.role}
                                      className="brand-input h-8 rounded-lg px-2 text-xs outline-none">
                                      <option value="admin">Admin</option>
                                      <option value="reviewer">Reviewer</option>
                                      <option value="staff">Staff</option>
                                    </select>
                                    <button type="submit"
                                      className="rounded-lg border border-[var(--ai-border)] px-2 py-1 text-xs text-[var(--ai-text-secondary)] hover:text-white">
                                      Update
                                    </button>
                                  </form>
                                  <form action={deactivateMemberAction}>
                                    <input type="hidden" name="membershipId" value={m.id} />
                                    <button type="submit"
                                      className="rounded-lg border border-[rgba(255,80,80,0.3)] px-2 py-1 text-xs text-[var(--ai-danger)] hover:bg-[rgba(255,80,80,0.1)]">
                                      Remove
                                    </button>
                                  </form>
                                </div>
                              )}
                            </td>
                          )}
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {canManage && (
                  <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
                    <p className="text-sm font-semibold text-white">Invite a team member</p>
                    {params.error === "invalid-form" && (
                      <div className="mt-3 brand-status-danger rounded-2xl px-4 py-3 text-sm">Check all fields.</div>
                    )}
                    <form action={inviteMemberAction} className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto_auto]">
                      <input type="text" name="displayName" required placeholder="Display name"
                        className="brand-input h-10 rounded-xl px-3 text-sm outline-none" />
                      <input type="email" name="email" required placeholder="Email address"
                        className="brand-input h-10 rounded-xl px-3 text-sm outline-none" />
                      <select name="role" defaultValue="staff" className="brand-input h-10 rounded-xl px-3 text-sm outline-none">
                        <option value="admin">Admin</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="staff">Staff</option>
                      </select>
                      <button type="submit"
                        className="brand-button-primary inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium">
                        Invite
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}

            {tab === "notifications" && (
              <div className="rounded-[22px] border border-[var(--ai-border)] bg-[rgba(255,255,255,0.03)] p-5">
                <p className="text-sm font-semibold text-white">Notification preferences</p>
                <div className="mt-4 space-y-4">
                  {[
                    { label: "Email on new incident", description: "Send an email when a new incident is reported" },
                    { label: "Weekly governance digest", description: "Summary of risks, policies, and training status" },
                    { label: "Policy acknowledgement reminders", description: "Remind members of unacknowledged policies" },
                  ].map(({ label, description }) => (
                    <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-[rgba(8,18,34,0.78)] px-4 py-4">
                      <div>
                        <p className="text-sm text-white">{label}</p>
                        <p className="mt-1 text-xs text-[var(--ai-text-muted)]">{description}</p>
                      </div>
                      <span className="h-6 w-11 flex-shrink-0 rounded-full bg-[linear-gradient(135deg,#1c65ff_0%,#7a38ff_100%)]" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </WorkspacePanel>
    </AppShell>
  );
}
