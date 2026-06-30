import { requireFeature } from "@/lib/routeGuards";
import type { FeatureFlagKey } from "@/types/FeatureFlag";

interface FeatureGateProps {
  flag: FeatureFlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export async function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const enabled = await requireFeature(flag);
  if (!enabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
