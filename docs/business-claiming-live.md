# Business Claiming (Live Workflow)

SouthernVT supports a real business owner claim workflow backed by Supabase.

---

## Current Status (July 2026)

| Component | Status |
|---|---|
| Claim form at `/claim-listing?listing=<slug>` | ✅ Production-ready |
| Supabase persistence (`business_claims`) | ✅ Production-ready — requires Supabase env vars |
| Admin notification email on submission | ✅ Production-ready — requires Resend env vars |
| Basecamp claims review queue | ✅ Production-ready — reads live Supabase |
| Approve / reject with email notification | ✅ Production-ready |
| Owner auth (login, signup) | ✅ Routes exist, requires Supabase Auth setup |
| Owner dashboard — basic edit requests | ✅ Works when auth + approval complete |
| Owner dashboard — photos, events, deals | ⏳ Coming soon (placeholder shown) |
| Auto-link owner account on approval | ⚠️ Works only if claimant has already signed up (see below) |

---

## How Claims Are Submitted

1. A business owner opens `/claim-listing?listing=<listing-slug>` or clicks "Claim this listing" on any listing page.
2. They submit:
   - business name
   - listing URL
   - contact name
   - role at business
   - email
   - phone (optional)
   - website (optional)
   - requested updates (optional)
   - verification notes (optional)
3. SouthernVT saves the request to `business_claims` with `status = pending`.
4. Emails are sent:
   - admin notification to `CLAIMS_ADMIN_EMAIL`
   - confirmation to the submitter
5. A hidden honeypot field is validated server-side to block bot spam.
6. The owner sees: **"Your claim request has been submitted. SouthernVT will review it before granting access."**

Claims are never auto-approved. Claiming is free.

### If Supabase is not configured

If `SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_URL` are missing, the API returns `503` and the form displays:

> "Claim submissions are not enabled yet. Please email partners@southernvt.com."

It does not silently mock success.

---

## Admin Review Process

`/basecamp/claims` reads pending claim records from Supabase when Supabase is configured. Falls back to mock data for local development.

Actions:
- **Approve** — marks claim `approved`, creates `business_listing_owners` row (if owner account exists), sends approval email
- **Reject** — marks claim `rejected`, sends rejection email, listing remains unclaimed

---

## Owner Dashboard Access Limitation (Important)

When a claim is approved, SouthernVT attempts to find a Supabase auth account matching the claimant's email and create a `business_listing_owners` row. 

**If the claimant has not yet signed up**, the system logs a warning and proceeds — the claim is still marked approved and the email is sent — but **owner dashboard access is not automatically granted**.

Manual resolution:
1. Ask the claimant to sign up at `/signup`
2. In the Supabase Dashboard → Table Editor → `business_listing_owners`, manually insert a row with their `user_id` and the `business_listing_id`

This will be replaced by an invite-by-email flow in a future sprint.

---

## Owner Access Routes

| Route | Purpose |
|---|---|
| `/login` | Email/password or magic link login |
| `/signup` | Create a new account |
| `/logout` | Sign out |
| `/partner-portal` | Approved owner dashboard |
| `/claim-listing?listing=<slug>` | Submit a claim |

### Partner Portal Behavior

- **Not logged in**: Login/signup prompt + "coming online" notice with `partners@southernvt.com`
- **Logged in, no approved listings**: Pending notice, contact email
- **Logged in with approved listings**: Edit request form, locked fields note, photos/events/deals placeholders

---

## What Owners Can Edit (via edit request)

Owners submit draft changes for:
- description
- website
- phone
- owner message

All changes are stored in `business_listing_edit_requests` and reviewed by SouthernVT before going live.

Photos, events, and deals management are planned for the next sprint.

---

## What Owners Cannot Edit

- Verified by SouthernVT badge
- SouthernVT Recommended status
- Editorial review status
- Coverage region
- Editorial ranking

---

## Verification Policy

Verification cannot be bought or requested. It is granted by the SouthernVT editorial team only. No payments or subscriptions are involved in the claim workflow.

---

## Required Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Required for claim persistence and Basecamp review |
| `RESEND_API_KEY` | Required for claim emails |
| `CLAIMS_EMAIL_FROM` | Sender address for claim emails |
| `CLAIMS_ADMIN_EMAIL` | Admin inbox that receives new claim notifications |

---

## Required Supabase Migrations

Apply in order before enabling live claims:

```
supabase/migrations/202606280001_cms_foundation.sql
supabase/migrations/202606290001_trailhead_core_infra.sql
supabase/migrations/202606290002_schema_compat_views.sql
supabase/migrations/202607050001_business_claiming_live.sql
supabase/migrations/202607050002_claim_listing_fields.sql
```

See `docs/supabase-live-mode.md` for full migration instructions.
