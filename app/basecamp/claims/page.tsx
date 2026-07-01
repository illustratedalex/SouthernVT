import { Sidebar } from "@/components/admin";
import { BasecampClaimsClient } from "@/components/claims/BasecampClaimsClient";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Articles", href: "/basecamp/articles" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
  { label: "Claims", href: "/basecamp/claims", active: true },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
];

export default function BasecampClaimsPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <BasecampClaimsClient />
        </main>
      </div>
    </div>
  );
}
