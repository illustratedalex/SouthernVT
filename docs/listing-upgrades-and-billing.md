# Listing Upgrades and Billing

SouthernVT keeps business listing upgrades structurally ready for launch, but intentionally conservative so businesses cannot accidentally purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.

---

## Billing Provider

**Square** is the billing provider for SouthernVT.

Stripe was previously scaffolded but was never launched. All Stripe routes now return `410 Gone` and direct callers to the Square equivalents.

See `docs/square-billing.md` for full Square setup documentation.

---

## Current Status

| Area | Status |
|---|---|
| Upgrade page | Live — Square checkout button wired |
| Square checkout route | `POST /api/billing/create-square-checkout` |
| Square webhook route | `POST /api/billing/square-webhook` — signature verified, event parsing staged |
| Partner portal billing section | Live — Square wording |
| Basecamp subscriptions | Live — Square status indicator |
| Square production launch | Ready when Square env vars are configured |
| Deprecated Stripe routes | Return `410 Gone` |

---

## Plans

### Free Basic Listing
- Cost: $0
- Default listing state
- No checkout required

### Enhanced Listing
- $25/month
- $250/year
- Visibility upgrade only

### Founding Partner
- $50/month
- $500/year
- Early-supporter recognition during beta
- May be approved via application rather than instant self-service

### Future Premium
- Disabled for beta launch
- Reserved for later release

---

## Trust Policy

This sentence appears on upgrade pages, checkout metadata, and partner-facing surfaces:

> Paid business listing upgrades do not purchase editorial recommendations, verification, rankings, or SouthernVT Recommended status.

Founding Partner support is also editorially separate and does not influence verification or rankings.

### Editorial vs commercial rule

- **Places cannot be upgraded.** Trails, parks, waterfalls, covered bridges, scenic drives, and editorial destinations are selected and written through SouthernVT's editorial process. They have no upgrade path.
- Only business listings can purchase enhanced listing tools.
- Verification and SouthernVT Recommended remain editorial only.

---

## Required Environment Variables

See `docs/square-billing.md` for the full list. The minimum to enable live checkout:

```
SQUARE_ACCESS_TOKEN=
SQUARE_LOCATION_ID=
SQUARE_ENVIRONMENT=production
SQUARE_WEBHOOK_SIGNATURE_KEY=
SQUARE_PLAN_VARIATION_ID_ENHANCED_MONTHLY=
SQUARE_PLAN_VARIATION_ID_ENHANCED_YEARLY=
SQUARE_PLAN_VARIATION_ID_FOUNDING_PARTNER_MONTHLY=
SQUARE_PLAN_VARIATION_ID_FOUNDING_PARTNER_YEARLY=
```

---

## Checkout Route

`POST /api/billing/create-square-checkout`

Request body:

```json
{
  "businessSlug": "grafton-inn",
  "planId": "enhanced_monthly",
  "billingCadence": "monthly"
}
```

Returns `{ success: true, checkoutUrl: "https://checkout.square.site/..." }` when Square is configured.

Returns `503` with a human-readable message when Square env vars are missing.

---

## Webhook Route

`POST /api/billing/square-webhook`

Handles Square webhook events. Verifies signature when `SQUARE_WEBHOOK_SIGNATURE_KEY` is set.

**TODO before full activation:** wire persistence hooks in the webhook route to activate/downgrade listings in the database on subscription lifecycle events.

---

## Manual Invoice Fallback

When Square is not configured, the upgrade page shows:

> Online checkout is coming soon. Contact partners@southernvt.com to activate this plan.

Businesses can request manual invoicing by emailing `partners@southernvt.com`.

---

## What Is Live vs Pending

### Live
- Upgrade page copy and Square checkout button
- Trust policy on all upgrade surfaces
- Partner portal upgrade messaging
- Basecamp subscription summaries with Square status
- Square route validation, error handling, and 503 fallback

### Pending (needs Square env vars + catalog IDs)
- Actual Square payment link creation
- Subscription lifecycle (activate/downgrade)
- Webhook persistence to database
- Automated billing sync

---

## Deprecated Stripe Routes

| Old route | Status | Replacement |
|---|---|---|
| `POST /api/billing/create-checkout-session` | 410 Gone | `POST /api/billing/create-square-checkout` |
| `POST /api/billing/webhook` | 410 Gone | `POST /api/billing/square-webhook` |
