"use client";

import type { PartnerInsight } from "@/types/PartnerReadiness";

interface PartnerValueSummaryProps {
  businessName: string;
  insights: PartnerInsight;
}

export function PartnerValueSummary({ businessName, insights }: PartnerValueSummaryProps) {
  const metrics = [
    { label: "Profile Views", value: insights.profileViews, icon: "👁️" },
    { label: "Website Clicks", value: insights.websiteClicks, icon: "🔗" },
    { label: "Phone Clicks", value: insights.phoneClicks, icon: "☎️" },
    { label: "Saved to Trips", value: insights.savedToTrips, icon: "🗺️" },
    { label: "Passport Check-ins", value: insights.passportCheckIns, icon: "✓" },
    { label: "Deal Views", value: insights.dealViews, icon: "🎁" },
  ];

  const achievements = [
    { label: "Collections", value: insights.collectionAppearances },
    { label: "Guide Mentions", value: insights.guideMentions },
    { label: "Search Impressions", value: insights.searchImpressions },
  ];

  const topTerms = insights.topSearchTerms.slice(0, 5);

  return (
    <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Your Value on SouthernVT</h2>
      <p className="mt-2 text-sm text-slate-600">
        {businessName} is already helping visitors discover your business. Here&apos;s how you&apos;re performing.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
            <div className="flex items-baseline justify-between">
              <p className="text-3xl font-bold text-slate-900">{metric.value.toLocaleString()}</p>
              <span className="text-xl">{metric.icon}</span>
            </div>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{metric.label}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <article key={achievement.label} className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
            <p className="text-2xl font-bold text-[#1f3b2f]">{achievement.value}</p>
            <p className="mt-2 text-sm text-slate-600">{achievement.label}</p>
          </article>
        ))}
      </div>

      {topTerms.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-[#f0ebe2] bg-[#fcfaf6] p-4">
          <p className="text-sm font-semibold text-slate-900 mb-3">Top visitor search terms:</p>
          <div className="flex flex-wrap gap-2">
            {topTerms.map((term) => (
              <span
                key={term}
                className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-sm text-slate-600"
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-6 rounded-2xl border border-[#e8dfc8] bg-[#fff7e4] p-3 text-sm text-[#6b5a30]">
        ✓ Partner tools are free during the SouthernVT beta. Thank you for helping us build a better guide to Southern Vermont.
      </p>
    </section>
  );
}
