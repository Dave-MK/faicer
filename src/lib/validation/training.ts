import { z } from "zod";

export const trainingCourseSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(1).max(2000),
  durationMinutes: z.coerce.number().int().min(1).max(600),
  requiredForRoles: z.string().trim().min(1),
});
