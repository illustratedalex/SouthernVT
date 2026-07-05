# Contact Email — Setup Guide

The SouthernVT contact form sends real email via [Resend](https://resend.com). This doc explains configuration, routing rules, and how to verify your sender domain.

---

## Required Environment Variables

| Variable | Description | Example |
|---|---|---|
| `RESEND_API_KEY` | Resend API key | `re_...` |
| `CONTACT_EMAIL_FROM` | Display name + address for outbound contact emails | `SouthernVT <hello@southernvt.com>` |

Set these in your `.env.local` for local development and in Vercel → Settings → Environment Variables for production.

---

## Resend Setup

1. Create a free account at [resend.com](https://resend.com).
2. Go to **API Keys** and create a key with _Sending Access_.
3. Copy the key and set it as `RESEND_API_KEY`.

---

## Sender Domain Verification

Resend requires a verified sending domain for production use (the Resend sandbox only allows sending to your own account email).

1. In Resend, go to **Domains** and click **Add Domain**.
2. Enter your domain (e.g. `southernvt.com`).
3. Add the DNS records Resend provides:
   - Two `TXT` records for DKIM
   - One `MX` record (for bounce tracking)
4. Click **Verify**. DNS propagation can take up to 24 hours.
5. Once verified, update `CONTACT_EMAIL_FROM` to use that domain:
   ```
   CONTACT_EMAIL_FROM="SouthernVT <hello@southernvt.com>"
   ```

---

## Email Routing Rules

The API route (`app/api/contact/route.ts`) inspects the submitted `reason` and routes to the appropriate destination inbox:

| Reason | Destination |
|---|---|
| General Question | hello@southernvt.com |
| Suggest a Place | hello@southernvt.com |
| Correct a Listing | hello@southernvt.com |
| Other | hello@southernvt.com |
| Claim a Business | partners@southernvt.com |
| Founding Partner Inquiry | partners@southernvt.com |
| Press / Media | press@southernvt.com |

Routing logic lives in `lib/email/contactEmail.ts` → `routeContactEmail()`.

---

## Spam Protection

A hidden honeypot field named `company` is included in the form. Real users never see or fill it. If the API route receives a non-empty `company` value, it returns `{ success: true }` without sending any email.

---

## Error Handling

- If `RESEND_API_KEY` is missing, the API returns `503 { success: false, error: "Email service is not configured." }`.
- If Resend returns an error, the API returns `500` with a user-safe message.
- Email failures are logged server-side (`console.error`) but never expose raw error details to the client.

---

## Vercel Environment Variables Needed

Set in Vercel → Settings → Environment Variables → Production:

```
RESEND_API_KEY=re_...
CONTACT_EMAIL_FROM=SouthernVT <hello@southernvt.com>
```
