export function Navigation() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-stone-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        <a href="#" className="text-lg font-semibold tracking-[0.24em] text-white uppercase">
          SouthernVT
        </a>
        <nav className="hidden items-center gap-6 text-sm text-stone-300 md:flex">
          <a className="transition hover:text-white" href="#explore">
            Explore
          </a>
          <a className="transition hover:text-white" href="#events">
            Events
          </a>
          <a className="transition hover:text-white" href="#offers">
            Offers
          </a>
          <a className="rounded-full border border-emerald-500/40 px-4 py-2 text-emerald-300 transition hover:bg-emerald-500/10" href="#newsletter">
            Plan a trip
          </a>
        </nav>
      </div>
    </header>
  );
}
