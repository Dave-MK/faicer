import { z } from "zod";

export const assessmentSchema = z.object({
  entityType: z.enum(["ai_tool", "use_case", "control"]),
  entityId: z.string().trim().min(1),
  assessmentDate: z
    .string()
    .trim()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/),
  findings: z.string().trim().min(1).max(5000),
  outcome: z.enum(["pass", "fail", "conditional"]),
  nextAssessmentAt: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
