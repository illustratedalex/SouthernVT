import { PartnerEventsList } from "@/components/partner/PartnerEventsList";
import { PartnerShell } from "@/components/partner/PartnerShell";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getCurrentOwner, getOwnerEvents } from "@/repositories/PartnerPortalRepository";

export const metadata = createPageMetadata({
  title: "Partner Portal Events",
  description: "Track upcoming and past event submissions in the SouthernVT Partner Portal.",
  path: "/partner-portal/events",
});

export default async function PartnerPortalEventsPage() {
  const [previewEnabled, owner] = await Promise.all([isFeatureEnabled("businessPortal"), getCurrentOwner()]);
  const events = await getOwnerEvents(owner.id);

  return (
    <PartnerShell
      title="Manage your events"
      description="Keep your business events fresh, timely, and discoverable."
      previewMode={!previewEnabled}
      active="events"
    >
      <PartnerEventsList events={events} />
    </PartnerShell>
  );
}
