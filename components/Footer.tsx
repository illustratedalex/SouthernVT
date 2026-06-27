const footerLinks = [
  { label: "Explore", href: "#explore" },
  { label: "Adventure", href: "#adventure" },
  { label: "Events", href: "#events" },
  { label: "Deals", href: "#deals" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#e8dfc8] bg-[#14261f] px-6 py-12 text-slate-300 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xl font-semibold text-[#f8f2e4]">Southern Vermont</p>
          <p className="mt-3 text-base leading-8 text-slate-400">
            Thoughtful travel ideas for scenic drives, local dining, mountain stays, and unforgettable outdoor moments.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-[#f8f2e4]">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
