# SEO Foundation

## Metadata strategy

The public site uses centralized metadata helpers in [lib/seo.ts](../lib/seo.ts):

- `createPageMetadata()` for shared route-level metadata.
- `createPlaceMetadata()` for place detail pages.
- `createCollectionMetadata()` for collection detail pages.
- `createEventMetadata()` for event detail pages.
- `createArticleMetadata()` for guide/article detail pages.

Each helper returns a Next.js `Metadata` object with:

- `title`
- `description`
- `alternates.canonical`
- `openGraph`
- `twitter`

When a model includes `seoTitle` or `seoDescription`, those fields are used first.

## Sitemap generation

Sitemap is generated in [app/sitemap.ts](../app/sitemap.ts).

It includes:

- static public routes (`/`, `/places`, `/collections`, `/events`, `/guides`)
- published places
- published collections
- published events
- published guides/articles

Current implementation uses repository data (mock-backed today) and can move to Supabase-backed repositories later without changing sitemap shape.

## Robots rules

Robots config is in [app/robots.ts](../app/robots.ts).

Rules:

- Allow public crawling (`/`)
- Disallow internal/admin surfaces:
  - `/basecamp`
  - `/api`
  - `/admin`

Sitemap reference points to `/sitemap.xml`.

## JSON-LD

JSON-LD helpers are in [lib/jsonLd.ts](../lib/jsonLd.ts):

- `placeJsonLd()`
- `eventJsonLd()`
- `articleJsonLd()`
- `collectionJsonLd()`

Detail pages inject the corresponding JSON-LD script (`application/ld+json`) server-side.

## Future Search Console setup

Recommended next steps:

1. Set `NEXT_PUBLIC_SITE_URL` to production domain in each environment.
2. Verify domain ownership in Google Search Console and Bing Webmaster Tools.
3. Submit `/sitemap.xml` to both consoles.
4. Monitor indexing coverage and enhancement reports (structured data).
5. Add organization/sitewide JSON-LD and OG image generation.
6. Add automated smoke checks for metadata and sitemap output in CI.
