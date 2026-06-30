import type { Deal } from "@/types/Deal";

interface PartnerDealsListProps {
  deals: Deal[];
}

export function PartnerDealsList({ deals }: PartnerDealsListProps) {
  const currentOffers = deals.filter((deal) => deal.status === "published" || deal.status === "scheduled");
  const draftOffers = deals.filter((deal) => deal.status === "draft" || deal.status === "review");

  return (
    <section className="space-y-6 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Owner deals</h2>
        <button type="button" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700">Add offer (placeholder)</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Current offers</h3>
          <ul className="mt-3 space-y-2">
            {currentOffers.length ? currentOffers.map((deal) => (
              <li key={deal.id} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{deal.title}</p>
                <p className="mt-1 text-xs text-slate-500">{deal.startDate} to {deal.endDate}</p>
              </li>
            )) : <li className="text-sm text-slate-500">No current offers.</li>}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Draft offers</h3>
          <ul className="mt-3 space-y-2">
            {draftOffers.length ? draftOffers.map((deal) => (
              <li key={deal.id} className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold text-slate-900">{deal.title}</p>
                <p className="mt-1 text-xs text-slate-500">Status: {deal.status}</p>
              </li>
            )) : <li className="text-sm text-slate-500">No draft offers.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
