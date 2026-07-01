import Link from "next/link";
import { Sidebar } from "@/components/admin";
import {
  ContentScoreGauge,
  DiscoveryOpportunityCard,
  PhotoMissionCard,
  QuickActionsPanel,
  SeasonPlanner,
  TodaysPriorities,
  WeeklyGoalCard,
  WritingQueue,
} from "@/components/basecamp/content-studio";
import { calculateHealth } from "@/lib/content/ContentHealthService";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getMediaAssets } from "@/lib/repositories/mediaRepository";
import { getArticles } from "@/repositories/ArticleRepository";
import { getDeals } from "@/repositories/DealRepository";
import { getEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getStoryByCollection, getStoryByPlace } from "@/repositories/StoryRepository";

type ReadinessStats = {
  completed: number;
  needsWork: number;
  average: number;
};

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content", active: true },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Content Report", href: "/basecamp/content/report" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Articles", href: "/basecamp/articles" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Reviews", href: "/basecamp/reviews" },
  { label: "Analytics", href: "/basecamp/analytics" },
  { label: "Passport", href: "/basecamp/passport" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
];

const seasonTopics: Record<string, string[]> = {
  Summer: ["Swimming Holes", "Camping", "Kayaking"],
  Fall: ["Foliage Weekends", "Scenic Drives", "Harvest Festivals"],
  Winter: ["Cozy Inns", "Snowy Trails", "Holiday Markets"],
  Spring: ["Waterfalls", "Mud Season Routes", "Early Wildflowers"],
};

function inferSeason(month: number): string {
  if ([12, 1, 2].includes(month)) {
    return "Winter";
  }
  if ([3, 4, 5].includes(month)) {
    return "Spring";
  }
  if ([6, 7, 8].includes(month)) {
    return "Summer";
  }
  return "Fall";
}

function roundAverage(values: number[]): number {
  if (!values.length) {
    return 0;
  }
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function statsFromScores(scores: number[], threshold = 80): ReadinessStats {
  const completed = scores.filter((score) => score >= threshold).length;
  return {
    completed,
    needsWork: Math.max(0, scores.length - completed),
    average: roundAverage(scores),
  };
}

function buildLandscapeImage(date: Date): string {
  const options = [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80",
  ];

  const daySeed = Number(date.toISOString().slice(8, 10));
  return options[daySeed % options.length];
}

export default async function BasecampContentStudioPage() {
  const [places, collections, articles, events, deals, mediaAssets] = await Promise.all([
    getPlaces(),
    getCollections(),
    getArticles(),
    getEvents(),
    getDeals(),
    getMediaAssets(),
  ]);

  const placeStories = await Promise.all(places.map((place) => getStoryByPlace(place.id)));
  const collectionStories = await Promise.all(collections.map((collection) => getStoryByCollection(collection.id)));

  const placeHealth = places.map((place, index) => {
    const inCollectionCount = collections.filter((collection) => collection.places.includes(place.id)).length;
    const relatedArticleCount = articles.filter((article) => article.relatedPlaces.includes(place.id)).length;
    const relatedEventCount = events.filter((event) => event.venuePlaceId === place.id).length;
    const relatedDealCount = deals.filter((deal) => deal.placeId === place.id).length;
    return calculateHealth("place", place, {
      story: placeStories[index],
      inCollectionCount,
      relatedArticleCount,
      relatedEventCount,
      relatedDealCount,
    });
  });

  const collectionHealth = collections.map((collection, index) =>
    calculateHealth("collection", collection, {
      story: collectionStories[index],
    }),
  );
  const articleHealth = articles.map((article) => calculateHealth("article", article));
  const eventHealth = events.map((event) => calculateHealth("event", event));
  const dealHealth = deals.map((deal) => calculateHealth("deal", deal));

  const placeScores = placeHealth.map((item) => item.healthScore);
  const collectionScores = collectionHealth.map((item) => item.healthScore);
  const articleScores = articleHealth.map((item) => item.healthScore);
  const eventScores = eventHealth.map((item) => item.healthScore);
  const dealScores = dealHealth.map((item) => item.healthScore);
  const mediaScores = mediaAssets.map((asset) => {
    const checks = [
      asset.title.trim().length > 0,
      asset.altText.trim().length > 0,
      asset.url.trim().length > 0,
      asset.thumbnailUrl.trim().length > 0,
      asset.tags.length > 0,
      asset.attachedTo.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  });

  const readiness = {
    places: statsFromScores(placeScores),
    collections: statsFromScores(collectionScores),
    articles: statsFromScores(articleScores),
    events: statsFromScores(eventScores),
    deals: statsFromScores(dealScores),
    media: statsFromScores(mediaScores),
  };

  const currentDate = new Date();
  const season = inferSeason(currentDate.getMonth() + 1);
  const landscapeImage = buildLandscapeImage(currentDate);

  const allHealth = [...placeHealth, ...collectionHealth, ...articleHealth, ...eventHealth, ...dealHealth];
  const launchReadyCount = allHealth.filter((item) => item.launchReadiness >= 80).length;
  const needsPhotosCount = allHealth.filter((item) => item.photographyScore < 60).length;
  const needsStoryCount = allHealth.filter((item) => item.storyScore < 60).length;
  const needsRelationshipsCount = allHealth.filter((item) => item.discoveryScore < 60).length;
  const needsSEOCount = allHealth.filter((item) => item.seoScore < 60).length;
  const now = new Date();
  const needsReviewCount = allHealth.filter((item) => new Date(item.nextReview).getTime() <= now.getTime()).length;

  const editorialTasks = places
    .flatMap((place, index) => {
      const priorities: Array<{ id: string; label: string; href: string }> = [];
      if (!placeStories[index]) {
        priorities.push({
          id: `${place.id}-story`,
          label: `${place.name} - Missing Story`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if (place.gallery.length < 3) {
        priorities.push({
          id: `${place.id}-gallery`,
          label: `${place.name} - Missing Gallery`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if (place.relatedPlaces.length === 0) {
        priorities.push({
          id: `${place.id}-nearby`,
          label: `${place.name} - Needs Nearby Places`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if ((placeStories[index]?.photographyTips.length ?? 0) === 0) {
        priorities.push({
          id: `${place.id}-photo-tips`,
          label: `${place.name} - Needs Photography Tips`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if (!place.featuredImage.trim()) {
        priorities.push({
          id: `${place.id}-hero`,
          label: `${place.name} - Missing Hero`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if (!place.seoTitle.trim() || !place.seoDescription.trim()) {
        priorities.push({
          id: `${place.id}-seo`,
          label: `${place.name} - Needs SEO`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      return priorities;
    })
    .slice(0, 16);

  const priorityItems = editorialTasks.slice(0, 8);

  const photoMissions = places
    .map((place) => {
      const missions: string[] = [];
      if (!place.featuredImage.trim()) {
        missions.push("Hero");
      }
      if (place.gallery.length < 3) {
        missions.push("Drone Orbit", "Parking", "Trailhead", "Vertical Reel", "Ambient Audio");
      }
      return { place, missions };
    })
    .filter((entry) => entry.missions.length > 0)
    .slice(0, 4);

  const placesMissingStory = places
    .filter((_, index) => !placeStories[index])
    .slice(0, 6)
    .map((place) => ({ id: place.id, label: place.name, href: `/basecamp/places/${place.id}` }));

  const articlesMissingSummary = articles
    .filter((article) => article.excerpt.trim().length < 20)
    .slice(0, 6)
    .map((article) => ({ id: article.id, label: article.title, href: `/basecamp/articles/${article.id}` }));

  const collectionsMissingIntroduction = collections
    .filter((collection) => collection.description.trim().length < 40)
    .slice(0, 6)
    .map((collection) => ({ id: collection.id, label: collection.title, href: `/basecamp/collections/${collection.id}` }));

  const placesNotInCollections = places.filter((place) => !collections.some((collection) => collection.places.includes(place.id)));
  const placesWithoutDeals = places.filter((place) => !deals.some((deal) => deal.placeId === place.id));
  const placesWithoutArticles = places.filter((place) => !articles.some((article) => article.relatedPlaces.includes(place.id)));
  const placesWithoutEvents = places.filter((place) => !events.some((event) => event.venuePlaceId === place.id));
  const collectionsUnderFivePlaces = collections.filter((collection) => collection.places.length < 5);

  const allScores = [
    ...placeScores,
    ...collectionScores,
    ...articleScores,
    ...eventScores,
    ...dealScores,
    ...mediaScores,
  ];
  const studioScore = roundAverage(allScores);

  const missingStoryPlace = places.find((_, index) => !placeStories[index]);
  const missingHeroPlace = places.find((place) => !place.featuredImage.trim());
  const missingCollectionPlace = places.find((place) => !collections.some((collection) => collection.places.includes(place.id)));
  const missingNearbyPlace = places.find((place) => place.relatedPlaces.length === 0);
  const missingSEOPlace = places.find((place) => !place.seoTitle.trim() || !place.seoDescription.trim());

  const quickActions = [
    { label: "Add Story", href: missingStoryPlace ? `/basecamp/places/${missingStoryPlace.id}` : "/basecamp/places" },
    { label: "Add Hero", href: missingHeroPlace ? `/basecamp/places/${missingHeroPlace.id}` : "/basecamp/places" },
    { label: "Add Collection", href: missingCollectionPlace ? `/basecamp/places/${missingCollectionPlace.id}` : "/basecamp/collections/new" },
    { label: "Add Nearby Place", href: missingNearbyPlace ? `/basecamp/places/${missingNearbyPlace.id}` : "/basecamp/places" },
    { label: "Write SEO", href: missingSEOPlace ? `/basecamp/places/${missingSEOPlace.id}` : "/basecamp/places" },
  ];

  const todayGoals = [
    { title: "Improve 3 Places", current: Math.min(3, placeHealth.filter((item) => item.healthScore >= 80).length), target: 3 },
    { title: "Publish 1 Story", current: missingStoryPlace ? 0 : 1, target: 1 },
    { title: "Upload 10 Photos", current: Math.min(10, mediaAssets.length), target: 10 },
  ];

  const weeklyGoals = [
    { title: "Close 10 Tasks", current: Math.max(0, 10 - Math.min(10, editorialTasks.length)), target: 10 },
    { title: "Reach 85% Health", current: Math.min(85, studioScore), target: 85 },
    { title: "Ship 5 Launch-Ready", current: Math.min(5, launchReadyCount), target: 5 },
  ];

  const monthlyGoals = [
    { title: "Improve 30 Places", current: Math.min(30, placeHealth.filter((item) => item.healthScore >= 80).length), target: 30 },
    { title: "Publish 12 Stories", current: Math.min(12, places.filter((_, index) => Boolean(placeStories[index])).length), target: 12 },
    { title: "Upload 120 Photos", current: Math.min(120, mediaAssets.length), target: 120 },
  ];

  const upcomingSeasons = ["Summer", "Fall", "Winter", "Spring"].map((name) => ({
    season: name,
    topics: seasonTopics[name],
  }));

  const hamiltonFallsNeeds = [
    "Hero photo",
    "Gallery",
    "Drone orbit",
    "Parking notes",
    "GPS verified",
    "Nearby food",
    "Nearby lodging",
    "Nearby collection",
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <section className="overflow-hidden rounded-[30px] border border-[#e8dfc8] bg-white shadow-sm">
            <div className="relative grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Content Studio</p>
                <h1 className="text-4xl font-semibold text-slate-900">Good Morning Alex</h1>
                <p className="text-sm leading-7 text-slate-600">
                  {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {season}
                </p>
                <p className="max-w-2xl text-sm leading-8 text-slate-600">
                  Your editorial production studio for today. Focus on readiness, close gaps, and ship the next SouthernVT stories.
                </p>
              </div>
              <div className="h-64 lg:h-full">
                <img src={landscapeImage} alt="Vermont landscape inspiration" className="h-full w-full object-cover" />
              </div>
            </div>
          </section>

          <TodaysPriorities items={priorityItems} />

          <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-semibold text-slate-900">Content Health Buckets</h2>
              <Link href="/basecamp/content/report" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white">
                Open Content Report
              </Link>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Content Ready For Launch", count: launchReadyCount, detail: `${allHealth.length} tracked` },
                { label: "Needs Photos", count: needsPhotosCount, detail: "Photography health < 60" },
                { label: "Needs Story", count: needsStoryCount, detail: "Story health < 60" },
                { label: "Needs Relationships", count: needsRelationshipsCount, detail: "Discovery health < 60" },
                { label: "Needs SEO", count: needsSEOCount, detail: "SEO health < 60" },
                { label: "Needs Review", count: needsReviewCount, detail: "Review date due" },
                { label: "Average Place Health", count: readiness.places.average, detail: `${readiness.places.completed} ready` },
                { label: "Average Collection Health", count: readiness.collections.average, detail: `${readiness.collections.completed} ready` },
              ].map((entry) => (
                <article key={entry.label} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{entry.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{entry.count}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{entry.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Photography Missions</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {photoMissions.length ? (
                photoMissions.map((mission) => (
                  <PhotoMissionCard key={mission.place.id} placeName={mission.place.name} missions={mission.missions} href={`/basecamp/places/${mission.place.id}`} />
                ))
              ) : (
                <article className="rounded-2xl border border-[#ece3cf] bg-white p-5 text-sm text-slate-600">No urgent photography missions right now.</article>
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Editorial Needs Spotlight</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Hamilton Falls</h2>
                <p className="mt-1 text-sm leading-7 text-slate-600">Waterfall · Outdoor Recreation · Jamaica, Vermont</p>
              </div>
              <Link href="/basecamp/places/place-hamilton-falls" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white">
                Open Place
              </Link>
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {hamiltonFallsNeeds.map((need) => (
                <div key={need} className="rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
                  <span className="mr-2 text-[#1f3b2f]">☐</span>
                  {need}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Editorial Tasks</h2>
            <p className="mt-1 text-sm text-slate-600">Auto-generated from content health gaps. Open any item to jump into its editor.</p>
            {editorialTasks.length ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {editorialTasks.slice(0, 12).map((task) => (
                  <Link key={task.id} href={task.href} className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[#d7cbb3] hover:bg-white">
                    <span className="mr-2 text-[#1f3b2f]">☐</span>
                    {task.label}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-600">No open editorial tasks detected.</p>
            )}
          </section>

          <WritingQueue
            placesMissingStory={placesMissingStory}
            articlesMissingSummary={articlesMissingSummary}
            collectionsMissingIntroduction={collectionsMissingIntroduction}
          />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Discovery Opportunities</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DiscoveryOpportunityCard
                title="Places not in Collections"
                count={placesNotInCollections.length}
                description="Increase discoverability by attaching standalone places to at least one collection."
                href="/basecamp/collections"
              />
              <DiscoveryOpportunityCard
                title="Places without Deals"
                count={placesWithoutDeals.length}
                description="Coordinate partner offers to improve conversion opportunities from place pages."
                href="/basecamp/deals"
              />
              <DiscoveryOpportunityCard
                title="Places without Articles"
                count={placesWithoutArticles.length}
                description="Fill editorial gaps so each key place has guide coverage."
                href="/basecamp/articles"
              />
              <DiscoveryOpportunityCard
                title="Places without Events"
                count={placesWithoutEvents.length}
                description="Add event ties so destination pages reflect seasonality and urgency."
                href="/basecamp/events"
              />
              <DiscoveryOpportunityCard
                title="Collections with fewer than 5 Places"
                count={collectionsUnderFivePlaces.length}
                description="Grow light collections to improve route depth and itinerary value."
                href="/basecamp/collections"
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Today&apos;s Goal</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {todayGoals.map((goal) => (
                <WeeklyGoalCard key={goal.title} title={goal.title} current={goal.current} target={goal.target} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Weekly Goal</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {weeklyGoals.map((goal) => (
                <WeeklyGoalCard key={goal.title} title={goal.title} current={goal.current} target={goal.target} />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Monthly Goal</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {monthlyGoals.map((goal) => (
                <WeeklyGoalCard key={goal.title} title={goal.title} current={goal.current} target={goal.target} />
              ))}
            </div>
          </section>

          <QuickActionsPanel actions={quickActions} />

          <ContentScoreGauge current={studioScore} target={95} />

          <SeasonPlanner plans={upcomingSeasons} />
        </main>
      </div>
    </div>
  );
}
