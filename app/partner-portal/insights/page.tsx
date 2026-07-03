import { PartnerShell } from "@/components/partner/PartnerShell";
import { PartnerValueSummary } from "@/components/partner/PartnerValueSummary";
import { PartnerReadinessScore } from "@/components/partner/PartnerReadinessScore";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { calculatePartnerReadinessScore } from "@/lib/partner/PartnerReadinessService";
import { createPageMetadata } from "@/lib/seo";
import { getCurrentOwner, getOwnerPlaces } from "@/repositories/PartnerPortalRepository";

export const metadata = createPageMetadata({
  title: "Partner Insights",
  description: "View your business profile insights and readiness score.",
  path: "/partner-portal/insights",
});

// Mock insights data generator
function generateMockInsights() {
  return {
    profileViews: 2847,
    websiteClicks: 156,
    phoneClicks: 89,
    directionsClicks: 234,
    savedToTrips: 412,
    passportCheckIns: 167,
    dealViews: 1023,
    collectionAppearances: 8,
    guideMentions: 3,
    searchImpressions: 5892,
    topSearchTerms: ["historic inn", "dining vermont", "weekend getaway", "romantic restaurant", "vermont lodging"],
  };
}

export default async function PartnerInsightsPage() {
  const [previewEnabled, owner, ownerPlaces] = await Promise.all([
    isFeatureEnabled("businessPortal"),
    getCurrentOwner(),
    getOwnerPlaces(),
  ]);

  const primaryPlace = ownerPlaces[0];
  const readinessScore = primaryPlace ? calculatePartnerReadinessScore(primaryPlace) : null;
  const mockInsights = generateMockInsights();

  return (
    <PartnerShell
      title="Partner Insights"
      description="Track how your profile is helping visitors discover your business."
      previewMode={!previewEnabled}
      active="insights"
    >
      {primaryPlace ? (
        <div className="space-y-6">
          <PartnerValueSummary businessName={primaryPlace.name} insights={mockInsights} />

          {readinessScore ? <PartnerReadinessScore score={readinessScore} /> : null}
        </div>
      ) : (
        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 text-sm text-slate-600 shadow-sm">
          No linked places were found for this owner.
        </section>
      )}
    </PartnerShell>
  );
}
