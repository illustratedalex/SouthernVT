"use client";

import { useMemo } from "react";
import { useToasts } from "@/components/ui";
import { FeatureFlags } from "@/types/Settings";
import { useFeatureFlags } from "../../../hooks/useFeatureFlags";

const featureList = [
  { key: "aiConcierge" as const, label: "AI Concierge", description: "Smart travel assistant and recommendations" },
  { key: "aiPlanner" as const, label: "AI Planner", description: "Intelligent trip planning suggestions" },
  { key: "weather" as const, label: "Weather", description: "Real-time weather data and forecasts" },
  { key: "passport" as const, label: "Passport", description: "Visitor collection and rewards program" },
  { key: "partnerPortal" as const, label: "Partner Portal", description: "Business partner dashboard access" },
  { key: "businessClaims" as const, label: "Business Claims", description: "Partner verification and claims" },
  { key: "knowledgeGraph" as const, label: "Knowledge Graph", description: "Semantic relationship mapping" },
  { key: "mapbox" as const, label: "Mapbox", description: "Interactive mapping and location services" },
  { key: "analytics" as const, label: "Analytics", description: "Visitor behavior and content analytics" },
  { key: "premiumProfiles" as const, label: "Premium Profiles", description: "Enhanced business profiles" },
];

const groupedFeatures = [
  {
    title: "Services",
    keys: ["aiConcierge", "weather", "mapbox", "analytics"] as const,
  },
  {
    title: "Features",
    keys: ["aiPlanner", "passport", "partnerPortal", "businessClaims", "knowledgeGraph", "premiumProfiles"] as const,
  },
];

export function FeatureToggle() {
  const { pushToast } = useToasts();
  const { featureFlags, setFeatureEnabled } = useFeatureFlags();

  const featuresByKey = useMemo(
    () => new Map(featureList.map((feature) => [feature.key, feature])),
    [],
  );

  const handleToggle = (key: keyof FeatureFlags) => {
    const nextEnabled = !featureFlags[key];
    setFeatureEnabled(key, nextEnabled);
    const featureLabel = featuresByKey.get(key as (typeof featureList)[number]["key"])?.label ?? "Feature";
    pushToast({
      tone: "success",
      title: `${featureLabel} ${nextEnabled ? "enabled" : "disabled"}`,
    });
  };

  const enabledCount = featureList.filter(({ key }) => featureFlags[key]).length;
  const totalCount = featureList.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Feature Flags</h2>
        <p className="mt-2 text-sm text-slate-600">
          Toggle features on or off. Changes apply immediately and are mocked in local storage.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-900">
          <span className="text-lg">✓</span>
          <span>{enabledCount} of {totalCount} features enabled</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm xl:sticky xl:top-6">
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Sidebar Status</p>
          <div className="mt-3 space-y-2">
            {featureList.map(({ key, label }) => (
              <div key={`${key}-status`} className="flex items-center justify-between rounded-lg border border-[#f1e7d3] px-3 py-2">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    featureFlags[key] ? "bg-green-100 text-green-700" : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {featureFlags[key] ? "ON" : "DISABLED"}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Feature Toggles Grid */}
        <div className="space-y-6">
          {groupedFeatures.map((group) => (
            <section key={group.title} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{group.title}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {group.keys.map((key) => {
                  const feature = featuresByKey.get(key);
                  if (!feature) {
                    return null;
                  }

                  return (
                    <div key={feature.key} className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{feature.label}</h3>
                          <p className="mt-1 text-xs text-slate-600">{feature.description}</p>
                          <p
                            className={`mt-3 text-xs font-semibold uppercase tracking-[0.2em] ${
                              featureFlags[feature.key] ? "text-green-700" : "text-rose-700"
                            }`}
                          >
                            {featureFlags[feature.key] ? "ON" : "OFF"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggle(feature.key)}
                          aria-pressed={featureFlags[feature.key]}
                          aria-label={`${featureFlags[feature.key] ? "Disable" : "Enable"} ${feature.label}`}
                          className={`ml-3 relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${
                            featureFlags[feature.key] ? "bg-green-600" : "bg-slate-300"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              featureFlags[feature.key] ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
