import { z } from "zod";

export const riskSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(1).max(2000),
  entityType: z.enum(["ai_tool", "use_case", "organisation"]),
  entityId: z.string().trim().min(1),
  severity: z.coerce.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
  likelihood: z.coerce.number().int().min(1).max(5) as z.ZodType<1 | 2 | 3 | 4 | 5>,
  mitigation: z.string().trim().min(1).max(2000),
  ownerUserId: z.string().trim().min(1),
  status: z.enum(["open", "mitigated", "accepted", "closed"]),
});
