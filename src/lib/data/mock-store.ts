import { randomUUID } from "node:crypto";
import type {
  MockAuditEvent,
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

export function getDefaultOrganisationId(userId: string) {
  return getMembershipsForUser(userId)[0]?.organisationId ?? null;
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

  users.set(userId, user);
  organisations.set(organisationId, organisation);
  memberships.set(membershipId, membership);
  auditEvents.unshift({
    id: randomUUID(),
    organisationId,
    actorUserId: userId,
    action: "organisation.created",
    entityType: "organisation",
    entityId: organisationId,
    metadataJson: { mode: "mock-sign-up" },
    createdAt: timestamp,
  });

  return { user, organisation, membership };
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

  organisations.set(organisationId, organisation);
  memberships.set(membershipId, membership);
  auditEvents.unshift({
    id: randomUUID(),
    organisationId,
    actorUserId: userId,
    action: "organisation.created",
    entityType: "organisation",
    entityId: organisationId,
    metadataJson: { mode: "mock-owner-create" },
    createdAt: timestamp,
  });

  return organisation;
}

export function resetMockStore() {
  users.clear();
  organisations.clear();
  memberships.clear();
  auditEvents.length = 0;
}
