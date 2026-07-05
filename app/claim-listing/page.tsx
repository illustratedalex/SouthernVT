import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ClaimForm } from "@/components/claims";
import { getBusinessListingBySlug } from "@/lib/businessListings";
import { isBusinessPlaceType } from "@/lib/businessClaims";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getPlaceBySlug } from "@/repositories/PlaceRepository";

interface ClaimListingPageProps {
  searchParams: Promise<{ listing?: string }>;
}

async function resolveClaimListing(slug: string) {
  const [place, businessListing] = await Promise.all([
    getPlaceBySlug(slug),
    Promise.resolve(getBusinessListingBySlug(slug)),
  ]);

  const claimablePlace = place && isBusinessPlaceType(place.placeType) ? place : null;
  if (claimablePlace) {
    return {
      id: claimablePlace.id,
      slug: claimablePlace.slug,
      name: claimablePlace.name,
      type: "place_listing",
      address: claimablePlace.address,
      townLine: `${claimablePlace.city}, ${claimablePlace.state} ${claimablePlace.zip}`,
      publicHref: `/places/${claimablePlace.slug}`,
      publicLabel: "place page",
    };
  }

  if (businessListing) {
    return {
      id: businessListing.id,
      slug: businessListing.slug,
      name: businessListing.name,
      type: "business_listing",
      address: businessListing.address || "Address not yet confirmed",
      townLine: `${businessListing.town}, ${businessListing.county}`,
      publicHref: `/businesses/${businessListing.slug}`,
      publicLabel: "listing",
    };
  }

  return null;
}

export async function generateMetadata({ searchParams }: ClaimListingPageProps): Promise<Metadata> {
  const params = await searchParams;
  const slug = (params.listing ?? "").trim();

  if (!slug) {
    return {
      title: "Claim Listing | SouthernVT",
      description: "Business ownership claim form.",
      robots: { index: false, follow: false },
    };
  }

  const listing = await resolveClaimListing(slug);
  if (!listing) {
    return {
      title: "Claim Listing | SouthernVT",
      description: "Business ownership claim form.",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `Claim ${listing.name} | SouthernVT`,
    description: `Request ownership access for the ${listing.name} listing.`,
    path: `/claim-listing?listing=${encodeURIComponent(listing.slug)}`,
  });
}

export default async function ClaimListingPage({ searchParams }: ClaimListingPageProps) {
  const params = await searchParams;
  const listingSlug = (params.listing ?? "").trim();

  if (!listingSlug) {
    redirect("/businesses");
  }

  const businessPortalEnabled = await isFeatureEnabled("businessPortal");
  const listing = await resolveClaimListing(listingSlug);

  if (!businessPortalEnabled || !listing) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-4xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[30px] border border-[#e8dfc8] bg-white/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Business Portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Claim {listing.name}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Claiming is currently free. Submit your request and SouthernVT will manually review it before granting edit access.
          </p>
          <div className="mt-4 text-sm text-slate-600">
            <p>{listing.address}</p>
            <p>{listing.townLine}</p>
          </div>
          <Link href={listing.publicHref} className="mt-4 inline-flex text-sm font-semibold text-[#1f3b2f] underline underline-offset-4">
            Back to listing
          </Link>
        </div>

        <ClaimForm listing={{ id: listing.id, slug: listing.slug, name: listing.name, type: listing.type, publicHref: listing.publicHref, publicLabel: listing.publicLabel }} />
      </section>

      <Footer />
    </main>
  );
}
