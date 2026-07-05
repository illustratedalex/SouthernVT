import "server-only";
import type { BusinessClaim } from "@/types/Claim";
import type { BusinessListing } from "@/types/BusinessListing";
import { sendEmail, requireEmailEnv } from "./sender";
import {
  emailHtmlWrapper,
  h1,
  p,
  eyebrow,
  divider,
  calloutBox,
  primaryButton,
  metaTable,
  sign,
} from "./emailTemplates";

// ---------------------------------------------------------------------------
// 1. Claim Request Received — sent to claimant on submission
// ---------------------------------------------------------------------------

export async function sendClaimReceivedEmail(claim: BusinessClaim): Promise<void> {
  const { resendApiKey, emailFrom } = requireEmailEnv();

  const html = emailHtmlWrapper(`
    ${eyebrow("Claim Request")}
    ${h1(`We received your claim for ${claim.businessName}.`)}
    ${p(`Hi ${claim.contactName}, thanks for reaching out. Your request is now in our review queue and we'll take a look shortly.`)}
    ${p("Claiming is free. Once your request is reviewed and approved, you'll be able to update your listing's details through the SouthernVT Partner Portal.")}
    ${calloutBox(`
      ${p("<strong>What happens next</strong>")}
      ${p("We review every request manually — usually within a few business days. If we have questions or need additional verification, we'll reply to this email.")}
    `)}
    ${metaTable([
      ["Business", claim.businessName],
      ["Your name", claim.contactName],
      ["Your role", claim.role],
      ["Reference", claim.id],
    ])}
    ${divider()}
    ${p("No action is needed from you right now. If anything changes or you want to add context, just reply to this email.")}
    ${sign()}
  `);

  const text = [
    `Hi ${claim.contactName},`,
    "",
    `We received your claim request for ${claim.businessName}.`,
    "Your request is now in our review queue.",
    "",
    "Claiming is free. Once approved, you'll be able to update your listing through the SouthernVT Partner Portal.",
    "",
    "What happens next:",
    "We review every request manually — usually within a few business days.",
    "If we have questions, we'll reply to this email.",
    "",
    `Business: ${claim.businessName}`,
    `Your name: ${claim.contactName}`,
    `Reference: ${claim.id}`,
    "",
    "No action needed right now. Reply to this email to add context.",
    "",
    "— The SouthernVT team",
  ].join("\n");

  await sendEmail(
    {
      from: emailFrom,
      to: claim.email,
      subject: `Claim request received: ${claim.businessName}`,
      html,
      text,
    },
    resendApiKey,
  );
}

// ---------------------------------------------------------------------------
// 2. Admin notification — sent to site admin on every new submission
// ---------------------------------------------------------------------------

export async function sendClaimAdminNotificationEmail(claim: BusinessClaim): Promise<void> {
  const { resendApiKey, emailFrom, adminEmail } = requireEmailEnv();

  const reviewUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://southernvt.com"}/basecamp/claims`;

  const html = emailHtmlWrapper(`
    ${eyebrow("Basecamp — New Claim")}
    ${h1(`New listing claim: ${claim.businessName}`)}
    ${p("A business owner has submitted a claim request. Review it in Basecamp and approve or reject.")}
    ${metaTable([
      ["Business", claim.businessName],
      ["Listing URL", claim.listingUrl],
      ["Contact", claim.contactName],
      ["Role", claim.role],
      ["Email", claim.email],
      ["Phone", claim.phone || "Not provided"],
      ["Website", claim.website || "Not provided"],
      ["Submitted", new Date(claim.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })],
      ["Claim ID", claim.id],
    ])}
    ${claim.requestedUpdates ? calloutBox(`${p("<strong>Requested updates</strong>")}<p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">${claim.requestedUpdates}</p>`) : ""}
    ${claim.verificationNotes ? calloutBox(`${p("<strong>Verification notes</strong>")}<p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">${claim.verificationNotes}</p>`) : ""}
    ${primaryButton("Review in Basecamp", reviewUrl)}
  `);

  const text = [
    `New listing claim: ${claim.businessName}`,
    "",
    `Business: ${claim.businessName}`,
    `Listing URL: ${claim.listingUrl}`,
    `Contact: ${claim.contactName}`,
    `Role: ${claim.role}`,
    `Email: ${claim.email}`,
    `Phone: ${claim.phone || "Not provided"}`,
    `Website: ${claim.website || "Not provided"}`,
    "",
    "Requested updates:",
    claim.requestedUpdates || "None provided",
    "",
    "Verification notes:",
    claim.verificationNotes || "None provided",
    "",
    `Claim ID: ${claim.id}`,
    "",
    `Review: ${reviewUrl}`,
  ].join("\n");

  await sendEmail(
    {
      from: emailFrom,
      to: adminEmail,
      subject: `New listing claim: ${claim.businessName}`,
      html,
      text,
    },
    resendApiKey,
  );
}

// ---------------------------------------------------------------------------
// 3. Claim Approved — sent to claimant when a reviewer approves the claim
// ---------------------------------------------------------------------------

export async function sendClaimApprovedEmail(claim: BusinessClaim): Promise<void> {
  const { resendApiKey, emailFrom } = requireEmailEnv();

  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://southernvt.com"}/partner-portal`;
  const listingUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://southernvt.com"}/businesses/${claim.businessSlug}`;

  const html = emailHtmlWrapper(`
    ${eyebrow("Claim Approved")}
    ${h1(`You're now the verified owner of ${claim.businessName}.`)}
    ${p(`Hi ${claim.contactName}, good news — we've reviewed and approved your claim for ${claim.businessName}. You now have owner access.`)}
    ${calloutBox(`
      ${p("<strong>What you can do now</strong>")}
      ${p("Log in to the Partner Portal to update your listing's description, website, phone, and more. Any changes you submit are reviewed by SouthernVT before going live.")}
    `)}
    ${primaryButton("Open Partner Portal", portalUrl)}
    ${metaTable([
      ["Business", claim.businessName],
      ["Your listing", listingUrl],
      ["Reference", claim.id],
    ])}
    ${divider()}
    ${p("A note on verification: SouthernVT's <em>Verified</em> badge is separate from ownership. Verification is earned through editorial review and cannot be purchased.")}
    ${p("If you have questions, reply to this email.")}
    ${sign()}
  `);

  const text = [
    `Hi ${claim.contactName},`,
    "",
    `Good news — your claim for ${claim.businessName} has been approved.`,
    "You now have owner access to your listing.",
    "",
    "Log in to the Partner Portal to update your listing's details.",
    "Any changes you submit are reviewed by SouthernVT before going live.",
    "",
    `Partner Portal: ${portalUrl}`,
    `Your listing: ${listingUrl}`,
    `Reference: ${claim.id}`,
    "",
    "Note: SouthernVT's Verified badge is separate from ownership.",
    "Verification is earned through editorial review and cannot be purchased.",
    "",
    "— The SouthernVT team",
  ].join("\n");

  await sendEmail(
    {
      from: emailFrom,
      to: claim.email,
      subject: `Your claim for ${claim.businessName} has been approved`,
      html,
      text,
    },
    resendApiKey,
  );
}

// ---------------------------------------------------------------------------
// 4. Claim Rejected — sent to claimant when a reviewer rejects the claim
// ---------------------------------------------------------------------------

export async function sendClaimRejectedEmail(claim: BusinessClaim): Promise<void> {
  const { resendApiKey, emailFrom } = requireEmailEnv();

  const html = emailHtmlWrapper(`
    ${eyebrow("Claim Request Update")}
    ${h1(`We weren't able to approve your claim for ${claim.businessName}.`)}
    ${p(`Hi ${claim.contactName}, thank you for submitting a claim request. After review, we weren't able to approve it at this time.`)}
    ${claim.reviewNotes ? calloutBox(`
      ${p("<strong>Notes from our review</strong>")}
      <p style="margin:0;font-size:14px;color:#334155;line-height:1.6;">${claim.reviewNotes}</p>
    `) : ""}
    ${p("If you believe this was made in error, or if you'd like to provide additional verification, reply to this email and we'll take another look.")}
    ${metaTable([
      ["Business", claim.businessName],
      ["Reference", claim.id],
    ])}
    ${divider()}
    ${p("The listing remains live on SouthernVT. You're always welcome to reapply with additional context.")}
    ${sign()}
  `);

  const text = [
    `Hi ${claim.contactName},`,
    "",
    `Thank you for submitting a claim for ${claim.businessName}.`,
    "After review, we weren't able to approve your request at this time.",
    "",
    ...(claim.reviewNotes ? ["Notes from our review:", claim.reviewNotes, ""] : []),
    "If you believe this was an error, or want to provide additional verification,",
    "reply to this email and we'll take another look.",
    "",
    `Business: ${claim.businessName}`,
    `Reference: ${claim.id}`,
    "",
    "The listing remains live on SouthernVT.",
    "",
    "— The SouthernVT team",
  ].join("\n");

  await sendEmail(
    {
      from: emailFrom,
      to: claim.email,
      subject: `Update on your claim for ${claim.businessName}`,
      html,
      text,
    },
    resendApiKey,
  );
}

// ---------------------------------------------------------------------------
// 5. Business Featured Introduction — sent when a listing is marked featured
// ---------------------------------------------------------------------------

export async function sendBusinessFeaturedEmail(
  listing: BusinessListing,
  ownerEmail: string,
  ownerName: string,
): Promise<void> {
  const { resendApiKey, emailFrom } = requireEmailEnv();

  const listingUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://southernvt.com"}/businesses/${listing.slug}`;
  const portalUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://southernvt.com"}/partner-portal`;

  const html = emailHtmlWrapper(`
    ${eyebrow("SouthernVT — Featured Listing")}
    ${h1(`${listing.name} is now featured on SouthernVT.`)}
    ${p(`Hi ${ownerName}, we're pleased to let you know that ${listing.name} has been selected as a featured listing on SouthernVT.`)}
    ${p("Featured listings appear in curated discovery surfaces across the site — including category highlights, seasonal collections, and our editorial picks.")}
    ${calloutBox(`
      ${p("<strong>What being featured means</strong>")}
      ${p("SouthernVT features a small number of businesses we think are genuinely worth knowing about in Southern Vermont. Featured status is based on editorial judgment — not payment.")}
    `)}
    ${primaryButton("View your listing", listingUrl)}
    ${metaTable([
      ["Business", listing.name],
      ["Category", listing.category],
      ["Town", listing.town],
      ["Listing", listingUrl],
    ])}
    ${divider()}
    ${p("If you've claimed your listing, you can keep it up to date through the Partner Portal.")}
    ${p("If you haven't claimed it yet, you can do so for free at the link below. Keeping your listing accurate helps visitors find and trust your business.")}
    ${primaryButton("Claim your listing", `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://southernvt.com"}/claim-listing?listing=${encodeURIComponent(listing.slug)}`)}
    ${sign()}
  `);

  const text = [
    `Hi ${ownerName},`,
    "",
    `${listing.name} has been selected as a featured listing on SouthernVT.`,
    "",
    "Featured listings appear in curated discovery surfaces across the site,",
    "including category highlights, seasonal collections, and our editorial picks.",
    "",
    "Featured status is based on editorial judgment — not payment.",
    "",
    `View your listing: ${listingUrl}`,
    "",
    "If you've claimed your listing, you can keep it current through the Partner Portal.",
    `Partner Portal: ${portalUrl}`,
    "",
    "If you haven't claimed it yet, you can do so for free:",
    `Claim: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://southernvt.com"}/claim-listing?listing=${encodeURIComponent(listing.slug)}`,
    "",
    "— The SouthernVT team",
  ].join("\n");

  await sendEmail(
    {
      from: emailFrom,
      to: ownerEmail,
      subject: `${listing.name} is now featured on SouthernVT`,
      html,
      text,
    },
    resendApiKey,
  );
}

// ---------------------------------------------------------------------------
// Convenience: send both claim submission emails in one call (used by API)
// ---------------------------------------------------------------------------

export async function sendClaimSubmissionEmails(claim: BusinessClaim): Promise<void> {
  await Promise.all([
    sendClaimAdminNotificationEmail(claim),
    sendClaimReceivedEmail(claim),
  ]);
}
