# Database Overview

This document describes the hardened Supabase schema used by Southern VT CMS and how it supports the current mock-first repository architecture.

## Table purpose

- `places`: Canonical records for destination pages and business/location content.
- `collections`: Curated groupings of places used for public/editorial experiences.
- `media_assets`: Shared image/media catalog with typed attachments to content.
- `relationships`: Polymorphic link table for related content (place-to-place, place-to-collection, etc.).
- `workflow_events`: Immutable-ish workflow transition log per content item.
- `content_versions`: Version history snapshots per content item.
- `editorial_comments`: Review feedback threads attached to content records.
- `activities`: User-facing/admin activity feed events.
- `feature_flags`: Runtime feature controls used by route guards and repository switches.

## Major fields

- Identity: primary keys on every table (`id` or `key` for feature flags).
- Timestamps: `created_at` and `updated_at` on every table, with trigger-based `updated_at` maintenance.
- Soft-archive support: `archived_at` where records should be excluded from normal reads.
- Status fields: `status` added across tables to standardize filtering and future policy conditions.
- Lookup fields:
  - Slug indexes on `places.slug` and `collections.slug`.
  - Status indexes on every table.
  - Content lookup indexes on `(content_type, content_id)` for workflow, versions, comments, and activities.

## Status workflow model

- `places` and `collections`: `draft`, `published`, `archived` (by convention in app repositories).
- `media_assets`: `active` by default.
- `relationships`: `active` by default.
- `workflow_events`: `completed` by default.
- `content_versions`: `saved` by default.
- `editorial_comments`: `open` by default (with `resolved` boolean retained).
- `activities`: `logged` by default.
- `feature_flags`: `active` by default plus `enabled` boolean.

These values are intentionally permissive right now and can be tightened with check constraints later after editorial workflow finalization.

## JSONB metadata approach

JSONB is used where shape can evolve without frequent migrations:

- `places`: `categories`, `tags`, `gallery`, `amenities`, `metadata`, `related_places`
- `collections`: `gallery`, `place_ids`, `tags`, `metadata`
- `media_assets`: `tags`, `attached_to`, `metadata`
- `relationships`, `workflow_events`, `content_versions`, `editorial_comments`, `activities`, `feature_flags`: `metadata`

Why JSONB here:

- Keeps payloads flexible while content model is still evolving.
- Supports indexed querying with GIN where needed.
- Matches app-side TypeScript model objects and arrays used by repositories.

## Relationship model

The schema uses logical, polymorphic relationships instead of strict foreign keys in key areas:

- `relationships.source_type/source_id` and `target_type/target_id` may refer to different tables.
- `workflow_events`, `content_versions`, `editorial_comments`, and `activities` reference content via `(content_type, content_id)` pairs.
- `collections.place_ids` and `media_assets.attached_to` store typed references used by app logic.

This approach avoids brittle cross-table coupling while the domain model is still changing. Relationship integrity is currently enforced by repository logic and seed conventions.

## Future RLS/auth plan

Row Level Security is enabled on every table, but strict policies are not yet enforced.

Current state:

- RLS is enabled table-by-table in the schema.
- Policy examples are included as commented SQL templates for:
  - public read for published content
  - admin full access
  - editor create/update
  - business owner limited update

Planned next step:

1. Finalize JWT claim shape (`role`, `business_id`, ownership metadata).
2. Convert commented policy examples into active policies in environment-specific migrations.
3. Add test fixtures for each role path before enabling in production.
