# Public Placeholder Audit

Date: 2026-07-05

Scope reviewed:
- `/`
- `/places/*`
- `/businesses/*`
- `/collections/*`
- `/guides/*`
- `/events`
- `/deals`
- `/concierge`
- `/founding-partners`
- `/contact`
- `/our-coverage`
- `/why-trust-southernvt`
- `/privacy`

## Placeholder items found

1. Home page had a `Mock` newsletter badge.
2. Home page contained public links to Basecamp-only routes.
3. Businesses index hero had `Mock data only` badge.
4. Contact page hero block explicitly said `Editorial Hero Image Placeholder`.
5. Deal detail CTA copy used `placeholder` language for redemption.
6. Place detail page had multiple placeholder strings:
   - drone launch notes
   - premium gallery/video/owner message fallback copy
   - premium offers/events fallback copy
   - booking CTA placeholder
   - map description with placeholder wording
   - collection `Template slot` label
7. Traveler Experiences component presented synthetic ratings/review notes in a way that looked like live reviews.
8. PlaceGallery fallback image used a literal `Photo Placeholder` image URL.
9. Relationship section empty state said `Media placeholders`.

## Items fixed

- Replaced `Mock` badge with `Example` on homepage newsletter block.
- Removed public Basecamp links from homepage and replaced with public routes (`/guides`, `/places`).
- Replaced `Mock data only` badge on `/businesses` with:
  - `Beta directory · details may be incomplete`
- Rewrote contact hero placeholder copy to production-ready editorial messaging.
- Rewrote deal redemption placeholder copy to polished `coming soon` plus `partners@southernvt.com` fallback.
- Rewrote place-detail placeholder strings to polished launch-safe copy:
  - `coming soon` fallbacks for unavailable premium modules
  - clearer map and collection fallback language
- Reframed Traveler Experiences as **example preview** content and explicitly labeled notes as examples.
- Disabled review submission CTA in Traveler Experiences and changed to `Reviews coming soon`.
- Replaced placeholder image URL in PlaceGallery with a neutral fallback scenic image.
- Replaced `Media placeholders` text with `Related media links will appear as they are added.`

## Items intentionally left (polished and intentional)

1. `Coming soon` messaging for unavailable public features where release is intentionally staged:
   - deal redemption workflow
   - premium place module fallbacks
   - review submission flow
2. Collection/relationship empty states that clearly communicate data will appear as relationships are added.
3. Public pages that rely on beta data while explicitly describing preview/beta state.

## Notes

- No Basecamp/admin links remain in public homepage CTAs after cleanup.
- Basic business listing messaging now clearly states details may be incomplete.
- Traveler experience content is now explicitly marked as example/preview to avoid looking like live, verified reviews.
