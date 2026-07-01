import { PartnerQuickActions } from "@/components/partner/PartnerQuickActions";
import { PartnerShell } from "@/components/partner/PartnerShell";
import { PartnerStats } from "@/components/partner/PartnerStats";
import { mockPartnerRecentActivity } from "@/data/partnerPortal";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getCurrentOwner, getOwnerPlaces, getPartnerStats } from "@/repositories/PartnerPortalRepository";

export const metadata = createPageMetadata({
  title: "Partner Portal Dashboard",
  description: "Business owner dashboard with partner stats, activity, and quick actions.",
  path: "/partner-portal/dashboard",
});

export default async function PartnerPortalDashboardPage() {
  const [previewEnabled, premiumProfilesEnabled, owner, stats, ownerPlaces] = await Promise.all([
    isFeatureEnabled("businessPortal"),
    isFeatureEnabled("premiumProfiles"),
    getCurrentOwner(),
    getPartnerStats(),
    getOwnerPlaces(),
  ]);
  const primaryPlace = ownerPlaces[0] ?? null;
  const showPremiumPanel = premiumProfilesEnabled && Boolean(primaryPlace?.ownerClaimed);

  return (
    <PartnerShell
      title={`Welcome back, ${owner.name}`}
      description="Track how your place, offers, and events are performing."
      previewMode={!previewEnabled}
      active="dashboard"
    >
      <PartnerStats stats={stats} />

      {showPremiumPanel ? (
        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Premium Status</h2>
          <p className="mt-2 text-sm text-slate-600">{primaryPlace?.name} is {primaryPlace?.isPremium ? "premium-enabled" : "standard"}.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Profile Views</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.profileViews ?? stats.placeViews}</p>
            </article>
            <article className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Passport Visits</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.passportVisits ?? stats.passportCheckIns}</p>
            </article>
            <article className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Deal Views</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">{stats.dealViews ?? stats.dealRedemptions}</p>
            </article>
            <article className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Recent Visitors</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">Recent visitors placeholder</p>
            </article>
          </div>
          <div className="mt-4">
            <button type="button" className="rounded-full border border-[#d7cbb3] px-4 py-2 text-sm font-semibold text-slate-700">Upgrade Placeholder</button>
          </div>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-slate-900">Recent activity</h2>
          <ul className="mt-4 space-y-3">
            {mockPartnerRecentActivity.map((activity) => (
              <li key={activity.id} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-600">{activity.description}</p>
                <p className="mt-1 text-xs text-slate-500">{activity.createdAt}</p>
              </li>
            ))}
          </ul>
        </section>

        <PartnerQuickActions />
      </div>
    </PartnerShell>
  );
}
