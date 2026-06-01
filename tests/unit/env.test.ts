import { describe, expect, it } from "vitest";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/config/env";

describe("env configuration", () => {
  it("returns null Supabase config when env vars are missing in mock mode", () => {
    expect(getSupabaseConfig()).toBeNull();
    expect(isSupabaseConfigured()).toBe(false);
  });
});
