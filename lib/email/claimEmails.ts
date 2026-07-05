import "server-only";
import type { BusinessClaim } from "@/types/Claim";

type ResendEmailPayload = {
  from: string;
  to: string | string[];
  subject: string;
  text: string;
};

function requireEmailEnv() {
  const resendApiKey = process.env.RESEND_API_KEY ?? "";
  const claimsEmailFrom = process.env.CLAIMS_EMAIL_FROM ?? "";
  const claimsAdminEmail = process.env.CLAIMS_ADMIN_EMAIL ?? "";

  if (!resendApiKey || !claimsEmailFrom || !claimsAdminEmail) {
    throw new Error("Claim email notifications require RESEND_API_KEY, CLAIMS_EMAIL_FROM, and CLAIMS_ADMIN_EMAIL.");
  }

  return { resendApiKey, claimsEmailFrom, claimsAdminEmail };
}

async function sendResendEmail(payload: ResendEmailPayload, apiKey: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Unable to send claim notification email: ${body || response.statusText}`);
  }
}

export async function sendClaimSubmissionEmails(claim: BusinessClaim) {
  const { resendApiKey, claimsEmailFrom, claimsAdminEmail } = requireEmailEnv();
  const subjectSuffix = `${claim.businessName} (${claim.businessSlug})`;

  const adminBody = [
    "A new SouthernVT listing claim was submitted.",
    "",
    `Business: ${claim.businessName}`,
    `Listing URL: ${claim.listingUrl}`,
    `Contact Name: ${claim.contactName}`,
    `Role: ${claim.role}`,
    `Email: ${claim.email}`,
    `Phone: ${claim.phone || "Not provided"}`,
    `Website: ${claim.website || "Not provided"}`,
    "",
    "Requested Updates:",
    claim.requestedUpdates || "None provided",
    "",
    "Verification Notes:",
    claim.verificationNotes || "None provided",
    "",
    `Claim ID: ${claim.id}`,
  ].join("\n");

  const claimantBody = [
    `Hi ${claim.contactName},`,
    "",
    `Thanks for submitting your claim request for ${claim.businessName}.`,
    "Your request has been received and is now pending review.",
    "",
    "Claiming is currently free.",
    "SouthernVT will manually review your request before granting listing access.",
    "",
    `Listing: ${claim.listingUrl}`,
    `Claim reference: ${claim.id}`,
    "",
    "If you need to add context, reply to this email.",
    "",
    "— SouthernVT",
  ].join("\n");

  await Promise.all([
    sendResendEmail(
      {
        from: claimsEmailFrom,
        to: claimsAdminEmail,
        subject: `New listing claim submitted: ${subjectSuffix}`,
        text: adminBody,
      },
      resendApiKey,
    ),
    sendResendEmail(
      {
        from: claimsEmailFrom,
        to: claim.email,
        subject: `We received your listing claim: ${claim.businessName}`,
        text: claimantBody,
      },
      resendApiKey,
    ),
  ]);
}
