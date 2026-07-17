import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(2000)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const useCaseSchema = z.object({
  toolId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(1).max(2000),
  businessUnit: z.string().trim().min(1).max(120),
  ownerUserId: z.string().trim().min(1),
  riskLevel: z.enum(["low", "medium", "high", "critical"]),
  euAiActTier: z
    .enum(["prohibited", "high", "limited", "minimal", "unclassified"])
    .default("unclassified"),
  status: z.enum(["draft", "approved", "restricted", "prohibited", "archived"]),
  dataInvolved: optionalText.pipe(z.string().optional()).transform((v) => v ?? ""),
  mitigations: optionalText.pipe(z.string().optional()).transform((v) => v ?? ""),
  nextReviewAt: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
