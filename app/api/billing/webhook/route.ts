import { NextResponse } from "next/server";
import { getStripeBillingStatus } from "@/lib/billing/plans";

export async function POST(request: Request) {
  const stripeStatus = getStripeBillingStatus();
  if (!stripeStatus.configured) {
    return NextResponse.json(
      {
        success: false,
        error: "Stripe webhooks are not configured yet.",
      },
      { status: 503 },
    );
  }

  const body = await request.text();
  console.log("[Stripe webhook stub] Received billing webhook payload:", body.slice(0, 200));

  return NextResponse.json({
    success: true,
    received: true,
    processed: false,
    message: "Billing webhook endpoint is staged for beta launch.",
  });
}
