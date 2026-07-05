import { NextResponse } from "next/server";
import { isSquareConfigured, verifySquareWebhookSignature } from "@/lib/billing/squareClient";

/** Square webhook event types SouthernVT will handle. */
type SquareWebhookEventType =
  | "payment.updated"
  | "subscription.created"
  | "subscription.updated"
  | "subscription.canceled"
  | "invoice.payment_made"
  | "invoice.payment_failed";

const HANDLED_EVENTS: SquareWebhookEventType[] = [
  "payment.updated",
  "subscription.created",
  "subscription.updated",
  "subscription.canceled",
  "invoice.payment_made",
  "invoice.payment_failed",
];

export async function POST(request: Request) {
  if (!isSquareConfigured()) {
    return NextResponse.json({ success: false, error: "Square webhooks are not configured." }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("x-square-hmacsha256-signature");
  const requestUrl = request.url;

  // Verify webhook signature when a key is present.
  const keyPresent = !!process.env.SQUARE_WEBHOOK_SIGNATURE_KEY?.trim();
  if (keyPresent) {
    let valid = false;
    try {
      valid = await verifySquareWebhookSignature(body, signature, requestUrl);
    } catch {
      return NextResponse.json({ success: false, error: "Webhook signature verification failed." }, { status: 401 });
    }
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid webhook signature." }, { status: 401 });
    }
  } else {
    console.warn("[Square webhook] SQUARE_WEBHOOK_SIGNATURE_KEY not set — skipping signature verification.");
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const eventType = event.type as string | undefined;
  console.log(`[Square webhook] Received event: ${eventType ?? "unknown"}`);

  if (!eventType || !HANDLED_EVENTS.includes(eventType as SquareWebhookEventType)) {
    // Acknowledge but don't process unknown events.
    return NextResponse.json({ success: true, received: true, processed: false, note: `Unhandled event type: ${eventType}` });
  }

  switch (eventType as SquareWebhookEventType) {
    case "subscription.created":
    case "subscription.updated": {
      // TODO: persist subscription ID, update listing status in database.
      const data = event.data as Record<string, unknown> | undefined;
      console.log("[Square webhook] Subscription event data:", JSON.stringify(data)?.slice(0, 300));
      break;
    }

    case "subscription.canceled": {
      // TODO: downgrade listing to basic_free in database.
      const data = event.data as Record<string, unknown> | undefined;
      console.log("[Square webhook] Subscription canceled:", JSON.stringify(data)?.slice(0, 300));
      break;
    }

    case "invoice.payment_made": {
      // TODO: confirm active status for the listing linked to this invoice.
      const data = event.data as Record<string, unknown> | undefined;
      console.log("[Square webhook] Invoice payment made:", JSON.stringify(data)?.slice(0, 300));
      break;
    }

    case "invoice.payment_failed": {
      // TODO: flag listing for manual review or grace-period downgrade.
      const data = event.data as Record<string, unknown> | undefined;
      console.log("[Square webhook] Invoice payment failed:", JSON.stringify(data)?.slice(0, 300));
      break;
    }

    case "payment.updated": {
      const data = event.data as Record<string, unknown> | undefined;
      console.log("[Square webhook] Payment updated:", JSON.stringify(data)?.slice(0, 300));
      break;
    }
  }

  return NextResponse.json({ success: true, received: true, processed: true, eventType });
}
