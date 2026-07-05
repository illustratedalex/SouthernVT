import { NextResponse } from "next/server";
import { getAuthenticatedOwnerUser } from "@/lib/auth/session";
import { createBusinessListingEditRequest, isActiveBusinessOwner } from "@/lib/claims/liveClaims";

interface EditRequestPayload {
  businessListingId?: string;
  description?: string;
  website?: string;
  phone?: string;
  photosPlaceholder?: string;
  eventsPlaceholder?: string;
  dealsPlaceholder?: string;
  ownerMessage?: string;
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedOwnerUser();
    if (!user) {
      return NextResponse.json({ error: "You must be logged in to submit edit requests." }, { status: 401 });
    }

    const payload = (await request.json()) as EditRequestPayload;
    if (!payload.businessListingId) {
      return NextResponse.json({ error: "businessListingId is required." }, { status: 400 });
    }

    const ownsListing = await isActiveBusinessOwner(user.id, payload.businessListingId);
    if (!ownsListing) {
      return NextResponse.json({ error: "You are not approved to edit this listing." }, { status: 403 });
    }

    await createBusinessListingEditRequest({
      businessListingId: payload.businessListingId,
      userId: user.id,
      proposedChanges: {
        description: payload.description ?? "",
        website: payload.website ?? "",
        phone: payload.phone ?? "",
        photosPlaceholder: payload.photosPlaceholder ?? "",
        eventsPlaceholder: payload.eventsPlaceholder ?? "",
        dealsPlaceholder: payload.dealsPlaceholder ?? "",
        ownerMessage: payload.ownerMessage ?? "",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit edit request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
