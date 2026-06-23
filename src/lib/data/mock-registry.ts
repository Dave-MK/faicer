import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import { getSessionSecret } from "@/lib/config/env";
import {
  getDemoUsers,
  getMembershipForUserInOrganisation,
  getMembershipsForUser,
  getOrganisationById,
  getToolById,
  getUserByEmail,
  getUserById,
  listAuditEventsForOrganisation,
  listToolsForOrganisation,
  listUseCasesForOrganisation,
  getUseCaseById,
  listPoliciesForOrganisation,
  getPolicyById,
  listAcknowledgementsForPolicy,
  getAcknowledgementForUserAndPolicy,
  listAcknowledgementsForUser,
  listRisksForOrganisation,
  getRiskById,
  listControlsForOrganisation,
  getControlById,
  listAssessmentsForOrganisation,
  getAssessmentById,
  listEvidenceForOrganisation,
  getEvidenceById,
  listIncidentsForOrganisation,
  getIncidentById,
  listCoursesForOrganisation,
  getCourseById,
  listCompletionsForUser,
  listCompletionsForCourse,
  listMembershipsForOrganisation,
  getDashboardStats,
} from "@/lib/data/mock-store";
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
  MockRegistry,
  MockRisk,
  MockTrainingCompletion,
  MockTrainingCourse,
  MockUseCase,
  MockUser,
} from "@/lib/types";

const MOCK_REGISTRY_COOKIE = "faicer_mock_registry";

// ─── Zod schemas ──────────────────────────────────────────────────────────────

const mockUserSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  displayName: z.string().min(1),
  summary: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockOrganisationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sector: z.string().min(1),
  country: z.string().min(1),
  employeeBand: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockMembershipSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["owner", "admin", "reviewer", "staff"]),
  status: z.enum(["active", "invited", "suspended"]),
  invitedAt: z.string().min(1),
  joinedAt: z.string().min(1),
});

const mockAuditEventSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  actorUserId: z.string().min(1),
  action: z.string().min(1),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  metadataJson: z.record(z.string(), z.string()),
  createdAt: z.string().min(1),
});

const mockToolSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  name: z.string().min(1),
  vendor: z.string().min(1),
  websiteUrl: z.string().url().nullable(),
  category: z.enum([
    "general_chatbot", "image_generation", "audio_generation", "video_generation",
    "transcription", "meeting_assistant", "coding_assistant", "marketing_automation",
    "crm_feature", "recruitment_feature", "analytics_feature", "other",
  ]),
  approvalStatus: z.enum(["approved", "restricted", "prohibited"]),
  accountOwnerUserId: z.string().min(1),
  businessOwnerUserId: z.string().min(1),
  privacyPolicyUrl: z.string().url().nullable(),
  dataProcessingNotes: z.string(),
  notes: z.string(),
  lastReviewedAt: z.string().nullable(),
  nextReviewAt: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockUseCaseSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  toolId: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  businessUnit: z.string(),
  ownerUserId: z.string().min(1),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["draft", "approved", "restricted", "prohibited", "archived"]),
  dataInvolved: z.string(),
  mitigations: z.string(),
  lastReviewedAt: z.string().nullable(),
  nextReviewAt: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockPolicySchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  title: z.string().min(1),
  body: z.string(),
  version: z.string().min(1),
  status: z.enum(["draft", "under_review", "active", "archived"]),
  effectiveDate: z.string().nullable(),
  linkedToolIds: z.array(z.string()),
  createdByUserId: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockPolicyAcknowledgementSchema = z.object({
  id: z.string().min(1),
  policyId: z.string().min(1),
  organisationId: z.string().min(1),
  userId: z.string().min(1),
  acknowledgedAt: z.string().min(1),
});

const mockRiskSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  severity: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  likelihood: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  riskScore: z.number(),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  mitigation: z.string(),
  residualScore: z.number(),
  ownerUserId: z.string().min(1),
  status: z.enum(["open", "mitigated", "accepted", "closed"]),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockControlSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  type: z.enum(["technical", "policy", "training", "process"]),
  status: z.enum(["active", "draft", "retired"]),
  linkedRiskIds: z.array(z.string()),
  ownerUserId: z.string().min(1),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockAssessmentSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  entityType: z.string(),
  entityId: z.string(),
  assessorUserId: z.string().min(1),
  assessmentDate: z.string().min(1),
  findings: z.string(),
  outcome: z.enum(["pass", "fail", "conditional"]),
  nextAssessmentAt: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockEvidenceItemSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  title: z.string().min(1),
  type: z.enum(["document", "screenshot", "audit_log", "assessment", "other"]),
  fileUrl: z.string().nullable(),
  linkedEntityType: z.string(),
  linkedEntityId: z.string(),
  uploadedByUserId: z.string().min(1),
  notes: z.string(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockIncidentSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "investigating", "resolved", "closed"]),
  linkedToolId: z.string().nullable(),
  linkedUseCaseId: z.string().nullable(),
  reporterUserId: z.string().min(1),
  assignedToUserId: z.string().nullable(),
  resolvedAt: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockTrainingCourseSchema = z.object({
  id: z.string().min(1),
  organisationId: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  requiredForRoles: z.array(z.enum(["owner", "admin", "reviewer", "staff"])),
  durationMinutes: z.number(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

const mockTrainingCompletionSchema = z.object({
  id: z.string().min(1),
  courseId: z.string().min(1),
  organisationId: z.string().min(1),
  userId: z.string().min(1),
  completedAt: z.string().min(1),
  certificateUrl: z.string().nullable(),
});

const mockRegistrySchema = z.object({
  users: z.array(mockUserSchema),
  organisations: z.array(mockOrganisationSchema),
  memberships: z.array(mockMembershipSchema),
  tools: z.array(mockToolSchema),
  auditEvents: z.array(mockAuditEventSchema),
  useCases: z.array(mockUseCaseSchema).default([]),
  policies: z.array(mockPolicySchema).default([]),
  policyAcknowledgements: z.array(mockPolicyAcknowledgementSchema).default([]),
  risks: z.array(mockRiskSchema).default([]),
  controls: z.array(mockControlSchema).default([]),
  assessments: z.array(mockAssessmentSchema).default([]),
  evidenceItems: z.array(mockEvidenceItemSchema).default([]),
  incidents: z.array(mockIncidentSchema).default([]),
  trainingCourses: z.array(mockTrainingCourseSchema).default([]),
  trainingCompletions: z.array(mockTrainingCompletionSchema).default([]),
});

// ─── Cookie encoding/signing ──────────────────────────────────────────────────

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function serialize(registry: MockRegistry) {
  const body = encode(JSON.stringify(registry));
  return `${body}.${sign(body)}`;
}

function emptyRegistry(): MockRegistry {
  return {
    users: [], organisations: [], memberships: [], tools: [], auditEvents: [],
    useCases: [], policies: [], policyAcknowledgements: [], risks: [],
    controls: [], assessments: [], evidenceItems: [], incidents: [],
    trainingCourses: [], trainingCompletions: [],
  };
}

function deserialize(raw: string | undefined): MockRegistry {
  if (!raw) return emptyRegistry();

  const [body, signature] = raw.split(".");
  if (!body || !signature) return emptyRegistry();

  const expected = sign(body);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return emptyRegistry();
  }

  try {
    const parsed = JSON.parse(decode(body));
    return mockRegistrySchema.parse(parsed) as MockRegistry;
  } catch {
    return emptyRegistry();
  }
}

function upsertById<T extends { id: string }>(items: T[], nextItem: T) {
  const nextItems = items.filter((item) => item.id !== nextItem.id);
  return [nextItem, ...nextItems];
}

function mergeById<T extends { id: string }>(primary: T[], secondary: T[]) {
  const seen = new Set(primary.map((item) => item.id));
  return [...primary, ...secondary.filter((item) => !seen.has(item.id))];
}

async function writeRegistry(registry: MockRegistry) {
  const cookieStore = await cookies();
  cookieStore.set(MOCK_REGISTRY_COOKIE, serialize(registry), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getMockRegistrySnapshot() {
  const cookieStore = await cookies();
  return deserialize(cookieStore.get(MOCK_REGISTRY_COOKIE)?.value);
}

export async function persistMockRegistryBundle(input: {
  user?: MockUser;
  organisation?: MockOrganisation;
  membership?: MockMembership;
  tool?: MockAITool;
  auditEvent?: MockAuditEvent;
  useCase?: MockUseCase;
  policy?: MockPolicy;
  policyAcknowledgement?: MockPolicyAcknowledgement;
  risk?: MockRisk;
  control?: MockControl;
  assessment?: MockAssessment;
  evidenceItem?: MockEvidenceItem;
  incident?: MockIncident;
  trainingCourse?: MockTrainingCourse;
  trainingCompletion?: MockTrainingCompletion;
}) {
  const registry = await getMockRegistrySnapshot();

  const nextRegistry: MockRegistry = {
    users: input.user ? upsertById(registry.users, input.user) : registry.users,
    organisations: input.organisation
      ? upsertById(registry.organisations, input.organisation)
      : registry.organisations,
    memberships: input.membership
      ? upsertById(registry.memberships, input.membership)
      : registry.memberships,
    tools: input.tool ? upsertById(registry.tools, input.tool) : registry.tools,
    auditEvents: input.auditEvent
      ? upsertById(registry.auditEvents, input.auditEvent)
      : registry.auditEvents,
    useCases: input.useCase ? upsertById(registry.useCases, input.useCase) : registry.useCases,
    policies: input.policy ? upsertById(registry.policies, input.policy) : registry.policies,
    policyAcknowledgements: input.policyAcknowledgement
      ? upsertById(registry.policyAcknowledgements, input.policyAcknowledgement)
      : registry.policyAcknowledgements,
    risks: input.risk ? upsertById(registry.risks, input.risk) : registry.risks,
    controls: input.control ? upsertById(registry.controls, input.control) : registry.controls,
    assessments: input.assessment
      ? upsertById(registry.assessments, input.assessment)
      : registry.assessments,
    evidenceItems: input.evidenceItem
      ? upsertById(registry.evidenceItems, input.evidenceItem)
      : registry.evidenceItems,
    incidents: input.incident
      ? upsertById(registry.incidents, input.incident)
      : registry.incidents,
    trainingCourses: input.trainingCourse
      ? upsertById(registry.trainingCourses, input.trainingCourse)
      : registry.trainingCourses,
    trainingCompletions: input.trainingCompletion
      ? upsertById(registry.trainingCompletions, input.trainingCompletion)
      : registry.trainingCompletions,
  };

  await writeRegistry(nextRegistry);
}

// ─── User lookups ─────────────────────────────────────────────────────────────

export async function getCombinedMockUsers() {
  const registry = await getMockRegistrySnapshot();
  return [...registry.users, ...getDemoUsers()];
}

export async function findMockUserById(userId: string) {
  const seeded = getUserById(userId);
  if (seeded) return seeded;
  const registry = await getMockRegistrySnapshot();
  return registry.users.find((u) => u.id === userId) ?? null;
}

export async function findMockUserByEmail(email: string) {
  const seeded = getUserByEmail(email);
  if (seeded) return seeded;
  const registry = await getMockRegistrySnapshot();
  return registry.users.find((u) => u.email === email) ?? null;
}

// ─── Organisation lookups ─────────────────────────────────────────────────────

export async function findMockOrganisationById(organisationId: string) {
  const seeded = getOrganisationById(organisationId);
  if (seeded) return seeded;
  const registry = await getMockRegistrySnapshot();
  return registry.organisations.find((o) => o.id === organisationId) ?? null;
}

// ─── Membership lookups ───────────────────────────────────────────────────────

export async function getMockMembershipsForUser(userId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryMemberships = registry.memberships.filter(
    (m) => m.userId === userId && m.status === "active",
  );
  return [...registryMemberships, ...getMembershipsForUser(userId)];
}

export async function findMockMembershipForUserInOrganisation(
  userId: string,
  organisationId: string,
) {
  const registry = await getMockRegistrySnapshot();
  const registryMembership =
    registry.memberships.find(
      (m) =>
        m.userId === userId &&
        m.organisationId === organisationId &&
        m.status === "active",
    ) ?? null;
  if (registryMembership) return registryMembership;
  return getMembershipForUserInOrganisation(userId, organisationId);
}

export async function getMockDefaultOrganisationId(userId: string) {
  return (await getMockMembershipsForUser(userId))[0]?.organisationId ?? null;
}

export async function listMockMembershipsForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.memberships.filter(
    (m) => m.organisationId === organisationId,
  );
  const seeded = listMembershipsForOrganisation(organisationId);
  return mergeById(registryItems, seeded);
}

// ─── Audit lookups ────────────────────────────────────────────────────────────

export async function listMockAuditEvents(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryEvents = registry.auditEvents.filter(
    (e) => e.organisationId === organisationId,
  );
  return [...registryEvents, ...listAuditEventsForOrganisation(organisationId)];
}

// ─── Tool lookups ─────────────────────────────────────────────────────────────

export async function listMockToolsForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryTools = registry.tools.filter((t) => t.organisationId === organisationId);
  const seeded = listToolsForOrganisation(organisationId);
  return mergeById(registryTools, seeded);
}

export async function findMockToolById(toolId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryTool = registry.tools.find((t) => t.id === toolId);
  if (registryTool) return registryTool;
  return getToolById(toolId);
}

// ─── Use-case lookups ─────────────────────────────────────────────────────────

export async function listMockUseCasesForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.useCases.filter((uc) => uc.organisationId === organisationId);
  return mergeById(registryItems, listUseCasesForOrganisation(organisationId));
}

export async function findMockUseCaseById(useCaseId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.useCases.find((uc) => uc.id === useCaseId);
  if (found) return found;
  return getUseCaseById(useCaseId);
}

// ─── Policy lookups ───────────────────────────────────────────────────────────

export async function listMockPoliciesForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.policies.filter((p) => p.organisationId === organisationId);
  return mergeById(registryItems, listPoliciesForOrganisation(organisationId));
}

export async function findMockPolicyById(policyId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.policies.find((p) => p.id === policyId);
  if (found) return found;
  return getPolicyById(policyId);
}

export async function listMockAcknowledgementsForPolicy(policyId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.policyAcknowledgements.filter((a) => a.policyId === policyId);
  return mergeById(registryItems, listAcknowledgementsForPolicy(policyId));
}

export async function findMockAcknowledgement(userId: string, policyId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.policyAcknowledgements.find(
    (a) => a.userId === userId && a.policyId === policyId,
  );
  if (found) return found;
  return getAcknowledgementForUserAndPolicy(userId, policyId);
}

export async function listMockAcknowledgementsForUser(userId: string, organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.policyAcknowledgements.filter(
    (a) => a.userId === userId && a.organisationId === organisationId,
  );
  return mergeById(registryItems, listAcknowledgementsForUser(userId, organisationId));
}

// ─── Risk lookups ─────────────────────────────────────────────────────────────

export async function listMockRisksForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.risks.filter((r) => r.organisationId === organisationId);
  return mergeById(registryItems, listRisksForOrganisation(organisationId));
}

export async function findMockRiskById(riskId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.risks.find((r) => r.id === riskId);
  if (found) return found;
  return getRiskById(riskId);
}

// ─── Control lookups ──────────────────────────────────────────────────────────

export async function listMockControlsForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.controls.filter((c) => c.organisationId === organisationId);
  return mergeById(registryItems, listControlsForOrganisation(organisationId));
}

export async function findMockControlById(controlId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.controls.find((c) => c.id === controlId);
  if (found) return found;
  return getControlById(controlId);
}

// ─── Assessment lookups ───────────────────────────────────────────────────────

export async function listMockAssessmentsForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.assessments.filter((a) => a.organisationId === organisationId);
  return mergeById(registryItems, listAssessmentsForOrganisation(organisationId));
}

export async function findMockAssessmentById(assessmentId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.assessments.find((a) => a.id === assessmentId);
  if (found) return found;
  return getAssessmentById(assessmentId);
}

// ─── Evidence lookups ─────────────────────────────────────────────────────────

export async function listMockEvidenceForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.evidenceItems.filter((e) => e.organisationId === organisationId);
  return mergeById(registryItems, listEvidenceForOrganisation(organisationId));
}

export async function findMockEvidenceById(evidenceId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.evidenceItems.find((e) => e.id === evidenceId);
  if (found) return found;
  return getEvidenceById(evidenceId);
}

// ─── Incident lookups ─────────────────────────────────────────────────────────

export async function listMockIncidentsForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.incidents.filter((i) => i.organisationId === organisationId);
  return mergeById(registryItems, listIncidentsForOrganisation(organisationId));
}

export async function findMockIncidentById(incidentId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.incidents.find((i) => i.id === incidentId);
  if (found) return found;
  return getIncidentById(incidentId);
}

// ─── Training lookups ─────────────────────────────────────────────────────────

export async function listMockCoursesForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.trainingCourses.filter(
    (c) => c.organisationId === organisationId,
  );
  return mergeById(registryItems, listCoursesForOrganisation(organisationId));
}

export async function findMockCourseById(courseId: string) {
  const registry = await getMockRegistrySnapshot();
  const found = registry.trainingCourses.find((c) => c.id === courseId);
  if (found) return found;
  return getCourseById(courseId);
}

export async function listMockCompletionsForUser(userId: string, organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.trainingCompletions.filter(
    (c) => c.userId === userId && c.organisationId === organisationId,
  );
  return mergeById(registryItems, listCompletionsForUser(userId, organisationId));
}

export async function listMockCompletionsForCourse(courseId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryItems = registry.trainingCompletions.filter((c) => c.courseId === courseId);
  return mergeById(registryItems, listCompletionsForCourse(courseId));
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export async function getMockDashboardStats(organisationId: string) {
  return getDashboardStats(organisationId);
}
