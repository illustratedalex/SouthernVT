import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { TripDayCard } from "@/components/planner/TripDayCard";
import { TripSummary } from "@/components/planner/TripSummary";
import { mockArticles } from "@/data/articles";
import { mockCollections } from "@/data/collections";
import { mockEvents } from "@/data/events";
import { mockPlaces } from "@/data/places";
import { createPageMetadata } from "@/lib/seo";
import { getTripById, getTrips } from "@/repositories/TripRepository";

interface PlannerTripDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const trips = await getTrips();
  return trips.map((trip) => ({ id: trip.id }));
}

export async function generateMetadata({ params }: PlannerTripDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip || trip.status === "archived") {
    return {
      title: "Trip Not Found | SouthernVT",
      description: "This itinerary is not currently available.",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `${trip.title} | SouthernVT Trip Planner`,
    description: trip.notes,
    path: `/planner/${trip.id}`,
  });
}

export default async function PlannerTripDetailPage({ params }: PlannerTripDetailPageProps) {
  const { id } = await params;
  const trip = await getTripById(id);

  if (!trip || trip.status === "archived") {
    notFound();
  }

  const placesById = new Map(mockPlaces.map((place) => [place.id, place]));
  const collectionsById = new Map(mockCollections.map((collection) => [collection.id, collection]));
  const eventsById = new Map(mockEvents.map((event) => [event.id, event]));
  const articlesById = new Map(mockArticles.map((article) => [article.id, article]));

  const relatedPlaces = trip.selectedPlaces
    .map((placeId) => placesById.get(placeId))
    .filter((place): place is NonNullable<typeof place> => Boolean(place))
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-linear-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">Trip itinerary</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">{trip.title}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">{trip.notes}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10">
        <div className="space-y-6">
          <TripSummary trip={trip} />

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Day-by-day itinerary</h2>
            {trip.days.map((day) => (
              <TripDayCard
                key={day.id}
                day={day}
                placesById={placesById}
                collectionsById={collectionsById}
                eventsById={eventsById}
                articlesById={articlesById}
              />
            ))}
          </section>

          <section className="rounded-[28px] border border-dashed border-[#d7cbb3] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Map preview placeholder</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">A route-aware map canvas will appear here in a future iteration. For now, drive-time hints are included in each itinerary item.</p>
          </section>

          <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Related places</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {relatedPlaces.length ? (
                relatedPlaces.map((place) => (
                  <article key={place.id} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] p-4">
                    <h3 className="text-lg font-semibold text-slate-900">{place.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{place.city}, {place.state}</p>
                    <Link href={`/places/${place.slug}`} className="mt-3 inline-flex text-sm font-semibold text-[#1f3b2f]">
                      View place
                    </Link>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-600">No related places are attached to this trip yet.</p>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
          <section className="rounded-3xl border border-dashed border-[#d7cbb3] bg-white p-5 text-sm text-slate-600 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Save trip placeholder</h2>
            <p className="mt-2">Trip persistence controls will connect to authenticated profiles in a future release.</p>
          </section>

          <section className="rounded-3xl border border-dashed border-[#d7cbb3] bg-white p-5 text-sm text-slate-600 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Export PDF placeholder</h2>
            <p className="mt-2">A printable PDF export will appear once formatting templates are finalized.</p>
          </section>

          <section className="rounded-3xl border border-dashed border-[#d7cbb3] bg-white p-5 text-sm text-slate-600 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Share link placeholder</h2>
            <p className="mt-2">Sharing controls will support private and public itinerary links later.</p>
          </section>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
