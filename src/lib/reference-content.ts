export const publicNavigation = [
  { label: "Product", href: "/dashboard" },
  { label: "Solutions", href: "/governance" },
  { label: "Resources", href: "/docs" },
  { label: "Company", href: "/welcome" },
  { label: "Pricing", href: "/pricing" },
];

export const appNavigation = [
  { key: "overview", label: "Overview", href: "/dashboard", icon: "overview" },
  { key: "register", label: "AI Register", href: "/tools", icon: "register" },
  { key: "use-cases", label: "Use Cases", href: "/use-cases", icon: "use-cases" },
  { key: "governance", label: "Governance", href: "/governance", icon: "governance" },
  { key: "policies", label: "Policies", href: "/policies", icon: "policies" },
  { key: "evidence", label: "Evidence", href: "/evidence", icon: "evidence" },
  { key: "risks", label: "Risks", href: "/risks", icon: "risks" },
  {
    key: "assessments",
    label: "Assessments",
    href: "/assessments",
    icon: "assessments",
  },
  { key: "controls", label: "Controls", href: "/controls", icon: "controls" },
  { key: "incidents", label: "Incidents", href: "/incidents", icon: "incidents" },
  { key: "training", label: "Training", href: "/training", icon: "training" },
  { key: "reports", label: "Reports", href: "/reports", icon: "reports" },
  {
    key: "integrations",
    label: "Integrations",
    href: "/integrations",
    icon: "integrations",
  },
  { key: "settings", label: "Settings", href: "/settings", icon: "settings" },
] as const;

export const staffNavigation = [
  { key: "overview", label: "Home", href: "/dashboard", icon: "overview" },
  {
    key: "approved-tools",
    label: "Approved Tools",
    href: "/approved-tools",
    icon: "register",
  },
  {
    key: "my-policies",
    label: "My Policies",
    href: "/my-policies",
    icon: "policies",
  },
  { key: "training", label: "Training", href: "/training", icon: "training" },
  {
    key: "my-activity",
    label: "My Activity",
    href: "/my-activity",
    icon: "activity",
  },
  { key: "help", label: "Help & Support", href: "/help", icon: "help" },
  { key: "settings", label: "Settings", href: "/settings", icon: "settings" },
] as const;

export const dashboardHealthMetrics = [
  { label: "Policies", value: "156", delta: "+ 18%" },
  { label: "Controls", value: "412", delta: "+ 11%" },
  { label: "Evidence Items", value: "3,677", delta: "+ 19%" },
  { label: "Assessments", value: "28", delta: "+ 17%" },
];

export const dashboardEvidenceBreakdown = [
  { label: "Verified", value: "2,283 (62%)", tone: "info" },
  { label: "Pending Review", value: "891 (24%)", tone: "violet" },
  { label: "Expiring Soon", value: "321 (9%)", tone: "warning" },
  { label: "Issues", value: "182 (5%)", tone: "danger" },
];

export const dashboardCoverageDomains = [
  { label: "Data Privacy", value: "91%", tone: "cyan" },
  { label: "Access Control", value: "86%", tone: "blue" },
  { label: "Vendor Management", value: "80%", tone: "violet" },
  { label: "Change Management", value: "76%", tone: "warning" },
  { label: "Incident Response", value: "64%", tone: "danger" },
];

export const dashboardRiskRows = [
  {
    label: "High",
    description: "3 risks require immediate attention",
    tone: "danger",
  },
  {
    label: "Medium",
    description: "7 risks require monitoring",
    tone: "warning",
  },
  { label: "Low", description: "12 risks under control", tone: "success" },
  { label: "Info", description: "6 informational risks", tone: "info" },
];

export const recentEvidenceRows = [
  {
    evidence: "Vendor Risk Assessment - CloudCo",
    type: "Assessment",
    policy: "Vendor Management",
    source: "OneTrust",
    status: "Verified",
    updated: "May 20, 2024",
  },
  {
    evidence: "Access Review Q2 2024",
    type: "Access Review",
    policy: "Access Control",
    source: "Okta",
    status: "Verified",
    updated: "May 19, 2024",
  },
  {
    evidence: "Data Processing Agreement",
    type: "Document",
    policy: "Data Privacy",
    source: "SharePoint",
    status: "Verified",
    updated: "May 18, 2024",
  },
  {
    evidence: "Change Management Log",
    type: "Log",
    policy: "Change Management",
    source: "ServiceNow",
    status: "Pending Review",
    updated: "May 17, 2024",
  },
  {
    evidence: "Security Incident Report #1432",
    type: "Incident",
    policy: "Incident Response",
    source: "Jira Service Mgmt",
    status: "Verified",
    updated: "May 16, 2024",
  },
];

export const useCaseRows = [
  {
    title: "Draft marketing content",
    tool: "ChatGPT Enterprise",
    unit: "Marketing",
    risk: "Medium",
    status: "Approved",
    owner: "S. Lee",
    review: "May 20, 2024",
  },
  {
    title: "Customer support copilot",
    tool: "Microsoft Copilot",
    unit: "Customer Success",
    risk: "Medium",
    status: "Approved",
    owner: "R. Patel",
    review: "May 19, 2024",
  },
  {
    title: "Code generation assistance",
    tool: "GitHub Copilot",
    unit: "Engineering",
    risk: "Low",
    status: "Approved",
    owner: "M. Chen",
    review: "May 18, 2024",
  },
  {
    title: "Sales email summarisation",
    tool: "ChatGPT Enterprise",
    unit: "Sales",
    risk: "Low",
    status: "Approved",
    owner: "A. Kim",
    review: "May 17, 2024",
  },
  {
    title: "Legal document drafting",
    tool: "Claude 3.5",
    unit: "Legal",
    risk: "High",
    status: "Restricted",
    owner: "J. Morgan",
    review: "May 16, 2024",
  },
];

export const governanceHighlights = [
  {
    title: "Unified Governance",
    copy: "Centralize policies, risks, and compliance in one platform.",
    icon: "shield",
  },
  {
    title: "Guided Workflows",
    copy: "Step-by-step processes ensure consistency and completeness.",
    icon: "controls",
  },
  {
    title: "Team Collaboration",
    copy: "Define roles, manage access, and collaborate securely.",
    icon: "integrations",
  },
  {
    title: "Training Compliance",
    copy: "Track progress and ensure your team stays certified.",
    icon: "training",
  },
  {
    title: "Audit Ready",
    copy: "Maintain clear records and evidence for every decision.",
    icon: "reports",
  },
];

export const evidenceHighlights = [
  {
    title: "Centralised Register",
    copy: "One source of truth for all AI tools and use cases.",
    icon: "register",
  },
  {
    title: "Risk-Based Governance",
    copy: "Assess, classify and control AI usage with confidence.",
    icon: "risks",
  },
  {
    title: "Policy & Control Alignment",
    copy: "Ensure compliance with organisational policies and frameworks.",
    icon: "policies",
  },
  {
    title: "Evidence & Audit Ready",
    copy: "Maintain proof, track activity and demonstrate oversight.",
    icon: "evidence",
  },
  {
    title: "Continuous Review",
    copy: "Scheduled reviews and lifecycle management keep you current.",
    icon: "activity",
  },
];
