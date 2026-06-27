const categories = [
  {
    title: "Waterfalls & trails",
    description: "Forest paths, river crossings, and views that reward every turn.",
    accent: "Water",
  },
  {
    title: "Cozy stays",
    description: "Historic inns, cabins, and boutique hotels with warm hospitality.",
    accent: "Stay",
  },
  {
    title: "Local flavors",
    description: "Seasonal menus, cider houses, bakeries, and farm-to-table kitchens.",
    accent: "Food",
  },
  {
    title: "Scenic drives",
    description: "Route planning for covered bridges, overlooks, and meadow views.",
    accent: "Drive",
  },
];

export default function CategoryGrid() {
  return (
    <section id="explore" className="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-10">
      <div className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.32em] text-[#1f3b2f]">
          Explore categories
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Curated experiences for every kind of Vermont getaway.
        </h2>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <article
            key={category.title}
            className="rounded-[1.5rem] border border-[#eae1cb] bg-[#fcfaf5] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#d8b15d]">
              {category.accent}
            </p>
            <h3 className="mt-4 text-xl font-semibold text-slate-900">{category.title}</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">{category.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
