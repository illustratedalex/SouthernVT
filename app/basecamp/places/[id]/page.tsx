import { notFound } from "next/navigation";
import {
  CompletenessMeter,
  ContentHealthGauge,
  EditorialComments,
  PlaceForm,
  PublishingPanel,
  RelationshipEditor,
  VersionHistory,
  WorkflowTimeline,
} from "@/components/basecamp";
import { calculatePlaceCompleteness } from "@/lib/completeness/placeCompleteness";
import { calculateHealth } from "@/lib/content/ContentHealthService";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getArticles } from "@/repositories/ArticleRepository";
import { getDeals } from "@/repositories/DealRepository";
import { getEvents } from "@/repositories/EventRepository";
import { getStoryByPlace } from "@/repositories/StoryRepository";
import {
  getCommentsForContent,
  getVersionsForContent,
  getWorkflowEventsForContent,
} from "@/lib/repositories/WorkflowRepository";
import { getPlaceById } from "@/repositories/PlaceRepository";

interface PlaceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { id } = await params;
  const [place, workflowEvents, versions, comments, collections, articles, events, deals, story] = await Promise.all([
    getPlaceById(id),
    getWorkflowEventsForContent("place", id),
    getVersionsForContent("place", id),
    getCommentsForContent("place", id),
    getCollections(),
    getArticles(),
    getEvents(),
    getDeals(),
    getStoryByPlace(id),
  ]);

  if (!place) {
    notFound();
  }

  const currentStatus = workflowEvents[0]?.toStatus ?? place.status;
  const completeness = calculatePlaceCompleteness(place);
  const inCollectionCount = collections.filter((collection) => collection.places.includes(place.id)).length;
  const relatedArticleCount = articles.filter((article) => article.relatedPlaces.includes(place.id)).length;
  const relatedEventCount = events.filter((event) => event.venuePlaceId === place.id).length;
  const relatedDealCount = deals.filter((deal) => deal.placeId === place.id).length;
  const health = calculateHealth("place", place, {
    story,
    inCollectionCount,
    relatedArticleCount,
    relatedEventCount,
    relatedDealCount,
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-(--color-forest-green)">Basecamp</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Edit place</h1>
          <p className="mt-2 text-base leading-8 text-slate-600">
            Update a destination entry with the same flexible editor used for new places.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <PlaceForm initialPlace={place} />
          <aside className="space-y-6 xl:sticky xl:top-24 xl:h-fit">
            <section className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
              <p className="px-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Launch Readiness</p>
              <div className="mt-3 grid gap-4">
                <ContentHealthGauge label="Launch Readiness" value={health.launchReadiness} tone="forest" />
                <ContentHealthGauge label="Content Health" value={health.healthScore} tone="forest" />
                <ContentHealthGauge label="SEO Health" value={health.seoScore} tone="amber" />
                <ContentHealthGauge label="Story Health" value={health.storyScore} tone="rose" />
                <ContentHealthGauge label="Discovery Health" value={health.discoveryScore} tone="amber" />
              </div>
            </section>
            <CompletenessMeter score={completeness} />
            <PublishingPanel currentStatus={currentStatus} />
            <WorkflowTimeline events={workflowEvents} />
            <VersionHistory versions={versions} />
            <EditorialComments comments={comments} />
            <RelationshipEditor contentType="place" contentId={place.id} centerLabel={place.name} />
          </aside>
        </div>
      </div>
    </div>
  );
}
