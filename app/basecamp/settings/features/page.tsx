import { Sidebar } from "@/components/admin";
import { FeatureToggle, SettingsSidebar } from "@/components/basecamp/settings";

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
  { label: "Feature Flags", href: "/basecamp/settings/features", active: true },
  { label: "Integrations", href: "/basecamp/settings/integrations" },
  { label: "API Status", href: "/basecamp/settings/api" },
];

export default function FeatureFlagsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          {/* Header */}
          <section className="overflow-hidden rounded-[30px] border border-[#e8dfc8] bg-white shadow-sm">
            <div className="space-y-4 p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Administration</p>
              <h1 className="text-4xl font-semibold text-slate-900">Feature Flags</h1>
              <p className="max-w-2xl text-sm leading-8 text-slate-600">
                Enable or disable features for your SouthernVT instance. Control access to experimental features, AI
                capabilities, and platform integrations.
              </p>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar Navigation */}
            <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm h-fit lg:sticky lg:top-6">
              <SettingsSidebar active="features" />
            </div>

            {/* Main Content */}
            <div>
              <FeatureToggle />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
