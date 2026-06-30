import Link from "next/link";

type WritingItem = {
  id: string;
  label: string;
  href: string;
};

type WritingQueueProps = {
  placesMissingStory: WritingItem[];
  articlesMissingSummary: WritingItem[];
  collectionsMissingIntroduction: WritingItem[];
};

function QueueGroup({ title, items }: { title: string; items: WritingItem[] }) {
  return (
    <div className="space-y-2 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">{title}</p>
      {items.length ? (
        <ul className="space-y-1.5 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="text-slate-700 hover:text-slate-900 hover:underline">{item.label}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500">Nothing waiting right now.</p>
      )}
    </div>
  );
}

export function WritingQueue({ placesMissingStory, articlesMissingSummary, collectionsMissingIntroduction }: WritingQueueProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Writing Queue</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <QueueGroup title="Places missing Story" items={placesMissingStory} />
        <QueueGroup title="Articles missing Summary" items={articlesMissingSummary} />
        <QueueGroup title="Collections missing Introduction" items={collectionsMissingIntroduction} />
      </div>
    </section>
  );
}
