const weekendEvents = [
  {
    title: "Summer Music on the Green",
    detail: "Friday • Brattleboro • Live sets and riverfront dining",
  },
  {
    title: "Farmers Market Morning",
    detail: "Saturday • Manchester • Fresh pastries, crafts, and local produce",
  },
  {
    title: "Moonlight Trail Walk",
    detail: "Sunday • Bennington • Guided evening stroll with lanterns",
  },
];

export default function EventPreview() {
  return (
    <section id="events" className="bg-[#f8f2e4] py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#1f3b2f]">
              This weekend
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              A few of the best local plans for the next few days.
            </h2>
          </div>
          <a href="#newsletter" className="text-sm font-semibold text-[#1f3b2f] transition hover:text-[#2e5943]">
            Get seasonal ideas →
          </a>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {weekendEvents.map((event) => (
            <article key={event.title} className="rounded-[1.5rem] border border-[#e8dfc8] bg-white p-7 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8b15d]">Local plan</p>
              <h3 className="mt-4 text-xl font-semibold text-slate-900">{event.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{event.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
