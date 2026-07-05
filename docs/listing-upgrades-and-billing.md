# Listing Upgrades and Billing

SouthernVT keeps listing upgrades structurally ready for beta, but intentionally conservative so businesses cannot accidentally purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.

---

## Current Status

| Area | Status |
|---|---|
| Upgrade page | Live |
| Checkout route | Validation-only beta stub |
| Webhook route | Staged placeholder |
| Partner portal billing section | Live |
| Basecamp subscriptions | Live / manual records |
| Stripe production launch | Not yet enabled |

---

## Plans

### Free Basic Listing
- Cost: $0
- Current default listing state
- No checkout required

### Enhanced Listing
- $25/month
- $250/year
- Visibility upgrade only

### Founding Partner
- $50/month
- $500/year
- Early-supporter recognition during beta

### Future Premium
- Disabled for beta launch
- Reserved for later release

---

## Trust Policy

This sentence appears on upgrade pages and checkout-related surfaces:

> Paid listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.

Founding Partner support is also editorially separate and does not influence verification or rankings.

---

## Required Stripe Environment Variables

Set these in Vercel before attempting any real checkout launch:

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

If any are missing, the upgrade page shows:

> Online checkout is coming soon. Contact partners@southernvt.com to activate this plan.

---

## Vercel Setup

1. Open **Vercel → Project → Settings → Environment Variables**
2. Add the Stripe variables above for the **Production** environment
3. Redeploy the app
4. Verify the upgrade page and Basecamp subscription page show the expected readiness copy

---

## Webhook Setup

Point your Stripe webhook endpoint to:

`/api/billing/webhook`

For future live billing, configure Stripe to listen for invoice and subscription events. The current route is a beta stub and does not yet process actual Stripe signatures.

---

## Checkout Route

`POST /api/billing/create-checkout-session`

Request body:

```json
{
  "listingSlug": "grafton-inn",
  "planId": "enhanced_monthly"
}
```

Validation performed:
- listing slug exists
- plan id exists
- plan is active
- plan is purchasable
- plan does not reference verification or recommendation products

If Stripe env vars are missing, the route returns a 503 with the same coming-soon message shown on the upgrade page.

---

## What Is Live vs Placeholder

### Live
- Upgrade page copy
- Trust policy
- Partner portal upgrade messaging
- Basecamp subscription summaries

### Placeholder
- Actual Stripe session creation
- Stripe signature verification
- Automated billing sync
- Subscription lifecycle management

---

## Manual Records

Basecamp subscriptions currently use manual/mocked records for the founding partner list. This is intentional until Stripe is launched. The page clearly labels those records as manual.

---

## Manual Steps Still Needed

- Add Stripe keys in Vercel
- Create live Stripe products/prices
- Replace the checkout stub with real session creation
- Replace the webhook stub with signed event processing
- Decide how subscription records will sync into Supabase
