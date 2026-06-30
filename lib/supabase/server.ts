import "server-only";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/types";

export function getSupabaseServerClient() {
  const config = requireSupabaseConfig();

  return createClient<Database>(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
