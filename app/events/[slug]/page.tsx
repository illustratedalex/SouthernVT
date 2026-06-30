import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ContentSection } from "@/components/public/ContentSection";
import { HeroImage } from "@/components/public/HeroImage";
import { PublicCTA } from "@/components/public/PublicCTA";
import { QuickFacts } from "@/components/public/QuickFacts";
import { RelatedContentRail } from "@/components/public/RelatedContentRail";
import { eventJsonLd } from "@/lib/jsonLd";
import { createEventMetadata } from "@/lib/seo";
import { getPublishedDeals } from "@/repositories/DealRepository";
import { getEventBySlug, getPublishedEvents } from "@/repositories/EventRepository";
import { getPlaceById, getPlaces } from "@/repositories/PlaceRepository";

interface EventDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await getPublishedEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.status !== "published") {
    return {
      title: "Event Not Found | SouthernVT",
      description: "This event is not currently available.",
      robots: { index: false, follow: false },
    };
  }

  return createEventMetadata(event);
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event || event.status !== "published") {
    notFound();
  }

  const [venue, allPlaces, allDeals] = await Promise.all([getPlaceById(event.venuePlaceId), getPlaces(), getPublishedDeals()]);
  const jsonLd = eventJsonLd(event);

  const relatedPlaces = allPlaces.filter((place) => place.id === event.venuePlaceId || place.tags.some((tag) => event.tags.includes(tag))).slice(0, 4);
  const nearbyPlaces = allPlaces.filter((place) => place.city === event.city && place.id !== event.venuePlaceId).slice(0, 4);
  const relatedDeals = allDeals.filter((deal) => deal.status === "published" && (deal.placeId === event.venuePlaceId || deal.tags.some((tag) => event.tags.includes(tag)))).slice(0, 4);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events", href: "/events" }, { label: event.title }]} />

      <HeroImage
        eyebrow="SouthernVT Event"
        title={event.title}
        subtitle={event.description}
        image={event.featuredImage}
        alt={event.title}
        badges={[event.eventType, event.city, `${event.startDate} - ${event.endDate}`]}
      >
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p>{event.startDate} {event.startTime} to {event.endDate} {event.endTime}</p>
          <p>{venue?.name ?? event.address}</p>
        </div>
      </HeroImage>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <QuickFacts
          facts={[
            { label: "Date", value: event.startDate, detail: `${event.endDate}` },
            { label: "Time", value: event.startTime, detail: `${event.endTime} end` },
            { label: "Venue", value: venue?.name ?? event.address, detail: `${event.city}, ${event.state}` },
            { label: "Cost", value: event.cost || "Contact organizer", detail: event.ticketUrl ? "Tickets available" : "Check organizer details" },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <ContentSection title="Description" eyebrow="Event details" description="What visitors can expect from the experience.">
              <p className="text-sm leading-8 text-slate-700">{event.description}</p>
            </ContentSection>

            <RelatedContentRail
              title="Related places"
              items={relatedPlaces.map((place) => ({
                id: place.id,
                title: place.name,
                subtitle: `${place.placeType} · ${place.city}`,
                href: `/places/${place.slug}`,
                badge: place.featured ? "Featured" : undefined,
              }))}
              emptyTitle="No related places yet"
              emptyDescription="This event will show related venues and stops as relationships are added."
            />

            <RelatedContentRail
              title="Nearby places"
              items={nearbyPlaces.map((place) => ({
                id: place.id,
                title: place.name,
                subtitle: `${place.placeType} · ${place.city}`,
                href: `/places/${place.slug}`,
                badge: place.featured ? "Featured" : undefined,
              }))}
              emptyTitle="No nearby places yet"
              emptyDescription="Nearby recommendations will be enriched with geospatial ranking in a later release."
            />

            <RelatedContentRail
              title="Related deals"
              items={relatedDeals.map((deal) => ({
                id: deal.id,
                title: deal.title,
                subtitle: deal.shortDescription,
                href: `/deals/${deal.slug}`,
                badge: deal.dealType,
              }))}
              emptyTitle="No related deals yet"
              emptyDescription="Offers tied to this event will appear once partner deals are published."
            />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <ContentSection title="Venue" eyebrow="Location" description="Where the event is taking place.">
              <div className="space-y-2 text-sm leading-7 text-slate-700">
                <p>{venue?.name ?? event.address}</p>
                <p>{event.address}, {event.city}, {event.state} {event.zip}</p>
                {venue ? <p>{venue.hours}</p> : null}
              </div>
            </ContentSection>

            <ContentSection title="Organizer" eyebrow="Host" description="The partner or organizer behind the event.">
              <div className="space-y-2 text-sm leading-7 text-slate-700">
                <p>{event.organizerName}</p>
                <p>{event.organizerEmail}</p>
                {event.organizerWebsite ? <p>{event.organizerWebsite}</p> : null}
              </div>
            </ContentSection>

            <PublicCTA
              eyebrow="Add to trip"
              title="Save this event to your plan"
              description="Keep your itinerary focused by linking this event with places, deals, and nearby stops."
              href="/planner/new"
              label="Add to trip"
            />
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
