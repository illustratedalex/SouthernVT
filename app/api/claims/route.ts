import { NextResponse } from "next/server";
import { createBusinessClaim } from "@/lib/claims/liveClaims";
import { sendClaimSubmissionEmails } from "@/lib/email/claimEmails";
import type { BusinessClaimInput } from "@/types/Claim";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<BusinessClaimInput>;

  if ((payload.honeypot ?? "").trim()) {
    console.warn("Blocked suspected claim form spam submission.");
    return NextResponse.json({ blocked: true });
  }

  if (
    !payload.businessListingId ||
    !payload.businessSlug ||
    !payload.businessName ||
    !payload.listingUrl ||
    !payload.contactName ||
    !payload.role ||
    !payload.email
  ) {
    return NextResponse.json({ error: "Missing required claim fields." }, { status: 400 });
  }

  try {
    const claim = await createBusinessClaim({
      businessListingId: payload.businessListingId,
      businessSlug: payload.businessSlug,
      businessName: payload.businessName,
      listingUrl: payload.listingUrl,
      contactName: payload.contactName,
      role: payload.role,
      email: payload.email,
      phone: payload.phone ?? "",
      website: payload.website ?? "",
      requestedUpdates: payload.requestedUpdates ?? "",
      verificationNotes: payload.verificationNotes ?? "",
    });

    await sendClaimSubmissionEmails(claim);

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit claim.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
