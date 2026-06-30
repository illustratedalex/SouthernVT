import { getFeatureFlag, isFeatureEnabled } from "@/lib/featureFlags";
import type { FeatureFlag, FeatureFlagKey } from "@/types/FeatureFlag";

export async function requireFeature(flag: FeatureFlagKey): Promise<boolean> {
  return isFeatureEnabled(flag);
}

export async function getFeatureFallback(flag: FeatureFlagKey): Promise<FeatureFlag | null> {
  const feature = await getFeatureFlag(flag);
  if (feature?.enabled) {
    return null;
  }
  return feature;
}
