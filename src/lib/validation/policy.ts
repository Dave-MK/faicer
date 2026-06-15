import { z } from "zod";

export const policySchema = z.object({
  title: z.string().trim().min(2).max(200),
  body: z.string().trim().min(10).max(50000),
  status: z.enum(["draft", "under_review", "active", "archived"]),
  effectiveDate: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
