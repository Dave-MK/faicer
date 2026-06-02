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
} from "@/lib/data/mock-store";
import type {
  MockAuditEvent,
  MockAITool,
  MockMembership,
  MockOrganisation,
  MockRegistry,
  MockUser,
} from "@/lib/types";

const MOCK_REGISTRY_COOKIE = "ai_ledger_mock_registry";

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
    "general_chatbot",
    "image_generation",
    "audio_generation",
    "video_generation",
    "transcription",
    "meeting_assistant",
    "coding_assistant",
    "marketing_automation",
    "crm_feature",
    "recruitment_feature",
    "analytics_feature",
    "other",
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

const mockRegistrySchema = z.object({
  users: z.array(mockUserSchema),
  organisations: z.array(mockOrganisationSchema),
  memberships: z.array(mockMembershipSchema),
  tools: z.array(mockToolSchema),
  auditEvents: z.array(mockAuditEventSchema),
});

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
    users: [],
    organisations: [],
    memberships: [],
    tools: [],
    auditEvents: [],
  };
}

function deserialize(raw: string | undefined) {
  if (!raw) {
    return emptyRegistry();
  }

  const [body, signature] = raw.split(".");

  if (!body || !signature) {
    return emptyRegistry();
  }

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
    return mockRegistrySchema.parse(parsed);
  } catch {
    return emptyRegistry();
  }
}

function upsertById<T extends { id: string }>(items: T[], nextItem: T) {
  const nextItems = items.filter((item) => item.id !== nextItem.id);
  return [nextItem, ...nextItems];
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
  };

  await writeRegistry(nextRegistry);
}

export async function getCombinedMockUsers() {
  const registry = await getMockRegistrySnapshot();
  return [...registry.users, ...getDemoUsers()];
}

export async function findMockUserById(userId: string) {
  const seededUser = getUserById(userId);

  if (seededUser) {
    return seededUser;
  }

  const registry = await getMockRegistrySnapshot();
  return registry.users.find((user) => user.id === userId) ?? null;
}

export async function findMockUserByEmail(email: string) {
  const seededUser = getUserByEmail(email);

  if (seededUser) {
    return seededUser;
  }

  const registry = await getMockRegistrySnapshot();
  return registry.users.find((user) => user.email === email) ?? null;
}

export async function findMockOrganisationById(organisationId: string) {
  const seededOrganisation = getOrganisationById(organisationId);

  if (seededOrganisation) {
    return seededOrganisation;
  }

  const registry = await getMockRegistrySnapshot();
  return (
    registry.organisations.find((organisation) => organisation.id === organisationId) ??
    null
  );
}

export async function getMockMembershipsForUser(userId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryMemberships = registry.memberships.filter(
    (membership) => membership.userId === userId && membership.status === "active",
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
      (membership) =>
        membership.userId === userId &&
        membership.organisationId === organisationId &&
        membership.status === "active",
    ) ?? null;

  if (registryMembership) {
    return registryMembership;
  }

  return getMembershipForUserInOrganisation(userId, organisationId);
}

export async function getMockDefaultOrganisationId(userId: string) {
  return (await getMockMembershipsForUser(userId))[0]?.organisationId ?? null;
}

export async function listMockAuditEvents(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryEvents = registry.auditEvents.filter(
    (event) => event.organisationId === organisationId,
  );

  return [...registryEvents, ...listAuditEventsForOrganisation(organisationId)];
}

function mergeById<T extends { id: string }>(primary: T[], secondary: T[]) {
  const seen = new Set(primary.map((item) => item.id));
  return [...primary, ...secondary.filter((item) => !seen.has(item.id))];
}

export async function listMockToolsForOrganisation(organisationId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryTools = registry.tools.filter(
    (tool) => tool.organisationId === organisationId,
  );
  const seededTools = listToolsForOrganisation(organisationId);

  return mergeById(registryTools, seededTools);
}

export async function findMockToolById(toolId: string) {
  const registry = await getMockRegistrySnapshot();
  const registryTool = registry.tools.find((tool) => tool.id === toolId);

  if (registryTool) {
    return registryTool;
  }

  return getToolById(toolId);
}
