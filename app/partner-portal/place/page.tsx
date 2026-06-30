import { PartnerPlaceEditor } from "@/components/partner/PartnerPlaceEditor";
import { PartnerShell } from "@/components/partner/PartnerShell";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getCurrentOwner, getOwnerPlaces } from "@/repositories/PartnerPortalRepository";

export const metadata = createPageMetadata({
  title: "Partner Portal Place Editor",
  description: "Edit your business listing information in the SouthernVT Partner Portal.",
  path: "/partner-portal/place",
});

export default async function PartnerPortalPlacePage() {
  const [previewEnabled, owner] = await Promise.all([isFeatureEnabled("businessPortal"), getCurrentOwner()]);
  const places = await getOwnerPlaces(owner.id);
  const place = places[0];

  return (
    <PartnerShell
      title="Manage your listing"
      description="Update your place details and submit edits for editorial approval."
      previewMode={!previewEnabled}
      active="place"
    >
      {place ? (
        <PartnerPlaceEditor place={place} />
      ) : (
        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 text-sm text-slate-600 shadow-sm">
          No linked places were found for this owner.
        </section>
      )}
    </PartnerShell>
  );
}
