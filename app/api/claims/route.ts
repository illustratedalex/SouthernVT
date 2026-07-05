import { NextResponse } from "next/server";
import { createBusinessClaim } from "@/lib/claims/liveClaims";
import type { BusinessClaimInput } from "@/types/Claim";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<BusinessClaimInput>;

  if (
    !payload.businessListingId ||
    !payload.businessSlug ||
    !payload.businessName ||
    !payload.claimantName ||
    !payload.claimantEmail ||
    !payload.roleAtBusiness
  ) {
    return NextResponse.json({ error: "Missing required claim fields." }, { status: 400 });
  }

  try {
    const claim = await createBusinessClaim({
      businessListingId: payload.businessListingId,
      businessSlug: payload.businessSlug,
      businessName: payload.businessName,
      claimantName: payload.claimantName,
      claimantEmail: payload.claimantEmail,
      claimantPhone: payload.claimantPhone ?? "",
      roleAtBusiness: payload.roleAtBusiness,
      proofMessage: payload.proofMessage ?? "",
    });

    return NextResponse.json({ claim }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit claim.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
