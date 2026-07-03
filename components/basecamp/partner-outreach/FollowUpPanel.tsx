import Link from "next/link";
import type { OutreachBusiness } from "@/types/PartnerOutreach";

export function FollowUpPanel({ businesses }: { businesses: OutreachBusiness[] }) {
  const followUps = [...businesses]
    .sort((a, b) => new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime())
    .slice(0, 6);

  return (
    <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Follow-up Panel</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Upcoming follow-ups</h2>
      <div className="mt-4 space-y-2">
        {followUps.map((business) => (
          <Link key={business.id} href="/basecamp/partner-outreach" className="block rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 transition hover:bg-white hover:border-[#d7cbb3]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{business.businessName}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                {new Date(business.nextFollowUp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-600">{business.notes}</p>
          </Link>
        ))}
      </div>
    </article>
  );
}
