# Compass Analytics Events (GA4)

This project tracks key visitor and partner actions in Google Analytics 4 using `window.gtag`.

GA4 measurement is configured through:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

The GA loader remains unchanged. Vercel Analytics and Microsoft Clarity remain active.

## Event names

- `concierge_start`
- `concierge_complete`
- `ai_concierge`
- `place_view`
- `business_view`
- `business_website_click`
- `directions_click`
- `phone_click`
- `claim_start`
- `claim_submit`
- `founding_partner_interest`
- `newsletter_signup`
- `search`
- `saved_trip`
- `passport_checkin`

## Where each event fires

- `concierge_start`: Concierge wizard "Generate Concierge Plan" click.
- `concierge_complete`: Concierge results render when a trip is generated.
- `ai_concierge`: AI concierge narrative request click.
- `place_view`: Place page render.
- `business_view`: Business page render.
- `business_website_click`: Business page website link click.
- `directions_click`: Place/business directions link click.
- `phone_click`: Business phone link click.
- `claim_start`: Claim flow load/start for a listing.
- `claim_submit`: Mock claim submission success.
- `founding_partner_interest`: Founding Partner CTA click.
- `newsletter_signup`: Newsletter signup form submit.
- `search`: Search form submit.
- `saved_trip`: Planner trip detail page render.
- `passport_checkin`: Passport check-in action click.

## Why these events matter

- Measure itinerary intent and completion in Concierge.
- Understand destination and business discovery behavior.
- Track conversion intent (website clicks, calls, directions).
- Track business-owner funnel actions (claim start/submit).
- Track partner interest demand.
- Track audience growth funnel actions (newsletter, search, saved trips).
- Track Adventure Passport engagement.

## GA4 verification steps

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env.local`.
2. Start the app and open pages tied to the events above.
3. In browser DevTools, verify `collect?v=2` GA requests or `gtag("event", ...)` calls.
4. In GA4 DebugView, confirm events arrive with expected names and params.
5. Confirm no duplicate events for single interactions (especially render-based events).

## Notes

- Vercel Analytics is still enabled in `app/layout.tsx`.
- Microsoft Clarity is still enabled in `app/layout.tsx`.
