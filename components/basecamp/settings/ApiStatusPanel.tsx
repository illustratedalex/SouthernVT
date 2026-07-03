"use client";

import { ApiStatusConfig } from "@/types/Settings";

interface ApiStatusPanelProps {
  apiStatus: ApiStatusConfig;
}

export function ApiStatusPanel({ apiStatus }: ApiStatusPanelProps) {
  const apis = [
    apiStatus.openai,
    apiStatus.microsoftClarity,
    apiStatus.vercelAnalytics,
    apiStatus.mapbox,
    apiStatus.supabase,
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-50 text-green-900 border-green-200";
      case "configured":
        return "bg-blue-50 text-blue-900 border-blue-200";
      case "missing":
        return "bg-orange-50 text-orange-900 border-orange-200";
      case "error":
        return "bg-red-50 text-red-900 border-red-200";
      default:
        return "bg-slate-50 text-slate-900 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return "✓";
      case "configured":
        return "◐";
      case "missing":
        return "⚠";
      case "error":
        return "✕";
      default:
        return "?";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">API Status</h2>
        <p className="mt-2 text-sm text-slate-600">
          Monitor the status of third-party API integrations and services
        </p>
      </div>

      {/* API Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {apis.map((api) => (
          <div key={api.name} className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{api.name}</h3>
                {api.description && (
                  <p className="mt-1 text-xs text-slate-600">{api.description}</p>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${getStatusColor(api.status)}`}>
                <span>{getStatusIcon(api.status)}</span>
                <span>{getStatusLabel(api.status)}</span>
              </span>
            </div>

            {api.lastChecked && (
              <div className="mt-3 text-xs text-slate-500">
                Last checked: {new Date(api.lastChecked).toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Overview */}
      <div className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Integration Overview</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            { label: "Connected", count: apis.filter((a) => a.status === "connected").length, color: "text-green-600" },
            { label: "Configured", count: apis.filter((a) => a.status === "configured").length, color: "text-blue-600" },
            { label: "Missing", count: apis.filter((a) => a.status === "missing").length, color: "text-orange-600" },
            { label: "Error", count: apis.filter((a) => a.status === "error").length, color: "text-red-600" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg border border-[#ece3cf] bg-[#fcfaf6] p-3">
              <p className="text-xs uppercase tracking-widest text-slate-600">{stat.label}</p>
              <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
