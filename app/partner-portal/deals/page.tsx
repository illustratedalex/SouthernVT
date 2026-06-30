import { PartnerDealsList } from "@/components/partner/PartnerDealsList";
import { PartnerShell } from "@/components/partner/PartnerShell";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getCurrentOwner, getOwnerDeals } from "@/repositories/PartnerPortalRepository";

export const metadata = createPageMetadata({
  title: "Partner Portal Deals",
  description: "Manage current and draft promotions in the SouthernVT Partner Portal.",
  path: "/partner-portal/deals",
});

export default async function PartnerPortalDealsPage() {
  const [previewEnabled, owner] = await Promise.all([isFeatureEnabled("businessPortal"), getCurrentOwner()]);
  const deals = await getOwnerDeals(owner.id);

  return (
    <PartnerShell
      title="Manage your offers"
      description="Review active promotions, drafts, and plan your next seasonal campaign."
      previewMode={!previewEnabled}
      active="deals"
    >
      <PartnerDealsList deals={deals} />
    </PartnerShell>
  );
}
