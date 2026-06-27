const highlights = ["Waterfalls", "Scenic drives", "Farm dinners", "Mountain stays"];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950 text-[#f8f2e4]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(14,24,20,0.9) 0%, rgba(14,24,20,0.65) 45%, rgba(14,24,20,0.3) 100%), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=80')",
        }}
      />
      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-6 py-24 sm:px-8 lg:px-10">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-[#d8b15d]">
            Premium Vermont travel guide
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">
            Discover Southern Vermont at the pace you love.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Follow forest trails, sip local cider, and linger in mountain towns with thoughtful recommendations for every kind of escape.
          </p>
        </div>

        <div className="mt-10 w-full max-w-3xl rounded-[1.75rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-3 rounded-[1.35rem] bg-[#14261f]/90 p-3 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search hikes, inns, food, and events"
              className="h-14 flex-1 rounded-2xl border border-slate-700 bg-[#101a15] px-4 text-base text-[#f8f2e4] outline-none placeholder:text-slate-400"
            />
            <button className="h-14 rounded-2xl bg-[#d8b15d] px-6 text-base font-semibold text-[#14261f] transition hover:bg-[#e2bf6d]">
              Start exploring
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {highlights.map((item) => (
            <span key={item} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
