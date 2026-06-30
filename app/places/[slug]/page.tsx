import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { NearbyPlacesRail } from "@/components/discovery/NearbyPlacesRail";
import { NextAdventureCard } from "@/components/discovery/NextAdventureCard";
import { RecommendedCollectionsRail } from "@/components/discovery/RecommendedCollectionsRail";
import { RecommendedEventsRail } from "@/components/discovery/RecommendedEventsRail";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ContentSection } from "@/components/public/ContentSection";
import { GalleryGrid } from "@/components/public/GalleryGrid";
import { HeroImage } from "@/components/public/HeroImage";
import { PublicCTA } from "@/components/public/PublicCTA";
import { QuickFacts } from "@/components/public/QuickFacts";
import { ReviewList } from "@/components/public/ReviewList";
import { BestTimeSection } from "@/components/story/BestTimeSection";
import { HistorySection } from "@/components/story/HistorySection";
import { LocalSecrets } from "@/components/story/LocalSecrets";
import { PhotographyTips } from "@/components/story/PhotographyTips";
import { StoryHero } from "@/components/story/StoryHero";
import { StoryQuote } from "@/components/story/StoryQuote";
import { StorySidebar } from "@/components/story/StorySidebar";
import { StorySummary } from "@/components/story/StorySummary";
import { VisitorTips } from "@/components/story/VisitorTips";
import { CompassEngine } from "@/lib/compass/CompassEngine";
import { DiscoveryService } from "@/lib/discovery/DiscoveryService";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { placeJsonLd } from "@/lib/jsonLd";
import { createPlaceMetadata } from "@/lib/seo";
import { getPlaceBySlug, getPlaces } from "@/repositories/PlaceRepository";
import { getApprovedReviewsByPlaceId } from "@/repositories/ReviewRepository";
import { getStoryByPlace } from "@/repositories/StoryRepository";
import type { Place } from "@/types/Place";
import type { Story } from "@/types/Story";
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

  const story = await getStoryByPlace(place.id);
  return createPlaceMetadata(place, story?.summary);
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place || place.status !== "published") {
    notFound();
  }

  const [reviewsEnabled, approvedReviews, storyRecord, relatedPlaces, relatedCollections, nearbyEvents, nextAdventure, compassNearby, compassCollections, compassEvents] = await Promise.all([
    isFeatureEnabled("reviews"),
    getApprovedReviewsByPlaceId(place.id),
    getStoryByPlace(place.id),
    DiscoveryService.getRelatedPlaces({ placeId: place.id, limit: 8 }),
    DiscoveryService.getRecommendedCollections({ placeId: place.id, limit: 4 }),
    DiscoveryService.getRecommendedEvents({ placeId: place.id, limit: 4 }),
    DiscoveryService.getNextAdventure(place.id),
    CompassEngine.recommendNearby(place.id, 4),
    CompassEngine.recommendCollectionsByTags(place.tags, 4),
    CompassEngine.recommendEventsByTags(place.tags, 4),
  ]);

  const story = storyRecord ?? createFallbackStory(place);
  const nearbyFood = relatedPlaces.filter((candidate) => ["Restaurant", "Brewery", "Farm Stand"].includes(candidate.placeType)).slice(0, 4);
  const nearbyLodging = relatedPlaces.filter((candidate) => candidate.placeType === "Hotel").slice(0, 4);
  const nearbyPlaces = relatedPlaces.slice(0, 4);

  const galleryImages = place.gallery.length ? place.gallery : [place.featuredImage];
  const reviewCount = approvedReviews.length;
  const averageRating = reviewCount ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;
  const jsonLd = placeJsonLd(place);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Places", href: "/places" }, { label: place.name }]} />

      <HeroImage
        eyebrow={place.placeType}
        title={place.name}
        subtitle={story.summary}
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
            { label: "Location", value: `${place.city}, ${place.state}`, detail: place.address || "Address details coming soon." },
            { label: "Story season", value: story.season, detail: `Difficulty: ${story.difficulty}` },
            { label: "Reading time", value: story.readingTime, detail: `Written by ${story.author}` },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <StoryHero story={story} eyebrow="Place Story" />
            <StorySummary story={story} />
            <HistorySection story={story} />
            <VisitorTips story={story} />
            <PhotographyTips story={story} />
            <LocalSecrets story={story} />
            <BestTimeSection story={story} />
            <StoryQuote story={story} />

            <ContentSection title="Gallery" eyebrow="Photo preview" description="A few images to help you picture the stop before you go.">
              <GalleryGrid images={galleryImages.slice(0, 6)} alt={place.name} />
            </ContentSection>

            <ReviewList reviews={approvedReviews} previewMode={!reviewsEnabled} />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <StorySidebar story={story} />

            <ContentSection title="Location" eyebrow="Find it" description="Pinpoint the stop before heading out.">
              <div className="space-y-2 text-sm leading-7 text-slate-700">
                <p>{place.address || "Address not listed"}</p>
                <p>{place.city}, {place.state} {place.zip}</p>
                <p>Latitude {place.latitude.toFixed(4)} · Longitude {place.longitude.toFixed(4)}</p>
              </div>
            </ContentSection>

            <PlacePassportCTA place={place} />
            <PlacePlanningCTA place={place} />

            <NearbyPlacesRail places={nearbyPlaces} title="Related Places" />
            <NearbyPlacesRail places={nearbyFood} title="Nearby Food" />
            <NearbyPlacesRail places={nearbyLodging} title="Nearby Lodging" />
            <RecommendedEventsRail events={nearbyEvents} title="Nearby Events" />
            <RecommendedCollectionsRail collections={relatedCollections} title="Related Collections" />
            <RecommendationRail
              title="Compass Nearby Picks"
              recommendations={compassNearby}
              emptyMessage="Compass nearby picks will appear here."
              mapItem={(recommendation) => ({
                id: recommendation.item.id,
                title: recommendation.item.name,
                subtitle: recommendation.item.description,
                href: `/places/${recommendation.item.slug}`,
                score: recommendation.score,
                badge: recommendation.item.placeType,
                reasons: recommendation.reasons,
              })}
            />
            <RecommendationRail
              title="Compass Collection Picks"
              recommendations={compassCollections}
              emptyMessage="Compass collection picks will appear here."
              mapItem={(recommendation) => ({
                id: recommendation.item.id,
                title: recommendation.item.title,
                subtitle: recommendation.item.subtitle,
                href: `/collections/${recommendation.item.slug}`,
                score: recommendation.score,
                badge: recommendation.item.season,
                reasons: recommendation.reasons,
              })}
            />
            <RecommendationRail
              title="Compass Event Picks"
              recommendations={compassEvents}
              emptyMessage="Compass event picks will appear here."
              mapItem={(recommendation) => ({
                id: recommendation.item.id,
                title: recommendation.item.title,
                subtitle: recommendation.item.description,
                href: `/events/${recommendation.item.slug}`,
                score: recommendation.score,
                badge: recommendation.item.eventType,
                reasons: recommendation.reasons,
              })}
            />
            <NextAdventureCard adventure={nextAdventure} title="Next Adventure" />
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

function createFallbackStory(place: Place): Story {
  return {
    id: `story-fallback-${place.id}`,
    title: `${place.name}: A Southern Vermont Story`,
    subtitle: `${place.placeType} in ${place.city}, ${place.state}`,
    body: `${place.description}\n\nThis stop works best when paired with nearby routes, local food, and one additional destination before sunset.`,
    summary: place.description,
    author: "Trailhead Editorial",
    readingTime: "3 min",
    difficulty: "Easy",
    season: "Year-Round",
    history: [
      `${place.name} has become a dependable stop in Southern Vermont itineraries.`,
      "Local trip planning often links this destination with nearby villages and seasonal events.",
      "Recent updates have improved discoverability through collections and guide coverage.",
    ],
    visitorTips: [
      "Confirm operating hours before leaving for the day.",
      "Plan one nearby stop to make the route feel complete.",
      "Leave buffer time for weather and parking variability.",
    ],
    photographyTips: [
      "Use morning or late-day light for softer color and detail.",
      "Capture one wide frame and one close detail for variety.",
      "Keep horizon lines level for cleaner scenic compositions.",
    ],
    localSecrets: [
      "Weekday visits can feel calmer than weekend peaks.",
      "Village cafes nearby often make strong pre- or post-stop anchors.",
      "Pairing this location with a short walk improves the overall route rhythm.",
    ],
    bestTimeToVisit: "Year-round, with seasonal highlights depending on weather and local event calendars.",
    featuredQuote: "The best Southern Vermont stops always feel like a story, not just a pin on a map.",
    createdAt: place.createdAt,
    updatedAt: place.updatedAt,
  };
}
