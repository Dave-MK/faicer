import { describe, expect, it } from "vitest";
import { toolSchema } from "@/lib/validation/tool";

describe("tool validation", () => {
  it("accepts a valid tool record", () => {
    const parsed = toolSchema.safeParse({
      name: "ChatGPT Team",
      vendor: "OpenAI",
      websiteUrl: "https://chatgpt.com",
      category: "general_chatbot",
      approvalStatus: "approved",
      privacyPolicyUrl: "https://openai.com/policies/privacy-policy",
      dataProcessingNotes: "No personal data without approval.",
      notes: "Human review required for delivery.",
      nextReviewAt: "2026-10-01",
    });

    expect(parsed.success).toBe(true);
  });

  it("rejects invalid tool inputs", () => {
    const parsed = toolSchema.safeParse({
      name: "A",
      vendor: "",
      category: "wrong",
      approvalStatus: "approved",
      nextReviewAt: "01-10-2026",
    });

    expect(parsed.success).toBe(false);
  });
});
