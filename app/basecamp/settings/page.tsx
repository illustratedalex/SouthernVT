import { Sidebar } from "@/components/admin";
import { GeneralSettingsForm, SettingsSidebar, ApiStatusPanel } from "@/components/basecamp/settings";
import { getGeneralSettings, getApiStatus, getCurrentEnvironment } from "@/lib/repositories/SettingsRepository";

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
  { label: "Settings", href: "/basecamp/settings", active: true },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Integrations", href: "/basecamp/settings/integrations" },
  { label: "API Status", href: "/basecamp/settings/api" },
];

export default function SettingsPage() {
  const generalSettings = getGeneralSettings();
  const apiStatus = getApiStatus();
  const environment = getCurrentEnvironment();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          {/* Header */}
          <section className="overflow-hidden rounded-[30px] border border-[#e8dfc8] bg-white shadow-sm">
            <div className="space-y-4 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Administration</p>
              <h1 className="text-4xl font-semibold text-slate-900">Settings</h1>
              <p className="max-w-2xl text-sm leading-8 text-slate-600">
                Configure SouthernVT instance settings, feature flags, and integrations. Manage general preferences,
                API connections, and editorial defaults.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  environment === "production"
                    ? "bg-red-50 text-red-900"
                    : environment === "preview"
                      ? "bg-blue-50 text-blue-900"
                      : "bg-slate-50 text-slate-900"
                }`}>
                  <span className={`h-2 w-2 rounded-full ${
                    environment === "production"
                      ? "bg-red-600"
                      : environment === "preview"
                        ? "bg-blue-600"
                        : "bg-slate-600"
                  }`}></span>
                  <span className="capitalize">{environment} environment</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-900">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  <span>All systems operational</span>
                </span>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar Navigation */}
            <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm h-fit lg:sticky lg:top-6">
              <SettingsSidebar active="general" />
            </div>

            {/* Main Content */}
            <div>
              <GeneralSettingsForm settings={generalSettings} />

              {/* API Quick Status */}
              <div className="mt-6 rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">API Health</h3>
                    <p className="mt-1 text-sm text-slate-600">Real-time integration status overview</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-5">
                  {[
                    { name: "OpenAI", status: apiStatus.openai.status },
                    { name: "Clarity", status: apiStatus.microsoftClarity.status },
                    { name: "Vercel", status: apiStatus.vercelAnalytics.status },
                    { name: "Mapbox", status: apiStatus.mapbox.status },
                    { name: "Supabase", status: apiStatus.supabase.status },
                  ].map((api) => {
                    const statusColor =
                      api.status === "connected"
                        ? "bg-green-100 text-green-900 border-green-200"
                        : api.status === "configured"
                          ? "bg-blue-100 text-blue-900 border-blue-200"
                          : api.status === "missing"
                            ? "bg-orange-100 text-orange-900 border-orange-200"
                            : "bg-red-100 text-red-900 border-red-200";

                    return (
                      <div key={api.name} className={`rounded-lg border p-3 text-center ${statusColor}`}>
                        <p className="text-xs font-semibold uppercase tracking-widest">{api.name}</p>
                        <p className="mt-2 text-xs font-bold capitalize">{api.status}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
