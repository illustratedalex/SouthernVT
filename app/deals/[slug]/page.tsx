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
import { PlacePassportCTA } from "@/components/public/PlacePassportCTA";
import { dealJsonLd } from "@/lib/jsonLd";
import { createDealMetadata } from "@/lib/seo";
import { getCollections } from "@/lib/repositories/collectionRepository";
import { getPlaces } from "@/repositories/PlaceRepository";
import { getDealBySlug, getPublishedDeals } from "@/repositories/DealRepository";

interface DealDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const deals = await getPublishedDeals();
  return deals.map((deal) => ({ slug: deal.slug }));
}

export async function generateMetadata({ params }: DealDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal || deal.status !== "published") {
    return {
      title: "Deal Not Found | SouthernVT",
      description: "This offer is not currently available.",
      robots: { index: false, follow: false },
    };
  }

  return createDealMetadata(deal);
}

function redemptionLabel(method: string) {
  const labels: Record<string, string> = {
    show_phone: "Show on phone",
    code: "Use promo code",
    qr: "Scan QR",
    link: "Claim via link",
    in_person: "Redeem in person",
  };

  return labels[method] ?? method;
}

export default async function DealDetailPage({ params }: DealDetailPageProps) {
  const { slug } = await params;
  const deal = await getDealBySlug(slug);

  if (!deal || deal.status !== "published") {
    notFound();
  }

  const [places, collections] = await Promise.all([getPlaces(), getCollections()]);
  const place = places.find((item) => item.id === deal.placeId) ?? null;
  const collection = deal.collectionId ? collections.find((item) => item.id === deal.collectionId) ?? null : null;
  const jsonLd = dealJsonLd(deal);

  const nearbyPlaces = place
    ? places.filter((candidate) => candidate.id !== place.id && (candidate.city === place.city || place.relatedPlaces.includes(candidate.id) || candidate.tags.some((tag) => place.tags.includes(tag)))).slice(0, 4)
    : [];
  const relatedCollections = collections
    .filter((candidate) => candidate.status === "published" && (candidate.id === deal.collectionId || (place ? candidate.places.includes(place.id) : false) || candidate.tags.some((tag) => deal.tags.includes(tag))))
    .slice(0, 4);

  const ctaHref = deal.redemptionUrl || (deal.code ? `#use-${deal.code.toLowerCase()}` : "#redeem");
  const ctaText = deal.redemptionUrl ? "Claim offer" : deal.code ? `Use code ${deal.code}` : "Redeem this offer";

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Deals", href: "/deals" }, { label: deal.title }]} />

      <HeroImage
        eyebrow="Partner Offer"
        title={deal.title}
        subtitle={deal.shortDescription}
        image={deal.featuredImage}
        alt={deal.title}
        badges={[deal.dealType, `${deal.startDate} - ${deal.endDate}`, place?.name ?? "Southern Vermont"]}
      >
        <div className="space-y-3 text-sm leading-7 text-slate-200">
          <p>{place?.name ?? "Related place unavailable"}</p>
          <p>{redemptionLabel(deal.redemptionMethod)}</p>
        </div>
      </HeroImage>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <QuickFacts
          facts={[
            { label: "Deal type", value: deal.dealType, detail: deal.featured ? "Featured offer" : "Seasonal promotion" },
            { label: "Valid", value: deal.startDate, detail: deal.endDate },
            { label: "Redeem", value: redemptionLabel(deal.redemptionMethod), detail: deal.code ? `Code: ${deal.code}` : deal.redemptionUrl ? "Claim link available" : "Redeem on site" },
            { label: "Place", value: place?.name ?? "Unlinked", detail: place ? `${place.city}, ${place.state}` : "Related place not attached" },
          ]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="space-y-6">
            <ContentSection title="Deal description" eyebrow="Offer overview" description={deal.shortDescription}>
              <p className="text-sm leading-8 text-slate-700">{deal.description}</p>
            </ContentSection>

            <ContentSection title="Terms" eyebrow="Fine print" description="What visitors should know before they redeem the offer.">
              <p className="text-sm leading-8 text-slate-700">{deal.terms}</p>
            </ContentSection>

            <RelatedContentRail
              title="Nearby places"
              items={nearbyPlaces.map((candidate) => ({
                id: candidate.id,
                title: candidate.name,
                subtitle: `${candidate.placeType} · ${candidate.city}`,
                href: `/places/${candidate.slug}`,
                badge: candidate.featured ? "Featured" : undefined,
              }))}
              emptyTitle="No nearby places yet"
              emptyDescription="Nearby stops will appear when the offer is connected to a broader place network."
            />

            <RelatedContentRail
              title="Related collections"
              items={relatedCollections.map((candidate) => ({
                id: candidate.id,
                title: candidate.title,
                subtitle: `${candidate.season} · ${candidate.audience}`,
                href: `/collections/${candidate.slug}`,
                badge: candidate.season,
              }))}
              emptyTitle="No related collections yet"
              emptyDescription="Collection bundles for this deal will show up as relationships are added."
            />
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <ContentSection title="Related place" eyebrow="Where to redeem" description="The location connected to this partner offer.">
              {place ? (
                <div className="space-y-2 text-sm leading-7 text-slate-700">
                  <p className="font-semibold text-slate-900">{place.name}</p>
                  <p>{place.city}, {place.state}</p>
                  <p>{place.address}</p>
                </div>
              ) : (
                <p className="text-sm leading-7 text-slate-600">Place details unavailable.</p>
              )}
            </ContentSection>

            {collection ? (
              <ContentSection title="Related collection" eyebrow="Trip theme" description="A collection that includes or complements this offer.">
                <div className="space-y-2 text-sm leading-7 text-slate-700">
                  <p className="font-semibold text-slate-900">{collection.title}</p>
                  <p>{collection.subtitle}</p>
                </div>
              </ContentSection>
            ) : null}

            {place ? <PlacePassportCTA place={place} /> : null}

            <PublicCTA
              eyebrow="Claim deal"
              title="Use this offer"
              description="Online redemption tools are coming soon. Contact the partner directly or email partners@southernvt.com for help redeeming this offer."
              href={ctaHref}
              label={ctaText}
            />
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}
