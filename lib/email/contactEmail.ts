import "server-only";
import { sendEmail } from "./sender";
import {
  emailHtmlWrapper,
  h1,
  p,
  eyebrow,
  divider,
  calloutBox,
  metaTable,
} from "./emailTemplates";

export type ContactEmailInput = {
  name: string;
  email: string;
  reason: string;
  message: string;
  submittedAt: string;
};

function requireContactEmailEnv() {
  const resendApiKey = process.env.RESEND_API_KEY ?? "";
  const emailFrom = process.env.CONTACT_EMAIL_FROM ?? "";

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  if (!emailFrom) {
    throw new Error("CONTACT_EMAIL_FROM is not configured.");
  }

  return { resendApiKey, emailFrom };
}

const helloReasons = ["General Question", "Suggest a Place", "Correct a Listing", "Other"];
const partnerReasons = ["Founding Partner Inquiry", "Claim a Business"];

function destinationForReason(reason: string): string {
  if (partnerReasons.includes(reason)) return "partners@southernvt.com";
  if (reason === "Press / Media") return "press@southernvt.com";
  if (helloReasons.includes(reason)) return "hello@southernvt.com";
  return "hello@southernvt.com";
}

export function isContactEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL_FROM);
}

export async function sendContactEmail(input: ContactEmailInput): Promise<void> {
  const { resendApiKey, emailFrom } = requireContactEmailEnv();
  const to = destinationForReason(input.reason);

  const escapedMessage = input.message
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  const html = emailHtmlWrapper(`
    ${eyebrow("Contact Form — southernvt.com/contact")}
    ${h1(`New message: ${input.reason}`)}
    ${metaTable([
      ["From", input.name],
      ["Email", input.email],
      ["Reason", input.reason],
      ["Submitted", new Date(input.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" })],
      ["Source", "southernvt.com/contact"],
    ])}
    ${divider()}
    ${calloutBox(`
      <p style="margin:0 0 8px;font-size:11px;font-weight:bold;letter-spacing:0.18em;text-transform:uppercase;color:#7a6a55;">Message</p>
      <p style="margin:0;font-size:14px;color:#334155;line-height:1.7;">${escapedMessage}</p>
    `)}
    ${divider()}
    ${p(`Reply directly to this email to respond to ${input.name} at ${input.email}.`)}
  `);

  const text = [
    `New contact form message — southernvt.com/contact`,
    "",
    `From: ${input.name}`,
    `Email: ${input.email}`,
    `Reason: ${input.reason}`,
    `Submitted: ${new Date(input.submittedAt).toLocaleString("en-US", { timeZone: "America/New_York" })}`,
    `Source: southernvt.com/contact`,
    "",
    "Message:",
    "----------",
    input.message,
    "----------",
    "",
    `Reply to this email to respond to ${input.name}.`,
  ].join("\n");

  await sendEmail(
    {
      from: emailFrom,
      to,
      subject: `SouthernVT Contact: ${input.reason}`,
      html,
      text,
    },
    resendApiKey,
  );
}
