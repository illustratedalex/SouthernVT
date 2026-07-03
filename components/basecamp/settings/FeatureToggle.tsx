"use client";

import { FeatureFlags } from "@/types/Settings";
import { useState } from "react";

interface FeatureToggleProps {
  flags: FeatureFlags;
}

const featureList = [
  { key: "aiConcierge" as const, label: "AI Concierge", description: "Smart travel assistant and recommendations" },
  { key: "weather" as const, label: "Weather", description: "Real-time weather data and forecasts" },
  { key: "aiPlanner" as const, label: "AI Planner", description: "Intelligent trip planning suggestions" },
  { key: "passport" as const, label: "Passport", description: "Visitor collection and rewards program" },
  { key: "partnerPortal" as const, label: "Partner Portal", description: "Business partner dashboard access" },
  { key: "knowledgeGraph" as const, label: "Knowledge Graph", description: "Semantic relationship mapping" },
  { key: "businessClaims" as const, label: "Business Claims", description: "Partner verification and claims" },
  { key: "premiumProfiles" as const, label: "Premium Profiles", description: "Enhanced business profiles" },
  { key: "mapbox" as const, label: "Mapbox", description: "Interactive mapping and location services" },
  { key: "analytics" as const, label: "Analytics", description: "Visitor behavior and content analytics" },
  { key: "futureFeatures" as const, label: "Future Features", description: "Experimental and upcoming features" },
];

export function FeatureToggle({ flags }: FeatureToggleProps) {
  const [toggles, setToggles] = useState(flags);
  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof FeatureFlags) => {
    setToggles({ ...toggles, [key]: !toggles[key] });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const enabledCount = Object.values(toggles).filter(Boolean).length;
  const totalCount = Object.keys(toggles).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Feature Flags</h2>
        <p className="mt-2 text-sm text-slate-600">
          Toggle features on or off. Changes will be applied immediately.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-900">
          <span className="text-lg">✓</span>
          <span>{enabledCount} of {totalCount} features enabled</span>
        </div>
      </div>

      {/* Feature Toggles Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {featureList.map(({ key, label, description }) => (
          <div key={key} className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{label}</h3>
                <p className="mt-1 text-xs text-slate-600">{description}</p>
              </div>
              <button
                onClick={() => handleToggle(key)}
                className={`ml-3 relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
                  toggles[key] ? "bg-green-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    toggles[key] ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            {toggles[key] && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                <span>✓</span>
                <span>Enabled</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <div>
          {saved ? (
            <div className="flex items-center gap-2 text-sm text-green-700">
              <span>✓</span>
              <span>Feature flags updated</span>
            </div>
          ) : (
            <p className="text-sm text-slate-600">Toggle features above and save your changes</p>
          )}
        </div>
        <button
          onClick={handleSave}
          className="rounded-lg bg-[#1f3b2f] px-6 py-2 text-sm font-semibold text-white hover:bg-[#2a4a3f] transition"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
