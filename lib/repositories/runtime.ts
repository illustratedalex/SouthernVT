import { hasSupabaseEnv } from "@/lib/supabase/client";
import { getRepositoryModeOverride } from "@/lib/repositories/mode";

export function useSupabaseRepositories() {
  const modeOverride = getRepositoryModeOverride();
  if (modeOverride) {
    return modeOverride === "supabase";
  }

  return hasSupabaseEnv();
}
