import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AnalyticsTrackOnRender } from "@/components/analytics/AnalyticsTrackOnRender";
import { NearbyPlacesRail } from "@/components/discovery/NearbyPlacesRail";
import { RecommendedCollectionsRail } from "@/components/discovery/RecommendedCollectionsRail";
import { RecommendedDealsRail } from "@/components/discovery/RecommendedDealsRail";
import { RecommendedEventsRail } from "@/components/discovery/RecommendedEventsRail";
import { RecommendationRail } from "@/components/recommendation/RecommendationRail";
import { Breadcrumbs } from "@/components/public/Breadcrumbs";
import { ContentSection } from "@/components/public/ContentSection";
import { HeroImage } from "@/components/public/HeroImage";
import { PublicCTA } from "@/components/public/PublicCTA";
import { QuickFacts } from "@/components/public/QuickFacts";
import { StoryQuote } from "@/components/story/StoryQuote";
import { StorySummary } from "@/components/story/StorySummary";
import { StorySidebar } from "@/components/story/StorySidebar";
import { CompassEngine } from "@/lib/compass/CompassEngine";
import { DiscoveryService } from "@/lib/discovery/DiscoveryService";
import { articleJsonLd } from "@/lib/jsonLd";
import { createArticleMetadata } from "@/lib/seo";
import { getArticleBySlug, getPublishedArticles } from "@/repositories/ArticleRepository";
import type { Article } from "@/types/Article";
import type { Story } from "@/types/Story";

interface GuideDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    return {
      title: "Guide Not Found | SouthernVT",
      description: "This guide is not currently available.",
      robots: { index: false, follow: false },
    };
  }

  return createArticleMetadata(article);
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "published") {
    notFound();
  }

  const [relatedPlaces, relatedCollections, relatedEvents, relatedDeals, compassPlaces, compassCollections, compassEvents, compassDeals] = await Promise.all([
    DiscoveryService.getRelatedPlaces({ articleId: article.id, limit: 4 }),
    DiscoveryService.getRecommendedCollections({ articleId: article.id, limit: 4 }),
    DiscoveryService.getRecommendedEvents({ articleId: article.id, limit: 4 }),
    DiscoveryService.getRecommendedDeals({ articleId: article.id, limit: 4 }),
    CompassEngine.recommendByTags(article.tags, 4),
    CompassEngine.recommendCollectionsByTags(article.tags, 4),
    CompassEngine.recommendEventsByTags(article.tags, 4),
    CompassEngine.recommendDealsByTags(article.tags, 4),
  ]);

  const story = articleToStory(article);
  const jsonLd = articleJsonLd(article);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <AnalyticsTrackOnRender
        event="guide_viewed"
        onceKey={`guide:${article.id}`}
        params={{ guide_id: article.id, guide_slug: article.slug, guide_title: article.title }}
      />
      <AnalyticsTrackOnRender
        event="story_viewed"
        onceKey={`story:guide:${article.id}`}
        params={{ story_id: story.id, story_title: story.title, story_type: "guide" }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: article.title }]} />

      <HeroImage
        eyebrow="SouthernVT Guide Story"
        title={article.title}
        subtitle={story.summary}
        image={article.featuredImage}
        alt={article.title}
        badges={[article.articleType, article.author, new Date(article.publishedAt || article.updatedAt).toLocaleDateString()]}
      >
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p>{article.subtitle}</p>
          <p>{article.categories.join(" · ") || "Editorial guide"}</p>
        </div>
      </HeroImage>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <QuickFacts
          facts={[
            { label: "Author", value: article.author, detail: "Original SouthernVT editorial voice." },
            { label: "Published", value: new Date(article.publishedAt || article.updatedAt).toLocaleDateString(), detail: "Last updated in the public guide library." },
            { label: "Type", value: article.articleType, detail: article.status },
            { label: "Reading", value: story.readingTime, detail: `Story season: ${story.season}` },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <StorySummary story={story} />

            <ContentSection title="Guide narrative" eyebrow="Story context" description={article.subtitle}>
              <div className="whitespace-pre-line text-sm leading-8 text-slate-700">{article.body}</div>
            </ContentSection>

            <StoryQuote story={story} />

            <NearbyPlacesRail places={relatedPlaces} title="Places Mentioned" />
            <RecommendedCollectionsRail collections={relatedCollections} title="Collections" />
            <RecommendedEventsRail events={relatedEvents} title="Events" />
            <RecommendedDealsRail deals={relatedDeals} title="Deals" />
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
            <RecommendationRail
              title="Compass Deal Picks"
              recommendations={compassDeals}
              emptyMessage="Compass deal picks will appear here."
              mapItem={(recommendation) => ({
                id: recommendation.item.id,
                title: recommendation.item.title,
                subtitle: recommendation.item.shortDescription,
                href: `/deals/${recommendation.item.slug}`,
                score: recommendation.score,
                badge: recommendation.item.dealType,
                reasons: recommendation.reasons,
              })}
            />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <StorySidebar story={story} />

            <PublicCTA
              eyebrow="Build from this guide"
              title="Plan a trip from this story"
              description="Turn the places, collections, events, and deals in this guide into a Southern Vermont itinerary."
              href="/planner/new"
              label="Build a trip"
            />
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function articleToStory(article: Article): Story {
  return {
    id: `story-article-${article.id}`,
    title: article.title,
    subtitle: article.subtitle,
    body: article.body,
    summary: article.excerpt,
    author: article.author,
    readingTime: "5 min",
    difficulty: "Easy",
    season: "Year-Round",
    history: [
      "This guide is part of the expanding Southern Vermont editorial library.",
      "It is periodically updated as relationships between places and collections improve.",
      "Local partner updates influence guide quality across seasons.",
    ],
    visitorTips: [
      "Use this guide as a backbone, then personalize with one detour.",
      "Check each linked place for live hours before departure.",
      "Save event and deal links before going offline in mountain zones.",
    ],
    photographyTips: [
      "Capture one landscape frame and one local detail at each stop.",
      "Morning and evening windows usually produce the strongest color.",
      "Keep lens cloths handy for moisture-prone trail and river areas.",
    ],
    localSecrets: [
      "Most routes improve when you start earlier than planned.",
      "Village centers often hide strong coffee and bakery anchors between stops.",
      "Weekday travel can unlock shorter lines and calmer parking conditions.",
    ],
    bestTimeToVisit: "Year-round, with best conditions depending on each linked stop and event schedule.",
    featuredQuote: article.excerpt,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
}
