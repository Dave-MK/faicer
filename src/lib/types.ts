export type MembershipRole = "owner" | "admin" | "reviewer" | "staff";
export type MembershipStatus = "active" | "invited" | "suspended";
export type ToolApprovalStatus = "approved" | "restricted" | "prohibited";
export type ToolCategory =
  | "general_chatbot"
  | "image_generation"
  | "audio_generation"
  | "video_generation"
  | "transcription"
  | "meeting_assistant"
  | "coding_assistant"
  | "marketing_automation"
  | "crm_feature"
  | "recruitment_feature"
  | "analytics_feature"
  | "other";

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

export type MockAITool = {
  id: string;
  organisationId: string;
  name: string;
  vendor: string;
  websiteUrl: string | null;
  category: ToolCategory;
  approvalStatus: ToolApprovalStatus;
  accountOwnerUserId: string;
  businessOwnerUserId: string;
  privacyPolicyUrl: string | null;
  dataProcessingNotes: string;
  notes: string;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MockRegistry = {
  users: MockUser[];
  organisations: MockOrganisation[];
  memberships: MockMembership[];
  tools: MockAITool[];
  auditEvents: MockAuditEvent[];
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
export type WorkspaceAITool = MockAITool;
