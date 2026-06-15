import { z } from "zod";

export const evidenceSchema = z.object({
  title: z.string().trim().min(2).max(200),
  type: z.enum(["document", "screenshot", "audit_log", "assessment", "other"]),
  linkedEntityType: z.enum(["ai_tool", "use_case", "policy", "risk", "control", "assessment", "organisation"]),
  linkedEntityId: z.string().trim().min(1),
  notes: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
