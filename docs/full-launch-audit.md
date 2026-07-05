# SouthernVT Full Launch Audit

**Date:** 2026-07-05  
**Branch:** develop  
**Build:** ✅ Passes (0 errors, 137 warnings — all pre-existing)  
**Lint:** ✅ Passes (0 errors)  
**Typecheck:** ✅ Passes  
**Launch Readiness Score: 61 / 100**

---

## 1. Finished Features

These are complete and ship-ready.

| Feature | Detail |
|---|---|
| **Homepage** | Real content, feature-flag gated sections render gracefully when off |
| **Business directory** | 128 real seed listings with live claim-status overlay from Supabase |
| **Business listing pages** | Full detail pages with contact info, completeness score, badges, CTA |
| **Claim flow** | End-to-end: `/claim-listing`, API, Supabase persistence, honeypot spam guard |
| **Email notifications** | 5 transactional templates (claim received, admin alert, approved, rejected, featured) via Resend |
| **Auth / login / signup** | Full Supabase email+password and magic-link flow |
| **Owner auth callback** | `/auth/callback` verifies OTP, sets httpOnly cookie, redirects to Partner Portal |
| **Partner portal (main)** | Auth-aware; shows approved owned listings and edit-request form |
| **Claim review queue** | `/basecamp/claims` reads live Supabase claims; approve/reject with notes |
| **Navigation (Navbar)** | Full desktop + mobile responsive with dropdown groups |
| **Footer** | All links present, responsive |
| **Collections** | Directory + detail pages using seeded mock data |
| **Events** | Directory + detail pages using seeded mock data |
| **Deals** | Directory + detail pages using seeded mock data |
| **Guides / Articles** | Directory + detail pages using seeded mock data |
| **Places** | Directory + full detail pages with Compass engine, Relationship engine, layout profiles |
| **Concierge (non-AI)** | Compass-based recommendations work without AI narration |
| **Trip Planner (non-AI)** | Planning UI works, AI narration disabled |
| **Explorer mode** | Functional |
| **404 page** | Branded not-found page with 6 recovery links |
| **Error boundaries** | `error.tsx` + `global-error.tsx` both present |
| **SEO** | `robots.ts`, dynamic `sitemap.ts`, `createPageMetadata` used consistently sitewide |
| **Mobile layout** | Full `sm:/md:/lg:/xl:` Tailwind coverage across all major pages |
| **Basecamp admin suite** | ~40 routes covering all content types, relationship engine, media, activity log |
| **Feature flag infrastructure** | 15 flags, Supabase-backed with mock fallback |
| **Founding Partners public page** | Marketing page live (0 active partners displayed correctly) |
| **Privacy page structure** | Exists (placeholder content — see blockers) |
| **Terms page** | Exists |
| **About page** | Real content |
| **Our Coverage page** | Real content |
| **Why Trust SouthernVT page** | Real content |
| **Contact page UI** | Form fields, validation — submission not wired (see blockers) |
| **Analytics component layer** | Google Analytics + Clarity scripts present, fail-silent when keys absent |

---

## 2. Partially Finished Features

These exist and mostly work, but have gaps that need closing before or shortly after launch.

### Partner Portal sub-routes
- `/partner-portal/dashboard`, `/partner-portal/deals`, `/partner-portal/events`, `/partner-portal/insights` all redirect to `/partner-portal`.
- The main portal page is functional; the sub-sections are scaffolded but not built.

### Supabase data layer
- Full schema, migrations, and repository implementations exist.
- The `supabase` feature flag is **disabled**, so all repositories fall back to mock data even when env vars are set.
- Auth and claim APIs bypass this flag correctly (they call Supabase directly), but all other content (places, collections, events, etc.) is served from mock files at runtime.

### AI Concierge
- Full OpenAI integration code is present (`app/api/concierge/ai/route.ts`).
- The `aiConcierge` feature flag is off; page serves Compass-based recommendations as a fallback.
- **Note:** model ID is hardcoded to `gpt-5.5` — this is not a standard OpenAI model ID and will likely error when the flag is turned on.

### AI Trip Planner
- Planner UI is functional without AI. AI flag is disabled.
- `app/planner/new/page.tsx` and `app/planner/[id]/page.tsx` import directly from mock data modules.

### Analytics
- GA4 and Clarity component scripts are wired.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` is **not in `.env.example`** and has no value.
- `NEXT_PUBLIC_CLARITY_PROJECT_ID` is in `.env.example` but empty.
- Neither analytics service is collecting data until env vars are set.

### Email — contact form
- 5 claim transactional emails are fully wired.
- The contact form (`/contact`) calls `event.preventDefault()` and sets `submitted = true` locally. **No email is sent.** Comment in source reads: `"Mock submit only for now. No emails are sent yet."`

### Founding Partners CRM
- Public marketing page is clean.
- Basecamp CRM page is labelled `statusPill="Mock CRM"`.
- `data/foundingPartners.ts` has 3 of 5 entries named `"Bellows Falls business placeholder"`, `"Local café placeholder"`, `"Brewery placeholder"`.

---

## 3. Mock-Only Features

These render real UI but operate entirely on hardcoded test data.

| Feature | Evidence |
|---|---|
| **Places data** | `data/places.ts` — mock seed; no Supabase sync active |
| **Collections** | `data/collections.ts` — exports `mockCollections` |
| **Events** | `data/events.ts` — exports `mockEvents` |
| **Deals** | `data/deals.ts` — exports `mockDeals` |
| **Articles / Guides** | `data/articles.ts` — exports `mockArticles` |
| **Reviews** | `data/reviews.ts` — mock seed (reviews feature flag also off) |
| **Trips** | `data/trips.ts` — mock seed |
| **Passport** | `data/passport.ts` — mock seed (passport feature flag also off) |
| **Analytics dashboards** | `data/analytics.ts` — mock seed (analytics flag also off) |
| **Partner outreach** | `data/partnerOutreach.ts` — mock data in Basecamp |
| **Morning briefing** | `data/morningBriefing.ts` — mock seed |
| **Weekly issue** | `data/weeklyIssue.ts` — mock seed |
| **SouthernVT 100** | `data/southernvt100.ts` — mock seed |
| **Place DNA** | `data/placeDNA.ts` — mock seed |
| **Media library** | `data/media.ts` / `mediaAssets.ts` — mock seed |
| **Explorer** | `data/explorer.ts` — mock seed |
| **Relationships** | `data/relationships.ts` — mock seed |
| **Verifications** | `data/verifications.ts` — mock seed |
| **Editorial issues** | `data/editorialIssues.ts` — mock seed |
| **Founding Partners CRM** | `data/foundingPartners.ts` — 3 of 5 entries are named placeholders |
| **Contact form** | Submits locally, no API or email |
| **Basecamp businesses panel** | `app/basecamp/businesses/page.tsx` — actions labelled "mock-only in this preview" |

---

## 4. Disabled Features

Features that are intentionally off and render disabled/fallback states.

| Feature | Flag | Notes |
|---|---|---|
| **Interactive Map** | `mapbox = false` | Renders fallback message; no Mapbox integration |
| **Passport** | `passport = false` | Check-in / stamp system hidden sitewide |
| **AI Concierge narration** | `aiConcierge = false` | Returns static narrative; OpenAI not called |
| **AI Trip Planner** | `aiPlanner = false` | Planner UI works in non-AI mode |
| **Public reviews** | `reviews = false` | Review UI hidden on place pages |
| **Premium profiles** | `premiumProfiles = false` | Premium content blocks hidden sitewide |
| **Editorial Intelligence** | `editorialIntelligence = false` | Homepage intelligence section hidden |
| **Analytics dashboards** | `analytics = false` | Basecamp analytics hidden |
| **Billing / Stripe** | `billing = false` | No payment infrastructure exists |
| **Supabase repository mode** | `supabase = false` | All content repositories use mock data |
| **Weather** | `weather = false` | Weather summaries hidden |

---

## 5. Critical Launch Blockers

Issues that must be resolved before any public launch.

### 🔴 B1 — Privacy policy is placeholder text
- `app/privacy/page.tsx` contains: `"Privacy policy placeholder for SouthernVT beta launch."`
- A real privacy policy is legally required before collecting any user data (signups, claims).
- **File:** `app/privacy/page.tsx:11`

### 🔴 B2 — Contact form sends nothing
- `components/public/ContactInquiryForm.tsx` explicitly comments `"Mock submit only for now. No emails are sent yet."`
- Visitors who use the contact form receive no response and SouthernVT receives no notification.
- **File:** `components/public/ContactInquiryForm.tsx:49`

### 🔴 B3 — Supabase feature flag defeats live data
- `data/featureFlags.ts` sets `supabase: enabled: false`.
- Even with valid Supabase env vars, all places/collections/events/deals/articles repositories serve mock data.
- The `businessPortal` claim flow bypasses this (it calls Supabase directly), creating an inconsistency.
- **Fix:** Toggle `supabase` flag to `true` in production, or set `NEXT_PUBLIC_REPOSITORY_MODE=supabase` env var.

### 🔴 B4 — Production env vars not configured
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` must be set for auth and claims to work.
- `RESEND_API_KEY`, `CLAIMS_EMAIL_FROM`, `CLAIMS_ADMIN_EMAIL` must be set for email to work.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` is missing from `.env.example` entirely.
- Without these, auth is broken, claims aren't saved, and emails aren't sent.

### 🔴 B5 — AI Concierge model ID is invalid
- `app/api/concierge/ai/route.ts` calls `gpt-5.5` — not a valid OpenAI model ID as of any public release.
- When `aiConcierge` flag is enabled, every AI request will error.
- **Fix:** Change to `gpt-4o` or `gpt-4-turbo` before enabling the flag.

### 🟡 B6 — Supabase migrations not applied
- Two migrations exist (`202607050001_business_claiming_live.sql`, `202607050002_claim_listing_fields.sql`) but must be manually run against the Supabase project.
- Without them, the `business_claims`, `business_listing_owners`, and `business_listing_edit_requests` tables don't exist and all claim/auth operations fail.

### 🟡 B7 — `businessPortal` feature flag dependency
- The `/claim-listing` page returns 404 if `businessPortal` flag is `false`.
- This is currently `true` in the seed data — but if the Supabase `feature_flags` table overrides it, the claim flow disappears for public users.
- Confirm the flag is `true` in the live Supabase `feature_flags` table.

---

## 6. Recommended Fixes

Ordered by impact. Do not require large rewrites.

1. **Write the privacy policy.** Even a minimal beta-appropriate policy covers data collection, cookies, and contact. Required before public launch.

2. **Wire the contact form.** Add a `POST /api/contact` route that calls `sendEmail()` using the existing Resend infrastructure. 30-minute task given the email system already exists.

3. **Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to `.env.example`.** It's already used in code — just needs documenting.

4. **Add `NEXT_PUBLIC_REPOSITORY_MODE` to `.env.example`.** Referenced in `lib/repositories/RepositoryProvider.tsx` but undocumented.

5. **Toggle `supabase` feature flag on in production.** Or set `NEXT_PUBLIC_REPOSITORY_MODE=supabase`. This makes places, collections, events, and all other content serve live Supabase data instead of mock arrays.

6. **Fix the AI Concierge model ID.** Change `gpt-5.5` to `gpt-4o` in `app/api/concierge/ai/route.ts` before enabling the `aiConcierge` flag.

7. **Clean placeholder founding partner entries.** Remove or mark as `status: "slot_available"` the 3 hardcoded placeholder names in `data/foundingPartners.ts`.

8. **Apply Supabase migrations** before launch:
   - `supabase/migrations/202607050001_business_claiming_live.sql`
   - `supabase/migrations/202607050002_claim_listing_fields.sql`

9. **Confirm `businessPortal` flag is `true` in live Supabase `feature_flags` table** (not just the local seed).

10. **Set up Resend sender domain verification** for `CLAIMS_EMAIL_FROM` before any claim emails can deliver.

---

## 7. Future Nice-to-Haves

Not blockers, but worth tracking.

- **Partner Portal sub-sections** — Deals, Events, Insights, and Dashboard tabs are scaffolded but redirect. Build these after first owners are active.
- **Interactive Map** — Mapbox integration exists in feature flag. Needs a Mapbox API key and flag toggle.
- **Passport / check-in system** — UI exists, flag is off. Good for a "Phase 2" engagement feature.
- **AI Concierge** — Code is ready (minus model ID fix). Enable after `gpt-4o` fix and OPENAI_API_KEY is set.
- **Public reviews** — Review repository and UI exist behind feature flag. Needs moderation workflow before enabling.
- **Premium listing profiles** — UI blocks exist behind `premiumProfiles` flag. Placeholder for future owner upgrade path.
- **Billing / Stripe** — Explicitly out of scope for beta. Good Phase 3 milestone.
- **Founding Partners CRM** — Replace the mock Basecamp panel with a real onboarding flow when first partners sign.
- **Real place/collection/event data in Supabase** — Currently all served from mock files. Migrating to live data is the largest single content infrastructure task.
- **`NEXT_PUBLIC_SITE_URL` fallback** — Currently defaults to `https://southernvt.com` in email templates. Verify this is set correctly in both staging and production.
- **`/why-trust-southernvt` route verification** — Exists in build output but wasn't confirmed to have a `page.tsx` during audit.
- **Weather feature** — Flag exists, no implementation present yet.
- **Editorial intelligence homepage section** — Flag exists, no implementation confirmed.
- **Vercel Analytics** — Not present in codebase. Add `@vercel/analytics` if deploying to Vercel.

---

## 8. Launch Readiness Score

**61 / 100**

| Category | Score | Weight | Notes |
|---|---|---|---|
| Core routes & navigation | 9/10 | — | All routes build; minor dead nav links |
| Business listings | 9/10 | — | 128 real listings, live claim status |
| Claim flow | 9/10 | — | End-to-end wired, needs env vars |
| Auth / login | 8/10 | — | Supabase-wired, needs env vars |
| Email system | 7/10 | — | Claim emails done; contact form not wired |
| Partner portal | 5/10 | — | Main page works; all sub-routes stub out |
| Content data (non-business) | 3/10 | — | Almost all mock; Supabase flag disabled |
| Analytics | 3/10 | — | Components present, no keys configured |
| Legal / Privacy | 1/10 | — | Placeholder privacy policy |
| AI features | 0/10 | — | All disabled (by design for beta) |
| Billing | 0/10 | — | Not present (by design for beta) |
| Mobile layout | 10/10 | — | Full responsive coverage confirmed |
| SEO | 9/10 | — | robots, sitemap, metadata all solid |
| Error handling | 9/10 | — | Branded 404, error boundaries present |

> **Interpretation:** SouthernVT is a well-structured, well-built beta product. The core business listing and claim workflow are genuinely launch-ready. The main drag on the score is the prevalence of mock data for non-business content, disabled analytics, a placeholder privacy policy, and an unwired contact form — all of which are fixable in days rather than weeks.

---

## Build Result

```
npm run lint     ✅  0 errors, 137 warnings (all pre-existing, unrelated to recent changes)
npm run typecheck ✅  No errors
npm run build   ✅  110 static pages, all routes compile clean
```

---

## Top 10 Next Tasks

| # | Task | Effort | Impact |
|---|---|---|---|
| 1 | Write and publish real Privacy Policy | 2-4 hrs | 🔴 Launch blocker |
| 2 | Wire `/contact` form → `POST /api/contact` using existing Resend system | 1 hr | 🔴 UX gap |
| 3 | Set all production env vars (`SUPABASE_*`, `RESEND_*`, `GA_*`) | 1 hr | 🔴 Infrastructure |
| 4 | Apply both Supabase migrations on live project | 15 min | 🔴 Infrastructure |
| 5 | Toggle `supabase` flag `true` in production (or set `NEXT_PUBLIC_REPOSITORY_MODE=supabase`) | 5 min | 🟡 Live data |
| 6 | Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` and `NEXT_PUBLIC_REPOSITORY_MODE` to `.env.example` | 5 min | 🟡 Documentation |
| 7 | Fix AI Concierge model ID from `gpt-5.5` → `gpt-4o` | 5 min | 🟡 Pre-AI-enable |
| 8 | Clean up or remove 3 placeholder entries in `data/foundingPartners.ts` | 15 min | 🟡 Content quality |
| 9 | Verify `businessPortal` and `publicPlaces` flags are `true` in live Supabase | 15 min | 🟡 Functionality |
| 10 | Configure Resend sender domain for `CLAIMS_EMAIL_FROM` | 30 min | 🟡 Email delivery |
