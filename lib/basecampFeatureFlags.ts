import type { FeatureFlags } from "@/types/Settings";

export const BASECAMP_FEATURE_FLAGS_STORAGE_KEY = "basecamp.settings.feature-flags";
export const BASECAMP_FEATURE_FLAGS_CHANGE_EVENT = "basecamp-feature-flags-change";

export const BASECAMP_FEATURE_DEFAULTS: FeatureFlags = {
  aiConcierge: true,
  aiPlanner: false,
  weather: false,
  passport: true,
  partnerPortal: true,
  businessClaims: true,
  knowledgeGraph: true,
  mapbox: false,
  analytics: true,
  premiumProfiles: false,
  futureFeatures: false,
};

export const BASECAMP_FEATURE_KEYS = [
  "aiConcierge",
  "aiPlanner",
  "weather",
  "passport",
  "partnerPortal",
  "businessClaims",
  "knowledgeGraph",
  "mapbox",
  "analytics",
  "premiumProfiles",
  "futureFeatures",
] as const;

export type BasecampFeatureKey = (typeof BASECAMP_FEATURE_KEYS)[number];

export function normalizeBasecampFeatureFlags(updates?: Partial<FeatureFlags> | null): FeatureFlags {
  return {
    ...BASECAMP_FEATURE_DEFAULTS,
    ...updates,
  };
}
