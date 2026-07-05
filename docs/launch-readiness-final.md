# Launch Readiness Final Audit

Last updated: 2026-07-05

## Scope

- Public launch blockers only
- No backend architecture changes
- Safety-first behavior for missing third-party configuration

## Results by task

### 1) Contact form email routing
- `/contact` and `/api/contact` verified.
- Resend is required (`RESEND_API_KEY`, `CONTACT_EMAIL_FROM`).
- No fake success if email is unconfigured (`503` returned).
- Routing map verified:
  - General Question / Suggest a Place / Correct a Listing / Other → `hello@southernvt.com` (`GENERAL_EMAIL_TO`)
  - Founding Partner Inquiry / Claim a Business → `partners@southernvt.com` (`PARTNERS_EMAIL_TO`)
  - Press / Media → `press@southernvt.com` (`PRESS_EMAIL_TO`)

### 2) Privacy policy
- `/privacy` contains real beta-ready policy text.
- No placeholder legal copy remains.

### 3) Terms
- `/terms` exists and includes launch-critical statements:
  - listings may change
  - users should verify details and conditions
  - editorial recommendations are not for sale
  - verification cannot be purchased
  - submitted content may be reviewed

### 4) Supabase live readiness
- Supabase mode docs verified:
  - `docs/supabase-live-mode.md`
  - `docs/supabase-setup.md`
- Runtime mode resolver supports:
  - `NEXT_PUBLIC_REPOSITORY_MODE=supabase`
  - Safe fallback to `mock` when Supabase env is incomplete

### 5) Business claims
- Legacy `/claim/[slug]` redirects to `/claim-listing?listing=<slug>`.
- `/api/claims` fails safely with explicit `partners@southernvt.com` guidance when not configured.
- `/basecamp/claims` queue is present for pending claim review.
- `/partner-portal` messaging clearly states phased owner tooling and manual support path.

### 6) Production env checklist
- `.env.example` includes required launch variables.
- `docs/production-env-checklist.md` updated to include:
  - `GENERAL_EMAIL_TO`
  - `PARTNERS_EMAIL_TO`
  - `PRESS_EMAIL_TO`

### 7) Search Console / SEO
- `app/sitemap.ts` includes public routes and public dynamic entities.
- `app/robots.ts` includes:
  - `https://www.southernvt.com/sitemap.xml`
- No Basecamp/private routes are emitted in sitemap.

### 8) Public placeholder cleanup
- Updated public-facing wording to remove raw "mock/placeholder/TODO" launch leaks.
- Kept intentional "coming soon" messaging where features are explicitly staged.

### 9) Mobile polish spot-check
- Existing mobile polish remains in place for:
  - homepage
  - businesses
  - places
  - concierge
  - contact
  - founding partners
- No new regressions introduced in this sprint pass.

### 10) Feature flags sanity
- Launch defaults remain aligned:
  - mapbox OFF
  - billing OFF
  - premiumProfiles OFF
  - supabase live OFF by default until env + migration readiness
- Public nav does not expose disabled map/planner surfaces.

## Manual actions still required

1. Set production env vars in Vercel (Supabase, Resend, analytics, OpenAI, Stripe optional).
2. Verify Resend domain (`southernvt.com`) and sender identities.
3. Apply Supabase migrations before enabling `NEXT_PUBLIC_REPOSITORY_MODE=supabase`.
4. In Google Search Console:
   - verify domain
   - submit sitemap
   - request indexing for key pages

## Launch readiness score

**95 / 100 (Launch-ready, pending external production configuration).**
