import Link from "next/link";
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
import { getConnectedNodes, getEdges, getNode, recommendConnections } from "@/lib/repositories/KnowledgeGraphRepository";
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
  const graphNodeId = `collection:${collection.id}`;
  const [graphNode, graphEdges, graphConnected, graphRecommended] = await Promise.all([
    getNode(graphNodeId),
    getEdges(graphNodeId),
    getConnectedNodes(graphNodeId),
    recommendConnections(graphNodeId, 6),
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
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
            <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Knowledge Graph</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{graphNode?.title ?? collection.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{graphEdges.length} relationships attached to this collection node.</p>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Connected nodes</p>
                <div className="mt-2 space-y-2">
                  {graphConnected.slice(0, 6).map((node) => (
                    <Link
                      key={node.id}
                      href={`/basecamp/graph?node=${encodeURIComponent(node.id)}`}
                      className="block rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700"
                    >
                      {node.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Recommended next links</p>
                <div className="mt-2 space-y-2">
                  {graphRecommended.slice(0, 4).map((node) => (
                    <Link
                      key={node.id}
                      href={`/basecamp/graph?node=${encodeURIComponent(node.id)}`}
                      className="block rounded-xl border border-[#ece3cf] bg-white px-3 py-2 text-sm text-slate-700"
                    >
                      {node.title}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
