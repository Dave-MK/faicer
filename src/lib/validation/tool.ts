import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url()
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalText = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const toolSchema = z.object({
  name: z.string().trim().min(2).max(120),
  vendor: z.string().trim().min(2).max(120),
  websiteUrl: optionalUrl,
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
  privacyPolicyUrl: optionalUrl,
  dataProcessingNotes: optionalText,
  notes: optionalText,
  nextReviewAt: z
    .string()
    .trim()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/),
});
