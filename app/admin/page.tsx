import Link from "next/link";

const stats = [
  { label: "Published places", value: "24", accent: "Forest" },
  { label: "Upcoming events", value: "8", accent: "Seasonal" },
  { label: "Hidden gems", value: "12", accent: "Featured" },
  { label: "Pending edits", value: "3", accent: "Review" },
];

const recentActivity = [
  { title: "Updated Brattleboro lodging guide", time: "10 min ago", type: "Lodging" },
  { title: "Added new waterfall feature", time: "32 min ago", type: "Waterfall" },
  { title: "Published weekend event listing", time: "1 hr ago", type: "Event" },
];

const navigation = [
  { label: "Overview", href: "/admin", active: true },
  { label: "Places", href: "/admin/places" },
  { label: "Hidden Gems", href: "/admin/hidden-gems" },
  { label: "Restaurants", href: "/admin/restaurants" },
  { label: "Events", href: "/admin/events" },
  { label: "Trails", href: "/admin/trails" },
  { label: "Waterfalls", href: "/admin/waterfalls" },
  { label: "Lodging", href: "/admin/lodging" },
];

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 rounded-[28px] border border-amber-100/80 bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f3b2f] text-sm font-semibold uppercase tracking-[0.24em] text-[#f8f2e4]">
              SV
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f3b2f]">SouthernVT</p>
              <p className="text-sm text-slate-500">CMS Dashboard</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  item.active
                    ? "bg-[#1f3b2f] text-[#f8f2e4] shadow-lg"
                    : "text-slate-600 hover:bg-[#f6efe0] hover:text-[#1f3b2f]"
                }`}
              >
                <span>{item.label}</span>
                {item.active ? <span className="text-xs opacity-80">●</span> : null}
              </Link>
            ))}
          </nav>

          <div className="mt-10 rounded-[24px] border border-[#e4d8b8] bg-[#f8f2e4] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Ready to publish</p>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Curate your next seasonal update with rich content blocks and local highlights.
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#1f3b2f]">Content operations</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Southern Vermont CMS
                </h1>
                <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                  Manage places, hidden gems, events, trails, waterfalls, dining, and lodging from one calm command center.
                </p>
              </div>
              <button className="rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4] transition hover:bg-[#274737]">
                + New entry
              </button>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <article key={stat.label} className="rounded-[24px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d8b15d]">{stat.accent}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#1f3b2f]">Recent activity</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Freshly updated content</h2>
                </div>
                <a href="/basecamp/activity" className="text-sm font-semibold text-[#1f3b2f]">
                  View all
                </a>
              </div>

              <div className="mt-6 space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.title} className="flex items-center justify-between rounded-[20px] border border-[#f1e8d1] bg-[#fcfaf6] px-4 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.time}</p>
                    </div>
                    <span className="rounded-full border border-[#e2cc86] bg-[#fff7df] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#8c6620]">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#e8dfc8] bg-[#1f3b2f] p-6 text-[#f8f2e4] shadow-[0_20px_80px_rgba(31,59,47,0.16)]">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#d8b15d]">Operations snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold">A thoughtful editorial workflow is ready.</h2>
              <p className="mt-4 text-base leading-8 text-slate-200">
                Add, review, and publish destination stories with a layout built for calm collaboration.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Drafts keep moving forward",
                  "Featured stories stay highlighted",
                  "New entities slot into your library",
                ].map((item) => (
                  <div key={item} className="rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
