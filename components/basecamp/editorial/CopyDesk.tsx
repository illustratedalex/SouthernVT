"use client";

interface StoryReview {
  id: string;
  title: string;
  author: string;
  contentHealth: number;
  seoScore: number;
  readability: "Easy" | "Moderate" | "Challenging";
  verification: boolean;
}

const storiesInReview: StoryReview[] = [
  {
    id: "1",
    title: "Jamaica State Park Update",
    author: "Alex Chen",
    contentHealth: 92,
    seoScore: 88,
    readability: "Easy",
    verification: true,
  },
  {
    id: "2",
    title: "Mount Equinox Seasonal Guide",
    author: "Morgan Lee",
    contentHealth: 78,
    seoScore: 72,
    readability: "Moderate",
    verification: false,
  },
  {
    id: "3",
    title: "Grafton Inn Experience",
    author: "Jordan Davis",
    contentHealth: 85,
    seoScore: 81,
    readability: "Easy",
    verification: true,
  },
];

export function CopyDesk() {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Copy Desk</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Editorial Review</h2>
      <p className="mt-1 text-sm text-slate-600">Stories awaiting approval</p>

      <div className="mt-6 space-y-3">
        {storiesInReview.map((story) => (
          <div
            key={story.id}
            className="border border-[#e8dfc8] rounded-lg p-4 hover:bg-[#fcfaf6] transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-sm text-slate-900">{story.title}</h4>
                <p className="text-xs text-slate-500">by {story.author}</p>
              </div>
              {story.verification && (
                <span className="text-lg">✓</span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <p className="text-xs text-slate-600 mb-1">Content Health</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${story.contentHealth}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  {story.contentHealth}%
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-600 mb-1">SEO Score</p>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${story.seoScore}%` }}
                  />
                </div>
                <p className="text-xs font-semibold text-slate-700 mt-1">{story.seoScore}%</p>
              </div>

              <div>
                <p className="text-xs text-slate-600 mb-1">Readability</p>
                <span className="inline-block text-xs font-semibold text-slate-700 bg-[#fcfaf6] px-2 py-1 rounded border border-[#ece3cf]">
                  {story.readability}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 rounded-lg bg-[#1f3b2f] text-white px-3 py-2 text-xs font-semibold hover:bg-[#2a4a3f]">
                Approve
              </button>
              <button className="flex-1 rounded-lg border border-[#e8dfc8] bg-white text-slate-800 px-3 py-2 text-xs font-semibold hover:bg-[#fcfaf6]">
                Return for Revision
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
