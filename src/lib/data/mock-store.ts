import { randomUUID } from "node:crypto";
import type {
  MockAuditEvent,
  MockAITool,
  MockMembership,
  MockOrganisation,
  MockUser,
} from "@/lib/types";

const now = () => new Date().toISOString();

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

export function getDemoUsers() {
  return [...users.values()];
}

export function getUserById(userId: string) {
  return users.get(userId) ?? null;
}

export function getUserByEmail(email: string) {
  return [...users.values()].find((user) => user.email === email) ?? null;
}

export function getOrganisationById(organisationId: string) {
  return organisations.get(organisationId) ?? null;
}

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

export function listAuditEventsForOrganisation(organisationId: string) {
  return auditEvents.filter((event) => event.organisationId === organisationId);
}

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
    metadataJson: {
      name: tool.name,
      approvalStatus: tool.approvalStatus,
    },
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
    metadataJson: {
      name: tool.name,
      approvalStatus: tool.approvalStatus,
    },
    createdAt: timestamp,
  };

  return { tool, auditEvent };
}

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
    summary: "Mock user created from the Milestone 1 sign-up flow.",
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
