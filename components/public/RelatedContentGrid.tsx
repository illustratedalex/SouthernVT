import Link from "next/link";

export interface RelatedContentItem {
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

interface RelatedContentGridProps {
  title: string;
  emptyText: string;
  items: RelatedContentItem[];
}

export function RelatedContentGrid({ title, emptyText, items }: RelatedContentGridProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      {items.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.subtitle}</p>
              <Link href={item.href} className="mt-3 inline-flex text-sm font-semibold text-[#1f3b2f]">
                View
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-600">{emptyText}</p>
      )}
    </section>
  );
}
