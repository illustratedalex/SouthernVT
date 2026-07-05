import "server-only";

export type EmailPayload = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  text: string;
};

export type EmailEnv = {
  resendApiKey: string;
  emailFrom: string;
  adminEmail: string;
};

export function requireEmailEnv(): EmailEnv {
  const resendApiKey = process.env.RESEND_API_KEY ?? "";
  const emailFrom = process.env.CLAIMS_EMAIL_FROM ?? "";
  const adminEmail = process.env.CLAIMS_ADMIN_EMAIL ?? "";

  if (!resendApiKey || !emailFrom || !adminEmail) {
    throw new Error(
      "Email requires RESEND_API_KEY, CLAIMS_EMAIL_FROM, and CLAIMS_ADMIN_EMAIL environment variables.",
    );
  }

  return { resendApiKey, emailFrom, adminEmail };
}

export async function sendEmail(payload: EmailPayload, apiKey: string): Promise<void> {
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
    throw new Error(`Email send failed: ${body || response.statusText}`);
  }
}
