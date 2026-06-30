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
import { calculatePlaceCompleteness } from "@/lib/completeness/placeCompleteness";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getMediaAssets } from "@/lib/repositories/mediaRepository";
import { getArticles } from "@/repositories/ArticleRepository";
import { getDeals } from "@/repositories/DealRepository";
import { getEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getStoryByPlace } from "@/repositories/StoryRepository";
import type { Article } from "@/types/Article";
import type { Collection } from "@/types/Collection";
import type { Deal } from "@/types/Deal";
import type { Event } from "@/types/Event";
import type { MediaAsset } from "@/types/MediaAsset";
import type { Place } from "@/types/Place";

type ReadinessStats = {
  completed: number;
  needsWork: number;
  average: number;
};

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content", active: true },
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

function calculateCollectionCompleteness(collection: Collection): number {
  const checks = [
    collection.title.trim().length > 0,
    collection.subtitle.trim().length > 0,
    collection.description.trim().length > 0,
    collection.featuredImage.trim().length > 0,
    collection.gallery.length >= 1,
    collection.places.length >= 3,
    collection.tags.length >= 2,
    collection.seoTitle.trim().length > 0,
    collection.seoDescription.trim().length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function calculateArticleCompleteness(article: Article): number {
  const checks = [
    article.title.trim().length > 0,
    article.subtitle.trim().length > 0,
    article.excerpt.trim().length > 0,
    article.body.trim().length > 0,
    article.featuredImage.trim().length > 0,
    article.relatedPlaces.length > 0,
    article.categories.length > 0,
    article.tags.length > 0,
    article.seoTitle.trim().length > 0,
    article.seoDescription.trim().length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function calculateEventCompleteness(event: Event): number {
  const checks = [
    event.title.trim().length > 0,
    event.description.trim().length > 0,
    event.startDate.trim().length > 0,
    event.endDate.trim().length > 0,
    event.startTime.trim().length > 0,
    event.endTime.trim().length > 0,
    event.venuePlaceId.trim().length > 0,
    event.featuredImage.trim().length > 0,
    event.organizerName.trim().length > 0,
    event.organizerEmail.trim().length > 0,
    event.categories.length > 0,
    event.tags.length > 0,
    event.seoTitle.trim().length > 0,
    event.seoDescription.trim().length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function calculateDealCompleteness(deal: Deal): number {
  const checks = [
    deal.title.trim().length > 0,
    deal.description.trim().length > 0,
    deal.shortDescription.trim().length > 0,
    deal.placeId.trim().length > 0,
    deal.terms.trim().length > 0,
    deal.startDate.trim().length > 0,
    deal.endDate.trim().length > 0,
    deal.featuredImage.trim().length > 0,
    deal.categories.length > 0,
    deal.tags.length > 0,
    deal.seoTitle.trim().length > 0,
    deal.seoDescription.trim().length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function calculateMediaCompleteness(asset: MediaAsset): number {
  const checks = [
    asset.title.trim().length > 0,
    asset.altText.trim().length > 0,
    asset.url.trim().length > 0,
    asset.thumbnailUrl.trim().length > 0,
    asset.tags.length > 0,
    asset.attachedTo.length > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
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

  const placeScores = places.map((place) => calculatePlaceCompleteness(place).percentage);
  const collectionScores = collections.map(calculateCollectionCompleteness);
  const articleScores = articles.map(calculateArticleCompleteness);
  const eventScores = events.map(calculateEventCompleteness);
  const dealScores = deals.map(calculateDealCompleteness);
  const mediaScores = mediaAssets.map(calculateMediaCompleteness);

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

  const priorityItems = places
    .flatMap((place, index) => {
      const priorities: Array<{ id: string; label: string; href: string }> = [];
      if (place.gallery.length < 3) {
        priorities.push({
          id: `${place.id}-gallery`,
          label: `${place.name} missing gallery depth`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if (!placeStories[index]) {
        priorities.push({
          id: `${place.id}-story`,
          label: `${place.name} missing Story`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if (!collections.some((collection) => collection.places.includes(place.id))) {
        priorities.push({
          id: `${place.id}-collections`,
          label: `${place.name} missing Collections`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if (!place.featuredImage.trim()) {
        priorities.push({
          id: `${place.id}-hero`,
          label: `${place.name} missing Hero Image`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      if (place.relatedPlaces.length === 0) {
        priorities.push({
          id: `${place.id}-nearby`,
          label: `${place.name} missing Nearby Places`,
          href: `/basecamp/places/${place.id}`,
        });
      }

      return priorities;
    })
    .slice(0, 8);

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

  const quickActions = [
    { label: "Add Place", href: "/basecamp/places/new" },
    { label: "Add Collection", href: "/basecamp/collections/new" },
    { label: "Write Article", href: "/basecamp/articles/new" },
    { label: "Upload Media", href: "/basecamp/media" },
    { label: "Import CSV", href: "/basecamp/import" },
  ];

  const weeklyGoals = [
    { title: "Places", current: places.length, target: 100 },
    { title: "Collections", current: collections.length, target: 50 },
    { title: "Articles", current: articles.length, target: 100 },
  ];

  const upcomingSeasons = ["Summer", "Fall", "Winter", "Spring"].map((name) => ({
    season: name,
    topics: seasonTopics[name],
  }));

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
            <h2 className="text-2xl font-semibold text-slate-900">Content Readiness</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                { label: "Places", value: readiness.places },
                { label: "Collections", value: readiness.collections },
                { label: "Articles", value: readiness.articles },
                { label: "Events", value: readiness.events },
                { label: "Deals", value: readiness.deals },
                { label: "Media", value: readiness.media },
              ].map((entry) => (
                <article key={entry.label} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{entry.label}</p>
                  <div className="mt-2 grid grid-cols-3 gap-3 text-sm text-slate-700">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Completed</p>
                      <p className="text-xl font-semibold text-slate-900">{entry.value.completed}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Needs Work</p>
                      <p className="text-xl font-semibold text-slate-900">{entry.value.needsWork}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Avg</p>
                      <p className="text-xl font-semibold text-slate-900">{entry.value.average}%</p>
                    </div>
                  </div>
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
            <h2 className="text-2xl font-semibold text-slate-900">Weekly Goals</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {weeklyGoals.map((goal) => (
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
