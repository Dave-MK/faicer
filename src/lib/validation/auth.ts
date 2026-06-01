import { z } from "zod";

export const signInSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().trim().min(8).optional(),
});

export const signUpSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  email: z.email().trim().toLowerCase(),
  password: z.string().trim().min(8).optional(),
  organisationName: z.string().trim().min(2).max(120).optional(),
});
