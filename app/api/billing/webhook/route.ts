import { NextResponse } from "next/server";

/**
 * @deprecated SouthernVT now uses Square for billing.
 * Use POST /api/billing/square-webhook instead.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "This endpoint has been replaced. SouthernVT now uses Square for billing. Use /api/billing/square-webhook.",
      replacedBy: "/api/billing/square-webhook",
    },
    { status: 410 },
  );
}
