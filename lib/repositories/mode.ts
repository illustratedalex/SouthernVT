export type RepositoryRuntimeMode = "mock" | "supabase";

type ResolveRepositoryModeInput = {
  supabaseEnv: boolean;
  featureFlagSupabaseEnabled: boolean;
};

let modeOverride: RepositoryRuntimeMode | null = null;

export function setRepositoryModeOverride(mode: RepositoryRuntimeMode | null) {
  modeOverride = mode;
}

export function getRepositoryModeOverride(): RepositoryRuntimeMode | null {
  return modeOverride;
}

/**
 * Resolves which repository backend to use.
 *
 * Priority order (highest to lowest):
 *  1. In-process override (tests / Basecamp toggle)
 *  2. NEXT_PUBLIC_REPOSITORY_MODE env var ("supabase" | "mock")
 *  3. Feature flag "supabase" + Supabase env vars both present
 *  4. Default: mock
 *
 * Set NEXT_PUBLIC_REPOSITORY_MODE=supabase in Vercel production to activate
 * live Supabase repositories without depending on the feature flag DB.
 */
export function resolveRepositoryMode(input: ResolveRepositoryModeInput): RepositoryRuntimeMode {
  if (modeOverride) {
    return modeOverride;
  }

  const envMode = process.env.NEXT_PUBLIC_REPOSITORY_MODE?.trim().toLowerCase();
  if (envMode === "supabase") {
    if (!input.supabaseEnv) {
      if (typeof window === "undefined") {
        // Server-side: log a clear warning — do not silently pretend Supabase is active
        console.warn(
          "[SouthernVT] NEXT_PUBLIC_REPOSITORY_MODE=supabase is set but Supabase env vars " +
            "(NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing. " +
            "Falling back to mock repositories.",
        );
      }
      return "mock";
    }
    return "supabase";
  }

  if (envMode === "mock") {
    return "mock";
  }

  // Feature-flag path (legacy / local dev toggling via Basecamp UI)
  if (input.supabaseEnv && input.featureFlagSupabaseEnabled) {
    return "supabase";
  }

  return "mock";
}
