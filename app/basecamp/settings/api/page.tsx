import { Sidebar } from "@/components/admin";
import { ApiStatusPanel, SettingsSidebar } from "@/components/basecamp/settings";
import { getApiStatus, getCurrentEnvironment } from "@/lib/repositories/SettingsRepository";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Newsroom", href: "/basecamp/content" },
  { label: "Editorial Studio", href: "/basecamp/content" },
  { label: "Editorial Issue", href: "/basecamp/editorial-issue" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Content Report", href: "/basecamp/content/report" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Settings", href: "/basecamp/settings" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Integrations", href: "/basecamp/settings/integrations" },
  { label: "API Status", href: "/basecamp/settings/api", active: true },
];

export default function ApiStatusPage() {
  const apiStatus = getApiStatus();
  const environment = getCurrentEnvironment();

  const connectedCount = Object.values(apiStatus).filter((a) => a.status === "connected").length;
  const configuredCount = Object.values(apiStatus).filter((a) => a.status === "configured").length;
  const errorCount = Object.values(apiStatus).filter((a) => a.status === "error").length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          {/* Header */}
          <section className="overflow-hidden rounded-[30px] border border-[#e8dfc8] bg-white shadow-sm">
            <div className="space-y-4 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Administration</p>
              <h1 className="text-4xl font-semibold text-slate-900">API Status</h1>
              <p className="max-w-2xl text-sm leading-8 text-slate-600">
                Monitor the health and status of all connected third-party APIs. Check for errors, configuration
                issues, and integration readiness.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-900 border border-[#ece3cf]">
                  <span className="text-lg">🔗</span>
                  <span>{connectedCount} connected</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-900 border border-blue-200">
                  <span className="text-lg">◐</span>
                  <span>{configuredCount} configured</span>
                </span>
                {errorCount > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-900 border border-red-200">
                    <span className="text-lg">✕</span>
                    <span>{errorCount} errors</span>
                  </span>
                )}
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar Navigation */}
            <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm h-fit lg:sticky lg:top-6">
              <SettingsSidebar active="api" />
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <ApiStatusPanel apiStatus={apiStatus} />

              {/* Environment Info */}
              <div className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Deployment Environment</h3>
                <p className="mt-2 text-sm text-slate-600">Current environment and status information</p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Environment</p>
                    <p className="mt-2 text-2xl font-bold capitalize text-slate-900">{environment}</p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg text-xs font-semibold">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          environment === "production"
                            ? "bg-red-600"
                            : environment === "preview"
                              ? "bg-blue-600"
                              : "bg-slate-600"
                        }`}
                      ></span>
                      <span
                        className={
                          environment === "production"
                            ? "text-red-900"
                            : environment === "preview"
                              ? "text-blue-900"
                              : "text-slate-900"
                        }
                      >
                        {environment === "production"
                          ? "Production Live"
                          : environment === "preview"
                            ? "Preview Staging"
                            : "Development Local"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Total APIs</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">5</p>
                    <p className="mt-3 text-xs text-slate-600">Configured integrations</p>
                  </div>

                  <div className="rounded-lg border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Last Check</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">Just now</p>
                    <p className="mt-3 text-xs text-slate-600">Real-time status monitoring</p>
                  </div>
                </div>
              </div>

              {/* Troubleshooting */}
              <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">🔧 Troubleshooting</h3>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-900">Missing API</p>
                    <p className="mt-1 text-sm text-orange-900">
                      Check that all required API keys are configured in environment variables.
                    </p>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-red-900">Connection Error</p>
                    <p className="mt-1 text-sm text-red-900">
                      Verify network connectivity and that API endpoints are accessible.
                    </p>
                  </div>
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-blue-900">Configured Only</p>
                    <p className="mt-1 text-sm text-blue-900">
                      API is configured but not yet tested. Verify credentials are correct.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
