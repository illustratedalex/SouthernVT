# Stripe Production Audit

**Date:** 2025-07-08
**Repo:** SouthernVT / `develop`
**Status:** ⚠️ Not production-ready — Stripe is fully stubbed

---

## Summary

SouthernVT **cannot currently accept live payments.** All Stripe routes exist as stubs that validate inputs and return safe error messages, but no Stripe SDK calls are made and no real checkout sessions, customers, subscriptions, or webhooks are processed.

---

## Audit Results

### 1. Stripe SDK Integration

| Item | Status |
|---|---|
| `stripe` npm package installed | ❌ Not installed — not in `package.json` |
| `STRIPE_SECRET_KEY` used in SDK call | ❌ Env var checked but never passed to Stripe |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` loaded on client | ❌ Env var checked but never used in JS |
| `STRIPE_WEBHOOK_SECRET` used for signature verification | ❌ Env var checked but never used |

---

### 2. Checkout Session Route (`/api/billing/create-checkout-session`)

| Step | Status |
|---|---|
| Validates `listingSlug` and `planId` | ✅ Done |
| Confirms listing exists | ✅ Done |
| Confirms plan is purchasable | ✅ Done |
| Blocks verification/recommendation plans | ✅ Done |
| Returns 503 if env missing | ✅ Done |
| **Creates real Stripe checkout session** | ❌ NOT IMPLEMENTED — returns `checkoutReady: false` |
| Returns `session.url` for redirect | ❌ NOT IMPLEMENTED |

**Current behavior:** Even with all env vars set, route returns `{ success: true, checkoutReady: false }`. No Stripe SDK call is made.

---

### 3. Webhook Route (`/api/billing/webhook`)

| Step | Status |
|---|---|
| Route exists | ✅ Yes |
| Logs raw body | ✅ Yes |
| Verifies Stripe signature with `STRIPE_WEBHOOK_SECRET` | ❌ NOT IMPLEMENTED |
| Parses event type | ❌ NOT IMPLEMENTED |
| Handles `checkout.session.completed` | ❌ NOT IMPLEMENTED |
| Handles `customer.subscription.updated` | ❌ NOT IMPLEMENTED |
| Handles `customer.subscription.deleted` | ❌ NOT IMPLEMENTED |
| Activates listing on payment | ❌ NOT IMPLEMENTED |
| Updates listing status in database | ❌ NOT IMPLEMENTED |

**Current behavior:** Returns `{ received: true, processed: false }` if env is set.

---

### 4. Subscription Lifecycle

| Action | Status |
|---|---|
| Create subscription | ❌ Not implemented |
| Activate listing after payment | ❌ Not implemented |
| Upgrade listing tier | ❌ Not implemented |
| Cancel subscription | ❌ Not implemented |
| Renew subscription | ❌ Not implemented |
| Downgrade on cancellation | ❌ Not implemented |

---

### 5. Customer Creation

| Action | Status |
|---|---|
| Create Stripe customer | ❌ Not implemented |
| Store Stripe customer ID on listing/owner | ❌ Not implemented |
| Link customer to claimed listing | ❌ Not implemented |

---

### 6. Upgrade Page (`/businesses/[slug]/upgrade`)

| Item | Status |
|---|---|
| Page renders correctly | ✅ Yes |
| Shows "coming soon" when Stripe not configured | ✅ Yes |
| Redirects place slugs back to place page | ✅ Yes |
| Trust language displayed | ✅ Yes |
| "Claim this listing" CTA works | ✅ Yes |
| **Upgrade button triggers real checkout** | ❌ No — no checkout button exists yet |

---

### 7. Partner Portal Billing (`/partner-portal`)

| Item | Status |
|---|---|
| Shows current plan label | ✅ Yes |
| Shows "coming soon" when Stripe not configured | ✅ Yes |
| Directs to `partners@southernvt.com` as fallback | ✅ Yes |
| Upgrade button triggers real checkout | ❌ Not implemented |

---

### 8. Basecamp Subscriptions (`/basecamp/subscriptions`)

| Item | Status |
|---|---|
| Page renders | ✅ Yes |
| Shows MRR estimate from Founding Partner records | ✅ Yes |
| Shows Stripe status indicator | ✅ Yes |
| Live subscription records from Stripe | ❌ Not connected |
| Subscription management actions | ❌ Not implemented |

---

### 9. Environment Variables

| Variable | Documented in `.env.example` | Required for live payments |
|---|---|---|
| `STRIPE_SECRET_KEY` | ✅ Yes | ✅ Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Yes | ✅ Yes |
| `STRIPE_WEBHOOK_SECRET` | ✅ Yes | ✅ Yes |

All three are documented correctly. None need to be set until payments go live.

---

## Readiness Checklist

| Check | Status |
|---|---|
| ✓ Can create checkout session | ❌ Not wired |
| ✓ Can complete payment | ❌ Not wired |
| ✓ Can receive webhook | ❌ Stub only |
| ✓ Can activate listing | ❌ Not wired |
| ✓ Can upgrade listing | ❌ Not wired |
| ✓ Can cancel subscription | ❌ Not wired |
| ✓ Can renew subscription | ❌ Not wired |

---

## Overall Readiness Score

**Stripe: 10/100**

The scaffolding is clean and the guard rails are correct (trust language, env checks, 503 fallback, editorial separation), but zero real Stripe functionality is implemented.

---

## What Remains to Enable Live Payments

### Phase 1: Install and Wire Stripe SDK (est. 1–2 days)

1. `npm install stripe` — add Stripe Node SDK
2. Create `lib/stripe/client.ts` — initialize `Stripe(process.env.STRIPE_SECRET_KEY)` server-side singleton
3. Update `/api/billing/create-checkout-session`:
   - Call `stripe.checkout.sessions.create()` with `mode: "subscription"`
   - Set `success_url` and `cancel_url`
   - Create or retrieve Stripe customer
   - Return `session.url` for redirect
4. Update upgrade page — add "Upgrade" button that POSTs to checkout route and redirects to `session.url`

### Phase 2: Webhook Processing (est. 1 day)

5. Update `/api/billing/webhook`:
   - Verify signature with `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`
   - Handle `checkout.session.completed` → activate listing in database
   - Handle `customer.subscription.updated` → update listing status
   - Handle `customer.subscription.deleted` → downgrade listing to basic

### Phase 3: Customer & Subscription Management (est. 1 day)

6. Store `stripeCustomerId` and `stripeSubscriptionId` on claimed listing record
7. Add cancel/manage portal link via `stripe.billingPortal.sessions.create()`
8. Wire Basecamp subscriptions to live Stripe data

### Phase 4: Testing and Verification (est. 0.5 days)

9. Test with Stripe test keys and test card `4242 4242 4242 4242`
10. Verify webhook delivery via Stripe CLI or Stripe dashboard
11. Confirm activation, upgrade, and cancellation flows end-to-end

**Total estimated time to enable live payments: ~4 days of focused work**

---

## Current Safe State

The beta can run indefinitely without Stripe configured. Every billing surface degrades gracefully to:
- "Coming soon" message
- `partners@southernvt.com` contact fallback
- 503 response from API routes (does not crash the site)

No action is required before Stripe is intentionally enabled.

---

*Build status: ✅ Passing — `npm run lint`, `npm run typecheck`, `npm run build` all clean.*
