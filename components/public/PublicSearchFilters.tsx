interface PublicSearchFiltersProps {
  search: string;
  placeType: string;
  category: string;
  placeTypes: string[];
  categories: string[];
}

export function PublicSearchFilters({ search, placeType, category, placeTypes, categories }: PublicSearchFiltersProps) {
  return (
    <form className="grid gap-3 rounded-[24px] border border-[#e8dfc8] bg-white/90 p-4 shadow-sm md:grid-cols-[1.2fr_0.8fr_0.8fr_auto] md:items-center" action="/places" method="get">
      <input
        type="search"
        name="q"
        defaultValue={search}
        placeholder="Search places by name, town, or vibe"
        className="h-12 rounded-full border border-(--color-pine)/25 px-4 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      />

      <select
        name="type"
        defaultValue={placeType}
        className="h-12 rounded-full border border-(--color-pine)/25 px-4 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        <option value="All">All place types</option>
        {placeTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        name="category"
        defaultValue={category}
        className="h-12 rounded-full border border-(--color-pine)/25 px-4 text-sm text-slate-700 outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
      >
        <option value="All">All categories</option>
        {categories.map((item) => (
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
