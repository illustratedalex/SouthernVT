# Supabase Setup

This project is currently mock-first. The Supabase foundation is scaffolded for gradual migration without changing existing UI.

## 1) Create a Supabase project

1. Create a new project in Supabase.
2. In Project Settings > API, copy:
   - `Project URL`
   - `anon public` key

## 2) Configure environment variables

Set these values in your local environment file:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only, required for Basecamp claim review and owner mapping)
- `BASECAMP_ADMIN_EMAILS` (optional, comma-separated reviewer emails)

Example:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
BASECAMP_ADMIN_EMAILS=editor@southernvt.com,ops@southernvt.com
```

## 3) Apply database schema

In the Supabase SQL editor, run [supabase/schema.sql](../supabase/schema.sql).

This creates the foundation tables:

- `places`
- `collections`
- `media_assets`
- `relationships`
- `workflow_events`
- `content_versions`
- `editorial_comments`
- `activities`
- `feature_flags`

## 4) Seed baseline data

In the Supabase SQL editor, run [supabase/seed.sql](../supabase/seed.sql).

## 5) Repository strategy

Mock repositories remain the default and are not removed.

Standalone Supabase repository files are provided beside mock repositories for incremental adoption:

- `lib/repositories/PlaceRepository.mock.ts`
- `lib/repositories/placeRepository.supabase.ts`
- `lib/repositories/placeRepository.ts`
- `lib/repositories/collectionRepository.supabase.ts`
- `lib/repositories/mediaRepository.supabase.ts`
- `lib/repositories/relationshipRepository.supabase.ts`
- `lib/repositories/workflowRepository.supabase.ts`
- `lib/repositories/contentVersionsRepository.supabase.ts`
- `lib/repositories/editorialCommentsRepository.supabase.ts`
- `lib/repositories/activityRepository.supabase.ts`
- `lib/repositories/featureFlagRepository.supabase.ts`

## 6) Current scope

- Business owner authentication is now enabled through Supabase email/password and magic links.
- Business claiming and owner edit-request workflow requires the service role key on the server.
- `SUPABASE_SERVICE_ROLE_KEY` must never be exposed to client-side code.
- Supabase configuration helpers live in `lib/supabase/config.ts`.
