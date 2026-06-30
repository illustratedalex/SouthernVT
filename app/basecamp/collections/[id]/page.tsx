import { notFound } from "next/navigation";
import {
  CollectionForm,
  ContentHealthGauge,
  EditorialComments,
  PublishingPanel,
  RelationshipEditor,
  VersionHistory,
  WorkflowTimeline,
} from "@/components/basecamp";
import { calculateHealth } from "@/lib/content/ContentHealthService";
import { getCollectionById } from "@/lib/repositories/collectionRepository";
import {
  getCommentsForContent,
  getVersionsForContent,
  getWorkflowEventsForContent,
} from "@/lib/repositories/WorkflowRepository";
import { getStoryByCollection } from "@/repositories/StoryRepository";

interface CollectionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { id } = await params;
  const [collection, workflowEvents, versions, comments, story] = await Promise.all([
    getCollectionById(id),
    getWorkflowEventsForContent("collection", id),
    getVersionsForContent("collection", id),
    getCommentsForContent("collection", id),
    getStoryByCollection(id),
  ]);

  if (!collection) {
    notFound();
  }

  const currentStatus = workflowEvents[0]?.toStatus ?? collection.status;
  const health = calculateHealth("collection", collection, { story });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <CollectionForm initialCollection={collection} />
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
            <PublishingPanel currentStatus={currentStatus} />
            <WorkflowTimeline events={workflowEvents} />
            <VersionHistory versions={versions} />
            <EditorialComments comments={comments} />
            <RelationshipEditor contentType="collection" contentId={collection.id} centerLabel={collection.title} />
          </aside>
        </div>
      </div>
    </div>
  );
}
