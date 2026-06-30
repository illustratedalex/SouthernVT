import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ContentSection } from "@/components/public/ContentSection";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { HeroImage } from "@/components/public/HeroImage";
import { PublicCTA } from "@/components/public/PublicCTA";
import { QuickFacts } from "@/components/public/QuickFacts";
import { RelatedContentRail } from "@/components/public/RelatedContentRail";
import { ReviewList } from "@/components/public/ReviewList";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { placeJsonLd } from "@/lib/jsonLd";
import { createPlaceMetadata } from "@/lib/seo";
import { getPublishedArticles } from "@/repositories/ArticleRepository";
import { getPublishedDeals } from "@/repositories/DealRepository";
import { getPublishedEvents } from "@/repositories/EventRepository";
import { getPlaceBySlug, getPlaces } from "@/repositories/PlaceRepository";
import { getApprovedReviewsByPlaceId } from "@/repositories/ReviewRepository";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { PlacePassportCTA } from "@/components/public/PlacePassportCTA";
import { PlacePlanningCTA } from "@/components/public/PlacePlanningCTA";

interface PlaceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const places = await getPlaces();
  return places
    .filter((place) => place.status === "published")
    .map((place) => ({ slug: place.slug }));
}

export async function generateMetadata({ params }: PlaceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place || place.status !== "published") {
    return {
      title: "Place Not Found | SouthernVT",
      description: "This place is not currently available.",
      robots: { index: false, follow: false },
    };
  }

  return createPlaceMetadata(place);
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place || place.status !== "published") {
    notFound();
  }

  const [reviewsEnabled, approvedReviews, allPlaces, allCollections, allArticles, allEvents, allDeals] = await Promise.all([
    isFeatureEnabled("reviews"),
    getApprovedReviewsByPlaceId(place.id),
    getPlaces(),
    getCollections(),
    getPublishedArticles(),
    getPublishedEvents(),
    getPublishedDeals(),
  ]);

  const galleryImages = place.gallery.length ? place.gallery : [place.featuredImage];
  const reviewCount = approvedReviews.length;
  const averageRating = reviewCount ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;
  const nearbyPlaces = allPlaces.filter((candidate) => place.relatedPlaces.includes(candidate.id) && candidate.id !== place.id).slice(0, 4);
  const featuredCollections = allCollections
    .filter((collection) => collection.status === "published" && (collection.places.includes(place.id) || collection.tags.some((tag) => place.tags.includes(tag))))
    .slice(0, 4);
  const relatedGuides = allArticles
    .filter((article) => article.status === "published" && (article.relatedPlaces.includes(place.id) || article.tags.some((tag) => place.tags.includes(tag))))
    .slice(0, 4);
  const eventsNearby = allEvents
    .filter((event) => event.status === "published" && (event.venuePlaceId === place.id || event.city === place.city || event.tags.some((tag) => place.tags.includes(tag))))
    .slice(0, 4);
  const dealsNearby = allDeals
    .filter((deal) => deal.status === "published" && (deal.placeId === place.id || deal.tags.some((tag) => place.tags.includes(tag))))
    .slice(0, 4);
  const jsonLd = placeJsonLd(place);
  const visitorNotes = getVisitorNotes(place.placeType);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Places", href: "/places" }, { label: place.name }]} />

      <HeroImage
        eyebrow={place.placeType}
        title={place.name}
        subtitle={place.description}
        image={place.featuredImage}
        alt={place.name}
        badges={[place.featured ? "Featured" : "Open Guide", place.city, place.state]}
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-maple-gold)">Visit details</p>
          <div className="space-y-2 text-sm leading-7 text-slate-200">
            <p>{place.address}</p>
            <p>{place.city}, {place.state} {place.zip}</p>
            <p>{place.hours}</p>
          </div>
        </div>
      </HeroImage>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <QuickFacts
          facts={[
            { label: "Guest rating", value: reviewCount ? averageRating.toFixed(1) : "No ratings", detail: reviewCount ? `${reviewCount} approved reviews` : "Reviews are arriving soon." },
            { label: "Location", value: `${place.city}, ${place.state}`, detail: place.address },
            { label: "Hours", value: place.hours, detail: "Check seasonal updates before you go." },
            { label: "Gallery", value: `${galleryImages.length} photos`, detail: place.featured ? "Featured guide stop" : "Included in the public guide" },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <ContentSection title={`About ${place.name}`} eyebrow="Description" description="A short story about this place and why it matters to a Southern Vermont trip.">
              <p className="text-base leading-8 text-slate-700">{place.description}</p>
            </ContentSection>

            <ContentSection title="Gallery" eyebrow="Photo preview" description="A few images to help you picture the stop before you go.">
              <GalleryGrid images={galleryImages.slice(0, 6)} alt={place.name} />
            </ContentSection>

            <ContentSection title="Amenities" eyebrow="What to expect" description="Useful details to help with planning, timing, and comfort.">
              <div className="flex flex-wrap gap-2">
                {place.amenities.length ? (
                  place.amenities.map((amenity) => (
                    <span key={amenity} className="rounded-full border border-[#d8c7a3] bg-[#fcfaf6] px-3 py-1 text-sm font-medium text-slate-700">
                      {amenity}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">Amenities will be added as this place is expanded.</p>
                )}
              </div>
            </ContentSection>

            <ContentSection title="Visitor notes" eyebrow="Local advice" description={`Notes tailored for ${place.placeType.toLowerCase()} stops in Vermont.`}>
              <ul className="space-y-3 text-sm leading-7 text-slate-700">
                {visitorNotes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-maple-gold)" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </ContentSection>

            <ReviewList reviews={approvedReviews} previewMode={!reviewsEnabled} />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <ContentSection title="Location" eyebrow="Find it" description="Pinpoint the stop before heading out.">
              <div className="space-y-2 text-sm leading-7 text-slate-700">
                <p>{place.address}</p>
                <p>{place.city}, {place.state} {place.zip}</p>
                <p>Latitude {place.latitude.toFixed(4)} · Longitude {place.longitude.toFixed(4)}</p>
              </div>
            </ContentSection>

            <ContentSection title="Hours and contact" eyebrow="Plan ahead" description="Use these details to confirm timing before the trip.">
              <div className="space-y-2 text-sm leading-7 text-slate-700">
                <p>{place.hours}</p>
                <p>{place.phone || "Phone not listed"}</p>
                <p>{place.email || "Email not listed"}</p>
                <p>{place.website || "Website not listed"}</p>
              </div>
            </ContentSection>

            <PlacePassportCTA place={place} />
            <PlacePlanningCTA place={place} />

            <RelatedContentRail
              title="Nearby places"
              items={nearbyPlaces.map((nearby) => ({
                id: nearby.id,
                title: nearby.name,
                subtitle: `${nearby.placeType} · ${nearby.city}`,
                href: `/places/${nearby.slug}`,
                badge: nearby.featured ? "Featured" : undefined,
              }))}
              emptyTitle="No nearby places yet"
              emptyDescription="Nearby places will appear as more regional relationships are added."
            />

            <RelatedContentRail
              title="Featured in collections"
              items={featuredCollections.map((collection) => ({
                id: collection.id,
                title: collection.title,
                subtitle: `${collection.season} · ${collection.audience}`,
                href: `/collections/${collection.slug}`,
                badge: collection.featured ? "Featured" : undefined,
              }))}
              emptyTitle="No collections yet"
              emptyDescription="This place will be pulled into collections as the guide library grows."
            />

            <RelatedContentRail
              title="Related guides"
              items={relatedGuides.map((article) => ({
                id: article.id,
                title: article.title,
                subtitle: article.subtitle,
                href: `/guides/${article.slug}`,
                badge: article.articleType,
              }))}
              emptyTitle="No related guides yet"
              emptyDescription="Guides linked to this place will appear here once relationships are added."
            />

            <RelatedContentRail
              title="Events nearby"
              items={eventsNearby.map((event) => ({
                id: event.id,
                title: event.title,
                subtitle: `${event.startDate} · ${event.city}`,
                href: `/events/${event.slug}`,
                badge: event.eventType,
              }))}
              emptyTitle="No nearby events yet"
              emptyDescription="Seasonal event relationships will populate this rail over time."
            />

            <RelatedContentRail
              title="Deals nearby"
              items={dealsNearby.map((deal) => ({
                id: deal.id,
                title: deal.title,
                subtitle: deal.shortDescription,
                href: `/deals/${deal.slug}`,
                badge: deal.dealType,
              }))}
              emptyTitle="No nearby deals yet"
              emptyDescription="Local offers will appear here as partner offers are published."
            />
          </aside>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-12 sm:px-8 lg:grid-cols-2 lg:px-10">
        <PublicCTA
          eyebrow="Add to your passport"
          title={`Check in at ${place.name}`}
          description="Save this stop and keep track of the places you've visited across Southern Vermont."
          href={`/passport/check-in/${place.id}`}
          label="Check in now"
        />

        <PublicCTA
          eyebrow="Plan your route"
          title={`Build a trip around ${place.name}`}
          description="Use this place as the anchor for collections, guides, events, and nearby deals."
          href="/planner/new"
          label="Plan this trip"
          secondaryHref="/collections"
          secondaryLabel="Browse collections"
        />
      </section>

      <Footer />
    </main>
  );
}

function getVisitorNotes(placeType: string) {
  const notes: Record<string, string[]> = {
    Waterfall: ["Water levels can change quickly after rain.", "Wear sturdy shoes with good traction.", "Pack out what you pack in."],
    Restaurant: ["Check hours before visiting.", "Reservations may be recommended on busy weekends.", "Ask about seasonal specials and local sourcing."],
    Trail: ["Trail conditions vary by season.", "Bring water, layers, and proper footwear.", "Watch for mud after spring rains."],
    Hotel: ["Book ahead during foliage season.", "Confirm check-in times before arrival.", "Ask about parking and pet policies."],
  };

  return notes[placeType] ?? ["Check seasonal hours before you go.", "Confirm parking and access details before departure.", "Look for nearby stops to round out the trip."];
}
