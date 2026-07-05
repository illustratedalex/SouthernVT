export type Theme = "light" | "dark" | "auto";

export type ApiStatus = "connected" | "missing" | "configured" | "error";

export type EnvironmentType = "development" | "preview" | "production";

export type RepositoryMode = "mock" | "supabase";

export interface GeneralSettings {
  siteName: string;
  theme: Theme;
  editorial: {
    defaultVerificationRequired: boolean;
    defaultPublicationWindow: number;
  };
  verification: {
    autoApprovePhotos: boolean;
    requireVerificationBadge: boolean;
  };
}

export interface FeatureFlags {
  aiConcierge: boolean;
  weather: boolean;
  aiPlanner: boolean;
  passport: boolean;
  partnerPortal: boolean;
  knowledgeGraph: boolean;
  businessClaims: boolean;
  premiumProfiles: boolean;
  mapbox: boolean;
  analytics: boolean;
  futureFeatures: boolean;
}

export interface ApiIntegration {
  name: string;
  status: ApiStatus;
  lastChecked?: Date;
  description?: string;
}

export interface ApiStatusConfig {
  supabase: ApiIntegration;
  resend: ApiIntegration;
  openai: ApiIntegration;
  googleAnalytics: ApiIntegration;
  microsoftClarity: ApiIntegration;
  vercelAnalytics: ApiIntegration;
  stripe: ApiIntegration;
  mapbox: ApiIntegration;
}

export interface RepositoryModeInfo {
  mode: RepositoryMode;
  envVarSet: boolean;
  supabaseEnvPresent: boolean;
}

export interface SettingsContext {
  general: GeneralSettings;
  features: FeatureFlags;
  apis: ApiStatusConfig;
  environment: EnvironmentType;
}
