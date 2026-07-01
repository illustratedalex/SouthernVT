import Link from "next/link";
import { Sidebar } from "@/components/admin";
import { calculateHealth } from "@/lib/content/ContentHealthService";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getArticles } from "@/repositories/ArticleRepository";
import { getDeals } from "@/repositories/DealRepository";
import { getEvents } from "@/repositories/EventRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getStoryByCollection, getStoryByPlace } from "@/repositories/StoryRepository";
import type { ContentHealthType } from "@/types/ContentHealth";

type ReportItem = {
  id: string;
  label: string;
  type: ContentHealthType;
  editHref: string;
  healthScore: number;
  completenessScore: number;
  updatedAt: string;
};

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Content Report", href: "/basecamp/content/report", active: true },
  { label: "Places", href: "/basecamp/places" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Articles", href: "/basecamp/articles" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
];

function renderType(type: ContentHealthType): string {
  if (type === "place") {
    return "Place";
  }
  if (type === "collection") {
    return "Collection";
  }
  if (type === "article") {
    return "Article";
  }
  if (type === "event") {
    return "Event";
  }
  return "Deal";
}

function sortByDateDesc(a: ReportItem, b: ReportItem): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function Row({ item }: { item: ReportItem }) {
  return (
    <tr className="border-b border-[#ece3cf] text-sm text-slate-700 last:border-b-0">
      <td className="px-4 py-3 font-semibold text-slate-900">{item.label}</td>
      <td className="px-4 py-3">{renderType(item.type)}</td>
      <td className="px-4 py-3">{item.healthScore}%</td>
      <td className="px-4 py-3">{item.completenessScore}%</td>
      <td className="px-4 py-3">{new Date(item.updatedAt).toLocaleDateString()}</td>
      <td className="px-4 py-3">
        <Link href={item.editHref} className="font-semibold text-[#1f3b2f] hover:underline">
          Open Editor
        </Link>
      </td>
    </tr>
  );
}

function ReportSection({ title, items }: { title: string; items: ReportItem[] }) {
  return (
    <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      {items.length ? (
        <div className="mt-4 overflow-hidden rounded-2xl border border-[#ece3cf]">
          <table className="w-full border-collapse">
            <thead className="bg-[#fcfaf6] text-left text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Health</th>
                <th className="px-4 py-3">Complete</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>{items.map((item) => <Row key={`${item.type}-${item.id}-${title}`} item={item} />)}</tbody>
          </table>
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">No content available for this section yet.</p>
      )}
    </section>
  );
}

export default async function BasecampContentReportPage() {
  const [places, collections, articles, events, deals] = await Promise.all([
    getPlaces(),
    getCollections(),
    getArticles(),
    getEvents(),
    getDeals(),
  ]);

  const placeStories = await Promise.all(places.map((place) => getStoryByPlace(place.id)));
  const collectionStories = await Promise.all(collections.map((collection) => getStoryByCollection(collection.id)));

  const healthItems: ReportItem[] = [
    ...places.map((place, index) => {
      const inCollectionCount = collections.filter((collection) => collection.places.includes(place.id)).length;
      const relatedArticleCount = articles.filter((article) => article.relatedPlaces.includes(place.id)).length;
      const relatedEventCount = events.filter((event) => event.venuePlaceId === place.id).length;
      const relatedDealCount = deals.filter((deal) => deal.placeId === place.id).length;
      const health = calculateHealth("place", place, {
        story: placeStories[index],
        inCollectionCount,
        relatedArticleCount,
        relatedEventCount,
        relatedDealCount,
      });

      return {
        id: place.id,
        label: place.name,
        type: "place" as const,
        editHref: `/basecamp/places/${place.id}`,
        healthScore: health.healthScore,
        completenessScore: health.completenessScore,
        updatedAt: place.updatedAt,
      };
    }),
    ...collections.map((collection, index) => {
      const health = calculateHealth("collection", collection, {
        story: collectionStories[index],
      });
      return {
        id: collection.id,
        label: collection.title,
        type: "collection" as const,
        editHref: `/basecamp/collections/${collection.id}`,
        healthScore: health.healthScore,
        completenessScore: health.completenessScore,
        updatedAt: collection.updatedAt,
      };
    }),
    ...articles.map((article) => {
      const health = calculateHealth("article", article);
      return {
        id: article.id,
        label: article.title,
        type: "article" as const,
        editHref: `/basecamp/articles/${article.id}`,
        healthScore: health.healthScore,
        completenessScore: health.completenessScore,
        updatedAt: article.updatedAt,
      };
    }),
    ...events.map((event) => {
      const health = calculateHealth("event", event);
      return {
        id: event.id,
        label: event.title,
        type: "event" as const,
        editHref: `/basecamp/events/${event.id}`,
        healthScore: health.healthScore,
        completenessScore: health.completenessScore,
        updatedAt: event.updatedAt,
      };
    }),
    ...deals.map((deal) => {
      const health = calculateHealth("deal", deal);
      return {
        id: deal.id,
        label: deal.title,
        type: "deal" as const,
        editHref: `/basecamp/deals/${deal.id}`,
        healthScore: health.healthScore,
        completenessScore: health.completenessScore,
        updatedAt: deal.updatedAt,
      };
    }),
  ];

  const highestQuality = [...healthItems].sort((a, b) => b.healthScore - a.healthScore).slice(0, 8);
  const lowestQuality = [...healthItems].sort((a, b) => a.healthScore - b.healthScore).slice(0, 8);
  const mostComplete = [...healthItems].sort((a, b) => b.completenessScore - a.completenessScore).slice(0, 8);
  const leastComplete = [...healthItems].sort((a, b) => a.completenessScore - b.completenessScore).slice(0, 8);
  const newest = [...healthItems].sort(sortByDateDesc).slice(0, 8);
  const needsAttention = [...healthItems].filter((item) => item.healthScore < 60).sort((a, b) => a.healthScore - b.healthScore).slice(0, 8);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />
        <main className="flex-1 space-y-5">
          <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Content Report</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Editorial Quality Snapshot</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">Track best-in-class content, identify weak points, and jump directly into editors to improve launch readiness.</p>
          </section>

          <ReportSection title="Highest Quality" items={highestQuality} />
          <ReportSection title="Lowest Quality" items={lowestQuality} />
          <ReportSection title="Most Complete" items={mostComplete} />
          <ReportSection title="Least Complete" items={leastComplete} />
          <ReportSection title="Newest" items={newest} />
          <ReportSection title="Needs Attention" items={needsAttention} />
        </main>
      </div>
    </div>
  );
}
