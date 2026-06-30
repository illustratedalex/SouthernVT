type SeasonPlan = {
  season: string;
  topics: string[];
};

type SeasonPlannerProps = {
  plans: SeasonPlan[];
};

export function SeasonPlanner({ plans }: SeasonPlannerProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Upcoming Seasons</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <article key={plan.season} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">{plan.season}</p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              {plan.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
