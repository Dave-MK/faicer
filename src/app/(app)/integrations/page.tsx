import { AppShell } from "@/app/(app)/_components/app-shell";
import {
  StatusPill,
  WorkspaceHeader,
  WorkspacePanel,
} from "@/app/(app)/_components/workspace-primitives";
import { requireWorkspaceContext } from "@/lib/auth/workspace";

type IntegrationStatus = "connected" | "pending" | "planned";

const integrations: {
  name: string;
  vendor: string;
  description: string;
  category: string;
  status: IntegrationStatus;
}[] = [
  {
    name: "Microsoft 365",
    vendor: "Microsoft",
    description: "Import documents and SharePoint content as evidence items. Sync policy acknowledgements with M365 compliance centre.",
    category: "Evidence & documents",
    status: "planned",
  },
  {
    name: "Okta",
    vendor: "Okta",
    description: "Pull access reviews and user provisioning data as evidence for membership and entitlement controls.",
    category: "Identity & access",
    status: "planned",
  },
  {
    name: "Jira",
    vendor: "Atlassian",
    description: "Link incidents to Jira issues and sync resolution status bidirectionally.",
    category: "ITSM",
    status: "planned",
  },
  {
    name: "Slack",
    vendor: "Salesforce",
    description: "Send governance alerts and policy acknowledgement reminders to Slack channels and direct messages.",
    category: "Notifications",
    status: "planned",
  },
  {
    name: "OneTrust",
    vendor: "OneTrust",
    description: "Import vendor risk assessments and privacy inventory data directly into your evidence pack.",
    category: "Risk & compliance",
    status: "planned",
  },
  {
    name: "Azure OpenAI",
    vendor: "Microsoft",
    description: "Automatically classify and log Azure OpenAI usage against registered use cases and policies.",
    category: "AI platforms",
    status: "planned",
  },
  {
    name: "Webhook (inbound)",
    vendor: "Generic",
    description: "POST governance events from any system to AI Ledger. Supports incidents, evidence, and audit log entries.",
    category: "API & webhooks",
    status: "planned",
  },
  {
    name: "CSV / JSON import",
    vendor: "Generic",
    description: "Bulk-import tools, risks, policies, or evidence items from a spreadsheet or JSON export.",
    category: "API & webhooks",
    status: "planned",
  },
  {
    name: "Email notifications",
    vendor: "AI Ledger",
    description: "Built-in email delivery for incident alerts, policy reminders, and overdue assessment notifications.",
    category: "Notifications",
    status: "planned",
  },
];

const statusTone = (s: IntegrationStatus) =>
  ({ connected: "success", pending: "warning", planned: "muted" } as const)[s];

const statusLabel = (s: IntegrationStatus) =>
  ({ connected: "Connected", pending: "Pending setup", planned: "Coming soon" } as const)[s];

const categories = [...new Set(integrations.map((i) => i.category))];

export default async function IntegrationsPage() {
  const context = await requireWorkspaceContext();

  return (
    <AppShell
      current="integrations"
      organisationName={context.organisation.name}
      userDisplayName={context.user.displayName}
      role={context.membership.role}
    >
      <WorkspaceHeader
        title="Integrations"
        description="Connect the systems that feed your evidence, reviews, and audit trail. Native integrations are in development."
      />

      <div className="mb-5 brand-panel rounded-[2rem] p-5 text-sm text-[var(--ai-text-secondary)]">
        Integrations are currently in development. Each connector will push data directly into your Evidence Pack, Risk Register, or Incident log — no manual copy-paste. Sign up to the early access list to be notified when a connector ships.
      </div>

      {categories.map((cat) => {
        const catItems = integrations.filter((i) => i.category === cat);
        return (
          <div key={cat} className="mb-8">
            <p className="mb-3 text-sm font-semibold text-[var(--ai-text-muted)] uppercase tracking-wider">{cat}</p>
            <div className="grid gap-4 xl:grid-cols-3">
              {catItems.map((integration) => (
                <WorkspacePanel key={integration.name}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-white">{integration.name}</p>
                      <p className="mt-0.5 text-xs text-[var(--ai-text-muted)]">{integration.vendor}</p>
                    </div>
                    <StatusPill label={statusLabel(integration.status)} tone={statusTone(integration.status)} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--ai-text-secondary)]">{integration.description}</p>
                  {integration.status === "connected" && (
                    <button type="button"
                      className="mt-4 text-sm text-[var(--ai-danger)] hover:text-white">
                      Disconnect
                    </button>
                  )}
                  {integration.status === "pending" && (
                    <button type="button"
                      className="mt-4 text-sm text-[var(--ai-cyan)] hover:text-white">
                      Complete setup →
                    </button>
                  )}
                  {integration.status === "planned" && (
                    <p className="mt-4 text-xs text-[var(--ai-text-muted)]">Notify me when available</p>
                  )}
                </WorkspacePanel>
              ))}
            </div>
          </div>
        );
      })}
    </AppShell>
  );
}
