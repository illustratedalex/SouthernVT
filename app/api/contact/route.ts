import { NextResponse } from "next/server";
import { isContactEmailConfigured, sendContactEmail } from "@/lib/email/contactEmail";

type ContactPayload = {
  name?: string;
  email?: string;
  reason?: string;
  message?: string;
  company?: string; // honeypot
};

const VALID_REASONS = [
  "General Question",
  "Suggest a Place",
  "Correct a Listing",
  "Claim a Business",
  "Founding Partner Inquiry",
  "Press / Media",
  "Other",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const payload = (await request.json()) as ContactPayload;

  // Honeypot — silently succeed without sending
  if ((payload.company ?? "").trim()) {
    return NextResponse.json({ success: true });
  }

  // Service guard — fail loud if email is unconfigured
  if (!isContactEmailConfigured()) {
    return NextResponse.json(
      { success: false, error: "Email service is not configured." },
      { status: 503 },
    );
  }

  // Validation
  const errors: string[] = [];

  if (!payload.name?.trim()) errors.push("Name is required.");
  if (!payload.email?.trim() || !EMAIL_RE.test(payload.email)) errors.push("A valid email address is required.");
  if (!payload.reason?.trim() || !VALID_REASONS.includes(payload.reason)) errors.push("A valid reason is required.");
  if (!payload.message?.trim()) errors.push("Message is required.");
  if ((payload.message?.length ?? 0) > 5000) errors.push("Message must be 5000 characters or fewer.");

  if (errors.length > 0) {
    return NextResponse.json({ success: false, error: errors.join(" ") }, { status: 400 });
  }

  try {
    await sendContactEmail({
      name: payload.name!.trim(),
      email: payload.email!.trim().toLowerCase(),
      reason: payload.reason!.trim(),
      message: payload.message!.trim(),
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send message.";
    console.error("Contact form email failed:", message);
    return NextResponse.json(
      { success: false, error: "We couldn't send your message right now. Please try again or email us directly." },
      { status: 500 },
    );
  }
}
