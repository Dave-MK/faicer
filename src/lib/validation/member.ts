import { z } from "zod";

export const inviteMemberSchema = z.object({
  displayName: z.string().trim().min(2).max(100),
  email: z.email(),
  role: z.enum(["admin", "reviewer", "staff"]),
});

export const updateMemberRoleSchema = z.object({
  membershipId: z.string().trim().min(1),
  role: z.enum(["admin", "reviewer", "staff"]),
});
