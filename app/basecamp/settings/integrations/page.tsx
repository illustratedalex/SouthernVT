import { Sidebar } from "@/components/admin";
import { ApiStatusPanel, SettingsSidebar } from "@/components/basecamp/settings";
import { getApiStatus } from "@/lib/repositories/SettingsRepository";

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
  { label: "Integrations", href: "/basecamp/settings/integrations", active: true },
  { label: "API Status", href: "/basecamp/settings/api" },
];

export default function IntegrationsPage() {
  const apiStatus = getApiStatus();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          {/* Header */}
          <section className="overflow-hidden rounded-[30px] border border-[#e8dfc8] bg-white shadow-sm">
            <div className="space-y-4 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Administration</p>
              <h1 className="text-4xl font-semibold text-slate-900">Integrations</h1>
              <p className="max-w-2xl text-sm leading-8 text-slate-600">
                Configure and manage third-party integrations. Connect services, manage API keys, and verify integration
                status.
              </p>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar Navigation */}
            <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm h-fit lg:sticky lg:top-6">
              <SettingsSidebar active="integrations" />
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <ApiStatusPanel apiStatus={apiStatus} />

              {/* Integration Management */}
              <div className="rounded-2xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Configure Integrations</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Add or update API keys and credentials for third-party services
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    { name: "OpenAI", category: "AI & Language", description: "API key for GPT integration" },
                    { name: "Mapbox", category: "Maps & Location", description: "Map tile and routing API" },
                    { name: "Supabase", category: "Database & Auth", description: "PostgreSQL and authentication" },
                    { name: "Vercel Analytics", category: "Analytics", description: "Web performance metrics" },
                    { name: "Microsoft Clarity", category: "Analytics", description: "Session recording and heatmaps" },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between rounded-lg border border-[#ece3cf] bg-[#fcfaf6] p-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{integration.name}</h4>
                        <p className="mt-1 text-xs text-slate-600">{integration.description}</p>
                        <p className="mt-2 text-xs font-medium text-slate-500">{integration.category}</p>
                      </div>
                      <button className="rounded-lg border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-[#fcfaf6] transition">
                        Configure
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Integration Tips */}
              <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">📝 Integration Tips</h3>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li>• Keep API keys secure and rotate them regularly</li>
                  <li>• Monitor integration status and error logs for issues</li>
                  <li>• Test integrations in preview before enabling in production</li>
                  <li>• Document custom configurations for team reference</li>
                  <li>• Set up alerts for API connection failures</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
