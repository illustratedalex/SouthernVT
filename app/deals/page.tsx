import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { DealCard } from "@/components/public/DealCard";
import { createPageMetadata } from "@/lib/seo";
import { getFeaturedDeals, getPublishedDeals } from "@/repositories/DealRepository";

interface DealsPageProps {
  searchParams: Promise<{ q?: string; type?: string; category?: string }>;
}

export const metadata: Metadata = createPageMetadata({
  title: "Southern Vermont Deals",
  description: "Browse active Southern Vermont partner discounts, packages, and seasonal offers.",
  path: "/deals",
});

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const search = params.q?.trim().toLowerCase() ?? "";
  const type = params.type?.trim().toLowerCase() || "all";
  const category = params.category?.trim().toLowerCase() || "all";

  const loadedDeals = await getPublishedDeals();
  const deals = Array.isArray(loadedDeals) ? loadedDeals : [];
  const loadedFeaturedDeals = await getFeaturedDeals();
  const featuredDeals = (Array.isArray(loadedFeaturedDeals) ? loadedFeaturedDeals : []).slice(0, 3);

  const allDealTypes = [...new Set(deals.map((deal) => deal.dealType))].sort((a, b) => a.localeCompare(b));
  const allCategories = [...new Set(deals.flatMap((deal) => (Array.isArray(deal.categories) ? deal.categories : [])))].sort((a, b) => a.localeCompare(b));

  const filtered = deals.filter((deal) => {
    const haystack = `${deal.title} ${deal.description} ${deal.shortDescription} ${(Array.isArray(deal.categories) ? deal.categories : []).join(" ")} ${(Array.isArray(deal.tags) ? deal.tags : []).join(" ")}`.toLowerCase();
    const matchesSearch = !search || haystack.includes(search);
    const matchesType = type === "all" || deal.dealType.toLowerCase() === type;
    const matchesCategory = category === "all" || (Array.isArray(deal.categories) && deal.categories.some((item) => item.toLowerCase() === category));
    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />

      <section className="relative overflow-hidden border-b border-(--color-pine)/20 bg-linear-to-br from-[#12241d] via-[#1f3b2f] to-[#3d5d4b] text-(--color-cream)">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-(--color-maple-gold)">Partner offers</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-6xl">Deals across Southern Vermont.</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">Find active discounts, packages, and curated local offers from trusted partners.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 sm:px-8 lg:px-10">
        <form className="grid gap-4 rounded-3xl border border-[#e8dfc8] bg-white/80 p-4 shadow-sm md:grid-cols-3">
          <input name="q" defaultValue={params.q ?? ""} placeholder="Search deals" className="h-12 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none" />
          <select name="type" defaultValue={params.type ?? "all"} className="h-12 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none">
            <option value="all">All deal types</option>
            {allDealTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select name="category" defaultValue={params.category ?? "all"} className="h-12 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none">
            <option value="all">All categories</option>
            {allCategories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="submit" className="md:col-span-3 rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">Apply filters</button>
        </form>

        {featuredDeals.length ? (
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-(--color-pine)">Featured deals</p>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {featuredDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)}
            </div>
          </section>
        ) : null}

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-2">
            <h2 className="text-3xl font-semibold text-slate-900">Active deals grid</h2>
            <p className="text-sm text-slate-600">{filtered.length} result{filtered.length === 1 ? "" : "s"}</p>
          </div>

          {filtered.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((deal) => <DealCard key={deal.id} deal={deal} />)}
            </div>
          ) : (
            <div className="rounded-3xl border border-[#e8dfc8] bg-white p-6 text-sm leading-7 text-slate-700 shadow-sm">No active published deals match this filter set yet.</div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
}
