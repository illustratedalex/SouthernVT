import { GeneralSettings, FeatureFlags, ApiStatusConfig, EnvironmentType } from "@/types/Settings";

const generalSettings: GeneralSettings = {
  siteName: "SouthernVT",
  theme: "light",
  editorial: {
    defaultVerificationRequired: true,
    defaultPublicationWindow: 7,
  },
  verification: {
    autoApprovePhotos: false,
    requireVerificationBadge: true,
  },
};

const featureFlags: FeatureFlags = {
  aiConcierge: true,
  weather: true,
  aiPlanner: true,
  passport: true,
  partnerPortal: true,
  knowledgeGraph: true,
  businessClaims: true,
  premiumProfiles: false,
  mapbox: true,
  analytics: true,
  futureFeatures: false,
};

const apiStatus: ApiStatusConfig = {
  openai: {
    name: "OpenAI",
    status: "connected",
    lastChecked: new Date(Date.now() - 15 * 60000),
    description: "GPT API for AI Concierge and content analysis",
  },
  microsoftClarity: {
    name: "Microsoft Clarity",
    status: "connected",
    lastChecked: new Date(Date.now() - 30 * 60000),
    description: "Session recording and heatmap analytics",
  },
  vercelAnalytics: {
    name: "Vercel Analytics",
    status: "configured",
    lastChecked: new Date(Date.now() - 5 * 60000),
    description: "Web performance metrics and monitoring",
  },
  mapbox: {
    name: "Mapbox",
    status: "connected",
    lastChecked: new Date(Date.now() - 2 * 60000),
    description: "Interactive maps and location services",
  },
  supabase: {
    name: "Supabase",
    status: "connected",
    lastChecked: new Date(Date.now() - 1 * 60000),
    description: "PostgreSQL database and authentication",
  },
};

function getEnvironment(): EnvironmentType {
  if (process.env.VERCEL_ENV === "preview") {
    return "preview";
  }
  if (process.env.VERCEL_ENV === "production") {
    return "production";
  }
  return "development";
}

export function getGeneralSettings(): GeneralSettings {
  return generalSettings;
}

export function getFeatureFlags(): FeatureFlags {
  return featureFlags;
}

export function getApiStatus(): ApiStatusConfig {
  return apiStatus;
}

export function getCurrentEnvironment(): EnvironmentType {
  return getEnvironment();
}

export function updateGeneralSettings(updates: Partial<GeneralSettings>): GeneralSettings {
  return { ...generalSettings, ...updates };
}

export function updateFeatureFlags(updates: Partial<FeatureFlags>): FeatureFlags {
  return { ...featureFlags, ...updates };
}

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return featureFlags[feature];
}
