import { GeneralSettings, FeatureFlags, ApiStatusConfig, EnvironmentType, ApiStatus } from "@/types/Settings";

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

function envStatus(key: string | undefined): ApiStatus {
  return key && key.trim().length > 0 ? "configured" : "missing";
}

function buildApiStatus(): ApiStatusConfig {
  const now = new Date();
  return {
    supabase: {
      name: "Supabase",
      status:
        (process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "") &&
        (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "")
          ? "configured"
          : "missing",
      lastChecked: now,
      description: "PostgreSQL database and authentication",
    },
    resend: {
      name: "Resend (Email)",
      status: envStatus(process.env.RESEND_API_KEY),
      lastChecked: now,
      description: "Transactional email for contact form and claims",
    },
    openai: {
      name: "OpenAI",
      status: envStatus(process.env.OPENAI_API_KEY),
      lastChecked: now,
      description: "GPT-4o for AI Concierge and content analysis",
    },
    googleAnalytics: {
      name: "Google Analytics",
      status: envStatus(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
      lastChecked: now,
      description: "Page views, sessions, and visitor behaviour",
    },
    microsoftClarity: {
      name: "Microsoft Clarity",
      status: envStatus(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID),
      lastChecked: now,
      description: "Session replay and heatmap analytics",
    },
    vercelAnalytics: {
      name: "Vercel Analytics",
      status: "configured",
      lastChecked: now,
      description: "Web performance metrics — auto-enabled on Vercel",
    },
    stripe: {
      name: "Stripe",
      status:
        (process.env.STRIPE_SECRET_KEY?.trim() ?? "") &&
        (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() ?? "")
          ? "configured"
          : "missing",
      lastChecked: now,
      description: "Payment processing for listing upgrades (optional)",
    },
    mapbox: {
      name: "Mapbox",
      status: envStatus(process.env.NEXT_PUBLIC_MAPBOX_TOKEN),
      lastChecked: now,
      description: "Interactive maps and location services (optional)",
    },
  };
}

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
  return buildApiStatus();
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
