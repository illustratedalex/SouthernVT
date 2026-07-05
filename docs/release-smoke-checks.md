# Release Smoke Checks

Use this lightweight checklist before each production release.

## 1) Navigation and footer link check

- Open homepage and test all top navigation groups.
- Open footer and verify every link resolves (no 404/500):
  - Contact
  - Privacy
  - Terms
  - Our Coverage
  - Why Trust SouthernVT
  - Founding Partners
- Confirm "Current Issue" does not duplicate another nav item destination.

## 2) Public image URL check

- Spot-check homepage hero/cards, places, guides, events, and deals pages.
- Verify visible images load successfully (no broken placeholders/icons).
- If remote images fail, replace with known-good assets or safe gradients.

## 3) Contact form check

- Visit `/contact`.
- Submit a test message with a valid reason.
- Confirm successful submission when email env is configured.
- Confirm helpful failure when email env is not configured (no fake success).

## 4) Claim flow check

- From navigation/portal, "Claim a Listing" should route to `/businesses`.
- Confirm helper copy is visible:  
  **"Find your business, then choose Claim this listing."**
- Open a specific listing and verify claim CTA routes to `/claim-listing?listing=<slug>`.
- Submit a claim and confirm safe error messaging if claim services are not configured.

## 5) Privacy and terms check

- Verify `/privacy` and `/terms` render and include launch-ready legal text.
- Confirm contact email references are current (`hello@`, `partners@`, `press@`).

## 6) Production crawl checklist

- Crawl key public routes:
  `/`, `/businesses`, `/places`, `/collections`, `/guides`, `/events`, `/deals`, `/contact`, `/privacy`, `/terms`, `/founding-partners`, `/our-coverage`, `/why-trust-southernvt`, `/search`, `/concierge`.
- Check for:
  - Broken links
  - 404s/dead routes
  - Broken images
  - Placeholder leaks
  - Button/CTA misroutes
  - Missing title/description metadata
- Record findings in `docs/production-crawl.md`.
