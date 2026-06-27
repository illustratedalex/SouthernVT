export default function NewsletterSignup() {
  return (
    <section id="newsletter" className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-10">
      <div className="rounded-[2rem] bg-[#14261f] px-8 py-12 text-[#f8f2e4] shadow-2xl sm:px-10 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#d8b15d]">
              Newsletter
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Receive curated weekend ideas, seasonal events, and hidden escapes.
            </h2>
          </div>

          <div className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email address"
              className="h-14 flex-1 rounded-2xl border border-slate-700 bg-[#101a15] px-4 text-base text-[#f8f2e4] outline-none placeholder:text-slate-400"
            />
            <button className="h-14 rounded-2xl bg-[#d8b15d] px-6 font-semibold text-[#14261f] transition hover:bg-[#e2bf6d]">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
