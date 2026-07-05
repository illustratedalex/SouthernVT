# Feature Flags Launch Sanity Check

This document defines launch-ready defaults for public SouthernVT features and how those flags are applied in UI/navigation.

## Launch defaults

### ON for launch
- `aiConcierge` (with fallback narrative if `OPENAI_API_KEY` is missing)
- `passport` (public route is live and supports preview mode)
- `partnerPortal` / `businessPortal` (public route live with clear access state)
- `businessClaims` (claim flow live with safe 503 behavior if not configured)
- `publicPlaces` (public places directory/detail routes)
- `publicBusinesses` (public businesses directory/detail routes)
- `foundingPartners` (public route live)
- `travelerExperiences` (public example-preview section enabled)

### OFF unless fully configured
- `mapbox`
- `premiumProfiles`
- `billing`
- `supabase` live mode (keep mock mode until env + migrations are fully ready)

## Current implementation mapping

Some launch controls are explicit feature-flag keys in the repository; others are route/module launch policies.

| Launch concern | Current implementation key/path | Launch default |
|---|---|---|
| aiConcierge | `aiConcierge` flag + `/api/concierge/ai` fallback behavior | ON |
| aiPlanner | `aiPlanner` | OFF |
| weather | Basecamp settings toggle only | OFF |
| passport | `passport` | ON |
| partnerPortal | `businessPortal` (repository) + `partnerPortal` (Basecamp local settings) | ON |
| businessClaims | Basecamp local feature toggle + live claim routes | ON |
| publicPlaces | `publicPlaces` | ON |
| publicBusinesses | Public route policy (`/businesses`) | ON |
| foundingPartners | Public route policy (`/founding-partners`) | ON |
| travelerExperiences | Public component policy (example-preview mode) | ON |
| editorialIntelligence | `editorialIntelligence` | OFF |
| mapbox | `mapbox` | OFF |
| premiumProfiles | `premiumProfiles` | OFF |
| billing | `billing` | OFF |
| supabase | `supabase` + `NEXT_PUBLIC_REPOSITORY_MODE` | OFF by default |

## Navigation policy

Public navigation hides disabled unfinished features:
- Hide `/map` when `mapbox` is disabled
- Hide `/trip-planner` when `aiPlanner` is disabled
- Hide `/passport` when `passport` is disabled
- Hide `/partner-portal` when `businessPortal` is disabled

Footer also hides `Partner Portal` when `businessPortal` is disabled.

## Basecamp settings alignment

Basecamp launch defaults are aligned to launch policy:
- `aiConcierge`: ON
- `aiPlanner`: OFF
- `weather`: OFF
- `passport`: ON
- `partnerPortal`: ON
- `businessClaims`: ON
- `mapbox`: OFF
- `premiumProfiles`: OFF

## Launch verification checklist

1. Confirm public nav does not expose disabled modules.
2. Confirm disabled modules are either hidden or show polished preview/coming-soon messaging.
3. Confirm Basecamp feature badges and toggles reflect launch defaults.
4. Confirm repository mode remains `mock` until Supabase migration + env checklist is complete.
