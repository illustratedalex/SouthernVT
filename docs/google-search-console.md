# Google Search Console Setup (SouthernVT)

This checklist covers the production indexing setup for SouthernVT.

## 1) Verify the domain in Google Search Console

1. Open Google Search Console.
2. Add property: `https://www.southernvt.com` (Domain property preferred if DNS access is available).
3. Complete verification (DNS TXT, HTML tag, or other supported method).

## 2) Submit the sitemap

Submit:

`https://www.southernvt.com/sitemap.xml`

SouthernVT exposes this from `app/sitemap.ts`.

## 3) Confirm robots.txt

Production robots URL:

`https://www.southernvt.com/robots.txt`

It should:
- allow public crawling
- disallow private/admin areas (`/basecamp`, `/api`, `/admin`)
- include sitemap URL `https://www.southernvt.com/sitemap.xml`

## 4) URL inspection checklist

After deployment, use URL Inspection and request indexing for:

- `https://www.southernvt.com/`
- `https://www.southernvt.com/businesses`
- `https://www.southernvt.com/places/hamilton-falls`

## 5) Monitor indexing health

In Search Console, monitor:
- Pages indexed vs. not indexed
- Crawl stats
- Sitemaps report
- Coverage issues (404, excluded, duplicate, noindex)

## 6) Sitemap scope

The sitemap includes key public pages plus dynamic content:

- Static:
  - `/`
  - `/places`
  - `/businesses`
  - `/collections`
  - `/guides`
  - `/events`
  - `/deals`
  - `/concierge`
  - `/founding-partners`
  - `/why-trust-southernvt`
  - `/our-coverage`
- Dynamic:
  - published place detail pages (`/places/[slug]`)
  - business listing pages (`/businesses/[slug]`)
  - published collection pages (`/collections/[slug]`)
  - published guides, events, and deals

Private/admin routes are excluded.

## 7) Notes for launch

- Re-submit sitemap after major content imports.
- Keep page metadata (title/description) consistent on home, places, businesses, founding partners, contact, coverage, and privacy pages.
