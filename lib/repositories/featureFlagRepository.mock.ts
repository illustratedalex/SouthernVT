import { mockFeatureFlags } from "@/data/featureFlags";
import type { FeatureFlag, FeatureFlagKey } from "@/types/FeatureFlag";

const featureFlagStore: FeatureFlag[] = mockFeatureFlags.map((flag) => ({ ...flag }));

export async function getFeatureFlags(): Promise<FeatureFlag[]> {
  return featureFlagStore.map((flag) => ({ ...flag }));
}

export async function getFeatureFlag(key: FeatureFlagKey): Promise<FeatureFlag | null> {
  const flag = featureFlagStore.find((item) => item.key === key);
  return flag ? { ...flag } : null;
}

export async function isFeatureEnabled(key: FeatureFlagKey): Promise<boolean> {
  const flag = await getFeatureFlag(key);
  return Boolean(flag?.enabled);
}

export async function updateFeatureFlag(key: FeatureFlagKey, enabled: boolean): Promise<FeatureFlag | null> {
  const index = featureFlagStore.findIndex((flag) => flag.key === key);
  if (index < 0) {
    return null;
  }

  const current = featureFlagStore[index];
  const updated: FeatureFlag = {
    ...current,
    enabled,
    updatedAt: new Date().toISOString(),
  };

  featureFlagStore[index] = updated;
  return { ...updated };
}

export const mockFeatureFlagRepository = {
  getFeatureFlags,
  getFeatureFlag,
  isFeatureEnabled,
  updateFeatureFlag,
};
