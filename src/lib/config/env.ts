import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  FAICER_AUTH_MODE: z.enum(["mock", "supabase"]).optional(),
  APP_SESSION_SECRET: z.string().min(16).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
});

const parsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  FAICER_AUTH_MODE: process.env.FAICER_AUTH_MODE,
  APP_SESSION_SECRET: process.env.APP_SESSION_SECRET,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
});

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const env = parsed.data;

export function getAuthMode() {
  if (env.FAICER_AUTH_MODE) {
    return env.FAICER_AUTH_MODE;
  }

  return env.NODE_ENV === "production" ? "supabase" : "mock";
}

export function getSessionSecret() {
  if (env.APP_SESSION_SECRET) {
    return env.APP_SESSION_SECRET;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("APP_SESSION_SECRET must be set in production.");
  }

  return "faicer-dev-session-secret";
}

export function getSupabaseConfig() {
  if (
    env.NEXT_PUBLIC_SUPABASE_URL &&
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return {
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      publishableKey: env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    };
  }

  return null;
}

export function isSupabaseConfigured() {
  return getSupabaseConfig() !== null;
}

export function isSupabaseAuthEnabled() {
  return getAuthMode() === "supabase" && isSupabaseConfigured();
}
