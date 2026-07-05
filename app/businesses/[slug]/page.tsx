import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnalyticsTrackOnRender } from "@/components/analytics/AnalyticsTrackOnRender";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui";
import {
  getBusinessListingBySlug,
  getBusinessListingClaimLabel,
  getBusinessListingDescription,
  getBusinessListingStatusLabel,
  getBusinessListingStatusTone,
} from "@/lib/businessListings";
import { getBusinessRelationshipSnapshot } from "@/lib/graph/RelationshipQueries";
import { createPageMetadata } from "@/lib/seo";

interface BusinessPageProps {
  params: Promise<{ slug: string }>;
}

function buildBusinessMetadataDescription(slug: string) {
  const listing = getBusinessListingBySlug(slug);
  if (!listing) {
    return "Basic SouthernVT business listing.";
  }

  if (listing.status === "basic") {
    return `${listing.name} in ${listing.town}, ${listing.county}. Basic listing. Details may be incomplete.`;
  }

  return `${listing.name} in ${listing.town}, ${listing.county}. ${listing.description}`;
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = getBusinessListingBySlug(slug);

  if (!listing) {
    return createPageMetadata({
      title: "Business Listing | SouthernVT",
      description: "SouthernVT business listing.",
      path: `/businesses/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${listing.name} | SouthernVT Businesses`,
    description: buildBusinessMetadataDescription(slug),
    path: `/businesses/${listing.slug}`,
  });
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  const listing = getBusinessListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const claimMessage = listing.claimStatus === "unclaimed"
    ? "Own this business? Claim this listing to help keep your information current and unlock partner tools."
    : listing.claimStatus === "pending"
      ? "A claim request is already in review. Owners can still contact SouthernVT if details need correction."
      : "This listing has already been claimed by the business owner.";
  const relationshipSnapshot = getBusinessRelationshipSnapshot(listing.slug);

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <AnalyticsTrackOnRender
        event="business_viewed"
        onceKey={`business:${listing.id}`}
        params={{ business_id: listing.id, business_slug: listing.slug, business_name: listing.name }}
      />
      <Navbar />

      <section className="border-b border-[#dccfb8] bg-[#f7efe1]">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
          <Link href="/businesses" className="text-sm font-semibold text-[#1f3b2f] underline underline-offset-4">
            Back to businesses
          </Link>

          <div className="mt-5 flex flex-wrap gap-2">
            <Badge variant={getBusinessListingStatusTone(listing.status)}>{getBusinessListingStatusLabel(listing.status)}</Badge>
            <Badge variant="subtle">{getBusinessListingClaimLabel(listing.claimStatus)}</Badge>
            {listing.isVerified ? <Badge variant="amber">Verified by SouthernVT</Badge> : null}
            {listing.isFoundingPartner ? <Badge variant="featured">Founding Partner</Badge> : null}
          </div>

          <h1 className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl">{listing.name}</h1>
          <p className="mt-3 text-lg text-slate-700">{listing.category} in {listing.town}, {listing.county}</p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700">{listing.description}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-10">
        <div className="space-y-6">
          <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Business Details</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Category</p>
                <p className="mt-1 text-sm text-slate-800">{listing.category}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Town</p>
                <p className="mt-1 text-sm text-slate-800">{listing.town}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Address</p>
                <p className="mt-1 text-sm text-slate-800">{listing.address || "Not yet provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Contact</p>
                <div className="mt-1 space-y-1 text-sm text-slate-800">
                  <p>
                    {listing.phone ? (
                      <a
                        href={`tel:${listing.phone.replace(/[^+\d]/g, "")}`}
                        data-ga-event="phone_click"
                        data-ga-source="business_contact"
                        data-ga-label="Business phone"
                        data-ga-entity-slug={listing.slug}
                        data-ga-entity-name={listing.name}
                        data-ga-href={`tel:${listing.phone.replace(/[^+\d]/g, "")}`}
                        className="font-semibold text-[#1f3b2f] underline underline-offset-4"
                      >
                        {listing.phone}
                      </a>
                    ) : (
                      "Phone not yet provided"
                    )}
                  </p>
                  <p>
                    {listing.website ? (
                      <a
                        href={listing.website}
                        data-ga-event="business_website_click"
                        data-ga-source="business_contact"
                        data-ga-label="Business website"
                        data-ga-business-slug={listing.slug}
                        data-ga-business-name={listing.name}
                        data-ga-href={listing.website}
                        className="font-semibold text-[#1f3b2f] underline underline-offset-4"
                      >
                        Website
                      </a>
                    ) : (
                      "Website not yet provided"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Status Language</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-slate-700">
              <p><span className="font-semibold text-slate-900">Basic Listing:</span> Created by SouthernVT from publicly available or submitted information. May be incomplete.</p>
              <p><span className="font-semibold text-slate-900">Claimed by Owner:</span> Business owner has claimed the profile.</p>
              <p><span className="font-semibold text-slate-900">Verified by SouthernVT:</span> SouthernVT has reviewed or verified key details.</p>
              <p><span className="font-semibold text-slate-900">Founding Partner:</span> Business is helping support SouthernVT during beta.</p>
            </div>
          </article>

          <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Relationship Engine</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">Connected Discovery</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Nearby attractions</p>
                <div className="mt-2 space-y-2">
                  {relationshipSnapshot.nearbyAttractions.length ? relationshipSnapshot.nearbyAttractions.map((item) => (
                    <Link key={item.id} href={item.href} className="block rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="block text-xs uppercase tracking-[0.12em] text-slate-500">{item.reason}</span>
                    </Link>
                  )) : <p className="text-sm text-slate-600">No nearby attractions linked yet.</p>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Related collections</p>
                <div className="mt-2 space-y-2">
                  {relationshipSnapshot.relatedCollections.length ? relationshipSnapshot.relatedCollections.map((item) => (
                    <Link key={item.id} href={item.href} className="block rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="block text-xs uppercase tracking-[0.12em] text-slate-500">{item.reason}</span>
                    </Link>
                  )) : <p className="text-sm text-slate-600">No related collections linked yet.</p>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Upcoming events</p>
                <div className="mt-2 space-y-2">
                  {relationshipSnapshot.upcomingEvents.length ? relationshipSnapshot.upcomingEvents.map((item) => (
                    <Link key={item.id} href={item.href} className="block rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">{item.name}</span>
                      <span className="block text-xs uppercase tracking-[0.12em] text-slate-500">{item.reason}</span>
                    </Link>
                  )) : <p className="text-sm text-slate-600">No upcoming events linked yet.</p>}
                </div>
              </div>
            </div>
          </article>

          {listing.isVerified ? (
            <article className="rounded-[28px] border border-[#d7cba7] bg-[#fff7df] p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7c5b13]">Verified by SouthernVT</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                SouthernVT has reviewed or verified key details for this listing. Verification cannot be bought.
              </p>
            </article>
          ) : null}
        </div>

        <aside className="space-y-6">
          <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Completeness</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{listing.completenessScore}%</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#efe6d2]">
              <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15d,#1f5a3d)]" style={{ width: `${listing.completenessScore}%` }} />
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{getBusinessListingDescription(listing.status)}</p>
          </article>

          <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Claim This Listing</p>
            <p className="mt-3 text-sm leading-7 text-slate-700">{claimMessage}</p>
            <Link
              href={`/claim/${listing.slug}`}
              className="mt-4 inline-flex rounded-full bg-(--color-forest-green) px-5 py-3 text-sm font-semibold text-(--color-cream) motion-safe:transition motion-safe:hover:bg-(--color-pine)"
            >
              Claim this listing
            </Link>
          </article>
        </aside>
      </section>

      <Footer />
    </main>
  );
}