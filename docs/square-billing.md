# Square Billing — SouthernVT

SouthernVT uses **Square** as its billing provider for business listing upgrades and Founding Partner subscriptions.

Square was chosen because:
- It integrates well with local and small business workflows
- Supports subscription billing via the Subscriptions API
- Provides hosted payment links without requiring custom card UI
- Aligns with the kind of local business owners SouthernVT serves

---

## Trust Policy

> Paid business listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.

This language appears on the upgrade page, partner portal, and checkout metadata. It is not negotiable and is not removed for any tier.

- Places (trails, parks, waterfalls, covered bridges, scenic drives) **cannot be upgraded**.
- Only business listings may purchase enhanced listing tools.
- Verification and SouthernVT Recommended are editorial-only — they cannot be purchased.

---

## Plans

| Plan | Monthly | Yearly |
|---|---|---|
| Free Basic Listing | $0 | — |
| Enhanced Listing | $25/month | $250/year |
| Founding Partner | $50/month | $500/year |
| Future Premium | Disabled | Disabled |

Founding Partners may be approved via application/conversation rather than instant self-service checkout. This is intentional — the Founding Partner relationship is meant to be personal, not transactional.

---

## Required Environment Variables

Set these in Vercel before enabling live Square checkout:

```
SQUARE_ACCESS_TOKEN=               # Server-side only — never expose to client
SQUARE_LOCATION_ID=                # Your Square seller location ID
SQUARE_ENVIRONMENT=sandbox         # "sandbox" or "production"
SQUARE_WEBHOOK_SIGNATURE_KEY=      # From Square Developer Dashboard webhook config
SQUARE_PLAN_ID_ENHANCED=           # Catalog subscription plan ID for Enhanced Listing
SQUARE_PLAN_VARIATION_ID_ENHANCED_MONTHLY=
SQUARE_PLAN_VARIATION_ID_ENHANCED_YEARLY=
SQUARE_PLAN_ID_FOUNDING_PARTNER=
SQUARE_PLAN_VARIATION_ID_FOUNDING_PARTNER_MONTHLY=
SQUARE_PLAN_VARIATION_ID_FOUNDING_PARTNER_YEARLY=
```

`SQUARE_ACCESS_TOKEN` is never exposed to the client. All checkout creation happens server-side via `/api/billing/create-square-checkout`.

---

## Square Developer Dashboard Setup

### 1. Create a Square Developer Account

Go to [developer.squareup.com](https://developer.squareup.com) and create a developer application.

### 2. Get Access Token and Location ID

- **Sandbox:** Use the sandbox access token from the Credentials tab.
- **Production:** Use the production access token. Store it securely — never commit it.
- **Location ID:** From your Square dashboard under Locations. Copy the location ID.

### 3. Create Subscription Plans in the Catalog

Use the Square Catalog API or Dashboard to create subscription plans:

**Enhanced Listing**
- Monthly variation: $25/month
- Annual variation: $250/year

**Founding Partner**
- Monthly variation: $50/month
- Annual variation: $500/year

After creating plans, copy the **Plan IDs** and **Plan Variation IDs** into your `.env.local` / Vercel environment variables.

### 4. Configure Webhook Endpoint

In the Square Developer Dashboard:

1. Go to **Webhooks → Subscribe to events**
2. Set the endpoint URL to:
   ```
   https://www.southernvt.com/api/billing/square-webhook
   ```
3. Subscribe to these events:
   - `payment.updated`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `invoice.payment_made`
   - `invoice.payment_failed`
4. Copy the **Signature Key** and set it as `SQUARE_WEBHOOK_SIGNATURE_KEY`

---

## Checkout Flow

1. User visits `/businesses/[slug]/upgrade`
2. Selects a plan (Enhanced or Founding Partner)
3. Clicks **Continue with Square** — triggers `POST /api/billing/create-square-checkout`
4. API creates a Square-hosted payment link and returns `checkoutUrl`
5. User is redirected to Square's hosted checkout page
6. On success, Square redirects to `/businesses/[slug]/upgrade?checkout=success`
7. Square fires a `subscription.created` webhook to `/api/billing/square-webhook`

---

## Webhook Processing (TODO: persistence layer)

The webhook route at `/api/billing/square-webhook` currently:
- Verifies the Square signature if `SQUARE_WEBHOOK_SIGNATURE_KEY` is set
- Logs and acknowledges all subscribed events
- Returns 200 for handled and ignored events

**Persistence hooks need to be wired** before webhooks fully activate listings:
- `subscription.created` → activate listing in database
- `subscription.canceled` → downgrade listing to basic_free
- `invoice.payment_failed` → flag for manual review

These TODOs are marked in the webhook route source.

---

## Sandbox Testing

1. Set `SQUARE_ENVIRONMENT=sandbox` in `.env.local`
2. Use the sandbox access token and a sandbox location ID
3. Use Square test payment cards (e.g., `4111 1111 1111 1111`)
4. Test webhook delivery with the Square CLI:
   ```
   square webhooks trigger <event-type> --url http://localhost:3000/api/billing/square-webhook
   ```

---

## Manual Invoice Fallback

If Square is not configured (`SQUARE_ACCESS_TOKEN` or `SQUARE_LOCATION_ID` missing):
- The upgrade page shows a friendly "coming soon" notice
- A `mailto:partners@southernvt.com` CTA is displayed instead of the checkout button
- The API returns a 503 with a human-readable message

Businesses can request manual invoicing by emailing `partners@southernvt.com`.

---

## Deprecated: Stripe

Stripe was previously scaffolded as the billing provider but was never fully implemented. As of July 2025, Square is the primary billing provider.

The former Stripe routes now return `410 Gone`:
- `POST /api/billing/create-checkout-session` → use `/api/billing/create-square-checkout`
- `POST /api/billing/webhook` → use `/api/billing/square-webhook`
