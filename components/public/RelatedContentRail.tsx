import Link from "next/link";
import { EmptyRelatedState } from "./EmptyRelatedState";

export interface RelatedContentRailItem {
  id: string;
  title: string;
  href: string;
  subtitle?: string;
  badge?: string;
}

interface RelatedContentRailProps {
  title: string;
  items: RelatedContentRailItem[];
  emptyTitle: string;
  emptyDescription: string;
}

export function RelatedContentRail({ title, items, emptyTitle, emptyDescription }: RelatedContentRailProps) {
  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-[0_18px_58px_rgba(31,59,47,0.08)]">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item) => (
            <Link key={item.id} href={item.href} className="group block rounded-[22px] border border-[#efe7d3] bg-[#fcfaf6] p-4 transition hover:border-(--color-maple-gold)/60 hover:bg-white">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900 group-hover:text-(--color-forest-green)">{item.title}</p>
                  {item.subtitle ? <p className="mt-1 text-sm leading-6 text-slate-600">{item.subtitle}</p> : null}
                </div>
                {item.badge ? <span className="rounded-full bg-[#f7efe1] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--color-forest-green)">{item.badge}</span> : null}
              </div>
            </Link>
          ))
        ) : (
          <EmptyRelatedState title={emptyTitle} description={emptyDescription} />
        )}
      </div>
    </section>
  );
}