import type { FeatureFlag, FeatureFlagKey } from "@/types/FeatureFlag";
import { hasSupabaseEnv } from "@/lib/supabase/client";
import { getRepositoryModeOverride } from "@/lib/repositories/mode";
import * as mockRepository from "@/lib/repositories/featureFlagRepository.mock";
import * as supabaseRepository from "@/lib/repositories/featureFlagRepository.supabase";

type FeatureFlagRepositoryModule = {
  getFeatureFlags: () => Promise<FeatureFlag[]>;
  getFeatureFlag: (key: FeatureFlagKey) => Promise<FeatureFlag | null>;
  isFeatureEnabled: (key: FeatureFlagKey) => Promise<boolean>;
  updateFeatureFlag: (key: FeatureFlagKey, enabled: boolean) => Promise<FeatureFlag | null>;
};

function getPreferredRepository(): FeatureFlagRepositoryModule {
  const modeOverride = getRepositoryModeOverride();
  if (modeOverride === "mock") {
    return mockRepository;
  }

  if (modeOverride === "supabase") {
    return supabaseRepository;
  }

  if (hasSupabaseEnv()) {
    return supabaseRepository;
  }
  return mockRepository;
}

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  const repository = getPreferredRepository();
  try {
    return await repository.getFeatureFlags();
  } catch {
    return mockRepository.getFeatureFlags();
  }
}

export async function getFeatureFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
  const repository = getPreferredRepository();
  try {
    return await repository.getFeatureFlag(key);
  } catch {
    return mockRepository.getFeatureFlag(key);
  }
}

export async function isFeatureEnabled(key: FeatureFlagKey): Promise<boolean> {
  const repository = getPreferredRepository();
  try {
    return await repository.isFeatureEnabled(key);
  } catch {
    return mockRepository.isFeatureEnabled(key);
  }
}

export async function updateFeatureFlag(key: FeatureFlagKey, enabled: boolean): Promise<FeatureFlag | null> {
  const repository = getPreferredRepository();
  try {
    return await repository.updateFeatureFlag(key, enabled);
  } catch {
    return mockRepository.updateFeatureFlag(key, enabled);
  }
}

export async function createFeatureFlag(input: FeatureFlag): Promise<FeatureFlag> {
  const existing = await getFeatureFlag(input.key);
  if (existing) {
    return existing;
  }

  return {
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function archiveFeatureFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
  const existing = await getFeatureFlag(key);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    enabled: false,
    updatedAt: new Date().toISOString(),
  };
}

export const featureFlagRepository = {
  getAll: getFeatureFlags,
  getById: getFeatureFlag,
  create: createFeatureFlag,
  update: updateFeatureFlag,
  archive: archiveFeatureFlag,
  getFeatureFlags,
  getFeatureFlag,
  isFeatureEnabled,
  createFeatureFlag,
  updateFeatureFlag,
  archiveFeatureFlag,
};
