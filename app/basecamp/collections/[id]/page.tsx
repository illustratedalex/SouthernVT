import { notFound } from "next/navigation";
import {
  CollectionForm,
  EditorialComments,
  PublishingPanel,
  RelationshipEditor,
  VersionHistory,
  WorkflowTimeline,
} from "@/components/basecamp";
import { getCollectionById } from "@/lib/repositories/collectionRepository";
import {
  getCommentsForContent,
  getVersionsForContent,
  getWorkflowEventsForContent,
} from "@/lib/repositories/WorkflowRepository";

interface CollectionDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { id } = await params;
  const [collection, workflowEvents, versions, comments] = await Promise.all([
    getCollectionById(id),
    getWorkflowEventsForContent("collection", id),
    getVersionsForContent("collection", id),
    getCommentsForContent("collection", id),
  ]);

  if (!collection) {
    notFound();
  }

  const currentStatus = workflowEvents[0]?.toStatus ?? collection.status;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <CollectionForm initialCollection={collection} />
          <aside className="space-y-6 xl:sticky xl:top-24 xl:h-fit">
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
