# Offline and Retry Write Strategy (v0.4.0)

## Purpose

Prepare Basecamp save flows for real Supabase writes with retry/offline queueing, without implementing full sync in this milestone.

## Current State

All current Basecamp editor save/toggle flows now use repository-backed writes with queue fallback.

Places and Collections now use repository-backed save and transition writes with queue fallback:

- `components/basecamp/PlaceForm.tsx`
- `components/basecamp/CollectionForm.tsx`
- `components/basecamp/ArticleForm.tsx`
- `components/basecamp/EventForm.tsx`
- `components/basecamp/DealForm.tsx`
- `components/basecamp/MediaLibraryClient.tsx`
- `components/basecamp/FeatureFlagsSettings.tsx`
- `lib/services/WriteQueueService.ts`

## Queue Strategy

1. Wrap repository writes in a shared write gateway.
2. On network/server failure, enqueue write payload with:
   - operation type
   - repository name
   - payload
   - retry count
   - first/last attempt timestamps
3. Retry with capped exponential backoff.
4. Persist queue locally (IndexedDB preferred, `localStorage` fallback only for tiny payloads).
5. Reconcile queue on app resume/network restore.

## Conflict Rules (Planned)

- Default: last-write-wins for low-risk metadata fields.
- Escalate to manual review for workflow status transitions and editorial comments.

## Non-goals in v0.4.0

- No full offline sync implementation.
- No background sync worker yet.
- No cross-device conflict UX yet.
