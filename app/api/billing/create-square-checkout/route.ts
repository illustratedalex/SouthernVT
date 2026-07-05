import { NextResponse } from "next/server";
import { getBillingPlan, getSquareBillingStatus } from "@/lib/billing/plans";
import { getSquareClient, getSquareLocationId } from "@/lib/billing/squareClient";
import { getBusinessListingBySlugWithLiveClaimStatus } from "@/lib/businessListings.server";

type CheckoutRequestBody = {
  businessSlug?: string;
  planId?: string;
  billingCadence?: "monthly" | "yearly";
};

const TRUST_LANGUAGE =
  "Paid business listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.";

export async function POST(request: Request) {
  const payload = (await request.json()) as CheckoutRequestBody;
  const businessSlug = (payload.businessSlug ?? "").trim();
  const planId = (payload.planId ?? "").trim();
  const billingCadence = payload.billingCadence ?? "monthly";

  if (!businessSlug) {
    return NextResponse.json({ success: false, error: "businessSlug is required." }, { status: 400 });
  }
  if (!planId) {
    return NextResponse.json({ success: false, error: "planId is required." }, { status: 400 });
  }
  if (billingCadence !== "monthly" && billingCadence !== "yearly") {
    return NextResponse.json({ success: false, error: "billingCadence must be 'monthly' or 'yearly'." }, { status: 400 });
  }

  const listing = await getBusinessListingBySlugWithLiveClaimStatus(businessSlug);
  if (!listing) {
    return NextResponse.json({ success: false, error: "Business listing not found." }, { status: 404 });
  }

  const plan = getBillingPlan(planId);
  if (!plan) {
    return NextResponse.json({ success: false, error: "Unknown plan." }, { status: 400 });
  }
  if (!plan.active || !plan.purchasable) {
    return NextResponse.json({ success: false, error: "This plan is not available for purchase." }, { status: 400 });
  }

  const squareStatus = getSquareBillingStatus();
  if (!squareStatus.configured) {
    return NextResponse.json(
      {
        success: false,
        error: "Square checkout is not configured yet. Contact partners@southernvt.com to activate this plan.",
        trustLanguage: TRUST_LANGUAGE,
        listing: { slug: listing.slug, name: listing.name },
        plan: { id: plan.id, name: plan.name },
      },
      { status: 503 },
    );
  }

  // Resolve the Square subscription plan variation ID for the requested cadence.
  const planVariationId =
    billingCadence === "monthly"
      ? (plan.squareCatalogPlanVariationIdMonthly ?? "")
      : (plan.squareCatalogPlanVariationIdYearly ?? "");

  if (!planVariationId) {
    return NextResponse.json(
      {
        success: false,
        error: `Square catalog plan variation ID is not set for ${plan.name} (${billingCadence}). Configure SQUARE_PLAN_VARIATION_ID_* env vars after creating subscription plans in the Square Developer Dashboard.`,
        trustLanguage: TRUST_LANGUAGE,
      },
      { status: 503 },
    );
  }

  try {
    const client = getSquareClient();
    const locationId = getSquareLocationId();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.southernvt.com";

    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: `${businessSlug}-${planId}-${billingCadence}-${Date.now()}`,
      order: {
        locationId,
        referenceId: `svt-${businessSlug}-${planId}-${billingCadence}`,
        lineItems: [
          {
            name: `SouthernVT ${plan.name} (${billingCadence})`,
            quantity: "1",
            basePriceMoney: {
              amount: BigInt(plan.price * 100),
              currency: "USD",
            },
            note: TRUST_LANGUAGE,
          },
        ],
        metadata: {
          businessSlug,
          planId,
          billingCadence,
          source: "southernvt",
        },
      },
      checkoutOptions: {
        redirectUrl: `${appUrl}/businesses/${businessSlug}/upgrade?checkout=success`,
        askForShippingAddress: false,
        merchantSupportEmail: "partners@southernvt.com",
      },
      paymentNote: `SouthernVT listing upgrade — ${listing.name} (${plan.name}, ${billingCadence})`,
    });

    const paymentLink = response.paymentLink;
    if (!paymentLink?.url) {
      return NextResponse.json({ success: false, error: "Square did not return a payment link URL." }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: paymentLink.url,
      paymentLinkId: paymentLink.id,
      trustLanguage: TRUST_LANGUAGE,
      listing: { slug: listing.slug, name: listing.name },
      plan: { id: plan.id, name: plan.name, price: plan.price, interval: plan.interval },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error creating Square checkout.";
    console.error("[Square checkout] Error:", message);
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
