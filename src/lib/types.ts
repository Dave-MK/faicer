export type MembershipRole = "owner" | "admin" | "reviewer" | "staff";
export type MembershipStatus = "active" | "invited" | "suspended";

export type MockUser = {
  id: string;
  email: string;
  displayName: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
};

export type MockOrganisation = {
  id: string;
  name: string;
  sector: string;
  country: string;
  employeeBand: string;
  createdAt: string;
  updatedAt: string;
};

export type MockMembership = {
  id: string;
  organisationId: string;
  userId: string;
  role: MembershipRole;
  status: MembershipStatus;
  invitedAt: string;
  joinedAt: string;
};

export type MockAuditEvent = {
  id: string;
  organisationId: string;
  actorUserId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadataJson: Record<string, string>;
  createdAt: string;
};

export type SessionPayload = {
  userId: string;
  email: string;
  activeOrganisationId: string | null;
};

export type WorkspaceUser = {
  id: string;
  email: string;
  displayName: string;
};

export type WorkspaceOrganisation = {
  id: string;
  name: string;
  sector: string;
  country: string;
  employeeBand: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceMembership = {
  id: string;
  organisationId: string;
  userId: string;
  role: MembershipRole;
  status: MembershipStatus;
  invitedAt: string;
  joinedAt: string | null;
};

export type WorkspaceAuditEvent = MockAuditEvent;
