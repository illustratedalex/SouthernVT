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
import { articleJsonLd } from "@/lib/jsonLd";
import { createArticleMetadata } from "@/lib/seo";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getPublishedArticles, getArticleBySlug } from "@/repositories/ArticleRepository";
import { getPublishedDeals } from "@/repositories/DealRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getEvents } from "@/repositories/EventRepository";

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

  const [allPlaces, allCollections, allEvents, allDeals] = await Promise.all([getPlaces(), getCollections(), getEvents(), getPublishedDeals()]);

  const relatedPlaces = allPlaces
    .filter((place) => article.relatedPlaces.includes(place.id) || article.tags.some((tag) => place.tags.includes(tag)))
    .map((place) => ({
      id: place.id,
      title: place.name,
      subtitle: `${place.placeType} · ${place.city}`,
      href: `/places/${place.slug}`,
    }));

  const relatedCollections = allCollections.filter((collection) => article.relatedCollections.includes(collection.id));

  const relatedEvents = allEvents.filter((event) => article.relatedEvents.includes(event.id) || article.tags.some((tag) => event.tags.includes(tag)));

  const relatedDeals = allDeals
    .filter((deal) => deal.status === "published" && (article.relatedPlaces.includes(deal.placeId) || article.relatedCollections.includes(deal.collectionId ?? "") || article.tags.some((tag) => deal.tags.includes(tag))))
    .map((deal) => ({
      id: deal.id,
      title: deal.title,
      subtitle: deal.shortDescription,
      href: `/deals/${deal.slug}`,
      badge: deal.dealType,
    }))
    .slice(0, 4);

  const jsonLd = articleJsonLd(article);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: article.title }]} />

      <HeroImage
        eyebrow="SouthernVT Guide"
        title={article.title}
        subtitle={article.excerpt}
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
            { label: "Categories", value: `${article.categories.length}`, detail: article.categories.slice(0, 3).join(" · ") || "General editorial coverage" },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <ContentSection title="Article body" eyebrow="Guide copy" description={article.subtitle}>
              <div className="whitespace-pre-line text-sm leading-8 text-slate-700">{article.body}</div>
            </ContentSection>

            <RelatedContentRail
              title="Related places"
              items={relatedPlaces}
              emptyTitle="No related places yet"
              emptyDescription="Places connected to this guide will appear as relationships are added."
            />

            <RelatedContentRail
              title="Related collections"
              items={relatedCollections.map((collection) => ({
                id: collection.id,
                title: collection.title,
                subtitle: `${collection.season} · ${collection.audience}`,
                href: `/collections/${collection.slug}`,
                badge: collection.season,
              }))}
              emptyTitle="No related collections yet"
              emptyDescription="Collection links will populate as editorial relationships are expanded."
            />

            <RelatedContentRail
              title="Related events"
              items={relatedEvents.map((event) => ({
                id: event.id,
                title: event.title,
                subtitle: `${event.startDate} · ${event.city}`,
                href: `/events/${event.slug}`,
                badge: event.eventType,
              }))}
              emptyTitle="No related events yet"
              emptyDescription="Event connections will show up once editorial links are available."
            />

            <RelatedContentRail
              title="Related deals"
              items={relatedDeals}
              emptyTitle="No related deals yet"
              emptyDescription="Offer links tied to this guide will appear when partner deals are published."
            />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <ContentSection title="Guide details" eyebrow="Reference" description="A quick summary of the editorial record.">
              <div className="space-y-2 text-sm leading-7 text-slate-700">
                <p>Type: {article.articleType}</p>
                <p>Status: {article.status}</p>
                <p>Categories: {article.categories.join(", ") || "None"}</p>
              </div>
            </ContentSection>

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
