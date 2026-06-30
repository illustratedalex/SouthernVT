import {
  getFeatureFlag as getFeatureFlagFromRepository,
  getFeatureFlags as getFeatureFlagsFromRepository,
  isFeatureEnabled as isFeatureEnabledFromRepository,
  updateFeatureFlag as updateFeatureFlagInRepository,
} from "@/lib/repositories/featureFlagRepository";
import type { FeatureFlag, FeatureFlagKey } from "@/types/FeatureFlag";

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  return getFeatureFlagsFromRepository();
}

export async function getFeatureFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
  return getFeatureFlagFromRepository(key);
}

export async function isFeatureEnabled(key: FeatureFlagKey): Promise<boolean> {
  return isFeatureEnabledFromRepository(key);
}

export async function updateFeatureFlag(key: FeatureFlagKey, enabled: boolean): Promise<FeatureFlag | null> {
  return updateFeatureFlagInRepository(key, enabled);
}
