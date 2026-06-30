# Schema Naming Normalization (v0.4.0)

## Scope

This audit targets naming consistency between:

- Supabase/Postgres tables and columns (`snake_case`)
- TypeScript domain models (`camelCase`)
- Legacy and current table names that overlap

The goal is migration safety and mapper stability, not a breaking rename.

## Current Mapping Pattern

- Repositories map DB `snake_case` to app `camelCase`.
- This is correct and should remain in repository mapper boundaries.
- Example mappings:
  - `places.place_type` -> `Place.placeType`
  - `places.featured_image` -> `Place.featuredImage`
  - `collections.place_ids` -> `Collection.places`

## Naming Mismatches Found

### Table-level mismatches

- `media` vs `media_assets`
- `versions` vs `content_versions`
- `comments` vs `editorial_comments`

These names represent overlapping concepts in old/new repository paths and migrations.

### Column-level mismatch status

- Column mismatch between DB and TypeScript is expected and handled via repository mappers.
- No direct SQL column rename is required for v0.4.0.

## Compatibility Migration Plan

### Phase 1 (v0.4.0, non-breaking)

- Keep existing tables unchanged.
- Add compatibility views only for overlapping legacy table names.
- Do not change repository mapper contracts.

### Phase 2 (v0.5+)

- Pick canonical table names per concept.
- Update Supabase repository modules to canonical tables.
- Keep legacy compatibility views for one deprecation window.

### Phase 3 (post-deprecation)

- Remove compatibility views once all query paths use canonical names.
- Regenerate Supabase types from canonical schema.

## Safety Rules

- No destructive renames in-place.
- No mapper removal while compatibility views are active.
- Prefer additive migrations (`create view`, `create or replace view`) over table rewrites.
