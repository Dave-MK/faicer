import { z } from "zod";

export const controlSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(1).max(2000),
  type: z.enum(["technical", "policy", "training", "process"]),
  status: z.enum(["active", "draft", "retired"]),
  ownerUserId: z.string().trim().min(1),
  linkedRiskIds: z.string().trim().optional(),
});
