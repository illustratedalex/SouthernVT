import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { NearbyPlacesRail } from "@/components/discovery/NearbyPlacesRail";
import { RecommendedArticlesRail } from "@/components/discovery/RecommendedArticlesRail";
import { RecommendedCollectionsRail } from "@/components/discovery/RecommendedCollectionsRail";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ContentSection } from "@/components/public/ContentSection";
import { HeroImage } from "@/components/public/HeroImage";
import { PublicCTA } from "@/components/public/PublicCTA";
import { QuickFacts } from "@/components/public/QuickFacts";
import { StoryQuote } from "@/components/story/StoryQuote";
import { StorySidebar } from "@/components/story/StorySidebar";
import { StorySummary } from "@/components/story/StorySummary";
import { VisitorTips } from "@/components/story/VisitorTips";
import { CompassEngine } from "@/lib/compass/CompassEngine";
import { DiscoveryService } from "@/lib/discovery/DiscoveryService";
import { collectionJsonLd } from "@/lib/jsonLd";
import { getCollectionBySlug, getCollections } from "@/lib/repositories/collectionRepository";
import { createCollectionMetadata } from "@/lib/seo";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getStoryByCollection } from "@/repositories/StoryRepository";
import type { Collection } from "@/types/Collection";
import type { Story } from "@/types/Story";

interface CollectionPublicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections
    .filter((collection) => collection.status === "published")
    .map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection || collection.status !== "published") {
    return {
      title: "Collection Not Found | SouthernVT",
      description: "This collection is not currently available.",
      robots: { index: false, follow: false },
    };
  }

  const story = await getStoryByCollection(collection.id);
  return createCollectionMetadata(collection, story?.summary);
}

export default async function CollectionPublicPage({ params }: CollectionPublicPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection || collection.status !== "published") {
    notFound();
  }

  const [allPlaces, storyRecord, similarCollections, featuredPlaces, relatedGuides, compassPlaces, compassCollections, compassGuides] = await Promise.all([
    getPlaces(),
    getStoryByCollection(collection.id),
    DiscoveryService.getRecommendedCollections({ collectionId: collection.id, limit: 3 }),
    DiscoveryService.getRelatedPlaces({ collectionId: collection.id, limit: 4 }),
    DiscoveryService.getRecommendedArticles({ collectionId: collection.id, limit: 4 }),
    CompassEngine.recommendByTags(collection.tags, 4),
    CompassEngine.recommendForAudience(collection.audience, 4),
    CompassEngine.recommendArticlesByTags(collection.tags, 4),
  ]);

  const story = storyRecord ?? createFallbackCollectionStory(collection);
  const collectionPlaces = allPlaces.filter((place) => collection.places.includes(place.id));
  const featuredPlacesForRail = featuredPlaces.filter((place) => place.featured || collection.places.includes(place.id)).slice(0, 4);
  const jsonLd = collectionJsonLd(collection);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: collection.title }]} />

      <HeroImage
        eyebrow="Collection Story"
        title={collection.title}
        subtitle={story.summary}
        image={collection.featuredImage}
        alt={collection.title}
        badges={[collection.season, collection.audience, collection.featured ? "Featured" : "Curated"]}
      >
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p>{story.subtitle}</p>
          <p>{collection.places.length} planned stops</p>
        </div>
      </HeroImage>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <QuickFacts
          facts={[
            { label: "Places", value: `${collection.places.length}`, detail: "Stops currently tied to this collection." },
            { label: "Season", value: story.season, detail: "Best matched season for this route story." },
            { label: "Audience", value: collection.audience, detail: "Who this route fits best." },
            { label: "Reading", value: story.readingTime, detail: `Written by ${story.author}` },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <StorySummary story={story} />

            <ContentSection title="Introduction" eyebrow="Collection Story" description={collection.subtitle}>
              <p className="text-base leading-8 text-slate-700">{story.body}</p>
            </ContentSection>

            <ContentSection title="Highlights" eyebrow="On this route" description="Core moments that make this collection worth the drive.">
              <ul className="space-y-3 text-sm leading-7 text-slate-700">
                {story.visitorTips.map((tip) => (
                  <li key={tip} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-maple-gold)" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </ContentSection>

            <ContentSection title="Suggested Route" eyebrow="Trip planning" description="A practical sequence for the strongest version of this day.">
              {collectionPlaces.length ? (
                <ol className="space-y-3 text-sm leading-7 text-slate-700">
                  {collectionPlaces.slice(0, 5).map((place, index) => (
                    <li key={place.id} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f7efe1] text-xs font-semibold text-(--color-forest-green)">{index + 1}</span>
                      <span>
                        <strong className="font-semibold text-slate-900">{place.name}</strong> · {place.placeType} in {place.city}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm leading-7 text-slate-600">Suggested route stops will appear as collection relationships are expanded.</p>
              )}
            </ContentSection>

            <ContentSection title="What Makes This Collection Special" eyebrow="Local perspective" description="Notes from editors and regional travelers.">
              <ul className="space-y-3 text-sm leading-7 text-slate-700">
                {story.localSecrets.map((secret) => (
                  <li key={secret} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--color-forest-green)" />
                    <span>{secret}</span>
                  </li>
                ))}
              </ul>
            </ContentSection>

            <VisitorTips story={story} />
            <StoryQuote story={story} />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <StorySidebar story={story} />
            <RecommendedCollectionsRail collections={similarCollections} title="Similar Collections" />
            <NearbyPlacesRail places={featuredPlacesForRail} title="Featured Places" />
            <RecommendedArticlesRail articles={relatedGuides} title="Related Guides" />
            <RecommendationRail
              title="Compass Place Picks"
              recommendations={compassPlaces}
              emptyMessage="Compass place picks will appear here."
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
                badge: recommendation.item.audience,
                reasons: recommendation.reasons,
              })}
            />
            <RecommendationRail
              title="Compass Guide Picks"
              recommendations={compassGuides}
              emptyMessage="Compass guide picks will appear here."
              mapItem={(recommendation) => ({
                id: recommendation.item.id,
                title: recommendation.item.title,
                subtitle: recommendation.item.excerpt,
                href: `/guides/${recommendation.item.slug}`,
                score: recommendation.score,
                badge: recommendation.item.articleType,
                reasons: recommendation.reasons,
              })}
            />

            <PublicCTA
              eyebrow="Ready to go"
              title="Plan this trip"
              description="Save this collection and build your Southern Vermont itinerary with local stops, meals, and scenic moments."
              href="/planner/new"
              label="Plan this trip"
            />
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function createFallbackCollectionStory(collection: Collection): Story {
  return {
    id: `story-fallback-${collection.id}`,
    title: `${collection.title}: A Southern Vermont Route Story`,
    subtitle: collection.subtitle,
    body: collection.description,
    summary: collection.description,
    author: "Trailhead Editorial",
    readingTime: "4 min",
    difficulty: "Easy",
    season: collection.season,
    history: [
      "This route evolved from repeat local travel patterns in Southern Vermont.",
      "Stops were selected to balance scenery, pacing, and practical logistics.",
      "Seasonal updates keep the sequence fresh while preserving the core experience.",
    ],
    visitorTips: [
      "Start with your longest scenic segment first.",
      "Keep one optional stop for weather-based flexibility.",
      "Use local dining reservations to stabilize your timeline.",
    ],
    photographyTips: [
      "Shoot one hero frame at each anchor stop.",
      "Capture local signage and street details to tell the full route story.",
      "Plan foliage shots around golden hour for stronger color depth.",
    ],
    localSecrets: [
      "This route works best when you leave room for small village detours.",
      "Weekdays can make high-interest stops easier to enjoy.",
      "Pair this collection with a matching guide to add context before driving.",
    ],
    bestTimeToVisit: `${collection.season} is the strongest season, but this route can be adapted year-round.`,
    featuredQuote: "The best collection days are the ones with one plan and two good detours.",
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
}
