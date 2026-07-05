import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { billingPlans, getCurrentBillingPlanLabel, getSquareBillingStatus } from "@/lib/billing/plans";
import { isBusinessPlaceType } from "@/lib/businessClaims";
import { getBusinessListingBySlugWithLiveClaimStatus } from "@/lib/businessListings.server";
import { createPageMetadata } from "@/lib/seo";
import { getPlaceBySlug } from "@/repositories/PlaceRepository";
import { SquareCheckoutButton } from "@/components/billing/SquareCheckoutButton";

interface BusinessUpgradePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BusinessUpgradePageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getBusinessListingBySlugWithLiveClaimStatus(slug);

  if (!listing) {
    return {
      title: "Upgrade Listing | SouthernVT",
      description: "Listing upgrade options for SouthernVT businesses.",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `Upgrade ${listing.name} | SouthernVT`,
    description: `View listing upgrade options for ${listing.name}.`,
    path: `/businesses/${listing.slug}/upgrade`,
  });
}

export default async function BusinessUpgradePage({ params }: BusinessUpgradePageProps) {
  const { slug } = await params;
  const listing = await getBusinessListingBySlugWithLiveClaimStatus(slug);

  if (!listing) {
    const place = await getPlaceBySlug(slug);
    if (place && !isBusinessPlaceType(place.placeType)) {
      redirect(`/places/${place.slug}?upgrade=business-only`);
    }
    notFound();
  }

  const squareStatus = getSquareBillingStatus();
  const currentPlan = getCurrentBillingPlanLabel(listing.isFoundingPartner, listing.status);
  const monthlyPlans = billingPlans.filter((plan) => plan.active && plan.interval !== "free");

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="mx-auto max-w-5xl space-y-6 px-6 py-10 sm:px-8 lg:px-10">
        <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Business listing upgrades</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Upgrade {listing.name}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Current plan: <span className="font-semibold text-slate-900">{currentPlan}</span>
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Paid business listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.
          </p>
          {!squareStatus.configured ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-7 text-amber-900">
              Online checkout is coming soon. Contact{" "}
              <a href="mailto:partners@southernvt.com" className="font-semibold underline underline-offset-2">
                partners@southernvt.com
              </a>{" "}
              to activate this plan.
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-7 text-emerald-900">
              Square is configured. Use the upgrade buttons below to continue with checkout.
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={`/claim-listing?listing=${encodeURIComponent(listing.slug)}`} className="rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">
              Claim this listing
            </Link>
            <a href="mailto:partners@southernvt.com" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-5 py-3 text-sm font-semibold text-slate-700">
              Email partners@southernvt.com
            </a>
          </div>
        </article>

        <section className="grid gap-4 md:grid-cols-2">
          {monthlyPlans.map((plan) => (
            <article key={plan.id} className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">{plan.name}</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {plan.price === 0 ? "Free" : `$${plan.price}/${plan.interval === "monthly" ? "month" : "year"}`}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">{plan.description}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{plan.trustNote}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {plan.purchasable && squareStatus.configured ? (
                  <SquareCheckoutButton
                    businessSlug={listing.slug}
                    planId={plan.id}
                    billingCadence={plan.interval as "monthly" | "yearly"}
                  />
                ) : plan.purchasable ? (
                  <a
                    href="mailto:partners@southernvt.com"
                    className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-2.5 text-sm font-semibold text-[#f8f2e4] hover:bg-[#2d5242] transition"
                  >
                    Contact us to upgrade
                  </a>
                ) : (
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Disabled
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>

        <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Future Premium</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Future Premium is disabled for beta launch. It is reserved for a later release and cannot be purchased yet.
          </p>
        </article>
      </section>

      <Footer />
    </main>
  );
}
