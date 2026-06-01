import { z } from "zod";

export const createOrganisationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  sector: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  employeeBand: z.string().trim().min(1).max(20),
});
