import { z } from "zod";

export const incidentSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(1).max(5000),
  severity: z.enum(["low", "medium", "high", "critical"]),
  status: z.enum(["open", "investigating", "resolved", "closed"]),
  linkedToolId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  linkedUseCaseId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  assignedToUserId: z
    .string()
    .trim()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
