import { BasecampPageHeader, BasecampSection, PassportStats, RecentStamps, RewardTable } from "@/components/basecamp";
import { getRewards, getPassportStats } from "@/repositories/PassportRepository";

export default async function BasecampPassportPage() {
  const [stats, rewards] = await Promise.all([getPassportStats(), getRewards()]);
  const safeTopCheckInPlaces = Array.isArray(stats?.topCheckInPlaces) ? stats.topCheckInPlaces : [];
  const safeRecentStamps = Array.isArray(stats?.recentStamps) ? stats.recentStamps : [];
  const safeRewards = Array.isArray(rewards) ? rewards : [];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <BasecampPageHeader
          eyebrow="Basecamp"
          title="Adventure Passport dashboard"
          description="Monitor mock member participation, stamp activity, and reward readiness."
          primaryAction={{ label: "Open passport", href: "/passport" }}
        />

        <PassportStats stats={stats} />

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <BasecampSection title="Top check-in places" eyebrow="Passport" className="p-6">
            <h2 className="text-xl font-semibold text-slate-900">Top check-in places</h2>
            <ul className="mt-4 space-y-3">
              {safeTopCheckInPlaces.map((place) => (
                <li key={place.placeId} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] px-4 py-3 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">{place.placeName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">{place.stamps} stamp{place.stamps === 1 ? "" : "s"}</p>
                </li>
              ))}
            </ul>
          </BasecampSection>

          <RecentStamps stamps={safeRecentStamps} />
        </section>

        <RewardTable rewards={safeRewards} />
      </div>
    </div>
  );
}
