# Mobile Launch Audit (Public Routes)

Audit widths:
- 390px (iPhone)
- 430px (large iPhone)
- 768px (tablet)

Routes reviewed:
- `/`
- `/places/hamilton-falls`
- `/places/jamaica-state-park`
- `/businesses`
- `/businesses/grafton-inn`
- `/concierge`
- `/founding-partners`
- `/contact`
- `/our-coverage`
- `/why-trust-southernvt`

## Issues Found

1. Some tap targets on pills/CTA links were below ideal mobile touch size.
2. Header brand block could feel tight on smaller iPhones.
3. Footer links had minimal vertical tap spacing on mobile.
4. A few uppercase tracking styles were too wide for narrow screens.
5. Concierge option clicks could re-navigate and move viewport unexpectedly.
6. Traveler Experiences summary row and category grid were dense on mobile.
7. Hero/body text balance on key pages was heavy at small widths.
8. Long pages had occasional horizontal pressure risk from tight tracking and large copy.

## Fixes Applied

- Added global mobile safety:
  - `overflow-x: hidden` on `html` and `body`
  - `-webkit-text-size-adjust: 100%`
- Improved navbar mobile fit:
  - tighter header spacing
  - hidden secondary brand line on small screens
  - larger mobile menu button target
- Improved footer mobile usability:
  - two-column link layout on small screens
  - added vertical tap padding
- Increased mobile tap targets:
  - business listing CTA
  - contact submit button + form field heights
  - concierge selection pills
  - major CTA buttons on key public pages
- Reduced mobile text-density pressure:
  - lighter tracking on small screens for section eyebrows
  - capped section description width
  - adjusted hero heading sizes for mobile-first readability
- Improved Traveler Experiences readability:
  - mobile-first stacking in summary row
  - hide divider on small screens
  - better intermediate category grid behavior
- Concierge interaction polish:
  - added `#concierge-wizard` anchor strategy so query updates stay in context
  - generate button now visually/interaction-disabled until required selections are made
- Improved image presentation on home:
  - stronger hero overlay for text contrast
  - reduced large image crop height on mobile for featured destination block

## Remaining Recommended Polish

1. Replace `<details>` mobile nav with explicit controlled drawer for tighter close/open behavior and focus management.
2. Add explicit visual QA screenshots for 390/430/768 for release checks.
3. Convert key public image blocks to `next/image` for better responsive cropping/loading behavior.
4. Add a lightweight mobile regression checklist in PR template for launch week.
