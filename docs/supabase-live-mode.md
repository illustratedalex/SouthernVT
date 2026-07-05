# Supabase Live Mode

How to switch SouthernVT from mock repositories to live Supabase-backed data.

---

## Overview

SouthernVT uses an adaptive repository pattern. Every data module has two implementations:

- `*.mock.ts` — serves static in-memory arrays (used by default in development and when Supabase is not configured)
- `*.supabase.ts` — reads and writes to Supabase via the REST API

The active implementation is resolved at request time by `lib/repositories/mode.ts`.

---

## How Mode Resolution Works

Priority order (highest wins):

1. **In-process override** — set programmatically in tests or Basecamp admin toggle
2. **`NEXT_PUBLIC_REPOSITORY_MODE` env var** — set to `supabase` or `mock`
3. **Feature flag `supabase` + Supabase env vars** — legacy path, still supported
4. **Default** — `mock`

If `NEXT_PUBLIC_REPOSITORY_MODE=supabase` is set but Supabase env vars are missing, the system falls back to mock and logs a clear server-side warning:

```
[SouthernVT] NEXT_PUBLIC_REPOSITORY_MODE=supabase is set but Supabase env vars
(NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY) are missing.
Falling back to mock repositories.
```

It will never silently pretend Supabase is active.

---

## Required Environment Variables

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL, e.g. `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key from Supabase project settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for admin operations (claims review, etc.) |
| `NEXT_PUBLIC_REPOSITORY_MODE` | Set to `supabase` to activate live repositories |

---

## How to Activate in Production (Vercel)

1. Go to **Vercel → Project → Settings → Environment Variables**
2. Add the four variables above under the **Production** scope
3. Trigger a new deployment

That's it. No code changes required.

---

## Migration Order

Apply Supabase migrations to your production project **before** switching the mode. Run them in order using the Supabase CLI or SQL editor:

```
supabase/migrations/202606280001_cms_foundation.sql
supabase/migrations/202606290001_trailhead_core_infra.sql
supabase/migrations/202606290002_schema_compat_views.sql
supabase/migrations/202607050001_business_claiming_live.sql
supabase/migrations/202607050002_claim_listing_fields.sql
```

### Using the Supabase CLI

```bash
# Link to your production project
supabase link --project-ref <your-project-ref>

# Push all pending migrations
supabase db push
```

### Using the SQL Editor

Paste and run each migration file in order via the Supabase Dashboard → SQL Editor.

---

## Supabase Auth Setup

Before switching live mode, also configure auth in the Supabase dashboard:

1. **Authentication → Providers**: enable Email (with email confirmations if desired)
2. **Authentication → URL Configuration**:
   - Site URL: `https://www.southernvt.com`
   - Redirect URLs: `https://www.southernvt.com/auth/callback`
3. **Authentication → Email Templates**: customise if desired

---

## How to Verify Claims and Listings Persist

After activating live mode:

1. Submit a test claim at `/claim-listing?listing=<any-slug>`
2. Go to `/basecamp/claims` — the claim should appear in the pending queue
3. Approve the claim — the listing's `claimStatus` should update to `claimed`
4. Check the Supabase dashboard → Table Editor → `business_claims` to confirm the row exists

---

## Local Development

Local development defaults to **mock mode** even if `NEXT_PUBLIC_REPOSITORY_MODE` is unset. This is intentional — it keeps local dev fast and offline-capable.

To run locally against a real Supabase project:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_REPOSITORY_MODE=supabase
```

Then restart the dev server.

---

## Mock Data

Mock data files are preserved permanently. They are never deleted and always available as a fallback. They power:

- Local development
- Build-time static generation
- Preview deployments without Supabase env vars
- Test environments

---

## API Status Page

The Basecamp API status page at `/basecamp/settings/api` shows:

- **Active Mode** — Mock or Supabase
- **Env Var** — whether `NEXT_PUBLIC_REPOSITORY_MODE` is set
- **Supabase Env** — whether URL + anon key are present

Use this to verify your production configuration is correct.

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Mode shows "mock" in production | `NEXT_PUBLIC_REPOSITORY_MODE` not set | Set `NEXT_PUBLIC_REPOSITORY_MODE=supabase` in Vercel |
| Mode shows "mock" despite env var | Supabase URL/key missing | Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| Claims not appearing in Basecamp | Migrations not applied | Run migrations in Supabase SQL editor |
| Auth callback failing | Redirect URL not configured | Add production URL to Supabase Auth → URL Configuration |
| Server warning in logs | Env var set, Supabase keys missing | Add Supabase URL + anon key to Vercel |
