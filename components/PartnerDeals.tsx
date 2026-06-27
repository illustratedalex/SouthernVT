const deals = [
  "15% off mountain cabin stays this week",
  "Free tasting flight at a local cidery",
  "Two-for-one kayak rentals on the river",
];

export default function PartnerDeals() {
  return (
    <section id="deals" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="rounded-[2rem] border border-[#e8dfc8] bg-[#1f3b2f] p-8 text-[#f8f2e4] shadow-xl sm:p-10">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d8b15d]">
            Partner discounts
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Exclusive offers from the people who know Vermont best.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {deals.map((deal) => (
            <div key={deal} className="rounded-[1.25rem] border border-white/10 bg-white/10 p-5 text-sm leading-7 text-slate-100">
              {deal}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
