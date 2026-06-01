import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "@/lib/config/env";

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createBrowserClient(config.url, config.publishableKey);
}
