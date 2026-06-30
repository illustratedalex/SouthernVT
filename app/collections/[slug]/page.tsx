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
import { CollectionPlaceListLive } from "@/components/public/CollectionPlaceListLive";
import { collectionJsonLd } from "@/lib/jsonLd";
import { createCollectionMetadata } from "@/lib/seo";
import { getPublishedArticles } from "@/repositories/ArticleRepository";
import { getCollectionBySlug, getCollections } from "@/lib/repositories/collectionRepository";
import { getPlaces } from "@/repositories/PlaceRepository";

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

  return createCollectionMetadata(collection);
}

export default async function CollectionPublicPage({ params }: CollectionPublicPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection || collection.status !== "published") {
    notFound();
  }

  const [allCollections, allPlaces, allArticles] = await Promise.all([getCollections(), getPlaces(), getPublishedArticles()]);

  const collectionPlaces = allPlaces.filter((place) => collection.places.includes(place.id));

  const relatedCollections = allCollections
    .filter((item) => item.id !== collection.id && item.status === "published")
    .sort((a, b) => {
      const seasonMatchA = a.season === collection.season ? 1 : 0;
      const seasonMatchB = b.season === collection.season ? 1 : 0;
      if (seasonMatchA !== seasonMatchB) {
        return seasonMatchB - seasonMatchA;
      }
      return Number(b.featured) - Number(a.featured);
    })
    .slice(0, 3);

  const relatedGuides = allArticles
    .filter((article) => article.status === "published" && (article.relatedCollections.includes(collection.id) || article.tags.some((tag) => collection.tags.includes(tag))))
    .slice(0, 4);

  const jsonLd = collectionJsonLd(collection);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: collection.title }]} />

      <HeroImage
        eyebrow="Collection Guide"
        title={collection.title}
        subtitle={collection.subtitle}
        image={collection.featuredImage}
        alt={collection.title}
        badges={[collection.season, collection.audience, collection.featured ? "Featured" : "Curated"]}
      >
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p>{collection.description}</p>
          <p>{collection.places.length} planned stops</p>
        </div>
      </HeroImage>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <QuickFacts
          facts={[
            { label: "Places", value: `${collection.places.length}`, detail: "Stops currently tied to this collection." },
            { label: "Season", value: collection.season, detail: "Best matched to this time of year." },
            { label: "Audience", value: collection.audience, detail: "Who this route fits best." },
            { label: "Tags", value: `${collection.tags.length}`, detail: collection.tags.slice(0, 3).join(" · ") || "Seasonal and regional themes" },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <ContentSection title="About this collection" eyebrow="Description" description={collection.subtitle}>
              <p className="text-base leading-8 text-slate-700">{collection.description}</p>
            </ContentSection>

            <ContentSection title="Gallery" eyebrow="Photo set" description="A few visual cues from the places that shape this route.">
              <GalleryGrid images={collection.gallery.slice(0, 6).length ? collection.gallery.slice(0, 6) : [collection.featuredImage]} alt={collection.title} />
            </ContentSection>

            <ContentSection title="Places in this collection" eyebrow="Route stops" description="Use these stops as the backbone for the trip.">
              <CollectionPlaceListLive collectionId={collection.id} fallbackPlaceIds={collection.places} />
            </ContentSection>

            <ContentSection title="Suggested itinerary" eyebrow="Trip planning" description="A simple starting point for building the route.">
              {collectionPlaces.length ? (
                <ol className="space-y-3 text-sm leading-7 text-slate-700">
                  {collectionPlaces.slice(0, 4).map((place, index) => (
                    <li key={place.id} className="flex gap-3">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f7efe1] text-xs font-semibold text-(--color-forest-green)">{index + 1}</span>
                      <span>
                        <strong className="font-semibold text-slate-900">{place.name}</strong> · {place.placeType} in {place.city}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm leading-7 text-slate-600">The itinerary will populate as collection stops are connected.</p>
              )}
            </ContentSection>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <ContentSection title="Map preview" eyebrow="Coming soon" description="Interactive stops on a regional map will land in a later release.">
              <div className="flex h-64 items-center justify-center rounded-[24px] border border-dashed border-(--color-pine)/35 bg-[repeating-linear-gradient(45deg,rgba(31,59,47,0.04),rgba(31,59,47,0.04)_10px,rgba(31,59,47,0.07)_10px,rgba(31,59,47,0.07)_20px)] p-5 text-center">
                <p className="text-sm leading-7 text-slate-600">Interactive route map coming soon. This placeholder will show collection stops on a regional map view.</p>
              </div>
            </ContentSection>

            <RelatedContentRail
              title="Related collections"
              items={relatedCollections.map((item) => ({
                id: item.id,
                title: item.title,
                subtitle: item.subtitle,
                href: `/collections/${item.slug}`,
                badge: item.season,
              }))}
              emptyTitle="No related collections yet"
              emptyDescription="More nearby thematic routes will appear as collections expand."
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
              emptyDescription="Guides matched to this collection will appear as editorial relationships are added."
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
