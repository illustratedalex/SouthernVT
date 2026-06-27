const navItems = [
  { label: "Explore", href: "#explore" },
  { label: "Adventure", href: "#adventure" },
  { label: "Events", href: "#events" },
  { label: "Deals", href: "#deals" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8dfc8] bg-[#f8f2e4]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <a href="#" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1f3b2f] text-sm font-semibold uppercase tracking-[0.24em] text-[#f8f2e4]">
            SV
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#1f3b2f]">
              SouthernVT
            </p>
            <p className="text-xs text-slate-600">Travel guide</p>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-700 transition hover:text-[#1f3b2f]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#newsletter"
          className="rounded-full border border-[#1f3b2f] px-4 py-2 text-sm font-semibold text-[#1f3b2f] transition hover:bg-[#1f3b2f] hover:text-[#f8f2e4]"
        >
          Plan a trip
        </a>
      </div>
    </header>
  );
}
