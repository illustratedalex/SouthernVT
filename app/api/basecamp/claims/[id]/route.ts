import { NextResponse } from "next/server";
import { requireBasecampReviewerEmail } from "@/lib/auth/basecamp";
import { reviewBusinessClaim } from "@/lib/claims/liveClaims";
import { sendClaimApprovedEmail, sendClaimRejectedEmail } from "@/lib/email/claimEmails";
import type { ClaimReviewInput } from "@/types/Claim";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;
  const payload = (await request.json()) as Partial<ClaimReviewInput & { reviewedBy?: string }>;

  if (!payload.status || (payload.status !== "approved" && payload.status !== "rejected")) {
    return NextResponse.json({ error: "Status must be approved or rejected." }, { status: 400 });
  }

  try {
    const reviewerEmail = await requireBasecampReviewerEmail();
    const claim = await reviewBusinessClaim(
      id,
      {
        status: payload.status,
        reviewNotes: payload.reviewNotes ?? "",
      },
      payload.reviewedBy ?? reviewerEmail,
    );

    // Send outcome email — fire-and-forget so a mail failure doesn't block the review
    const notifyEmail = payload.status === "approved"
      ? sendClaimApprovedEmail(claim)
      : sendClaimRejectedEmail(claim);

    notifyEmail.catch((error: unknown) => {
      console.error("Claim outcome email failed:", error instanceof Error ? error.message : error);
    });

    return NextResponse.json({ claim });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to review claim.";
    const status = message.includes("required") || message.includes("authorized") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
