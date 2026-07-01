import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ClaimForm } from "@/components/claims";
import { isBusinessPlaceType } from "@/lib/businessClaims";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getPlaceBySlug } from "@/repositories/PlaceRepository";

interface ClaimPageProps {
  params: Promise<{ placeSlug: string }>;
}

export async function generateMetadata({ params }: ClaimPageProps): Promise<Metadata> {
  const { placeSlug } = await params;
  const place = await getPlaceBySlug(placeSlug);

  if (!place) {
    return {
      title: "Claim Listing | SouthernVT",
      description: "Business ownership claim form.",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `Claim ${place.name} | SouthernVT`,
    description: `Request ownership access for the ${place.name} listing.`,
    path: `/claim/${place.slug}`,
  });
}

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { placeSlug } = await params;

  const [place, businessPortalEnabled] = await Promise.all([
    getPlaceBySlug(placeSlug),
    isFeatureEnabled("businessPortal"),
  ]);

  if (!businessPortalEnabled || !place || !isBusinessPlaceType(place.placeType)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-4xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <div className="rounded-[30px] border border-[#e8dfc8] bg-white/70 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Business Portal</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Claim {place.name}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Complete the mock ownership request workflow for this place listing. No account sign-in is required in this preview.
          </p>
          <div className="mt-4 text-sm text-slate-600">
            <p>{place.address}</p>
            <p>{place.city}, {place.state} {place.zip}</p>
          </div>
          <Link href={`/places/${place.slug}`} className="mt-4 inline-flex text-sm font-semibold text-[#1f3b2f] underline underline-offset-4">
            Back to place page
          </Link>
        </div>

        <ClaimForm place={{ id: place.id, slug: place.slug, name: place.name }} />
      </section>

      <Footer />
    </main>
  );
}
