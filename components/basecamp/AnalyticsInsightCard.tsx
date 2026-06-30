interface AnalyticsInsightCardProps {
  title: string;
  description: string;
  items: string[];
}

export function AnalyticsInsightCard({ title, description, items }: AnalyticsInsightCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
