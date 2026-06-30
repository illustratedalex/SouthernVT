import { PartnerQuickActions } from "@/components/partner/PartnerQuickActions";
import { PartnerShell } from "@/components/partner/PartnerShell";
import { PartnerStats } from "@/components/partner/PartnerStats";
import { mockPartnerRecentActivity } from "@/data/partnerPortal";
import { isFeatureEnabled } from "@/lib/featureFlags";
import { createPageMetadata } from "@/lib/seo";
import { getCurrentOwner, getPartnerStats } from "@/repositories/PartnerPortalRepository";

export const metadata = createPageMetadata({
  title: "Partner Portal Dashboard",
  description: "Business owner dashboard with partner stats, activity, and quick actions.",
  path: "/partner-portal/dashboard",
});

export default async function PartnerPortalDashboardPage() {
  const [previewEnabled, owner, stats] = await Promise.all([
    isFeatureEnabled("businessPortal"),
    getCurrentOwner(),
    getPartnerStats(),
  ]);

  return (
    <PartnerShell
      title={`Welcome back, ${owner.name}`}
      description="Track how your place, offers, and events are performing."
      previewMode={!previewEnabled}
      active="dashboard"
    >
      <PartnerStats stats={stats} />

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
