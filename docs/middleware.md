# Middleware and Proxy Audit (v0.4.0)

## Summary

- Next.js `16.2.9` reports the root `middleware.ts` convention as deprecated.
- The project now uses root `proxy.ts` and keeps the same request behavior by delegating to `lib/supabase/middleware.ts`.
- Route matching behavior is preserved.

## What Changed

- Removed deprecated root file:
  - `middleware.ts`
- Added proxy entrypoint:
  - `proxy.ts`
- Kept shared behavior implementation:
  - `lib/supabase/middleware.ts`

## Behavior Parity Checklist

- Header passthrough parity:
  - `x-trailhead-supabase` is still set when Supabase config is present.
  - `x-trailhead-path` is still set from request pathname.
- Matcher parity:
  - Proxy matcher still excludes `_next/static`, `_next/image`, `favicon.ico`, `robots.txt`, and `sitemap.xml`.
- Auth/caching parity:
  - No auth token or cookie mutation was added.
  - No cache-control semantics were changed.

## Validation

- Production build succeeds after migration.
- Next build output reports proxy registration.

## Follow-up

- Keep middleware logic in `lib/supabase/middleware.ts` so future proxy/auth changes are centralized.
