import { NextResponse } from "next/server";
import { createBusinessClaim, hasSupabaseServiceRoleEnv } from "@/lib/claims/liveClaims";
import { sendClaimSubmissionEmails } from "@/lib/email/claimEmails";
import type { BusinessClaimInput } from "@/types/Claim";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<BusinessClaimInput>;

  if ((payload.honeypot ?? "").trim()) {
    console.warn("Blocked suspected claim form spam submission.");
    return NextResponse.json({ blocked: true });
  }

  // Service guard — do not silently mock success when Supabase is not configured
  if (!hasSupabaseServiceRoleEnv()) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Claim submissions are not enabled yet. Please email partners@southernvt.com to claim your listing.",
        notConfigured: true,
      },
      { status: 503 },
    );
  }

  // Email guard — fail safely when claim notifications are not configured
  if (
    !process.env.RESEND_API_KEY?.trim() ||
    !process.env.CLAIMS_EMAIL_FROM?.trim() ||
    !(process.env.PARTNERS_EMAIL_TO?.trim() || process.env.CLAIMS_ADMIN_EMAIL?.trim())
  ) {
    return NextResponse.json(
      {
        success: false,
        error: "Claim email notifications are not enabled yet. Please email partners@southernvt.com to submit your claim.",
        notConfigured: true,
      },
      { status: 503 },
    );
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
