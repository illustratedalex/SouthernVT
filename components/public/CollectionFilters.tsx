interface CollectionFiltersProps {
  search: string;
  season: string;
  audience: string;
  seasons: string[];
  audiences: string[];
}

export function CollectionFilters({ search, season, audience, seasons, audiences }: CollectionFiltersProps) {
  return (
    <form className="grid gap-3 rounded-[24px] border border-[#e8dfc8] bg-white/90 p-4 shadow-sm md:grid-cols-[1.2fr_0.8fr_0.8fr_auto] md:items-center" action="/collections" method="get">
      <input
        type="search"
        name="q"
        defaultValue={search}
        placeholder="Search guides by title, season, or vibe"
        className="h-12 rounded-full border border-(--color-pine)/25 px-4 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      />

      <select
        name="season"
        defaultValue={season}
        className="h-12 rounded-full border border-(--color-pine)/25 px-4 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        <option value="All">All seasons</option>
        {seasons.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        name="audience"
        defaultValue={audience}
        className="h-12 rounded-full border border-(--color-pine)/25 px-4 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        <option value="All">All audiences</option>
        {audiences.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <button type="submit" className="h-12 rounded-full bg-(--color-forest-green) px-5 text-sm font-semibold text-(--color-cream) transition hover:bg-(--color-pine)">
        Apply
      </button>
    </form>
  );
}
