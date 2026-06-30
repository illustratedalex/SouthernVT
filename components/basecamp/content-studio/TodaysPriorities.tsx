import Link from "next/link";

type PriorityItem = {
  id: string;
  label: string;
  href: string;
};

type TodaysPrioritiesProps = {
  items: PriorityItem[];
};

export function TodaysPriorities({ items }: TodaysPrioritiesProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-900">Today&apos;s Priorities</h2>
        <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">Editorial focus</span>
      </div>

      {items.length ? (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-[#d7cbb3] hover:bg-white">
              <span className="mr-2 text-[#1f3b2f]">☐</span>
              {item.label}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600">No urgent gaps detected this morning. Great editorial shape.</p>
      )}
    </section>
  );
}
