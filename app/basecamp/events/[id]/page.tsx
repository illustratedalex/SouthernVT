import { notFound } from "next/navigation";
import { EventForm } from "@/components/basecamp";
import { getEventById } from "@/repositories/EventRepository";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <EventForm initialEvent={event} />
      </div>
    </div>
  );
}
