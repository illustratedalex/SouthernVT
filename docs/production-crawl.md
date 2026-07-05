# Production Crawl Report

Date: 2026-07-05  
Environment: local production build (`next start`, first-time visitor crawl pass)

## Crawl scope

Checked directly:

- Homepage (`/`)
- Navigation and footer links
- Businesses (`/businesses`, sample detail `/businesses/grafton-inn`)
- Places (`/places`, sample detail `/places/hamilton-falls`)
- Collections (`/collections`, sample detail `/collections/summer-swimming-holes`)
- Guides (`/guides`, sample detail `/guides/weekend-in-brattleboro`)
- Events (`/events`, sample detail `/events/brattleboro-farmers-market`)
- Deals (`/deals`, sample detail `/deals/grafton-inn-10-percent-weekday-stays`)
- Contact (`/contact`)
- Privacy (`/privacy`)
- Terms (`/terms`)
- Founding Partners (`/founding-partners`)
- Business Claims (`/claim-listing`)
- Coverage (`/our-coverage`)
- Why Trust (`/why-trust-southernvt`)
- Search (`/search`)
- Concierge (`/concierge`)
- Traveler Experiences surface on homepage

Automated crawl summary:

- Seed pages checked: **22**
- Internal links discovered/checked: **214**
- Broken internal links found: **1**
- Missing title/description metadata on checked pages: **0**
- Image URLs checked: **19**
- Broken image URLs found: **3**

## Issues found

| ID | Severity | Area | Issue | Evidence |
|---|---|---|---|---|
| CRAWL-001 | **Critical** | Coverage page | Dead internal route `/suggest-place` linked publicly. | `/our-coverage` links to `/suggest-place` (returns 404). |
| CRAWL-002 | **High** | Homepage visual media | Broken hero/card image URL (Unsplash 404). | `photo-1506424482690-f7cd225efb41` returns 404. |
| CRAWL-003 | **High** | Homepage visual media | Broken hero/card image URL (Unsplash 404). | `photo-1514361892635-6b07e31e75fe` returns 404. |
| CRAWL-004 | **High** | Homepage visual media | Broken hero/card image URL (Unsplash 404). | `photo-1566127992631-137a642a90f4` returns 404. |
| CRAWL-005 | Medium | Global navigation | Duplicate nav destination: `Guides` and `Current Issue` both point to `/guides`. | `lib/navigation.ts` stories group. |
| CRAWL-006 | Medium | Claims entry UX | `/claim-listing` as a generic nav destination is ambiguous for first-time users without a selected listing context. | Public nav links to `/claim-listing` directly. |
| CRAWL-007 | Medium | Search UX | Search no-results CTA and coverage CTA behavior are inconsistent (one fixed, one dead). | `/search` uses feedback CTA; coverage still points to dead route. |
| CRAWL-008 | Low | Content quality | Several public pages rely on stock remote image URLs without health checks/fallbacks. | 3/19 sampled image URLs failed HEAD checks. |
| CRAWL-009 | Low | CTA clarity | Some “Coming soon” blocks remain in public partner surfaces; not broken, but can reduce launch polish. | `/partner-portal` feature cards. |
| CRAWL-010 | Low | Crawl robustness | No ongoing automated public-link/image crawl in CI to prevent regressions. | Operational gap observed from broken links/images. |

## Top 20 fixes (prioritized)

1. (**Critical**) Replace `/suggest-place` link on `/our-coverage` with a live route (`/feedback?category=Missing%20Place`).
2. (**High**) Replace/remove broken Unsplash image `photo-1506424482690-f7cd225efb41`.
3. (**High**) Replace/remove broken Unsplash image `photo-1514361892635-6b07e31e75fe`.
4. (**High**) Replace/remove broken Unsplash image `photo-1566127992631-137a642a90f4`.
5. (**Medium**) Change `Current Issue` nav item to a distinct route (or remove duplicate label).
6. (**Medium**) Update `Claim a Listing` nav flow to start at `/businesses` with clear listing selection guidance.
7. (**Medium**) Standardize “Suggest a Place” CTAs to one live destination across all public pages.
8. (**Medium**) Add public 404 smoke checks for all nav/footer links before deploy.
9. (**Medium**) Add image URL validation for homepage/cards in CI or pre-deploy script.
10. (**Low**) Add fallback image behavior where remote media fails.
11. (**Low**) Review partner portal “Coming soon” blocks for tighter launch wording.
12. (**Low**) Add crawl snapshot logging (route status + metadata) per release.
13. (**Low**) Add spell/grammar pass on CTA microcopy in nav/footer surfaces.
14. (**Low**) Add explicit QA checklist entry for Traveler Experiences block each release.
15. (**Low**) Add link-check pass specifically for coverage/trust/legal pages.
16. (**Low**) Add page-level analytics events for 404-origin clicks to catch dead CTAs faster.
17. (**Low**) Ensure all editorial image URLs are pinned to known-good assets.
18. (**Low**) Add pre-release check for duplicate destination links in navigation config.
19. (**Low**) Add automated metadata completeness check for all public routes.
20. (**Low**) Add a weekly production crawl report artifact in docs/release workflow.

## Production readiness score

**87 / 100**

Rationale:

- Core public routes, metadata, contact/legal/trust pages are live and reachable.
- One critical dead CTA and multiple broken public images materially affect first-visit trust/polish.
- No systemic 5xx/metadata failures found in this pass.
