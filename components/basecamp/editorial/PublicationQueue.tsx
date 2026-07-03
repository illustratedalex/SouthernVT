"use client";

interface PublicationItem {
  id: string;
  title: string;
  type: "Place" | "Article" | "Collection";
  status: "Ready to Publish" | "Scheduled" | "Published";
  date: string;
}

const publications: PublicationItem[] = [
  {
    id: "1",
    title: "Mount Equinox Skyline Drive",
    type: "Place",
    status: "Ready to Publish",
    date: "Today",
  },
  {
    id: "2",
    title: "Fall Foliage Collection",
    type: "Collection",
    status: "Scheduled",
    date: "Oct 1, 2026",
  },
  {
    id: "3",
    title: "Vermont Country Store Experience",
    type: "Place",
    status: "Published",
    date: "Sep 15, 2026",
  },
  {
    id: "4",
    title: "Hiking in Late Summer",
    type: "Article",
    status: "Published",
    date: "Aug 28, 2026",
  },
];

const statusColors: Record<string, string> = {
  "Ready to Publish": "bg-blue-100 text-blue-800",
  Scheduled: "bg-purple-100 text-purple-800",
  Published: "bg-green-100 text-green-800",
};

const statusIcons: Record<string, string> = {
  "Ready to Publish": "🚀",
  Scheduled: "📅",
  Published: "✓",
};

export function PublicationQueue() {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Publication Queue</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Publishing Schedule</h2>
      <p className="mt-1 text-sm text-slate-600">Content ready for or scheduled for publication</p>

      <div className="mt-6 space-y-3">
        {publications.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 border border-[#e8dfc8] rounded-lg hover:bg-[#fcfaf6] transition"
          >
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-slate-900 truncate">{item.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-slate-600 bg-[#fcfaf6] px-2 py-1 rounded border border-[#ece3cf]">
                  {item.type}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${statusColors[item.status]}`}>
                  {item.status}
                </span>
                <span className="text-xs text-slate-500">📅 {item.date}</span>
              </div>
            </div>

            {item.status === "Ready to Publish" && (
              <button className="ml-2 flex-shrink-0 rounded-lg bg-[#1f3b2f] text-white px-3 py-2 text-xs font-semibold hover:bg-[#2a4a3f]">
                {statusIcons[item.status]} Publish
              </button>
            )}
            {item.status === "Scheduled" && (
              <button className="ml-2 flex-shrink-0 rounded-lg border border-[#e8dfc8] bg-white text-slate-800 px-3 py-2 text-xs font-semibold hover:bg-[#fcfaf6]">
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
