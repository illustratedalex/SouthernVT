import { NextResponse } from "next/server";
import { requireBasecampReviewerEmail } from "@/lib/auth/basecamp";
import { getBusinessClaims } from "@/lib/claims/liveClaims";

export async function GET() {
  try {
    await requireBasecampReviewerEmail();
    const claims = await getBusinessClaims();
    return NextResponse.json({ claims });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load claims.";
    const status = message.includes("required") || message.includes("authorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
