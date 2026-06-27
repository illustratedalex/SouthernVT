export default function AdventureFeature() {
  return (
    <section id="adventure" className="bg-[#f3ebd8] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="rounded-[2rem] bg-[#1f3b2f] p-8 text-[#f8f2e4] shadow-xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d8b15d]">
            Today&apos;s adventure
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Begin with a waterfall walk, then slow down over cider and a mountain view.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-200">
            Spend the day moving from a hidden trailhead to a local farm stand, then settle in for dinner with a view of the hills at dusk.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-200">
            <span className="rounded-full border border-white/15 px-4 py-2">3-4 hours</span>
            <span className="rounded-full border border-white/15 px-4 py-2">Scenic route</span>
            <span className="rounded-full border border-white/15 px-4 py-2">Family friendly</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] shadow-xl">
          <div
            className="h-full min-h-[320px] bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80')",
            }}
          />
        </div>
      </div>
    </section>
  );
}
