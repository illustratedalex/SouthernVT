# Offline and Retry Write Strategy (v0.4.0)

## Purpose

Prepare Basecamp save flows for real Supabase writes with retry/offline queueing, without implementing full sync in this milestone.

## Current State

The following Basecamp flows still use optimistic local save simulation:

- Places (`components/basecamp/PlaceForm.tsx`)
- Collections (`components/basecamp/CollectionForm.tsx`)
- Articles (`components/basecamp/ArticleForm.tsx`)
- Events (`components/basecamp/EventForm.tsx`)
- Deals (`components/basecamp/DealForm.tsx`)
- Media uploads (`components/basecamp/MediaLibraryClient.tsx`)
- Feature flags panel (`components/basecamp/FeatureFlagsSettings.tsx`)

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
