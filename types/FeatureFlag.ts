export type FeatureFlagKey =
  | "aiPlanner"
  | "aiConcierge"
  | "passport"
  | "reviews"
  | "weather"
  | "analytics"
  | "mapbox"
  | "supabase"
  | "businessPortal"
  | "premiumProfiles"
  | "events"
  | "publicCollections"
  | "publicPlaces"
  | "partnerFeatures"
  | "billing";

export type FeatureFlagEnvironment = "development" | "staging" | "production";

export interface FeatureFlag {
  key: FeatureFlagKey;
  label: string;
  description: string;
  enabled: boolean;
  environment: FeatureFlagEnvironment;
  createdAt: string;
  updatedAt: string;
}
