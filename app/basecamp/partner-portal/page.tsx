import Link from "next/link";
import { Sidebar } from "@/components/admin";
import { isFeatureEnabled } from "@/lib/featureFlags";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Passport", href: "/basecamp/passport" },
  { label: "Partner Portal", href: "/basecamp/partner-portal", active: true },
  { label: "Users", href: "/basecamp/users" },
  { label: "Settings", href: "/basecamp/settings" },
];

export default async function BasecampPartnerPortalPage() {
  const businessPortalEnabled = await isFeatureEnabled("businessPortal");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          {!businessPortalEnabled ? (
            <div className="rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] p-4 text-sm font-medium text-[#6b5a30]">
              Partner Portal is in preview mode.
            </div>
          ) : null}

          <section className="rounded-4xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f3b2f]">Basecamp module</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Partner Portal</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              This module links editorial operators to the partner-facing workspace for local business management flows.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/partner-portal" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700">
                Open landing page
              </Link>
              <Link href="/partner-portal/dashboard" className="rounded-full bg-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#f8f2e4]">
                Open dashboard preview
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
