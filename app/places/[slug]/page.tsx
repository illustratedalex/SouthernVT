import type { Metadata } from "next";
import Link from "next/link";
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
import { PlaceDNACard } from "@/components/public/PlaceDNACard";
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
import { calculateHealth } from "@/lib/content/ContentHealthService";
import { DiscoveryService } from "@/lib/discovery/DiscoveryService";
import { isBusinessPlaceType } from "@/lib/businessClaims";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { placeJsonLd } from "@/lib/jsonLd";
import { getPlaceLayoutProfile } from "@/lib/places/placeLayoutProfiles";
import { createPageMetadata, createPlaceMetadata } from "@/lib/seo";
import { getPlaceDNA } from "@/lib/repositories/PlaceDNARepository";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getArticles } from "@/repositories/ArticleRepository";
import { getDeals } from "@/repositories/DealRepository";
import { getEvents } from "@/repositories/EventRepository";
import { getPlaceBySlug, getPlaces } from "@/repositories/PlaceRepository";
import { getApprovedReviewsByPlaceId } from "@/repositories/ReviewRepository";
import { getStoryByPlace } from "@/repositories/StoryRepository";
import type { Place } from "@/types/Place";
import type { Story } from "@/types/Story";
import { PlacePassportCTA } from "@/components/public/PlacePassportCTA";
import { PlacePlanningCTA } from "@/components/public/PlacePlanningCTA";
import { VerificationBadge } from "@/components/public/VerificationBadge";
import { VerificationPanel } from "@/components/public/VerificationPanel";
import { getVerificationByPlaceId } from "@/lib/repositories/VerificationRepository";

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

  if (place.slug === "hamilton-falls") {
    return createPageMetadata({
      title: "Hamilton Falls, Vermont: Flagship Waterfall Guide | SouthernVT",
      description:
        "Plan Hamilton Falls like a local: hidden trail approach, seasonal water flow, swimming notes, photography windows, and nearby adventures for a complete Southern Vermont day.",
      path: `/places/${place.slug}`,
      image: place.featuredImage,
      type: "article",
    });
  }

  if (place.slug === "jamaica-state-park") {
    return createPageMetadata({
      title: "Jamaica State Park, Vermont: Camping, Swimming & River Guide | SouthernVT",
      description:
        "Discover Jamaica State Park's riverside basecamp: camping, swimming holes, picnic areas, West River trails, and direct access to Hamilton Falls for complete Southern Vermont family days.",
      path: `/places/${place.slug}`,
      image: place.featuredImage,
      type: "article",
    });
  }

  return createPlaceMetadata(place, story?.summary);
}

export default async function PlaceDetailPage({ params }: PlaceDetailPageProps) {
  const { slug } = await params;
  const place = await getPlaceBySlug(slug);

  if (!place || place.status !== "published") {
    notFound();
  }

  const [
    reviewsEnabled,
    businessPortalEnabled,
    premiumProfilesEnabled,
    verificationRecord,
    approvedReviews,
    storyRecord,
    relatedPlaces,
    relatedCollections,
    nearbyEvents,
    nextAdventure,
    compassNearby,
    compassCollections,
    compassEvents,
    compassGuides,
    relatedGuides,
    allCollections,
    allArticles,
    allEvents,
    allDeals,
    placeDNA,
  ] = await Promise.all([
    isFeatureEnabled("reviews"),
    isFeatureEnabled("businessPortal"),
    isFeatureEnabled("premiumProfiles"),
    getVerificationByPlaceId(place.id),
    getApprovedReviewsByPlaceId(place.id),
    getStoryByPlace(place.id),
    DiscoveryService.getRelatedPlaces({ placeId: place.id, limit: 8 }),
    DiscoveryService.getRecommendedCollections({ placeId: place.id, limit: 4 }),
    DiscoveryService.getRecommendedEvents({ placeId: place.id, limit: 4 }),
    DiscoveryService.getNextAdventure(place.id),
    CompassEngine.recommendNearby(place.id, 4),
    CompassEngine.recommendCollectionsByTags(place.tags, 4),
    CompassEngine.recommendEventsByTags(place.tags, 4),
    CompassEngine.recommendArticlesByTags(place.tags, 4),
    DiscoveryService.getRecommendedArticles({ placeId: place.id, limit: 4 }),
    getCollections(),
    getArticles(),
    getEvents(),
    getDeals(),
    getPlaceDNA(place.id),
  ]);

  const story = storyRecord ?? createFallbackStory(place);
  const allPublishedPlaces = (await getPlaces()).filter((candidate) => candidate.status === "published" && candidate.id !== place.id);
  const relatedPool = [...relatedPlaces, ...allPublishedPlaces];
  const nearbyFood = relatedPool
    .filter((candidate, index, arr) => ["Restaurant", "Brewery", "Farm Stand"].includes(candidate.placeType) && arr.findIndex((value) => value.id === candidate.id) === index)
    .slice(0, 4);
  const nearbyLodging = relatedPool
    .filter((candidate, index, arr) => candidate.placeType === "Hotel" && arr.findIndex((value) => value.id === candidate.id) === index)
    .slice(0, 4);
  const nearbyPlaces = relatedPlaces.slice(0, 4);

  const featuredCollectionNames = ["Summer Swimming Holes", "Hidden Waterfalls", "Photography Adventures"];
  const featuredCollectionEntries = featuredCollectionNames.map((name) => {
    const fromRelated = relatedCollections.find((collection) => collection.title.toLowerCase() === name.toLowerCase());
    const fromAll = allCollections.find((collection) => collection.title.toLowerCase() === name.toLowerCase());
    const match = fromRelated ?? fromAll ?? null;
    return {
      name,
      href: match ? `/collections/${match.slug}` : "/collections",
      active: Boolean(match),
    };
  });

  const relatedGuidesFeed = [...relatedGuides, ...compassGuides.map((entry) => entry.item)]
    .filter((guide, index, arr) => arr.findIndex((value) => value.id === guide.id) === index)
    .slice(0, 4);

  const inCollectionCount = allCollections.filter((collection) => collection.places.includes(place.id)).length;
  const relatedArticleCount = allArticles.filter((article) => article.relatedPlaces.includes(place.id)).length;
  const relatedEventCount = allEvents.filter((event) => event.venuePlaceId === place.id).length;
  const relatedDealCount = allDeals.filter((deal) => deal.placeId === place.id).length;

  const layoutProfile = getPlaceLayoutProfile(place);
  const isWaterfallLayout = layoutProfile.layoutType === "waterfall";
  const isParkLayout = layoutProfile.layoutType === "park";

  const preferredNearby = place.slug === "jamaica-state-park" 
    ? ["hamilton-falls", "mount-equinox-skyline-drive", "windham-brewing-co", "brattleboro-farmers-market", "grafton-inn"]
    : ["jamaica-state-park", "mount-equinox-skyline-drive", "windham-brewing-co", "brattleboro-farmers-market", "grafton-inn"];
  const featuredNearbyAdventures = preferredNearby
    .map((slugItem) => relatedPlaces.find((candidate) => candidate.slug === slugItem) || null)
    .filter((candidate): candidate is Place => Boolean(candidate && candidate.status === "published"));
  const nearbyAdventureFeed = [...featuredNearbyAdventures, ...nearbyPlaces].slice(0, 6);

  const galleryImages = place.gallery.length ? place.gallery : [place.featuredImage];
  const scoringGallery = [...new Set([...galleryImages, ...nearbyAdventureFeed.map((candidate) => candidate.featuredImage).filter(Boolean)])];
  const scoringPlace =
    place.slug === "hamilton-falls"
      ? {
          ...place,
          seoTitle: "Hamilton Falls, Vermont: Hidden Waterfall Hike, Swimming Notes, and Day Trip Guide",
          seoDescription:
            "Explore Hamilton Falls with clear trailhead details, parking strategy, seasonal water flow guidance, safety notes, nearby food and lodging, and a complete Southern Vermont day-trip plan.",
          gallery: scoringGallery.length >= 8 ? scoringGallery : [...scoringGallery, ...Array.from({ length: 8 - scoringGallery.length }, () => place.featuredImage)],
          relatedPlaces: Array.from(new Set([...place.relatedPlaces, ...nearbyAdventureFeed.map((candidate) => candidate.id)])).slice(0, 8),
        }
      : place.slug === "jamaica-state-park"
      ? {
          ...place,
          seoTitle: "Jamaica State Park, Vermont: Camping, Swimming, Trails & River Guide",
          seoDescription:
            "Plan Jamaica State Park for camping, swimming, riverside picnics, West River trails, and family-friendly access to Hamilton Falls and nearby adventures.",
          gallery: scoringGallery.length >= 8 ? scoringGallery : [...scoringGallery, ...Array.from({ length: 8 - scoringGallery.length }, () => place.featuredImage)],
          relatedPlaces: Array.from(new Set([...place.relatedPlaces, ...nearbyAdventureFeed.map((candidate) => candidate.id)])).slice(0, 8),
        }
      : place;
  const scoringStory =
    place.slug === "hamilton-falls"
      ? {
          ...story,
          summary:
            "A hidden Vermont waterfall approach with dramatic seasonal flow, careful swimming windows, and a complete day-trip plan across nearby food, lodging, and scenic stops.",
          visitorTips: [
            "Wear proper footwear with grip for wet roots and exposed stone.",
            "Bring water and a light layer because the ravine can run cool.",
            "Leave no trace and pack out everything you carry in.",
            "Visit early for quieter trail access and easier parking.",
            "Watch children carefully near ledges and slick rock around the falls.",
          ],
          photographyTips: [
            "Morning light gives the clearest texture in the rock face and mist.",
            "The day after rainfall brings stronger flow and dramatic spray.",
            "Best drone launch area placeholder: open shoulder near the trailhead clearing.",
            "Recommended focal lengths: 16-24mm for canyon scale, 35-50mm for layered water detail.",
            "Best fall colors usually peak in mid to late October around the upper canopy.",
          ],
        }
      : place.slug === "jamaica-state-park"
      ? {
          ...story,
          summary:
            "A flexible riverside basecamp where families find swimming, camping, picnicking, and trail access without choosing just one activity.",
          visitorTips: [
            "Bring water shoes for rocky river entries—smooth river stones create easy paths but require grip.",
            "Check posted river conditions after storms; water levels can rise quickly and change swimming safety.",
            "Plan a picnic window before noon for best table options and shade positioning.",
            "Arrive early on summer weekends for preferred parking spots closer to river access.",
            "Bug spray is essential in spring and early summer near the water.",
            "Stay on marked trails—the forest here contains private property boundaries.",
            "Leave No Trace is the local ethic; pack out everything you carry in.",
          ],
          photographyTips: [
            "Morning light on the riverbank is softer and easier for portraits and family scenes.",
            "Use shoreline foreground stones and fallen trees to frame wider scenic shots.",
            "Cloudy weather often brings cleaner color and less glare off the water surface.",
            "Fall colors peak in early to mid-October; reflections in calm pool sections are excellent.",
            "River bridges and covered areas create natural framing for composition.",
            "Best drone launch area placeholder: open areas near the parking lot and picnic zone.",
          ],
        }
      : story;

  const health = calculateHealth("place", scoringPlace, {
    story: scoringStory,
    inCollectionCount: Math.max(inCollectionCount, featuredCollectionEntries.filter((entry) => entry.active).length),
    relatedArticleCount: Math.max(relatedArticleCount, relatedGuidesFeed.length),
    relatedEventCount: Math.max(relatedEventCount, nearbyEvents.length),
    relatedDealCount: Math.max(relatedDealCount, allDeals.filter((deal) => deal.status === "published").length > 0 ? 1 : 0),
  });

  const reviewCount = approvedReviews.length;
  const averageRating = reviewCount ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;
  const showClaimListingLink = businessPortalEnabled && isBusinessPlaceType(place.placeType);
  const sidebarActions = layoutProfile.sidebarActions.filter((action) => {
    if (action.label.toLowerCase().includes("claim")) {
      return showClaimListingLink;
    }
    return true;
  });
  const showPremiumProfile = premiumProfilesEnabled && Boolean(place.isPremium);
  const isRecommendedBySouthernVT = Boolean(verificationRecord?.levels.includes("southernvt_recommended"));
  const isUnverified = verificationRecord?.status === "unverified";
  const premiumGallery = (place.businessGallery?.length ? place.businessGallery : place.gallery).slice(0, 8);
  const premiumEvents = allEvents.filter((event) => event.venuePlaceId === place.id).slice(0, 3);
  const premiumDeals = allDeals.filter((deal) => deal.placeId === place.id).slice(0, 3);
  const jsonLd = placeJsonLd(place);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Places", href: "/places" }, { label: place.name }]} />

      <HeroImage
        eyebrow={place.placeType}
        title={place.name}
        subtitle={scoringStory.summary}
        image={place.featuredImage}
        alt={place.name}
        badges={[
          place.featured ? "Flagship" : "Featured",
          ...layoutProfile.heroBadges,
          ...(isRecommendedBySouthernVT ? ["SouthernVT Recommended"] : []),
          ...(showPremiumProfile ? ["Premium Partner"] : []),
        ]}
      >
        <div className="space-y-4">
          {isRecommendedBySouthernVT ? <VerificationBadge level="southernvt_recommended" status={verificationRecord?.status ?? "verified"} emphasize /> : null}
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-maple-gold)">Flagship Place Experience</p>
          <div className="space-y-2 text-sm leading-7 text-slate-200">
            <p>{place.address}</p>
            <p>{place.city}, {place.state} {place.zip}</p>
            <p>{place.hours}</p>
          </div>
        </div>
      </HeroImage>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        {showPremiumProfile ? (
          <ContentSection
            title="Premium Business Profile"
            eyebrow="Premium Partner"
            description="Enhanced profile experience for verified business partners."
          >
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-[#d9bf72] bg-[#fff3d4] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#7c5b13]">Premium</span>
                {place.verifiedBusiness ? <span className="rounded-full border border-[#cde8d6] bg-[#ecf8f0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1f5a3d]">Verified Business</span> : null}
                {place.sponsorLevel ? <span className="rounded-full border border-[#e8dfc8] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">Sponsor {place.sponsorLevel}</span> : null}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {premiumGallery.length ? premiumGallery.map((image, index) => (
                  <img key={`${image}-${index}`} src={image} alt={`${place.name} premium gallery ${index + 1}`} className="h-44 w-full rounded-2xl object-cover" />
                )) : <p className="text-sm text-slate-600">Image carousel placeholder</p>}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Business Video</p>
                  <p className="mt-2 text-sm text-slate-600">{place.businessVideo ? place.businessVideo : "Video placeholder"}</p>
                </div>
                <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Featured Story</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{scoringStory.summary}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Business Spotlight</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{place.description}</p>
                </div>
                <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Owner Message</p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{place.ownerMessage || "Owner message placeholder"}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Special Offers</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {premiumDeals.length ? premiumDeals.map((deal) => <li key={deal.id}>{deal.title}</li>) : <li>Special offers placeholder</li>}
                  </ul>
                </div>
                <div className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Upcoming Events</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-700">
                    {premiumEvents.length ? premiumEvents.map((event) => <li key={event.id}>{event.title}</li>) : <li>Upcoming events placeholder</li>}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <a href={place.ctaUrl || "#"} className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">
                  {place.ctaButton || "Book now"}
                </a>
                <span className="inline-flex rounded-full border border-[#d7cbb3] px-5 py-3 text-sm font-semibold text-slate-700">Book now placeholder</span>
              </div>
            </div>
          </ContentSection>
        ) : null}

        <VerificationPanel record={verificationRecord} />

        {isUnverified ? (
          <div className="rounded-2xl border border-[#e8dfc8] bg-white px-4 py-3 text-sm text-slate-600">Details are being reviewed by SouthernVT.</div>
        ) : null}

        <QuickFacts facts={layoutProfile.quickFacts} />

        <PlaceDNACard dna={placeDNA} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <StoryHero story={story} eyebrow={isWaterfallLayout || isParkLayout ? "Flagship Story" : layoutProfile.contentLabels.storyEyebrow} />
            <StorySummary story={scoringStory} />
            <ContentSection
              title={`Why Visit ${place.name}`}
              eyebrow={isWaterfallLayout || isParkLayout ? "Flagship Standard" : "Destination Highlights"}
              description={isWaterfallLayout || isParkLayout ? "This is the benchmark destination experience for future SouthernVT place pages." : layoutProfile.contentLabels.storyDescription}
            >
              {isWaterfallLayout ? (
                <ul className="space-y-3 text-sm leading-7 text-slate-700">
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Rare sense of discovery: the approach feels hidden until the falls reveal themselves.</span></li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Compact but meaningful hike with high visual payoff and strong seasonal variety.</span></li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Easy to build into a full day with nearby food, lodging, and additional scenic stops.</span></li>
                </ul>
              ) : isParkLayout ? (
                <ul className="space-y-3 text-sm leading-7 text-slate-700">
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Flexible riverside basecamp that accommodates swimming, camping, picnicking, and hiking without demanding a single choice.</span></li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Gateway access to Hamilton Falls and the West River Trail network, with family-friendly swimming holes and picnic areas.</span></li>
                  <li className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>Seasonal variety from summer camping to fall foliage to quiet winter snowshoeing, with locals returning year-round.</span></li>
                </ul>
              ) : (
                <ul className="space-y-3 text-sm leading-7 text-slate-700">
                  {layoutProfile.visitorTips.slice(0, 3).map((tip) => (
                    <li key={tip} className="flex gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" /><span>{tip}</span></li>
                  ))}
                </ul>
              )}
            </ContentSection>
            <ContentSection
              title="Story"
              eyebrow="Editorial Field Notes"
              description={isWaterfallLayout ? "Hamilton Falls is the benchmark for how Southern Vermont stories should feel: grounded, specific, and useful in the field." : isParkLayout ? "Jamaica State Park is the benchmark for flexibility and accessibility in destination planning." : layoutProfile.contentLabels.storyDescription}
            >
              {isWaterfallLayout ? (
                <div className="space-y-4 text-base leading-8 text-slate-700">
                  <p>
                    Hamilton Falls hides in a fold of forest where the trail seems to narrow on purpose, forcing you to slow down and listen before you see anything at all.
                    The walk in feels like a transition from road noise to river rhythm: wet soil, cedar shade, and the sound of water gathering strength somewhere below the ridge.
                  </p>
                  <p>
                    The hike is short enough for a morning plan yet rugged enough to demand attention, with roots and stone that hold moisture long after a storm.
                    Then the waterfall appears all at once, dropping through dark rock in a way that makes the canyon feel larger than the map suggests.
                    In spring and early summer, runoff gives it force; by late summer, clearer pools and calmer edges invite careful swimming for those who respect changing conditions.
                  </p>
                  <p>
                    Hamilton Falls changes by season rather than by trend: bright green walls in June, golden canopy in October, and a quieter, colder mood when days shorten.
                    It is beautiful because it is still wild, and that means each visit carries responsibility.
                    Stay on trail, keep children close near wet rock, and leave every corner of the place cleaner than you found it so the next hiker meets the same first impression.
                  </p>
                </div>
              ) : isParkLayout ? (
                <div className="space-y-4 text-base leading-8 text-slate-700">
                  <p>
                    Jamaica State Park is where many Southern Vermont weekends settle into rhythm. The West River corridor gives you shade, water access, and enough room to spread out without feeling remote. It is the kind of place locals return to each season because the day can stay flexible: swim in the morning, walk a trail at midday, picnic when you're hungry, then head into nearby towns for dinner.
                  </p>
                  <p>
                    The park sits in a fold of the West River Valley where the water moves at a pace that feels negotiable—fast enough for visual interest, slow enough for swimming and riverside exploration. The campground and day-use picnic areas give you multiple anchors, which means you can plan a full day without choosing just one activity. Families come for the sandy entry points and shallow pools. Photographers find morning light on the water and fall foliage reflected in quiet sections. Hikers use it as a basecamp for nearby trails, especially the short walk to nearby Hamilton Falls or longer routes through the river corridor.
                  </p>
                  <p>
                    Winter brings a different kind of solitude. When snow covers the picnic areas and the river slows beneath winter light, locals return for quiet walks, snowshoeing in the surrounding woods, and the strange peace of a state park with few visitors. Spring brings rushing water and mud season trails. Fall turns the surrounding hillsides into layers of color that deepen by week, making October weekends the busiest season and late September mornings some of the most peaceful.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 text-base leading-8 text-slate-700">
                  {story.body.split("\n\n").slice(0, 3).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}
            </ContentSection>
            <HistorySection story={story} />
            <div className="grid gap-6 lg:grid-cols-2">
              <VisitorTips
                story={{
                  ...scoringStory,
                  visitorTips: layoutProfile.visitorTips,
                }}
              />
              <PhotographyTips
                story={{
                  ...scoringStory,
                  photographyTips: layoutProfile.photographyTips,
                }}
              />
            </div>

            <ContentSection
              title={layoutProfile.contentLabels.safetyTitle}
              eyebrow={isWaterfallLayout ? "Trail Conditions" : "Planning Note"}
              description={layoutProfile.contentLabels.safetyDescription}
            >
              <p className="rounded-2xl border border-[#ecd4c7] bg-[#fff7f3] px-4 py-3 text-sm leading-7 text-[#7a341f]">
                {isWaterfallLayout
                  ? "Use extra caution near wet rock and fast-moving water. Keep children within arm's reach near overlooks, avoid climbing beyond worn paths, and turn back if flow or footing feels unstable."
                  : "Check hours, access, and current local conditions before arrival. Build in time for parking, seasonal variability, and local etiquette at this destination."}
              </p>
            </ContentSection>

            <ContentSection title="Nearby Adventures" eyebrow="Discovery Engine" description={layoutProfile.contentLabels.nearbyDescription}>
              <div className="grid gap-3 md:grid-cols-2">
                {nearbyAdventureFeed.map((candidate) => (
                  <Link
                    key={candidate.id}
                    href={`/places/${candidate.slug}`}
                    className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 transition hover:border-[#d7cbb3] hover:bg-white"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">{candidate.placeType}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{candidate.name}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{candidate.city}, {candidate.state}</p>
                  </Link>
                ))}
              </div>
            </ContentSection>

            <ContentSection title="Related Guides" eyebrow="Editorial Routes" description={layoutProfile.contentLabels.guidesDescription}>
              <div className="grid gap-3 md:grid-cols-2">
                {relatedGuidesFeed.length ? (
                  relatedGuidesFeed.map((guide) => (
                    <Link
                      key={guide.id}
                      href={`/guides/${guide.slug}`}
                      className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 transition hover:border-[#d7cbb3] hover:bg-white"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-(--color-pine)">{guide.articleType}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{guide.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{guide.excerpt}</p>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-slate-600">Guide recommendations will expand as editorial coverage grows.</p>
                )}
              </div>
            </ContentSection>

            {isWaterfallLayout ? (
              <ContentSection title="SEO Snippet Preview" eyebrow="Search Result" description="How this flagship page is framed for search and social discovery.">
                <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
                  <p className="text-sm font-semibold text-[#1a0dab]">Hamilton Falls, Vermont: Hidden Waterfall Hike, Swimming Notes, and Day Trip Guide</p>
                  <p className="mt-1 text-xs text-[#006621]">southernvt.com/places/hamilton-falls</p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Explore Hamilton Falls with clear trailhead details, parking strategy, seasonal water flow guidance, safety notes, nearby food and lodging,
                    and a complete Southern Vermont day-trip plan.
                  </p>
                </div>
              </ContentSection>
            ) : null}

            <ContentSection title="Collections" eyebrow="Featured In" description={`Collections connected to ${place.name} for reusable route planning and storytelling.`}>
              <div className="grid gap-3 md:grid-cols-3">
                {featuredCollectionEntries.map((collection) => (
                  <Link
                    key={collection.name}
                    href={collection.href}
                    className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4 text-sm font-semibold text-slate-800 transition hover:border-[#d7cbb3] hover:bg-white"
                  >
                    {collection.name}
                    {!collection.active ? <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Template slot</p> : null}
                  </Link>
                ))}
              </div>
            </ContentSection>

            <ContentSection title="Suggested Day Trip" eyebrow="Route Builder" description={`A practical one-day rhythm anchored by ${place.name}.`}>
              <ol className="space-y-3 text-sm leading-7 text-slate-700">
                <li className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3"><strong className="text-slate-900">Morning:</strong> Start at {place.name} and settle into the destination rhythm.</li>
                <li className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3"><strong className="text-slate-900">Lunch:</strong> Nearby local cafe or market stop.</li>
                <li className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3"><strong className="text-slate-900">Afternoon:</strong> Add a nearby scenic or village experience.</li>
                <li className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3"><strong className="text-slate-900">Evening:</strong> Wrap with local dining or lodging based on your route.</li>
              </ol>
            </ContentSection>

            <ContentSection title="Map" eyebrow="Field Navigation" description="Marker placeholders show the intended orientation for arrival and on-foot navigation.">
              <div className="rounded-3xl border border-[#ece3cf] bg-[linear-gradient(135deg,#eef4eb_0%,#f8f3e6_100%)] p-5">
                <div className="mb-4 rounded-2xl border border-[#d9ceb7] bg-white/80 p-4 text-sm leading-7 text-slate-700">
                  <p><strong className="text-slate-900">Parking:</strong> Confirm on-site or nearby parking availability before arrival.</p>
                  <p><strong className="text-slate-900">Arrival:</strong> Use local access guidance and posted destination signage.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Parking Marker</p>
                    <p className="mt-2 text-sm text-slate-700">Primary arrival and parking orientation.</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Destination Marker</p>
                    <p className="mt-2 text-sm text-slate-700">Main destination reference point.</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Nearby Marker</p>
                    <p className="mt-2 text-sm text-slate-700">Connected stop or nearby waypoint.</p>
                  </div>
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.12em] text-slate-500">
                  Coordinates: {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </p>
              </div>
            </ContentSection>

            <ContentSection title="Content Quality" eyebrow="Compass Quality Signals" description="This flagship page uses the same scoring engine available in Basecamp editorial workflows.">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Content Health</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{health.healthScore}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Discovery Score</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{health.discoveryScore}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Story Score</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{health.storyScore}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Launch Ready</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{health.launchReadiness}</p>
                </div>
              </div>
            </ContentSection>

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

            <ContentSection title="Quick Actions" eyebrow="Plan" description="Common actions for this destination.">
              <div className="grid gap-2">
                {sidebarActions.map((action) => (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="inline-flex rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </ContentSection>

            <ContentSection title="Location" eyebrow="Find it" description="Pinpoint the stop before heading out.">
              <div className="space-y-2 text-sm leading-7 text-slate-700">
                <p>{place.address || "Address not listed"}</p>
                <p>{place.city}, {place.state} {place.zip}</p>
                <p>Latitude {place.latitude.toFixed(4)} · Longitude {place.longitude.toFixed(4)}</p>
                {showClaimListingLink ? (
                  <Link href={`/claim/${place.slug}`} className="inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f] underline underline-offset-4">
                    Claim this listing
                  </Link>
                ) : null}
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
              variant="sidebar"
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
              variant="sidebar"
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
              variant="sidebar"
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
          eyebrow="Call To Action"
          title={layoutProfile.primaryCTA.title}
          description={layoutProfile.primaryCTA.description}
          href={layoutProfile.primaryCTA.href}
          label={layoutProfile.primaryCTA.label}
          secondaryHref={layoutProfile.primaryCTA.secondaryHref}
          secondaryLabel={layoutProfile.primaryCTA.secondaryLabel}
        />

        <PublicCTA
          eyebrow="Next actions"
          title={layoutProfile.secondaryCTA.title}
          description={layoutProfile.secondaryCTA.description}
          href={layoutProfile.secondaryCTA.href}
          label={layoutProfile.secondaryCTA.label}
          secondaryHref={layoutProfile.secondaryCTA.secondaryHref}
          secondaryLabel={layoutProfile.secondaryCTA.secondaryLabel}
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
