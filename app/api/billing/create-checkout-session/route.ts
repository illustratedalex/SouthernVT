import { NextResponse } from "next/server";
import { getBillingPlan, getStripeBillingStatus, hasStripeBillingEnv } from "@/lib/billing/plans";
import { getBusinessListingBySlugWithLiveClaimStatus } from "@/lib/businessListings.server";

type CheckoutRequestBody = {
  listingSlug?: string;
  planId?: string;
};

const TRUST_LANGUAGE = "Paid listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.";

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckoutRequestBody;
  const listingSlug = (payload.listingSlug ?? "").trim();
  const planId = (payload.planId ?? "").trim();

  if (!listingSlug) {
    return NextResponse.json({ success: false, error: "Listing slug is required." }, { status: 400 });
  }

  if (!planId) {
    return NextResponse.json({ success: false, error: "Plan id is required." }, { status: 400 });
  }

  const listing = await getBusinessListingBySlugWithLiveClaimStatus(listingSlug);
  if (!listing) {
    return NextResponse.json({ success: false, error: "Listing not found." }, { status: 404 });
  }

  const plan = getBillingPlan(planId);
  if (!plan) {
    return NextResponse.json({ success: false, error: "Unknown plan." }, { status: 400 });
  }

  if (!plan.active || !plan.purchasable) {
    return NextResponse.json({ success: false, error: "This plan is not available for purchase yet." }, { status: 400 });
  }

  if (/verification|recommended/i.test(`${plan.id} ${plan.name} ${plan.description}`)) {
    return NextResponse.json({ success: false, error: "Verification and recommendation plans are not purchasable." }, { status: 400 });
  }

  const stripeStatus = getStripeBillingStatus();
  if (!hasStripeBillingEnv() || !stripeStatus.configured) {
    return NextResponse.json(
      {
        success: false,
        error: "Online checkout is coming soon. Contact partners@southernvt.com to activate this plan.",
        trustLanguage: TRUST_LANGUAGE,
        listing: { slug: listing.slug, name: listing.name },
        plan: { id: plan.id, name: plan.name },
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    success: true,
    validated: true,
    checkoutReady: false,
    message: "Stripe is configured, but live checkout is not yet enabled in beta.",
    trustLanguage: TRUST_LANGUAGE,
    listing: { slug: listing.slug, name: listing.name },
    plan: { id: plan.id, name: plan.name, price: plan.price, interval: plan.interval },
  });
}
