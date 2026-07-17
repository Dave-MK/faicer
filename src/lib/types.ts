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

export type UseCaseStatus = "draft" | "approved" | "restricted" | "prohibited" | "archived";
export type EuAiActTier = "prohibited" | "high" | "limited" | "minimal" | "unclassified";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type RiskStatus = "open" | "mitigated" | "accepted" | "closed";
export type PolicyStatus = "draft" | "under_review" | "active" | "archived";
export type ControlType = "technical" | "policy" | "training" | "process";
export type ControlStatus = "active" | "draft" | "retired";
export type AssessmentOutcome = "pass" | "fail" | "conditional";
export type EvidenceType = "document" | "screenshot" | "audit_log" | "assessment" | "other";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "investigating" | "resolved" | "closed";

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

export type MockUseCase = {
  id: string;
  organisationId: string;
  toolId: string;
  title: string;
  description: string;
  businessUnit: string;
  ownerUserId: string;
  riskLevel: RiskLevel;
  euAiActTier: EuAiActTier;
  status: UseCaseStatus;
  dataInvolved: string;
  mitigations: string;
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MockPolicy = {
  id: string;
  organisationId: string;
  title: string;
  body: string;
  version: string;
  status: PolicyStatus;
  effectiveDate: string | null;
  linkedToolIds: string[];
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type MockPolicyAcknowledgement = {
  id: string;
  policyId: string;
  organisationId: string;
  userId: string;
  acknowledgedAt: string;
};

export type MockRisk = {
  id: string;
  organisationId: string;
  title: string;
  description: string;
  entityType: string;
  entityId: string;
  severity: 1 | 2 | 3 | 4 | 5;
  likelihood: 1 | 2 | 3 | 4 | 5;
  riskScore: number;
  riskLevel: RiskLevel;
  mitigation: string;
  residualScore: number;
  ownerUserId: string;
  status: RiskStatus;
  createdAt: string;
  updatedAt: string;
};

export type MockControl = {
  id: string;
  organisationId: string;
  title: string;
  description: string;
  type: ControlType;
  status: ControlStatus;
  linkedRiskIds: string[];
  ownerUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type MockAssessment = {
  id: string;
  organisationId: string;
  entityType: string;
  entityId: string;
  assessorUserId: string;
  assessmentDate: string;
  findings: string;
  outcome: AssessmentOutcome;
  nextAssessmentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MockEvidenceItem = {
  id: string;
  organisationId: string;
  title: string;
  type: EvidenceType;
  fileUrl: string | null;
  linkedEntityType: string;
  linkedEntityId: string;
  uploadedByUserId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
};

export type MockIncident = {
  id: string;
  organisationId: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  linkedToolId: string | null;
  linkedUseCaseId: string | null;
  reporterUserId: string;
  assignedToUserId: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MockTrainingCourse = {
  id: string;
  organisationId: string;
  title: string;
  description: string;
  requiredForRoles: MembershipRole[];
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
};

export type MockTrainingCompletion = {
  id: string;
  courseId: string;
  organisationId: string;
  userId: string;
  completedAt: string;
  certificateUrl: string | null;
};

export type MockRegistry = {
  users: MockUser[];
  organisations: MockOrganisation[];
  memberships: MockMembership[];
  tools: MockAITool[];
  auditEvents: MockAuditEvent[];
  useCases: MockUseCase[];
  policies: MockPolicy[];
  policyAcknowledgements: MockPolicyAcknowledgement[];
  risks: MockRisk[];
  controls: MockControl[];
  assessments: MockAssessment[];
  evidenceItems: MockEvidenceItem[];
  incidents: MockIncident[];
  trainingCourses: MockTrainingCourse[];
  trainingCompletions: MockTrainingCompletion[];
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
export type WorkspaceUseCase = MockUseCase;
export type WorkspacePolicy = MockPolicy;
export type WorkspacePolicyAcknowledgement = MockPolicyAcknowledgement;
export type WorkspaceRisk = MockRisk;
export type WorkspaceControl = MockControl;
export type WorkspaceAssessment = MockAssessment;
export type WorkspaceEvidenceItem = MockEvidenceItem;
export type WorkspaceIncident = MockIncident;
export type WorkspaceTrainingCourse = MockTrainingCourse;
export type WorkspaceTrainingCompletion = MockTrainingCompletion;

export type DashboardStats = {
  tools: { total: number; approved: number; restricted: number; prohibited: number };
  policies: { total: number; active: number };
  risks: { total: number; high: number; medium: number; low: number };
  evidence: { total: number };
  controls: { total: number };
  assessments: { total: number };
  useCases: { total: number; approved: number };
  incidents: { total: number; open: number };
};
