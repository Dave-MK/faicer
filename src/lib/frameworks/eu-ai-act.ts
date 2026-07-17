import type { EuAiActTier, ToolCategory } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// EU AI Act risk-tier reference layer
//
// Turns FAICER's use-case register into a first-pass conformity view against the
// EU AI Act's four risk tiers (Regulation (EU) 2024/1689), with cross-references
// to ISO/IEC 42001 and the NIST AI RMF so an SME can see, at a glance, what a
// given use of AI obliges them to do.
//
// This is decision-support, not legal advice. Every classification should be
// confirmed by a competent person and recorded with its rationale.
// ─────────────────────────────────────────────────────────────────────────────

export type FrameworkTone = "danger" | "warning" | "info" | "success" | "muted";

export type EuAiActTierMeta = {
  tier: EuAiActTier;
  label: string;
  /** One-line plain-English summary of the tier. */
  summary: string;
  /** Legal anchor within the Act. */
  reference: string;
  tone: FrameworkTone;
  /** Concrete example uses that typically fall in this tier. */
  examples: string[];
  /** What the deployer/provider must actually do. */
  obligations: string[];
  /** How this tier maps onto ISO/IEC 42001 and the NIST AI RMF. */
  frameworkMapping: {
    iso42001: string;
    nistAiRmf: string;
  };
};

export const EU_AI_ACT_TIERS: Record<
  Exclude<EuAiActTier, "unclassified">,
  EuAiActTierMeta
> = {
  prohibited: {
    tier: "prohibited",
    label: "Prohibited",
    summary:
      "An unacceptable-risk practice banned outright across the EU since 2 February 2025.",
    reference: "EU AI Act, Article 5",
    tone: "danger",
    examples: [
      "Social scoring of individuals by public or private bodies",
      "Manipulative or deceptive subliminal techniques that cause harm",
      "Untargeted scraping of facial images to build recognition databases",
      "Emotion inference in the workplace or education settings",
      "Biometric categorisation inferring sensitive traits (e.g. race, beliefs)",
    ],
    obligations: [
      "Do not deploy or place this use on the market — it is unlawful.",
      "If already in use, stop immediately and log the decision as an incident.",
      "Record the rationale and notify your governance owner.",
    ],
    frameworkMapping: {
      iso42001:
        "Fails ISO 42001 A.5 impact-assessment and A.2 policy gates — must be excluded from the AI management system's scope of acceptable use.",
      nistAiRmf:
        "GOVERN 1.1 / MAP 1.1 — the use falls outside the organisation's risk tolerance and legal boundaries; do not proceed to MEASURE/MANAGE.",
    },
  },
  high: {
    tier: "high",
    label: "High risk",
    summary:
      "Permitted, but subject to the Act's fullest obligations before and during use. Main deployer/provider duties apply from 2 August 2026.",
    reference: "EU AI Act, Articles 6 & 8–29, Annex III",
    tone: "warning",
    examples: [
      "AI used in recruitment, hiring, or worker management",
      "Creditworthiness and credit-scoring decisions",
      "Access to education, essential private, or public services",
      "Biometric identification and categorisation",
      "Safety components of critical infrastructure",
    ],
    obligations: [
      "Operate a risk-management system across the lifecycle (Art. 9).",
      "Apply data governance for training/validation data quality (Art. 10).",
      "Maintain technical documentation and automatic event logging (Arts. 11–12).",
      "Ensure meaningful human oversight (Art. 14).",
      "Ensure accuracy, robustness, and cybersecurity (Art. 15).",
      "Deployers: run a fundamental-rights impact assessment where required (Art. 27) and keep logs.",
    ],
    frameworkMapping: {
      iso42001:
        "Exercise the full ISO 42001 Annex A set: A.5 AI impact assessment, A.6 lifecycle & responsible design, A.7 data management, A.9 human oversight, plus A.4 resources.",
      nistAiRmf:
        "Full GOVERN–MAP–MEASURE–MANAGE cycle: document context (MAP), test for accuracy/bias/robustness (MEASURE), and put monitoring and human oversight in place (MANAGE).",
    },
  },
  limited: {
    tier: "limited",
    label: "Limited risk",
    summary:
      "Allowed with transparency duties: people must know they are interacting with, or seeing content from, AI.",
    reference: "EU AI Act, Article 50",
    tone: "info",
    examples: [
      "Customer-facing chatbots and virtual assistants",
      "AI-generated or AI-manipulated images, audio, or video (deepfakes)",
      "Emotion-recognition or biometric-categorisation systems (permitted uses)",
      "AI-generated text published to inform the public",
    ],
    obligations: [
      "Disclose to users that they are interacting with an AI system.",
      "Label AI-generated or manipulated content (including deepfakes) as artificial.",
      "Make disclosures clear, at the latest at first interaction.",
    ],
    frameworkMapping: {
      iso42001:
        "Covered by ISO 42001 A.8 information for interested parties and transparency controls.",
      nistAiRmf:
        "GOVERN 4 / MEASURE 2.9 — establish transparency and disclosure practices so users can interpret outputs appropriately.",
    },
  },
  minimal: {
    tier: "minimal",
    label: "Minimal risk",
    summary:
      "The large majority of AI uses. No mandatory obligations under the Act; voluntary codes of conduct encouraged.",
    reference: "EU AI Act, Recital 165 (voluntary codes)",
    tone: "success",
    examples: [
      "Spam filters and inbox triage",
      "AI features in productivity tools and drafting assistants",
      "Internal summarisation of non-sensitive content",
      "AI in video games or recommendation of low-stakes content",
    ],
    obligations: [
      "No specific legal obligations under the AI Act.",
      "Still apply your internal acceptable-use policy and data-handling rules.",
      "Ensure staff retain AI literacy (Art. 4) — a duty that applies to all tiers.",
    ],
    frameworkMapping: {
      iso42001:
        "Managed through baseline ISO 42001 A.2 policy and A.3 internal-organisation controls.",
      nistAiRmf:
        "Lightweight GOVERN coverage — record the use and rely on general policy rather than per-system controls.",
    },
  },
};

export type EuAiActTierOption = {
  value: EuAiActTier;
  label: string;
};

export const euAiActTierOptions: EuAiActTierOption[] = [
  { value: "unclassified", label: "Not yet classified" },
  { value: "prohibited", label: "Prohibited (Art. 5)" },
  { value: "high", label: "High risk (Annex III)" },
  { value: "limited", label: "Limited risk (Art. 50)" },
  { value: "minimal", label: "Minimal risk" },
];

const UNCLASSIFIED_META: EuAiActTierMeta = {
  tier: "unclassified",
  label: "Not yet classified",
  summary:
    "This use of AI has not yet been assessed against the EU AI Act risk tiers.",
  reference: "EU AI Act, Article 6 (classification rules)",
  tone: "muted",
  examples: [],
  obligations: [
    "Assess this use against the four risk tiers and record the outcome.",
    "Until classified, treat it cautiously and avoid sensitive data.",
  ],
  frameworkMapping: {
    iso42001: "Run an ISO 42001 A.5 AI impact assessment to establish the tier.",
    nistAiRmf: "Complete the NIST AI RMF MAP function to characterise the use.",
  },
};

export function getEuAiActTierMeta(tier: EuAiActTier | null | undefined): EuAiActTierMeta {
  // Fall back to "unclassified" for missing or legacy values so older records
  // (e.g. persisted before this field existed) never crash a render.
  if (!tier || tier === "unclassified") return UNCLASSIFIED_META;
  return EU_AI_ACT_TIERS[tier] ?? UNCLASSIFIED_META;
}

export function getEuAiActTierLabel(tier: EuAiActTier): string {
  return getEuAiActTierMeta(tier).label;
}

export function getEuAiActTierTone(tier: EuAiActTier): FrameworkTone {
  return getEuAiActTierMeta(tier).tone;
}

// ─────────────────────────────────────────────────────────────────────────────
// Suggestion helper
//
// Offers a *starting-point* tier from the tool category so the person
// classifying does not face a blank slate. It never auto-applies — the register
// still records whatever a human selects. Categories tied to hiring, credit,
// biometrics, or essential services in Annex III lean high risk; user-facing
// generative categories lean limited (transparency); the rest lean minimal.
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_TIER_HINT: Record<ToolCategory, EuAiActTier> = {
  general_chatbot: "limited",
  image_generation: "limited",
  audio_generation: "limited",
  video_generation: "limited",
  transcription: "minimal",
  meeting_assistant: "minimal",
  coding_assistant: "minimal",
  marketing_automation: "minimal",
  crm_feature: "minimal",
  recruitment_feature: "high",
  analytics_feature: "minimal",
  other: "unclassified",
};

export function suggestEuAiActTier(category: ToolCategory): {
  tier: EuAiActTier;
  rationale: string;
} {
  const tier = CATEGORY_TIER_HINT[category] ?? "unclassified";
  const rationale =
    tier === "high"
      ? "Uses in recruitment and worker management are listed in Annex III and typically classify as high risk."
      : tier === "limited"
        ? "User-facing or generative AI usually carries Article 50 transparency duties (disclose AI, label AI-generated content)."
        : tier === "minimal"
          ? "This category is usually minimal risk, but confirm against how and where the output is actually used."
          : "This category needs a manual assessment against the four risk tiers.";
  return { tier, rationale };
}
