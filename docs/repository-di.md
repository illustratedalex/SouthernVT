# Repository DI Activation (v0.4.0)

## Goal

Enable reliable repository mode switching (`mock` vs `supabase`) without changing UI call sites.

## Runtime Mode Controls

Repository runtime mode is now resolved in this order:

1. Explicit Provider override (`RepositoryProvider mode="mock" | "supabase"`)
2. `NEXT_PUBLIC_REPOSITORY_MODE` when set to `mock` or `supabase`
3. Auto mode:
   - `supabase` only when both are true:
     - Supabase environment is present
     - `supabase` feature flag is enabled
   - otherwise `mock`

## Implementation Notes

- Shared mode utilities:
  - `lib/repositories/mode.ts`
- Provider activation:
  - `lib/repositories/RepositoryProvider.tsx`
- Runtime read helper:
  - `lib/repositories/runtime.ts`
- Adaptive repositories now call `resolveRepositoryMode(...)` before choosing module backends.

## UI Agnostic Contract

- UI should consume repository interfaces and avoid direct DB calls.
- Existing screens keep current behavior because repository entrypoints are unchanged.
- Provider mode controls source selection globally without changing form/page code.

## Known Limits

- Some supabase repository modules still contain `not implemented` write paths.
- Explicit `mode="supabase"` will surface these gaps during testing, which is expected and useful.
