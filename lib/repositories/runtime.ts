import { hasSupabaseEnv } from "@/lib/supabase/client";
import { getRepositoryModeOverride } from "@/lib/repositories/mode";

export function useSupabaseRepositories() {
  const modeOverride = getRepositoryModeOverride();
  if (modeOverride) {
    return modeOverride === "supabase";
  }

  const envMode = process.env.NEXT_PUBLIC_REPOSITORY_MODE?.trim().toLowerCase();
  if (envMode === "supabase") {
    return hasSupabaseEnv();
  }
  if (envMode === "mock") {
    return false;
  }

  return hasSupabaseEnv();
}
