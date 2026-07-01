import {
  LatestContentPanel,
  QuickActionsPanel,
  Sidebar,
} from "@/components/admin";
import { ActivityFeed, BasecampPageHeader, BasecampSection, BasecampStatCard } from "@/components/basecamp";
import { calculatePlaceCompleteness } from "@/lib/completeness/placeCompleteness";
import { getFeatureFlags } from "@/lib/featureFlags";
import { getRecentActivity } from "@/lib/repositories/ActivityRepository";
import { getPlaces } from "@/repositories/PlaceRepository";

const navItems = [
  { label: "Dashboard", href: "/basecamp", active: true },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Hidden Gems", href: "/basecamp/hidden-gems" },
  { label: "Waterfalls", href: "/basecamp/waterfalls" },
  { label: "Trails", href: "/basecamp/trails" },
  { label: "Restaurants", href: "/basecamp/restaurants" },
  { label: "Lodging", href: "/basecamp/lodging" },
  { label: "Articles", href: "/basecamp/articles" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Reviews", href: "/basecamp/reviews" },
  { label: "Analytics", href: "/basecamp/analytics" },
  { label: "Passport", href: "/basecamp/passport" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
  { label: "Users", href: "/basecamp/users" },
  { label: "Settings", href: "/basecamp/settings" },
];

const stats = [
  { label: "Total Places", value: "48", detail: "Active and partner listings" },
  { label: "Hidden Gems", value: "21", detail: "Curated local discoveries" },
  { label: "Waterfalls", value: "17", detail: "Mapped and featured" },
  { label: "Upcoming Events", value: "14", detail: "Planned for the next 30 days" },
  { label: "Partner Places", value: "32", detail: "Verified collaborators" },
];

const quickActions = [
  { label: "+ Add Place", href: "/basecamp/places/new" },
  { label: "+ Add Hidden Gem", href: "/basecamp/hidden-gems/new" },
  { label: "+ Add Event", href: "/basecamp/events/new" },
  { label: "+ Add Waterfall", href: "/basecamp/waterfalls/new" },
];

const latestContent = [
  {
    title: "Riverstone Picnic Bridge",
    description: "A new hidden-gem story with updated access notes and image selection.",
    status: "Draft",
  },
  {
    title: "Summer Music on the Green",
    description: "Event copy and venue details prepared for the upcoming weekend publish window.",
    status: "Review",
  },
  {
    title: "Silver Ledge Falls",
    description: "Seasonal update for the waterfall listing with refreshed coordinates and trail guidance.",
    status: "Ready",
  },
  {
    title: "Brattleboro Boutique Stay",
    description: "Partner profile refreshed with image gallery and current amenities.",
    status: "Published",
  },
];

export default async function BasecampPage() {
  const [recentActivity, places] = await Promise.all([getRecentActivity(6), getPlaces()]);
  const featureFlags = await getFeatureFlags();
  const activeFeatureCount = featureFlags.filter((flag) => flag.enabled).length;
  const completenessScores = places.map((place) => calculatePlaceCompleteness(place));
  const averageCompleteness = completenessScores.length > 0
    ? Math.round(completenessScores.reduce((sum, score) => sum + score.percentage, 0) / completenessScores.length)
    : 0;
  const readyForLaunchCount = completenessScores.filter((score) => score.percentage >= 80).length;
  const needingPhotosCount = places.filter((place) => !place.featuredImage || place.gallery.length < 3).length;
  const missingRelationshipsCount = places.filter((place) => place.relatedPlaces.length === 0).length;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <BasecampPageHeader
            eyebrow="Basecamp"
            title="Southern Vermont content command center"
            description="Orchestrate everything from places to seasonal events with a premium editorial workspace."
            meta={`Feature Flags Active: ${activeFeatureCount}`}
            statusPill="Publishing studio"
            primaryAction={{ label: "+ New entry", href: "/basecamp/places/new" }}
            secondaryAction={{ label: "Preview site", href: "/" }}
          />

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => (
              <BasecampStatCard key={stat.label} label={stat.label} value={stat.value} detail={stat.detail} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <BasecampSection title="Recent activity" eyebrow="Basecamp" description="Fresh updates across the site." className="p-6">
              <div className="flex items-center justify-between gap-3">
                <a href="/basecamp/activity" className="text-sm font-semibold text-(--color-forest-green)">
                  See all
                </a>
              </div>

              <div className="mt-6">
                <ActivityFeed
                  items={recentActivity}
                  compact
                  emptyTitle="No recent activity"
                  emptyDescription="Actions across places, collections, media, and workflow will appear here."
                />
              </div>
            </BasecampSection>
            <QuickActionsPanel items={quickActions} />
          </section>

          <BasecampSection
            title="Content Readiness"
            eyebrow="Basecamp"
            description="Completeness overview for Places. Recommended launch threshold is 80%."
            className="p-6"
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Average completeness</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{averageCompleteness}%</p>
              </div>
              <div className="rounded-2xl border border-[#cde8d6] bg-[#ecf8f0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f5a3d]">Ready for launch</p>
                <p className="mt-2 text-3xl font-semibold text-[#1f5a3d]">{readyForLaunchCount}</p>
              </div>
              <div className="rounded-2xl border border-[#efe0b8] bg-[#fff8e8] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7a5c17]">Needing photos</p>
                <p className="mt-2 text-3xl font-semibold text-[#7a5c17]">{needingPhotosCount}</p>
              </div>
              <div className="rounded-2xl border border-[#f0d7d2] bg-[#fff2f0] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b2e1f]">Missing relationships</p>
                <p className="mt-2 text-3xl font-semibold text-[#8b2e1f]">{missingRelationshipsCount}</p>
              </div>
            </div>
          </BasecampSection>

          <LatestContentPanel items={latestContent} />
        </main>
      </div>
    </div>
  );
}
