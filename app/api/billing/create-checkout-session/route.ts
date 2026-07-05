import { NextResponse } from "next/server";

/**
 * @deprecated SouthernVT now uses Square for billing.
 * Use POST /api/billing/create-square-checkout instead.
 */
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "This endpoint has been replaced. SouthernVT now uses Square for billing. Use /api/billing/create-square-checkout.",
      replacedBy: "/api/billing/create-square-checkout",
    },
    { status: 410 },
  );
}
