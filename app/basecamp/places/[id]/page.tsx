import { notFound } from "next/navigation";
import {
  EditorialComments,
  PlaceForm,
  PublishingPanel,
  RelationshipEditor,
  VersionHistory,
  WorkflowTimeline,
} from "@/components/basecamp";
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
  const [place, workflowEvents, versions, comments] = await Promise.all([
    getPlaceById(id),
    getWorkflowEventsForContent("place", id),
    getVersionsForContent("place", id),
    getCommentsForContent("place", id),
  ]);

  if (!place) {
    notFound();
  }

  const currentStatus = workflowEvents[0]?.toStatus ?? place.status;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-forest-green)]">Basecamp</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Edit place</h1>
          <p className="mt-2 text-base leading-8 text-slate-600">
            Update a destination entry with the same flexible editor used for new places.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <PlaceForm initialPlace={place} />
          <aside className="space-y-6 xl:sticky xl:top-24 xl:h-fit">
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
