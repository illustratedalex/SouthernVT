# Production Environment Checklist

This document lists every environment variable required before deploying SouthernVT to production on Vercel. Set these in **Vercel → Project → Settings → Environment Variables → Production**.

---

## Quick Status

The API Status page at `/basecamp/settings/api` reads real env vars at runtime and shows **Configured** or **Missing** for each service.

---

## Required Variables

### Core

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | `https://www.southernvt.com` | Canonical public URL |
| `NEXT_PUBLIC_SITE_URL` | `https://southernvt.com` | Used in email templates |

---

### Supabase

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` | From Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Public anon key — safe for client |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | **Server-only.** Never expose to client. |
| `NEXT_PUBLIC_REPOSITORY_MODE` | `supabase` | Switches from mock data to live Supabase. Set to `supabase` in production. |

**Required Supabase setup before going live:**
1. Apply all migrations in `supabase/migrations/` to your production project.
2. Enable Email auth in Supabase Auth settings.
3. Set Site URL and Redirect URLs in Supabase Auth → URL Configuration.

---

### Auth / Basecamp

| Variable | Value | Notes |
|---|---|---|
| `BASECAMP_ADMIN_EMAILS` | `admin@southernvt.com` | Comma-separated list of admin email addresses that can access Basecamp |

---

### Email — Resend

| Variable | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | `re_...` | From resend.com API Keys |
| `CONTACT_EMAIL_FROM` | `SouthernVT <hello@southernvt.com>` | Sender for contact form emails |
| `CLAIMS_EMAIL_FROM` | `SouthernVT <partners@southernvt.com>` | Sender for claim notification emails |
| `CLAIMS_ADMIN_EMAIL` | `partners@southernvt.com` | Inbox that receives new claim notifications |

**Required Resend setup before going live:**
1. Verify `southernvt.com` as a sending domain in Resend → Domains.
2. Add the DNS records Resend provides (2× TXT for DKIM + 1× MX).
3. Wait for DNS propagation (up to 24 hours).

See `docs/contact-email.md` for full Resend setup guide.

---

### Analytics

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | `xxxxxxxxxx` | Microsoft Clarity project ID |

Vercel Analytics is automatically enabled on Vercel — no env var needed.

---

### AI

| Variable | Value | Notes |
|---|---|---|
| `OPENAI_API_KEY` | `sk-...` | OpenAI API key for AI Concierge (gpt-4o) |

---

### Stripe (Optional — for paid listing upgrades)

| Variable | Value | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Server-only. Never expose to client. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Public key — safe for client |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook signing secret from Stripe Dashboard |

Stripe is not required for launch. Leave these blank until paid upgrades are implemented.

---

### Mapbox (Optional)

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.eyJ1...` | Mapbox public access token |

---

## Vercel Setup Steps

1. Go to **Vercel → Project → Settings → Environment Variables**.
2. Add each variable above under the **Production** scope.
3. For variables also needed in Preview/Development, enable those scopes too.
4. After adding all variables, trigger a new deployment.

---

## Pre-Launch Checklist

- [ ] All required Supabase variables set
- [ ] Supabase migrations applied to production project
- [ ] `NEXT_PUBLIC_REPOSITORY_MODE=supabase` set in Vercel Production
- [ ] Resend API key set
- [ ] `southernvt.com` verified as Resend sending domain
- [ ] `CONTACT_EMAIL_FROM` and `CLAIMS_EMAIL_FROM` set
- [ ] `BASECAMP_ADMIN_EMAILS` set
- [ ] Google Analytics Measurement ID set
- [ ] Microsoft Clarity Project ID set
- [ ] OpenAI API key set
- [ ] Custom domain pointing to Vercel deployment
- [ ] Supabase Auth → URL Configuration updated with production domain
- [ ] Privacy Policy reviewed by legal counsel
- [ ] Terms of Service written and reviewed

---

## Notes

- **Never commit real secrets to git.** Use `.env.local` locally (git-ignored).
- **`SUPABASE_SERVICE_ROLE_KEY` and `STRIPE_SECRET_KEY`** are server-only. Set them in Vercel but never prefix with `NEXT_PUBLIC_`.
- The `/basecamp/settings/api` page reads env vars at request time and shows live **Configured / Missing** status for each service.
