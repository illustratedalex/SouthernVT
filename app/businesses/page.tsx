import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { BusinessListingCard } from "@/components/public/BusinessListingCard";
import { Badge } from "@/components/ui";
import {
  filterBusinessListings,
  getBusinessListingFilterCategories,
  getBusinessListingTowns,
} from "@/lib/businessListings";
import { getBusinessListingsWithLiveClaimStatus } from "@/lib/businessListings.server";
import { createPageMetadata } from "@/lib/seo";

interface BusinessesPageProps {
  searchParams: Promise<{
    town?: string;
    category?: string;
    claimed?: string;
    verified?: string;
    foundingPartner?: string;
  }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Southern Vermont Businesses | SouthernVT",
  description: "Browse Southern Vermont business listings that owners can claim and improve over time.",
  path: "/businesses",
});

export default async function BusinessesPage({ searchParams }: BusinessesPageProps) {
  const params = await searchParams;
  const listings = await getBusinessListingsWithLiveClaimStatus();
  const towns = getBusinessListingTowns();
  const categories = getBusinessListingFilterCategories();
  const filteredListings = filterBusinessListings(listings, params);
  const claimedOnly = params.claimed === "true";
  const verifiedOnly = params.verified === "true";
  const foundingPartnerOnly = params.foundingPartner === "true";

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="border-b border-(--color-pine)/20 bg-gradient-to-br from-[#12241d] via-[#1f3b2f] to-[#405d4c] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">SouthernVT Directory</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Local businesses across Southern Vermont.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            This is the public directory foundation. Listings can start basic, then get claimed, verified, and improved over time.
          </p>
          <p className="mt-3 text-sm font-medium text-slate-200/95">Find your business, then choose Claim this listing.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant="featured">Not paid placement</Badge>
            <Badge variant="subtle" className="border-white/20 bg-white/10 text-white">Beta directory · details may be incomplete</Badge>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <form className="rounded-[28px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto_auto_auto] lg:items-end">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Town
              <select
                name="town"
                defaultValue={params.town ?? "All"}
                className="h-12 w-full rounded-2xl border border-(--color-pine)/20 bg-white px-4 text-sm text-slate-700"
              >
                <option value="All">All towns</option>
                {towns.map((town) => (
                  <option key={town} value={town}>{town}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm font-medium text-slate-700">
              Category
              <select
                name="category"
                defaultValue={params.category ?? "All"}
                className="h-12 w-full rounded-2xl border border-(--color-pine)/20 bg-white px-4 text-sm text-slate-700"
              >
                <option value="All">All categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" name="claimed" value="true" defaultChecked={claimedOnly} className="h-4 w-4" />
              Claimed
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" name="verified" value="true" defaultChecked={verifiedOnly} className="h-4 w-4" />
              Verified
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 text-sm text-slate-700">
              <input type="checkbox" name="foundingPartner" value="true" defaultChecked={foundingPartnerOnly} className="h-4 w-4" />
              Founding Partner
            </label>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center rounded-full bg-(--color-forest-green) px-6 text-sm font-semibold text-(--color-cream) motion-safe:transition motion-safe:hover:bg-(--color-pine)"
            >
              Apply filters
            </button>
          </div>
        </form>

        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-(--color-pine)">Public Listings</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">Browse all businesses</h2>
            </div>
            <p className="text-sm text-slate-600">{filteredListings.length} result{filteredListings.length === 1 ? "" : "s"}</p>
          </div>

          {filteredListings.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredListings.map((listing) => (
                <BusinessListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-[#e8dfc8] bg-white p-6 text-sm leading-7 text-slate-700 shadow-sm">
              No business listings match those filters yet.
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
}