# Repository Switching

This project uses repository modules so data sources can switch without changing UI pages.

## Places repository modules

- `lib/repositories/PlaceRepository.mock.ts`
  - In-memory mock data source backed by `data/places.ts`.
  - Exposes `getPlaces`, `getPlaceById`, `getPlaceBySlug`, `createPlace`, `updatePlace`, `archivePlace`.

- `lib/repositories/placeRepository.supabase.ts`
  - Supabase data source for the same method set.
  - Maps database `snake_case` columns (for example `place_type`, `featured_image`, `created_at`) to app `camelCase` fields (`placeType`, `featuredImage`, `createdAt`).

- `lib/repositories/placeRepository.ts`
  - Runtime switch layer.
  - Defaults to mock repository.
  - Uses Supabase repository only when both conditions are true:
    - `supabase` feature flag is enabled.
    - Supabase environment variables are present.

## Collections repository modules

- `lib/repositories/CollectionRepository.mock.ts`
  - In-memory mock data source backed by `data/collections.ts`.
  - Exposes `getCollections`, `getCollectionById`, `getCollectionBySlug`, `createCollection`, `updateCollection`, `archiveCollection`.

- `lib/repositories/collectionRepository.supabase.ts`
  - Supabase data source for the same method set.
  - Maps database `snake_case` columns (for example `featured_image`, `place_ids`, `seo_title`, `created_at`) to app `camelCase` fields (`featuredImage`, `places`, `seoTitle`, `createdAt`).

- `lib/repositories/collectionRepository.ts`
  - Runtime switch layer.
  - Defaults to mock repository.
  - Uses Supabase repository only when both conditions are true:
    - `supabase` feature flag is enabled.
    - Supabase environment variables are present.

## Media repository modules

- `lib/repositories/mediaRepository.mock.ts`
  - In-memory mock data source backed by `data/media.ts`.
  - Exposes `getMediaAssets`, `getMediaAssetById`, `createMediaAsset`, `updateMediaAsset`, `archiveMediaAsset`.

- `lib/repositories/mediaRepository.supabase.ts`
  - Supabase data source for the same method set.
  - Maps database `snake_case` columns (for example `alt_text`, `asset_type`, `thumbnail_url`, `attached_to`, `created_at`) to app `camelCase` fields (`altText`, `type`, `thumbnailUrl`, `attachedTo`, `createdAt`).

- `lib/repositories/mediaRepository.ts`
  - Runtime switch layer.
  - Defaults to mock repository.
  - Uses Supabase repository only when both conditions are true:
    - `supabase` feature flag is enabled.
    - Supabase environment variables are present.

## Relationships repository modules

- `lib/repositories/relationshipRepository.mock.ts`
  - In-memory mock data source backed by `data/relationships.ts`.
  - Exposes `getRelationshipsForContent`, `getRelationshipsByType`, `createRelationship`, `updateRelationship`, `deleteRelationship`.

- `lib/repositories/relationshipRepository.supabase.ts`
  - Supabase data source for the same method set.
  - Maps database `snake_case` columns (for example `source_type`, `source_id`, `target_type`, `target_id`, `relationship_type`, `sort_order`, `created_at`) to app `camelCase` fields (`fromType`, `fromId`, `toType`, `toId`, `relationshipType`, `sortOrder`, `createdAt`).

- `lib/repositories/RelationshipRepository.ts`
  - Runtime switch layer used by existing relationship UI/public sections.
  - Defaults to mock repository.
  - Uses Supabase repository only when both conditions are true:
    - `supabase` feature flag is enabled.
    - Supabase environment variables are present.

## Workflow repository modules

- `lib/repositories/workflowRepository.mock.ts`
  - In-memory mock data source backed by `data/workflow.ts`.
  - Exposes `getWorkflowEventsForContent`, `getVersionsForContent`, `getCommentsForContent`, `addWorkflowEvent`, `addComment`, `resolveComment`.

- `lib/repositories/workflowRepository.supabase.ts`
  - Supabase data source for the same method set.
  - Maps database `snake_case` columns (for example `content_type`, `content_id`, `from_status`, `to_status`, `created_at`) to app `camelCase` fields (`contentType`, `contentId`, `fromStatus`, `toStatus`, `createdAt`).

- `lib/repositories/WorkflowRepository.ts`
  - Runtime switch layer used by Basecamp workflow panels.
  - Defaults to mock repository.
  - Uses Supabase repository only when both conditions are true:
    - `supabase` feature flag is enabled.
    - Supabase environment variables are present.

## Activity repository modules

- `lib/repositories/activityRepository.mock.ts`
  - In-memory mock data source backed by `data/activity.ts`.
  - Exposes `getActivity`, `getRecentActivity`, `getActivityByContent`, `createActivity`.

- `lib/repositories/activityRepository.supabase.ts`
  - Supabase data source for the same method set.
  - Maps database `snake_case` columns (for example `content_type`, `content_id`, `created_at`) to app `camelCase` fields (`contentType`, `contentId`, `createdAt`).

- `lib/repositories/ActivityRepository.ts`
  - Runtime switch layer used by Basecamp activity feed pages and widgets.
  - Defaults to mock repository.
  - Uses Supabase repository only when both conditions are true:
    - `supabase` feature flag is enabled.
    - Supabase environment variables are present.

## Feature flags repository modules

- `lib/repositories/featureFlagRepository.mock.ts`
  - In-memory mock data source backed by `data/featureFlags.ts`.
  - Exposes `getFeatureFlags`, `getFeatureFlag`, `isFeatureEnabled`, `updateFeatureFlag`.

- `lib/repositories/featureFlagRepository.supabase.ts`
  - Supabase data source for the same method set.
  - Maps database `snake_case` columns (for example `created_at`, `updated_at`) to app `camelCase` fields (`createdAt`, `updatedAt`).

- `lib/repositories/featureFlagRepository.ts`
  - Runtime switch layer for feature flag reads and updates.
  - Prefers Supabase when environment variables are available.
  - Automatically falls back to mock data when Supabase is unavailable or env vars are missing.

## Feature flag behavior

The switch is evaluated at call time using `isFeatureEnabled("supabase")`, so turning the feature flag on/off changes which repository handles subsequent calls.

## Compatibility entrypoint

`repositories/PlaceRepository.ts` re-exports the lib repository API so existing imports in app routes/components continue to work without page changes.
