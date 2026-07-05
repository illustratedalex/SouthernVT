# Email Notifications Readiness

This document defines which SouthernVT workflows send email, where messages are routed, and which environment variables are required.

## Workflows and routing

| Workflow | Trigger | Destination | Notes |
|---|---|---|---|
| Contact form (`/contact`) | `POST /api/contact` | Route by reason:<br>- General/Suggest/Correct/Other → `GENERAL_EMAIL_TO` (default `hello@southernvt.com`)<br>- Claim a Business / Founding Partner Inquiry → `PARTNERS_EMAIL_TO` (default `partners@southernvt.com`)<br>- Press / Media → `PRESS_EMAIL_TO` (default `press@southernvt.com`) | Subject: `SouthernVT Contact: {reason}` |
| Claim form (`/claim-listing`) | `POST /api/claims` | Admin notification to `PARTNERS_EMAIL_TO` (fallback `CLAIMS_ADMIN_EMAIL`) + claimant confirmation | Admin subject: `New SouthernVT Claim Request: {businessName}` |
| Founding Partner interest (`/founding-partners`) | CTA click | `mailto:partners@southernvt.com` and contact form route | CTA now points to contact form prefilled reason and direct email fallback |
| Listing upgrade fallback (`/businesses/[slug]/upgrade`) | Stripe not configured | `mailto:partners@southernvt.com` | Explicit fallback message with clickable email link |

## Required environment variables

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Resend API authentication |
| `CONTACT_EMAIL_FROM` | Yes | Sender identity for contact emails |
| `CLAIMS_EMAIL_FROM` | Yes | Sender identity for claim workflow emails |
| `PARTNERS_EMAIL_TO` | Yes (recommended) | Primary partner/claims destination inbox |
| `GENERAL_EMAIL_TO` | Yes (recommended) | Public general/contact destination inbox |
| `PRESS_EMAIL_TO` | Yes (recommended) | Press/media destination inbox |
| `CLAIMS_ADMIN_EMAIL` | Optional compatibility fallback | Used only if `PARTNERS_EMAIL_TO` is not set |

## Fail-safe behavior

- If `RESEND_API_KEY` is missing for contact flow:
  - API returns `503` with `Email service is not configured.`
  - UI shows the returned error and does not fake success.
- If claim emails are not configured:
  - `POST /api/claims` returns `503` with a clear message to email `partners@southernvt.com`.
  - UI surfaces the error and does not fake success.

## Resend sender/domain verification

1. Add and verify your sending domain in Resend (`southernvt.com`).
2. Configure DNS records (DKIM + tracking MX as provided by Resend).
3. Set sender addresses in env:
   - `CONTACT_EMAIL_FROM="SouthernVT <hello@southernvt.com>"`
   - `CLAIMS_EMAIL_FROM="SouthernVT <partners@southernvt.com>"`

## Test checklist

1. **Contact form routing**
   - Submit `General Question` and verify destination is general inbox.
   - Submit `Founding Partner Inquiry` and verify destination is partners inbox.
   - Submit `Press / Media` and verify destination is press inbox.
2. **Claim form notification**
   - Submit claim and verify:
     - admin receives `New SouthernVT Claim Request: {businessName}`
     - claimant receives confirmation email
     - admin email includes claimant name/email/phone/role/listing/proof message.
3. **Founding Partner CTA**
   - Verify CTA opens contact form with founding partner reason or mailto fallback to partners inbox.
4. **Upgrade fallback**
   - With Stripe env missing, verify mailto link to `partners@southernvt.com` appears and is clickable.
