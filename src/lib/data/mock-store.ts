import { randomUUID } from "node:crypto";
import type {
  MockAuditEvent,
  MockAITool,
  MockAssessment,
  MockControl,
  MockEvidenceItem,
  MockIncident,
  MockMembership,
  MockOrganisation,
  MockPolicy,
  MockPolicyAcknowledgement,
  MockRisk,
  MockTrainingCompletion,
  MockTrainingCourse,
  MockUseCase,
  MockUser,
  RiskLevel,
} from "@/lib/types";

const now = () => new Date().toISOString();

function computeRiskLevel(score: number): RiskLevel {
  if (score >= 20) return "critical";
  if (score >= 12) return "high";
  if (score >= 6) return "medium";
  return "low";
}

// ─── Users ────────────────────────────────────────────────────────────────────

const users = new Map<string, MockUser>([
  [
    "user-owner-brightforge",
    {
      id: "user-owner-brightforge",
      email: "owner@brightforge.test",
      displayName: "Maya Patel",
      summary: "Owner account for the BrightForge demo agency.",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "user-admin-brightforge",
    {
      id: "user-admin-brightforge",
      email: "admin@brightforge.test",
      displayName: "Jon Miles",
      summary: "Admin account with organisation management access.",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "user-staff-brightforge",
    {
      id: "user-staff-brightforge",
      email: "staff@brightforge.test",
      displayName: "Avery Chen",
      summary: "Staff account limited to workspace viewing.",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

// ─── Organisations ────────────────────────────────────────────────────────────

const organisations = new Map<string, MockOrganisation>([
  [
    "org-brightforge",
    {
      id: "org-brightforge",
      name: "BrightForge Studio",
      sector: "Marketing agency",
      country: "United Kingdom",
      employeeBand: "11-30",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

// ─── Memberships ──────────────────────────────────────────────────────────────

const memberships = new Map<string, MockMembership>([
  [
    "membership-owner-brightforge",
    {
      id: "membership-owner-brightforge",
      organisationId: "org-brightforge",
      userId: "user-owner-brightforge",
      role: "owner",
      status: "active",
      invitedAt: "2026-06-01T00:00:00.000Z",
      joinedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "membership-admin-brightforge",
    {
      id: "membership-admin-brightforge",
      organisationId: "org-brightforge",
      userId: "user-admin-brightforge",
      role: "admin",
      status: "active",
      invitedAt: "2026-06-01T00:00:00.000Z",
      joinedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "membership-staff-brightforge",
    {
      id: "membership-staff-brightforge",
      organisationId: "org-brightforge",
      userId: "user-staff-brightforge",
      role: "staff",
      status: "active",
      invitedAt: "2026-06-01T00:00:00.000Z",
      joinedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

// ─── Audit Events ─────────────────────────────────────────────────────────────

const auditEvents: MockAuditEvent[] = [
  {
    id: "audit-seed-brightforge",
    organisationId: "org-brightforge",
    actorUserId: "user-owner-brightforge",
    action: "seed.loaded",
    entityType: "organisation",
    entityId: "org-brightforge",
    metadataJson: { source: "mock-seed" },
    createdAt: "2026-06-01T00:00:00.000Z",
  },
];

// ─── AI Tools ─────────────────────────────────────────────────────────────────

const aiTools = new Map<string, MockAITool>([
  [
    "tool-chatgpt-brightforge",
    {
      id: "tool-chatgpt-brightforge",
      organisationId: "org-brightforge",
      name: "ChatGPT Team",
      vendor: "OpenAI",
      websiteUrl: "https://chatgpt.com",
      category: "general_chatbot",
      approvalStatus: "approved",
      accountOwnerUserId: "user-owner-brightforge",
      businessOwnerUserId: "user-owner-brightforge",
      privacyPolicyUrl: "https://openai.com/policies/privacy-policy",
      dataProcessingNotes:
        "No passwords, secrets, or unapproved client personal data. Human review required before delivery.",
      notes: "Approved for ideation, drafting, and internal summarisation.",
      lastReviewedAt: "2026-06-01",
      nextReviewAt: "2026-09-01",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "tool-canva-ai-brightforge",
    {
      id: "tool-canva-ai-brightforge",
      organisationId: "org-brightforge",
      name: "Canva Magic Studio",
      vendor: "Canva",
      websiteUrl: "https://www.canva.com",
      category: "image_generation",
      approvalStatus: "restricted",
      accountOwnerUserId: "user-admin-brightforge",
      businessOwnerUserId: "user-admin-brightforge",
      privacyPolicyUrl: "https://www.canva.com/policies/privacy-policy/",
      dataProcessingNotes:
        "Use brand-safe assets only. Do not upload confidential client design files without approval.",
      notes: "Restricted to concept visuals and internal mockups.",
      lastReviewedAt: "2026-06-01",
      nextReviewAt: "2026-08-15",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

// ─── Use Cases ────────────────────────────────────────────────────────────────

const useCases = new Map<string, MockUseCase>([
  [
    "uc-marketing-chatgpt",
    {
      id: "uc-marketing-chatgpt",
      organisationId: "org-brightforge",
      toolId: "tool-chatgpt-brightforge",
      title: "Draft marketing content",
      description: "Use ChatGPT Team to draft blog posts, social copy, and ad headlines.",
      businessUnit: "Marketing",
      ownerUserId: "user-admin-brightforge",
      riskLevel: "low",
      euAiActTier: "limited",
      status: "approved",
      dataInvolved: "Internal briefs, product descriptions. No personal data.",
      mitigations: "Human review of all outputs before publishing.",
      lastReviewedAt: "2026-06-01",
      nextReviewAt: "2026-09-01",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "uc-design-canva",
    {
      id: "uc-design-canva",
      organisationId: "org-brightforge",
      toolId: "tool-canva-ai-brightforge",
      title: "AI-assisted concept visuals",
      description: "Generate initial concept visuals and mood boards for client pitches.",
      businessUnit: "Design",
      ownerUserId: "user-admin-brightforge",
      riskLevel: "medium",
      euAiActTier: "limited",
      status: "restricted",
      dataInvolved: "Brand assets and colour palettes only.",
      mitigations: "No confidential client IP to be uploaded. Brand-safe assets only.",
      lastReviewedAt: "2026-06-01",
      nextReviewAt: "2026-08-15",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

// ─── Policies ─────────────────────────────────────────────────────────────────

const policies = new Map<string, MockPolicy>([
  [
    "policy-acceptable-use",
    {
      id: "policy-acceptable-use",
      organisationId: "org-brightforge",
      title: "AI Acceptable Use Policy",
      body: `## 1. Purpose\n\nThis policy defines how AI tools may be used by BrightForge Studio staff and contractors.\n\n## 2. Scope\n\nApplies to all employees, contractors, and third parties accessing AI tools on behalf of BrightForge Studio.\n\n## 3. Approved Usage\n\nAI tools listed in the AI Tool Register with status "Approved" may be used for the purposes documented in their associated use cases.\n\n## 4. Prohibited Usage\n\n- Do not enter passwords, API keys, or secrets into any AI tool.\n- Do not upload confidential client data without explicit approval.\n- Do not publish AI-generated content without human review.\n\n## 5. Review\n\nThis policy is reviewed quarterly.`,
      version: "1.0",
      status: "active",
      effectiveDate: "2026-06-01",
      linkedToolIds: ["tool-chatgpt-brightforge", "tool-canva-ai-brightforge"],
      createdByUserId: "user-owner-brightforge",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "policy-data-handling",
    {
      id: "policy-data-handling",
      organisationId: "org-brightforge",
      title: "AI Data Handling Policy",
      body: `## 1. Purpose\n\nThis policy sets out how personal and confidential data must be handled when using AI tools.\n\n## 2. Data Classification\n\n- **Public**: May be used freely with any approved AI tool.\n- **Internal**: May be used with approved tools only after anonymisation.\n- **Confidential**: Must not be entered into any AI tool without written approval.\n\n## 3. Retention\n\nAny AI-generated outputs containing processed personal data must be deleted within 30 days if not incorporated into a deliverable.\n\n## 4. Review\n\nReviewed annually or following a data incident.`,
      version: "1.0",
      status: "active",
      effectiveDate: "2026-06-01",
      linkedToolIds: ["tool-chatgpt-brightforge"],
      createdByUserId: "user-owner-brightforge",
      createdAt: "2026-06-02T00:00:00.000Z",
      updatedAt: "2026-06-02T00:00:00.000Z",
    },
  ],
]);

const policyAcknowledgements = new Map<string, MockPolicyAcknowledgement>([
  [
    "ack-owner-acceptable-use",
    {
      id: "ack-owner-acceptable-use",
      policyId: "policy-acceptable-use",
      organisationId: "org-brightforge",
      userId: "user-owner-brightforge",
      acknowledgedAt: "2026-06-01T10:00:00.000Z",
    },
  ],
  [
    "ack-admin-acceptable-use",
    {
      id: "ack-admin-acceptable-use",
      policyId: "policy-acceptable-use",
      organisationId: "org-brightforge",
      userId: "user-admin-brightforge",
      acknowledgedAt: "2026-06-02T09:00:00.000Z",
    },
  ],
]);

// ─── Risks ────────────────────────────────────────────────────────────────────

const risks = new Map<string, MockRisk>([
  [
    "risk-data-leak-chatgpt",
    {
      id: "risk-data-leak-chatgpt",
      organisationId: "org-brightforge",
      title: "Accidental client data submission to ChatGPT",
      description:
        "A staff member may inadvertently paste confidential client data into ChatGPT, causing a data breach.",
      entityType: "ai_tool",
      entityId: "tool-chatgpt-brightforge",
      severity: 4,
      likelihood: 3,
      riskScore: 12,
      riskLevel: "high",
      mitigation:
        "Mandatory training on data classification. Quarterly reminders. Human review before submission.",
      residualScore: 6,
      ownerUserId: "user-owner-brightforge",
      status: "open",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "risk-brand-canva",
    {
      id: "risk-brand-canva",
      organisationId: "org-brightforge",
      title: "Unauthorised use of client brand assets in Canva AI",
      description:
        "Client logos or proprietary assets could be uploaded into Canva Magic Studio without approval.",
      entityType: "ai_tool",
      entityId: "tool-canva-ai-brightforge",
      severity: 3,
      likelihood: 2,
      riskScore: 6,
      riskLevel: "medium",
      mitigation: "Restrict Canva AI to brand-safe internal assets only. Document in use case.",
      residualScore: 3,
      ownerUserId: "user-admin-brightforge",
      status: "mitigated",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "risk-over-reliance",
    {
      id: "risk-over-reliance",
      organisationId: "org-brightforge",
      title: "Over-reliance on AI-generated content quality",
      description:
        "Staff may publish AI-generated content without adequate review, risking inaccuracies or brand damage.",
      entityType: "organisation",
      entityId: "org-brightforge",
      severity: 3,
      likelihood: 3,
      riskScore: 9,
      riskLevel: "medium",
      mitigation: "Policy requirement for human review before any AI content is published.",
      residualScore: 4,
      ownerUserId: "user-owner-brightforge",
      status: "open",
      createdAt: "2026-06-02T00:00:00.000Z",
      updatedAt: "2026-06-02T00:00:00.000Z",
    },
  ],
]);

// ─── Controls ─────────────────────────────────────────────────────────────────

const controls = new Map<string, MockControl>([
  [
    "control-data-training",
    {
      id: "control-data-training",
      organisationId: "org-brightforge",
      title: "AI Data Handling Training",
      description: "All staff must complete AI data handling training before using any approved AI tool.",
      type: "training",
      status: "active",
      linkedRiskIds: ["risk-data-leak-chatgpt"],
      ownerUserId: "user-owner-brightforge",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "control-human-review",
    {
      id: "control-human-review",
      organisationId: "org-brightforge",
      title: "Mandatory Human Review of AI Outputs",
      description: "All AI-generated content must be reviewed and approved by a human before publication or client delivery.",
      type: "process",
      status: "active",
      linkedRiskIds: ["risk-over-reliance", "risk-data-leak-chatgpt"],
      ownerUserId: "user-owner-brightforge",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "control-asset-restriction",
    {
      id: "control-asset-restriction",
      organisationId: "org-brightforge",
      title: "Canva AI Asset Upload Restrictions",
      description: "Technical and policy controls restricting which assets may be uploaded to Canva Magic Studio.",
      type: "policy",
      status: "active",
      linkedRiskIds: ["risk-brand-canva"],
      ownerUserId: "user-admin-brightforge",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

// ─── Assessments ──────────────────────────────────────────────────────────────

const assessments = new Map<string, MockAssessment>([
  [
    "assessment-chatgpt-q2",
    {
      id: "assessment-chatgpt-q2",
      organisationId: "org-brightforge",
      entityType: "ai_tool",
      entityId: "tool-chatgpt-brightforge",
      assessorUserId: "user-admin-brightforge",
      assessmentDate: "2026-06-01",
      findings:
        "Tool is being used within approved use cases. Data handling policy acknowledged by all active users. One minor gap: not all outputs were being logged before delivery.",
      outcome: "conditional",
      nextAssessmentAt: "2026-09-01",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

// ─── Evidence Items ───────────────────────────────────────────────────────────

const evidenceItems = new Map<string, MockEvidenceItem>([
  [
    "evidence-policy-acceptance",
    {
      id: "evidence-policy-acceptance",
      organisationId: "org-brightforge",
      title: "AI Acceptable Use Policy — Acknowledgements",
      type: "document",
      fileUrl: null,
      linkedEntityType: "policy",
      linkedEntityId: "policy-acceptable-use",
      uploadedByUserId: "user-owner-brightforge",
      notes: "Acknowledgement records exported from the platform.",
      createdAt: "2026-06-02T00:00:00.000Z",
      updatedAt: "2026-06-02T00:00:00.000Z",
    },
  ],
  [
    "evidence-assessment-chatgpt",
    {
      id: "evidence-assessment-chatgpt",
      organisationId: "org-brightforge",
      title: "ChatGPT Team — Q2 Assessment Report",
      type: "assessment",
      fileUrl: null,
      linkedEntityType: "assessment",
      linkedEntityId: "assessment-chatgpt-q2",
      uploadedByUserId: "user-admin-brightforge",
      notes: "Quarterly review completed. Conditional pass — output logging gap identified.",
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

// ─── Incidents ────────────────────────────────────────────────────────────────

const incidents = new Map<string, MockIncident>([
  [
    "incident-prompt-leak",
    {
      id: "incident-prompt-leak",
      organisationId: "org-brightforge",
      title: "Client project name submitted in ChatGPT prompt",
      description:
        "A staff member submitted a prompt referencing a confidential client project name. No personal data was involved. Output was reviewed and discarded.",
      severity: "low",
      status: "resolved",
      linkedToolId: "tool-chatgpt-brightforge",
      linkedUseCaseId: "uc-marketing-chatgpt",
      reporterUserId: "user-staff-brightforge",
      assignedToUserId: "user-admin-brightforge",
      resolvedAt: "2026-06-03T00:00:00.000Z",
      createdAt: "2026-06-03T00:00:00.000Z",
      updatedAt: "2026-06-03T00:00:00.000Z",
    },
  ],
]);

// ─── Training ─────────────────────────────────────────────────────────────────

const trainingCourses = new Map<string, MockTrainingCourse>([
  [
    "course-ai-literacy",
    {
      id: "course-ai-literacy",
      organisationId: "org-brightforge",
      title: "AI Literacy 101",
      description: "An introduction to how AI tools work, common risks, and responsible use principles.",
      requiredForRoles: ["owner", "admin", "reviewer", "staff"],
      durationMinutes: 30,
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
  [
    "course-data-handling",
    {
      id: "course-data-handling",
      organisationId: "org-brightforge",
      title: "AI Data Handling & Privacy",
      description:
        "Covers data classification, what must never be entered into AI tools, and how to handle outputs containing sensitive information.",
      requiredForRoles: ["owner", "admin", "reviewer", "staff"],
      durationMinutes: 45,
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
    },
  ],
]);

const trainingCompletions = new Map<string, MockTrainingCompletion>([
  [
    "completion-owner-literacy",
    {
      id: "completion-owner-literacy",
      courseId: "course-ai-literacy",
      organisationId: "org-brightforge",
      userId: "user-owner-brightforge",
      completedAt: "2026-06-01T10:00:00.000Z",
      certificateUrl: null,
    },
  ],
  [
    "completion-admin-literacy",
    {
      id: "completion-admin-literacy",
      courseId: "course-ai-literacy",
      organisationId: "org-brightforge",
      userId: "user-admin-brightforge",
      completedAt: "2026-06-02T10:00:00.000Z",
      certificateUrl: null,
    },
  ],
  [
    "completion-owner-data",
    {
      id: "completion-owner-data",
      courseId: "course-data-handling",
      organisationId: "org-brightforge",
      userId: "user-owner-brightforge",
      completedAt: "2026-06-01T11:00:00.000Z",
      certificateUrl: null,
    },
  ],
]);

// ─── User queries ─────────────────────────────────────────────────────────────

export function getDemoUsers() {
  return [...users.values()];
}

export function getUserById(userId: string) {
  return users.get(userId) ?? null;
}

export function getUserByEmail(email: string) {
  return [...users.values()].find((user) => user.email === email) ?? null;
}

// ─── Organisation queries ─────────────────────────────────────────────────────

export function getOrganisationById(organisationId: string) {
  return organisations.get(organisationId) ?? null;
}

// ─── Membership queries ───────────────────────────────────────────────────────

export function getMembershipsForUser(userId: string) {
  return [...memberships.values()].filter(
    (membership) => membership.userId === userId && membership.status === "active",
  );
}

export function getMembershipForUserInOrganisation(
  userId: string,
  organisationId: string,
) {
  return (
    [...memberships.values()].find(
      (membership) =>
        membership.userId === userId &&
        membership.organisationId === organisationId &&
        membership.status === "active",
    ) ?? null
  );
}

export function listMembershipsForOrganisation(organisationId: string) {
  return [...memberships.values()].filter(
    (m) => m.organisationId === organisationId,
  );
}

// ─── Audit queries ────────────────────────────────────────────────────────────

export function listAuditEventsForOrganisation(organisationId: string) {
  return auditEvents.filter((event) => event.organisationId === organisationId);
}

// ─── Tool queries ─────────────────────────────────────────────────────────────

export function listToolsForOrganisation(organisationId: string) {
  return [...aiTools.values()].filter(
    (tool) => tool.organisationId === organisationId,
  );
}

export function getToolById(toolId: string) {
  return aiTools.get(toolId) ?? null;
}

export function getDefaultOrganisationId(userId: string) {
  return getMembershipsForUser(userId)[0]?.organisationId ?? null;
}

// ─── Use-case queries ─────────────────────────────────────────────────────────

export function listUseCasesForOrganisation(organisationId: string) {
  return [...useCases.values()].filter((uc) => uc.organisationId === organisationId);
}

export function getUseCaseById(useCaseId: string) {
  return useCases.get(useCaseId) ?? null;
}

// ─── Policy queries ───────────────────────────────────────────────────────────

export function listPoliciesForOrganisation(organisationId: string) {
  return [...policies.values()].filter((p) => p.organisationId === organisationId);
}

export function getPolicyById(policyId: string) {
  return policies.get(policyId) ?? null;
}

export function listAcknowledgementsForPolicy(policyId: string) {
  return [...policyAcknowledgements.values()].filter((a) => a.policyId === policyId);
}

export function getAcknowledgementForUserAndPolicy(userId: string, policyId: string) {
  return (
    [...policyAcknowledgements.values()].find(
      (a) => a.userId === userId && a.policyId === policyId,
    ) ?? null
  );
}

export function listAcknowledgementsForUser(userId: string, organisationId: string) {
  return [...policyAcknowledgements.values()].filter(
    (a) => a.userId === userId && a.organisationId === organisationId,
  );
}

// ─── Risk queries ─────────────────────────────────────────────────────────────

export function listRisksForOrganisation(organisationId: string) {
  return [...risks.values()].filter((r) => r.organisationId === organisationId);
}

export function getRiskById(riskId: string) {
  return risks.get(riskId) ?? null;
}

// ─── Control queries ──────────────────────────────────────────────────────────

export function listControlsForOrganisation(organisationId: string) {
  return [...controls.values()].filter((c) => c.organisationId === organisationId);
}

export function getControlById(controlId: string) {
  return controls.get(controlId) ?? null;
}

// ─── Assessment queries ───────────────────────────────────────────────────────

export function listAssessmentsForOrganisation(organisationId: string) {
  return [...assessments.values()].filter((a) => a.organisationId === organisationId);
}

export function getAssessmentById(assessmentId: string) {
  return assessments.get(assessmentId) ?? null;
}

// ─── Evidence queries ─────────────────────────────────────────────────────────

export function listEvidenceForOrganisation(organisationId: string) {
  return [...evidenceItems.values()].filter((e) => e.organisationId === organisationId);
}

export function getEvidenceById(evidenceId: string) {
  return evidenceItems.get(evidenceId) ?? null;
}

// ─── Incident queries ─────────────────────────────────────────────────────────

export function listIncidentsForOrganisation(organisationId: string) {
  return [...incidents.values()].filter((i) => i.organisationId === organisationId);
}

export function getIncidentById(incidentId: string) {
  return incidents.get(incidentId) ?? null;
}

// ─── Training queries ─────────────────────────────────────────────────────────

export function listCoursesForOrganisation(organisationId: string) {
  return [...trainingCourses.values()].filter((c) => c.organisationId === organisationId);
}

export function getCourseById(courseId: string) {
  return trainingCourses.get(courseId) ?? null;
}

export function listCompletionsForUser(userId: string, organisationId: string) {
  return [...trainingCompletions.values()].filter(
    (c) => c.userId === userId && c.organisationId === organisationId,
  );
}

export function listCompletionsForCourse(courseId: string) {
  return [...trainingCompletions.values()].filter((c) => c.courseId === courseId);
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export function getDashboardStats(organisationId: string) {
  const orgTools = listToolsForOrganisation(organisationId);
  const orgPolicies = listPoliciesForOrganisation(organisationId);
  const orgRisks = listRisksForOrganisation(organisationId);
  const orgEvidence = listEvidenceForOrganisation(organisationId);
  const orgControls = listControlsForOrganisation(organisationId);
  const orgAssessments = listAssessmentsForOrganisation(organisationId);
  const orgUseCases = listUseCasesForOrganisation(organisationId);
  const orgIncidents = listIncidentsForOrganisation(organisationId);

  return {
    tools: {
      total: orgTools.length,
      approved: orgTools.filter((t) => t.approvalStatus === "approved").length,
      restricted: orgTools.filter((t) => t.approvalStatus === "restricted").length,
      prohibited: orgTools.filter((t) => t.approvalStatus === "prohibited").length,
    },
    policies: {
      total: orgPolicies.length,
      active: orgPolicies.filter((p) => p.status === "active").length,
    },
    risks: {
      total: orgRisks.length,
      high: orgRisks.filter((r) => r.riskLevel === "high" || r.riskLevel === "critical").length,
      medium: orgRisks.filter((r) => r.riskLevel === "medium").length,
      low: orgRisks.filter((r) => r.riskLevel === "low").length,
    },
    evidence: { total: orgEvidence.length },
    controls: { total: orgControls.length },
    assessments: { total: orgAssessments.length },
    useCases: {
      total: orgUseCases.length,
      approved: orgUseCases.filter((uc) => uc.status === "approved").length,
    },
    incidents: {
      total: orgIncidents.length,
      open: orgIncidents.filter((i) => i.status === "open" || i.status === "investigating").length,
    },
  };
}

// ─── Mutation: Tools ──────────────────────────────────────────────────────────

export function createMockTool(input: {
  organisationId: string;
  actorUserId: string;
  accountOwnerUserId: string;
  businessOwnerUserId: string;
  name: string;
  vendor: string;
  websiteUrl?: string;
  category: MockAITool["category"];
  approvalStatus: MockAITool["approvalStatus"];
  privacyPolicyUrl?: string;
  dataProcessingNotes?: string;
  notes?: string;
  nextReviewAt: string;
}) {
  const timestamp = now();
  const reviewedOn = timestamp.slice(0, 10);

  const tool: MockAITool = {
    id: randomUUID(),
    organisationId: input.organisationId,
    name: input.name,
    vendor: input.vendor,
    websiteUrl: input.websiteUrl ?? null,
    category: input.category,
    approvalStatus: input.approvalStatus,
    accountOwnerUserId: input.accountOwnerUserId,
    businessOwnerUserId: input.businessOwnerUserId,
    privacyPolicyUrl: input.privacyPolicyUrl ?? null,
    dataProcessingNotes: input.dataProcessingNotes ?? "",
    notes: input.notes ?? "",
    lastReviewedAt: reviewedOn,
    nextReviewAt: input.nextReviewAt,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "ai_tool.created",
    entityType: "ai_tool",
    entityId: tool.id,
    metadataJson: { name: tool.name, approvalStatus: tool.approvalStatus },
    createdAt: timestamp,
  };

  return { tool, auditEvent };
}

export function updateMockTool(
  existing: MockAITool,
  input: {
    actorUserId: string;
    name: string;
    vendor: string;
    websiteUrl?: string;
    category: MockAITool["category"];
    approvalStatus: MockAITool["approvalStatus"];
    privacyPolicyUrl?: string;
    dataProcessingNotes?: string;
    notes?: string;
    nextReviewAt: string;
  },
) {
  const timestamp = now();
  const reviewedOn = timestamp.slice(0, 10);
  const tool: MockAITool = {
    ...existing,
    name: input.name,
    vendor: input.vendor,
    websiteUrl: input.websiteUrl ?? null,
    category: input.category,
    approvalStatus: input.approvalStatus,
    privacyPolicyUrl: input.privacyPolicyUrl ?? null,
    dataProcessingNotes: input.dataProcessingNotes ?? "",
    notes: input.notes ?? "",
    lastReviewedAt: reviewedOn,
    nextReviewAt: input.nextReviewAt,
    updatedAt: timestamp,
  };

  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: existing.organisationId,
    actorUserId: input.actorUserId,
    action: "ai_tool.updated",
    entityType: "ai_tool",
    entityId: existing.id,
    metadataJson: { name: tool.name, approvalStatus: tool.approvalStatus },
    createdAt: timestamp,
  };

  return { tool, auditEvent };
}

// ─── Mutation: Use Cases ──────────────────────────────────────────────────────

export function createMockUseCase(input: {
  organisationId: string;
  actorUserId: string;
  toolId: string;
  title: string;
  description: string;
  businessUnit: string;
  ownerUserId: string;
  riskLevel: MockUseCase["riskLevel"];
  euAiActTier: MockUseCase["euAiActTier"];
  status: MockUseCase["status"];
  dataInvolved: string;
  mitigations: string;
  nextReviewAt?: string;
}) {
  const timestamp = now();
  const useCase: MockUseCase = {
    id: randomUUID(),
    organisationId: input.organisationId,
    toolId: input.toolId,
    title: input.title,
    description: input.description,
    businessUnit: input.businessUnit,
    ownerUserId: input.ownerUserId,
    riskLevel: input.riskLevel,
    euAiActTier: input.euAiActTier,
    status: input.status,
    dataInvolved: input.dataInvolved,
    mitigations: input.mitigations,
    lastReviewedAt: timestamp.slice(0, 10),
    nextReviewAt: input.nextReviewAt ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "use_case.created",
    entityType: "use_case",
    entityId: useCase.id,
    metadataJson: { title: useCase.title, status: useCase.status },
    createdAt: timestamp,
  };
  return { useCase, auditEvent };
}

export function updateMockUseCase(
  existing: MockUseCase,
  input: {
    actorUserId: string;
    toolId: string;
    title: string;
    description: string;
    businessUnit: string;
    ownerUserId: string;
    riskLevel: MockUseCase["riskLevel"];
    euAiActTier: MockUseCase["euAiActTier"];
    status: MockUseCase["status"];
    dataInvolved: string;
    mitigations: string;
    nextReviewAt?: string;
  },
) {
  const timestamp = now();
  const useCase: MockUseCase = {
    ...existing,
    toolId: input.toolId,
    title: input.title,
    description: input.description,
    businessUnit: input.businessUnit,
    ownerUserId: input.ownerUserId,
    riskLevel: input.riskLevel,
    euAiActTier: input.euAiActTier,
    status: input.status,
    dataInvolved: input.dataInvolved,
    mitigations: input.mitigations,
    nextReviewAt: input.nextReviewAt ?? existing.nextReviewAt,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: existing.organisationId,
    actorUserId: input.actorUserId,
    action: "use_case.updated",
    entityType: "use_case",
    entityId: existing.id,
    metadataJson: { title: useCase.title, status: useCase.status },
    createdAt: timestamp,
  };
  return { useCase, auditEvent };
}

// ─── Mutation: Policies ───────────────────────────────────────────────────────

export function createMockPolicy(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  body: string;
  effectiveDate?: string;
}) {
  const timestamp = now();
  const policy: MockPolicy = {
    id: randomUUID(),
    organisationId: input.organisationId,
    title: input.title,
    body: input.body,
    version: "1.0",
    status: "draft",
    effectiveDate: input.effectiveDate ?? null,
    linkedToolIds: [],
    createdByUserId: input.actorUserId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "policy.created",
    entityType: "policy",
    entityId: policy.id,
    metadataJson: { title: policy.title, status: policy.status },
    createdAt: timestamp,
  };
  return { policy, auditEvent };
}

export function updateMockPolicy(
  existing: MockPolicy,
  input: {
    actorUserId: string;
    title: string;
    body: string;
    status: MockPolicy["status"];
    effectiveDate?: string;
    linkedToolIds?: string[];
  },
) {
  const timestamp = now();
  const policy: MockPolicy = {
    ...existing,
    title: input.title,
    body: input.body,
    status: input.status,
    effectiveDate: input.effectiveDate ?? existing.effectiveDate,
    linkedToolIds: input.linkedToolIds ?? existing.linkedToolIds,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: existing.organisationId,
    actorUserId: input.actorUserId,
    action: "policy.updated",
    entityType: "policy",
    entityId: existing.id,
    metadataJson: { title: policy.title, status: policy.status },
    createdAt: timestamp,
  };
  return { policy, auditEvent };
}

export function createMockPolicyAcknowledgement(input: {
  policyId: string;
  organisationId: string;
  userId: string;
}) {
  const timestamp = now();
  const ack: MockPolicyAcknowledgement = {
    id: randomUUID(),
    policyId: input.policyId,
    organisationId: input.organisationId,
    userId: input.userId,
    acknowledgedAt: timestamp,
  };
  return { acknowledgement: ack };
}

// ─── Mutation: Risks ──────────────────────────────────────────────────────────

export function createMockRisk(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  severity: MockRisk["severity"];
  likelihood: MockRisk["likelihood"];
  mitigation: string;
  ownerUserId: string;
}) {
  const timestamp = now();
  const riskScore = input.severity * input.likelihood;
  const riskLevel = computeRiskLevel(riskScore);
  const risk: MockRisk = {
    id: randomUUID(),
    organisationId: input.organisationId,
    title: input.title,
    description: input.description,
    entityType: input.entityType,
    entityId: input.entityId,
    severity: input.severity,
    likelihood: input.likelihood,
    riskScore,
    riskLevel,
    mitigation: input.mitigation,
    residualScore: Math.max(1, Math.floor(riskScore / 2)),
    ownerUserId: input.ownerUserId,
    status: "open",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "risk.created",
    entityType: "risk",
    entityId: risk.id,
    metadataJson: { title: risk.title, riskLevel: risk.riskLevel },
    createdAt: timestamp,
  };
  return { risk, auditEvent };
}

export function updateMockRisk(
  existing: MockRisk,
  input: {
    actorUserId: string;
    title: string;
    description: string;
    severity: MockRisk["severity"];
    likelihood: MockRisk["likelihood"];
    mitigation: string;
    status: MockRisk["status"];
    ownerUserId: string;
  },
) {
  const timestamp = now();
  const riskScore = input.severity * input.likelihood;
  const riskLevel = computeRiskLevel(riskScore);
  const risk: MockRisk = {
    ...existing,
    title: input.title,
    description: input.description,
    severity: input.severity,
    likelihood: input.likelihood,
    riskScore,
    riskLevel,
    mitigation: input.mitigation,
    residualScore: Math.max(1, Math.floor(riskScore / 2)),
    status: input.status,
    ownerUserId: input.ownerUserId,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: existing.organisationId,
    actorUserId: input.actorUserId,
    action: "risk.updated",
    entityType: "risk",
    entityId: existing.id,
    metadataJson: { title: risk.title, riskLevel: risk.riskLevel, status: risk.status },
    createdAt: timestamp,
  };
  return { risk, auditEvent };
}

// ─── Mutation: Controls ───────────────────────────────────────────────────────

export function createMockControl(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  type: MockControl["type"];
  ownerUserId: string;
  linkedRiskIds?: string[];
}) {
  const timestamp = now();
  const control: MockControl = {
    id: randomUUID(),
    organisationId: input.organisationId,
    title: input.title,
    description: input.description,
    type: input.type,
    status: "active",
    linkedRiskIds: input.linkedRiskIds ?? [],
    ownerUserId: input.ownerUserId,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "control.created",
    entityType: "control",
    entityId: control.id,
    metadataJson: { title: control.title, type: control.type },
    createdAt: timestamp,
  };
  return { control, auditEvent };
}

export function updateMockControl(
  existing: MockControl,
  input: {
    actorUserId: string;
    title: string;
    description: string;
    type: MockControl["type"];
    status: MockControl["status"];
    ownerUserId: string;
    linkedRiskIds?: string[];
  },
) {
  const timestamp = now();
  const control: MockControl = {
    ...existing,
    title: input.title,
    description: input.description,
    type: input.type,
    status: input.status,
    ownerUserId: input.ownerUserId,
    linkedRiskIds: input.linkedRiskIds ?? existing.linkedRiskIds,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: existing.organisationId,
    actorUserId: input.actorUserId,
    action: "control.updated",
    entityType: "control",
    entityId: existing.id,
    metadataJson: { title: control.title, status: control.status },
    createdAt: timestamp,
  };
  return { control, auditEvent };
}

// ─── Mutation: Assessments ────────────────────────────────────────────────────

export function createMockAssessment(input: {
  organisationId: string;
  actorUserId: string;
  entityType: string;
  entityId: string;
  assessmentDate: string;
  findings: string;
  outcome: MockAssessment["outcome"];
  nextAssessmentAt?: string;
}) {
  const timestamp = now();
  const assessment: MockAssessment = {
    id: randomUUID(),
    organisationId: input.organisationId,
    entityType: input.entityType,
    entityId: input.entityId,
    assessorUserId: input.actorUserId,
    assessmentDate: input.assessmentDate,
    findings: input.findings,
    outcome: input.outcome,
    nextAssessmentAt: input.nextAssessmentAt ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "assessment.created",
    entityType: "assessment",
    entityId: assessment.id,
    metadataJson: {
      entityType: assessment.entityType,
      entityId: assessment.entityId,
      outcome: assessment.outcome,
    },
    createdAt: timestamp,
  };
  return { assessment, auditEvent };
}

// ─── Mutation: Evidence ───────────────────────────────────────────────────────

export function createMockEvidenceItem(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  type: MockEvidenceItem["type"];
  linkedEntityType: string;
  linkedEntityId: string;
  notes?: string;
}) {
  const timestamp = now();
  const item: MockEvidenceItem = {
    id: randomUUID(),
    organisationId: input.organisationId,
    title: input.title,
    type: input.type,
    fileUrl: null,
    linkedEntityType: input.linkedEntityType,
    linkedEntityId: input.linkedEntityId,
    uploadedByUserId: input.actorUserId,
    notes: input.notes ?? "",
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "evidence.created",
    entityType: "evidence",
    entityId: item.id,
    metadataJson: { title: item.title, type: item.type },
    createdAt: timestamp,
  };
  return { evidenceItem: item, auditEvent };
}

// ─── Mutation: Incidents ──────────────────────────────────────────────────────

export function createMockIncident(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  severity: MockIncident["severity"];
  linkedToolId?: string;
  linkedUseCaseId?: string;
}) {
  const timestamp = now();
  const incident: MockIncident = {
    id: randomUUID(),
    organisationId: input.organisationId,
    title: input.title,
    description: input.description,
    severity: input.severity,
    status: "open",
    linkedToolId: input.linkedToolId ?? null,
    linkedUseCaseId: input.linkedUseCaseId ?? null,
    reporterUserId: input.actorUserId,
    assignedToUserId: null,
    resolvedAt: null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "incident.created",
    entityType: "incident",
    entityId: incident.id,
    metadataJson: { title: incident.title, severity: incident.severity },
    createdAt: timestamp,
  };
  return { incident, auditEvent };
}

export function updateMockIncident(
  existing: MockIncident,
  input: {
    actorUserId: string;
    title: string;
    description: string;
    severity: MockIncident["severity"];
    status: MockIncident["status"];
    assignedToUserId?: string;
  },
) {
  const timestamp = now();
  const incident: MockIncident = {
    ...existing,
    title: input.title,
    description: input.description,
    severity: input.severity,
    status: input.status,
    assignedToUserId: input.assignedToUserId ?? existing.assignedToUserId,
    resolvedAt:
      input.status === "resolved" || input.status === "closed"
        ? (existing.resolvedAt ?? timestamp)
        : existing.resolvedAt,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: existing.organisationId,
    actorUserId: input.actorUserId,
    action: "incident.updated",
    entityType: "incident",
    entityId: existing.id,
    metadataJson: { title: incident.title, status: incident.status },
    createdAt: timestamp,
  };
  return { incident, auditEvent };
}

// ─── Mutation: Training ───────────────────────────────────────────────────────

export function createMockCourse(input: {
  organisationId: string;
  actorUserId: string;
  title: string;
  description: string;
  durationMinutes: number;
  requiredForRoles: MockTrainingCourse["requiredForRoles"];
}) {
  const timestamp = now();
  const course: MockTrainingCourse = {
    id: randomUUID(),
    organisationId: input.organisationId,
    title: input.title,
    description: input.description,
    requiredForRoles: input.requiredForRoles,
    durationMinutes: input.durationMinutes,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "training_course.created",
    entityType: "training_course",
    entityId: course.id,
    metadataJson: { title: course.title },
    createdAt: timestamp,
  };
  return { course, auditEvent };
}

export function createMockTrainingCompletion(input: {
  courseId: string;
  organisationId: string;
  userId: string;
}) {
  const timestamp = now();
  const completion: MockTrainingCompletion = {
    id: randomUUID(),
    courseId: input.courseId,
    organisationId: input.organisationId,
    userId: input.userId,
    completedAt: timestamp,
    certificateUrl: null,
  };
  return { completion };
}

// ─── Mutation: Members ────────────────────────────────────────────────────────

export function addMockMember(input: {
  organisationId: string;
  actorUserId: string;
  displayName: string;
  email: string;
  role: MockMembership["role"];
}) {
  const timestamp = now();
  const userId = randomUUID();
  const membershipId = randomUUID();

  const user: MockUser = {
    id: userId,
    email: input.email,
    displayName: input.displayName,
    summary: "Invited member.",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const membership: MockMembership = {
    id: membershipId,
    organisationId: input.organisationId,
    userId,
    role: input.role,
    status: "active",
    invitedAt: timestamp,
    joinedAt: timestamp,
  };

  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: input.organisationId,
    actorUserId: input.actorUserId,
    action: "member.invited",
    entityType: "membership",
    entityId: membershipId,
    metadataJson: { email: input.email, role: input.role },
    createdAt: timestamp,
  };

  users.set(userId, user);
  memberships.set(membershipId, membership);
  auditEvents.unshift(auditEvent);

  return { user, membership, auditEvent };
}

export function updateMockMemberRole(
  membershipId: string,
  input: { actorUserId: string; role: MockMembership["role"] },
) {
  const existing = memberships.get(membershipId);
  if (!existing) return null;

  const timestamp = now();
  const updated: MockMembership = { ...existing, role: input.role };
  memberships.set(membershipId, updated);

  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: existing.organisationId,
    actorUserId: input.actorUserId,
    action: "member.role_updated",
    entityType: "membership",
    entityId: membershipId,
    metadataJson: { role: input.role },
    createdAt: timestamp,
  };
  auditEvents.unshift(auditEvent);

  return { membership: updated, auditEvent };
}

export function deactivateMockMember(
  membershipId: string,
  actorUserId: string,
) {
  const existing = memberships.get(membershipId);
  if (!existing) return null;

  const timestamp = now();
  const updated: MockMembership = { ...existing, status: "suspended" };
  memberships.set(membershipId, updated);

  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId: existing.organisationId,
    actorUserId,
    action: "member.deactivated",
    entityType: "membership",
    entityId: membershipId,
    metadataJson: {},
    createdAt: timestamp,
  };
  auditEvents.unshift(auditEvent);

  return { membership: updated, auditEvent };
}

// ─── Mutation: Org/User creation ──────────────────────────────────────────────

export function createMockUserWithOrganisation(input: {
  displayName: string;
  email: string;
  organisationName: string;
}) {
  const userId = randomUUID();
  const organisationId = randomUUID();
  const membershipId = randomUUID();
  const timestamp = now();

  const user: MockUser = {
    id: userId,
    email: input.email,
    displayName: input.displayName,
    summary: "Mock user created from the sign-up flow.",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const organisation: MockOrganisation = {
    id: organisationId,
    name: input.organisationName,
    sector: "Creative services",
    country: "United Kingdom",
    employeeBand: "3-10",
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const membership: MockMembership = {
    id: membershipId,
    organisationId,
    userId,
    role: "owner",
    status: "active",
    invitedAt: timestamp,
    joinedAt: timestamp,
  };

  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId,
    actorUserId: userId,
    action: "organisation.created",
    entityType: "organisation",
    entityId: organisationId,
    metadataJson: { mode: "mock-sign-up" },
    createdAt: timestamp,
  };

  users.set(userId, user);
  organisations.set(organisationId, organisation);
  memberships.set(membershipId, membership);
  auditEvents.unshift(auditEvent);

  return { user, organisation, membership, auditEvent };
}

export function createMockOrganisationForUser(
  userId: string,
  input: {
    name: string;
    sector: string;
    country: string;
    employeeBand: string;
  },
) {
  const organisationId = randomUUID();
  const membershipId = randomUUID();
  const timestamp = now();

  const organisation: MockOrganisation = {
    id: organisationId,
    name: input.name,
    sector: input.sector,
    country: input.country,
    employeeBand: input.employeeBand,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  const membership: MockMembership = {
    id: membershipId,
    organisationId,
    userId,
    role: "owner",
    status: "active",
    invitedAt: timestamp,
    joinedAt: timestamp,
  };

  const auditEvent: MockAuditEvent = {
    id: randomUUID(),
    organisationId,
    actorUserId: userId,
    action: "organisation.created",
    entityType: "organisation",
    entityId: organisationId,
    metadataJson: { mode: "mock-owner-create" },
    createdAt: timestamp,
  };

  organisations.set(organisationId, organisation);
  memberships.set(membershipId, membership);
  auditEvents.unshift(auditEvent);

  return { organisation, membership, auditEvent };
}

export function resetMockStore() {
  users.clear();
  organisations.clear();
  memberships.clear();
  aiTools.clear();
  auditEvents.length = 0;
}
