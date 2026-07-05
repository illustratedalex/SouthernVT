import Link from "next/link";
import { OwnerListingEditRequestForm } from "@/components/partner/OwnerListingEditRequestForm";
import { getAuthenticatedOwnerUser } from "@/lib/auth/session";
import { getOwnedBusinessListings } from "@/lib/claims/liveClaims";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Partner Portal",
  description: "Business owner tools for managing listings, deals, and events in Southern Vermont.",
  path: "/partner-portal",
});

export default async function PartnerPortalLandingPage() {
  const user = await getAuthenticatedOwnerUser();
  const ownedListings = user ? await getOwnedBusinessListings(user.id) : [];

  return (
    <section className="mx-auto max-w-6xl space-y-8 px-6 py-14 sm:px-8 lg:px-10">
      <header className="rounded-4xl border border-[#e8dfc8] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Business owner portal</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">Grow your Southern Vermont presence</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-600">
          The Partner Portal provides approved business owners a review-based workflow for listing updates.
        </p>
        {user ? (
          <form action="/logout" method="post" className="mt-6">
            <button type="submit" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-5 py-3 text-sm font-semibold text-slate-700">
              Logout
            </button>
          </form>
        ) : null}
      </header>

      {!user ? (
        <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Login required</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">Log in or create an account to access approved business listings.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4]">
              Login
            </Link>
            <Link href="/signup" className="rounded-full border border-[#d7cbb3] px-5 py-2.5 text-sm font-semibold text-slate-700">
              Sign up
            </Link>
          </div>
        </article>
      ) : null}

      {user && ownedListings.length === 0 ? (
        <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">No approved business listings yet.</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Your claim may still be pending review. SouthernVT cannot grant owner editing access until a claim is approved.
          </p>
        </article>
      ) : null}

      {user && ownedListings.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Owned listings</h2>
          {ownedListings.map((listing) => (
            <article key={listing.id} className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{listing.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{listing.town}, {listing.county}</p>
              <OwnerListingEditRequestForm listing={listing} />
              <div className="mt-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4 text-sm leading-7 text-slate-700">
                <p className="font-semibold text-slate-900">Locked fields</p>
                <p className="mt-1">
                  Owners cannot edit Verified by SouthernVT, SouthernVT Recommended, editorial review, coverage region, or editorial ranking.
                </p>
              </div>
            </article>
          ))}
        </section>
      ) : null}
    </section>
  );
}
