import Link from "next/link";

export interface PlaceRelatedItem {
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  label?: string;
}

interface PlaceRelatedSectionProps {
  title: string;
  emptyText: string;
  items: PlaceRelatedItem[];
}

export function PlaceRelatedSection({ title, emptyText, items }: PlaceRelatedSectionProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map((item) => (
            <Link key={item.id} href={item.href} className="block rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 transition hover:border-[#d8b15d] hover:bg-white">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.title}</p>
                  {item.subtitle ? <p className="mt-1 text-xs text-slate-500">{item.subtitle}</p> : null}
                </div>
                {item.label ? <span className="rounded-full bg-[#f7efe1] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--color-forest-green)">{item.label}</span> : null}
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm leading-7 text-slate-600">{emptyText}</p>
        )}
      </div>
    </section>
  );
}
