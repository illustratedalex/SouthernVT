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

export function resolveRepositoryMode(input: ResolveRepositoryModeInput): RepositoryRuntimeMode {
  if (modeOverride) {
    return modeOverride;
  }

  if (input.supabaseEnv && input.featureFlagSupabaseEnabled) {
    return "supabase";
  }

  return "mock";
}
