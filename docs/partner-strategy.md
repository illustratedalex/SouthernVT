# Partner Infrastructure Strategy

## Overview

The Partner Infrastructure Foundation provides SouthernVT with a framework for partner value discovery and profile optimization without commercial pressure or payment systems.

## Core Principles

### 1. Free During Beta
All partner tools are available at no charge during the SouthernVT beta. This establishes trust and gathers user feedback before introducing premium features.

### 2. Compass Controls Recommendations
Partner insights reflect actual engagement metrics—they do not grant editorial privilege or featured placement. Recommendations remain determined by Compass Engine and Discovery Services.

### 3. Verification Cannot Be Bought
The "Verified by SouthernVT" badge is purely editorial and earned through quality, completeness, and authenticity—never through payment or partnership level.

### 4. Deferred Monetization
Pricing, plans, subscriptions, and premium tiers are intentionally not implemented. These will be introduced in future phases with proper UX design and feature parity.

## Architecture

### Feature Flags

- **partnerFeatures** (default: true)
  - Controls visibility of partner insights, readiness scoring, and value summary
  - Enables partner-facing components without payment features

- **billing** (default: false)
  - Controls visibility of pricing, plans, subscriptions, and payment language
  - Completely disabled during beta to avoid confusion

### Data Types

**PartnerReadiness.ts**
- `PartnerReadinessScore`: Holistic profile completeness measurement (hero photo, gallery, story, verification, etc.)
- `ReadinessCriteria`: Specific profile attributes with weights
- `PartnerInsight`: Engagement metrics (profile views, clicks, saved trips, passport check-ins, deal views)
- `PartnerValueSummary`: Narrative summary of business impact on platform

### Services

**PartnerReadinessService.ts**
- `calculatePartnerReadinessScore(place)`: Evaluates 14 profile criteria and generates recommended next steps
- Criteria weighted by importance (story: 12, hero photo: 10, hours: 10, phone: 9, verification: 9, etc.)
- Returns percentage complete and actionable recommendations prioritized by impact

### Components

**PartnerReadinessScore.tsx**
- Visual progress bar with color-coded score (green ≥85%, amber ≥70%, orange <70%)
- Missing items checklist with descriptions
- Recommended next steps numbered for clarity
- Last updated timestamp

**PartnerValueSummary.tsx**
- 6 key metrics with icons (profile views, website clicks, phone clicks, saved to trips, passport check-ins, deal views)
- 3 achievement metrics (collection appearances, guide mentions, search impressions)
- Top 5 visitor search terms
- Beta message emphasizing free access

### Routes

**POST /partner-portal/insights**
- Shows PartnerValueSummary and PartnerReadinessScore for the owner's primary place
- Mock insights generated deterministically based on place ID
- Displays beta messaging

**GET /partner-portal/dashboard**
- Updated with beta message: "Partner tools are currently available at no charge during the SouthernVT beta..."
- Retains existing preview mode, stats, and quick actions

## Metrics

The system tracks:

- **Engagement**: Profile views, website/phone clicks, directions, saved trips
- **Loyalty**: Passport check-ins
- **Promotions**: Deal views
- **Editorial**: Collection appearances, guide mentions
- **Discovery**: Search impressions and top search terms

All metrics are mock-generated and reflect realistic business performance patterns.

## Future Phases

### Phase 2: Premium Features
- Featured badges and boosts (visual only, no algorithmic benefit)
- Advanced analytics (visitor geography, device types, referral sources)
- Marketing tools (banner builder, email templates)
- Event management enhancements

### Phase 3: Monetization
- Tiered pricing (Standard, Pro, Premium)
- Subscription billing via Stripe
- Usage-based features (photo uploads, event submissions)
- Partnership tiers with marketing value

### Phase 4: Advanced Tools
- AI-powered profile suggestions
- Competitive analysis
- Custom reports and export
- API access for integrations

## Safety & Grounding

### No Conflict with Editorial
- Partner readiness is purely informational
- Verification status unaffected by profile completeness
- Compass recommendations unaffected by partner tier or metrics
- Discovery Engine results driven by data, not business status

### No AI Personalization
- Partner insights are deterministic
- All metrics derived from real engagement data
- No algorithmic boosting or shadow weighting
- Transparent, auditable scoring

### No Upsells
- Partner portal shows only free tools during beta
- No pricing tables or upgrade prompts
- No scarcity language ("Limited slots", "Sign up now")
- Beta messaging emphasizes value and trust

## Implementation Notes

### Database Considerations
- PartnerReadiness is computed on-demand (no persistence needed)
- PartnerInsight metrics stored in mock data
- Future: Move to Supabase `partner_metrics` table when supabase flag enabled

### Performance
- Readiness calculation O(n) over 14 criteria
- Can be cached per place with invalidation on place update
- Insights load from mock data in <5ms

### Accessibility
- Score displays with color AND numeric value (not color-only)
- Recommended actions numbered for clarity
- Tab navigation through partner portal nav without issues
- All text is plain language, no jargon

## Decision Log

1. **No AI Recommendations**: Partner readiness is human-defined, not ML-based, to avoid bias and keep scores auditable.
2. **Mock Insights**: Deterministic, realistic mock data allows feature development without backend integration.
3. **Weighted Criteria**: Hero photo and business story weighted higher because they affect discovery likelihood most.
4. **Beta Message Required**: Explicit communication that tools are free removes uncertainty and builds trust.
5. **Separate Insights Route**: Keeps dashboard clean and gives insights proper emphasis as a dedicated feature.

## Rollout Plan

1. **Phase 1 (Current)**: partnerFeatures enabled, billing disabled
   - PartnerReadinessScore and PartnerValueSummary visible
   - Mock insights generated per place
   - Beta messaging on dashboard and insights

2. **Phase 2 (TBD)**: Supabase integration
   - Partner metrics stored in real database
   - Historical tracking enabled
   - Advanced filtering and export

3. **Phase 3 (Post-Beta)**: Billing enabled
   - Premium tiers introduced
   - Pricing published
   - Stripe integration activated

## Related Docs

- `docs/ai-concierge.md` — AI safety and grounding
- `docs/verification.md` — Verification system (when created)
- `.env.example` — No secrets needed (mock data only)
