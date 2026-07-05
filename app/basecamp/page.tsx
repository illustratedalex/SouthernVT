import Link from "next/link";
import { Sidebar } from "@/components/admin";
import { MorningBriefingNote } from "@/components/basecamp/MorningBriefingNote";
import { foundingPartners } from "@/data/foundingPartners";
import { copyDeskStories, morningPriorities, photoDeskNeeds, publishTodayItems, weatherPlaceholder } from "@/data/morningBriefing";
import { southernVT100Destinations } from "@/data/southernvt100";
import { weeklyIssue } from "@/data/weeklyIssue";
import { findMissingRelationships, findWeakStories } from "@/lib/editorial/EditorialIntelligence";

const navItems = [
  { label: "Dashboard", href: "/basecamp", active: true },
  { label: "Newsroom", href: "/basecamp/content" },
  { label: "Editorial Studio", href: "/basecamp/content" },
  { label: "Editorial Issue", href: "/basecamp/editorial-issue" },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Content Report", href: "/basecamp/content/report" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Businesses", href: "/basecamp/businesses" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Founding Partners", href: "/basecamp/founding-partners" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
];

const statusTone: Record<string, string> = {
  Complete: "border-emerald-200 bg-emerald-100 text-emerald-800",
  "In Review": "border-blue-200 bg-blue-100 text-blue-800",
  "Needs Review": "border-amber-200 bg-amber-100 text-amber-800",
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function greetingForHour(hour: number) {
  if (hour < 12) return "Good Morning, Alex";
  if (hour < 17) return "Good Afternoon, Alex";
  return "Good Evening, Alex";
}

function inferDesk(task: string): "Story" | "Photography" | "Verification" | "Partner Outreach" {
  const normalized = task.toLowerCase();
  if (normalized.includes("photo") || normalized.includes("hero") || normalized.includes("upload")) return "Photography";
  if (normalized.includes("verify")) return "Verification";
  if (normalized.includes("partner") || normalized.includes("outreach")) return "Partner Outreach";
  return "Story";
}

const upcomingMeetings = [
  { business: "Grafton Inn", date: "Jul 8", topic: "Summer package review" },
  { business: "Vermont Country Store", date: "Jul 9", topic: "Founding partner Q&A" },
  { business: "Hermit Thrush Brewery", date: "Jul 11", topic: "Issue co-promotion check-in" },
];

export default function BasecampMorningBriefingPage() {
  const now = new Date();
  const greeting = greetingForHour(now.getHours());
  const issueProgress = weeklyIssue.completionPercent;
  const readyToPublishCount = copyDeskStories.filter((story) => story.readyToPublish).length;
  const interestedBusinesses = foundingPartners.filter((partner) => partner.status === "interested").length;
  const foundingPartnerCount = foundingPartners.length;
  const partnerFollowUps = foundingPartners
    .filter((partner) => partner.status === "invited" || partner.status === "interested")
    .slice(0, 4);

  const intelligenceCandidates = [...findMissingRelationships(8), ...findWeakStories(8)].sort(
    (left, right) => right.priority - left.priority,
  );
  const focusRecommendation =
    intelligenceCandidates.find((entry) => entry.entityName.toLowerCase().includes("mount equinox")) ??
    intelligenceCandidates[0] ?? {
      entityName: "Mount Equinox Skyline Drive",
      href: "/places/mount-equinox-skyline-drive",
      missing: ["Needed for Fall Foliage issue."],
      priority: 90,
    };

  const impactStars = "★".repeat(5);
  const focusReason =
    focusRecommendation.entityName.toLowerCase().includes("mount equinox")
      ? "Needed for Fall Foliage issue."
      : (focusRecommendation.missing[0] ?? "High-impact editorial gap for this week.");

  const todayAssignments = [
    ...morningPriorities.map((priority, index) => ({
      title: priority.place,
      task: priority.task,
      priority: priority.priority,
      desk: inferDesk(priority.task),
      estimatedMinutes: [26, 32, 24, 28, 22][index] ?? 25,
      href: priority.href,
    })),
    {
      title: "Founding Partner Follow-ups",
      task: "Today's outreach confirmations",
      priority: "high" as const,
      desk: "Partner Outreach" as const,
      estimatedMinutes: 30,
      href: "/basecamp/founding-partners",
    },
  ];

  const southernVT100Published = southernVT100Destinations.filter((entry) => entry.editorialStatus === "Published").length;
  const southernVT100Research = southernVT100Destinations.filter((entry) => entry.editorialStatus === "Research").length;
  const southernVT100Photography = southernVT100Destinations.filter((entry) => entry.verification.photo).length;
  const southernVT100Verification = southernVT100Destinations.filter(
    (entry) => entry.verification.location && entry.verification.photo && entry.verification.visited && entry.verification.recommended,
  ).length;
  const topCategories = Object.entries(
    southernVT100Destinations.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.category] = (acc[entry.category] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.15),transparent_34%),linear-gradient(140deg,#f7efe1_0%,#fcfaf6_48%,#fffdf9_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <header className="rounded-[32px] border border-[#e8dfc8] bg-white/85 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Newsroom Home 2.0</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">{greeting}</h1>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Current Date</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(now)}</p>
              </article>
              <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Current Editorial Issue</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{weeklyIssue.title}</p>
              </article>
              <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Issue Progress</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{issueProgress}%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15d,#1f5a3d)]" style={{ width: `${issueProgress}%` }} />
                </div>
              </article>
              <article className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Weather Placeholder</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{weatherPlaceholder}</p>
              </article>
            </div>
          </header>

          <section className="rounded-[32px] border border-[#d7be8a] bg-[linear-gradient(135deg,#fff6df,#f6efe1)] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7c5b13]">Today&apos;s Focus</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">Today&apos;s Highest Impact Work</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-2xl border border-[#e5d2a6] bg-white/80 p-5">
                <p className="text-lg font-semibold text-slate-900">{focusRecommendation.entityName}</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">{focusReason}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                    Estimated Time · 32 minutes
                  </span>
                  <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
                    Impact · {impactStars}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href={focusRecommendation.href} className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-2 text-sm font-semibold text-white">
                    Open Assignment
                  </Link>
                  <Link href={focusRecommendation.href} className="inline-flex rounded-full border border-[#d7cbb3] bg-white px-5 py-2 text-sm font-semibold text-slate-800">
                    View Story
                  </Link>
                </div>
              </article>
              <article className="rounded-2xl border border-[#e5d2a6] bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7c5b13]">This Week&apos;s Issue</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{weeklyIssue.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{weeklyIssue.theme}</p>
              </article>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Today&apos;s Assignments</h2>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {todayAssignments.map((assignment) => (
                <Link key={`${assignment.title}-${assignment.task}`} href={assignment.href} className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm transition hover:border-[#d7cbb3] hover:bg-[#fcfaf6]">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-slate-900">{assignment.title}</p>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        assignment.priority === "urgent"
                          ? "border-rose-200 bg-rose-100 text-rose-800"
                          : "border-amber-200 bg-amber-100 text-amber-800"
                      }`}
                    >
                      {assignment.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{assignment.task}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                      {assignment.desk}
                    </span>
                    <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-700">
                      {assignment.estimatedMinutes} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Photo Desk</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Photos still needed today</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {photoDeskNeeds.map((need) => (
                  <div key={need} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                    <p className="text-sm font-semibold text-slate-900">{need}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Copy Desk</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Stories awaiting review</h2>
              <div className="mt-5 space-y-3">
                {copyDeskStories.map((story) => (
                  <Link key={story.title} href={story.href} className="block rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4 transition hover:bg-white">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-base font-semibold text-slate-900">{story.title}</p>
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${statusTone[story.verification]}`}>
                        {story.verification}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3 text-xs">
                      <div>
                        <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">SEO</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{story.seo}%</p>
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Content Health</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{story.storyHealth}%</p>
                      </div>
                      <div>
                        <p className="font-semibold uppercase tracking-[0.14em] text-slate-500">Verification</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{story.verification}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{weeklyIssue.editorialNotes}</p>
                  </Link>
                ))}
              </div>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Partner Desk</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Today&apos;s follow-ups</h2>
              <div className="mt-4 space-y-2">
                {partnerFollowUps.map((partner) => (
                  <div key={partner.businessName} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">{partner.businessName}</p>
                    <p className="text-xs text-slate-600">Follow-up {new Date(partner.nextFollowUpDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Upcoming Meetings</p>
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.business} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2">
                    <p className="text-sm font-semibold text-slate-900">{meeting.business}</p>
                    <p className="text-xs text-slate-600">{meeting.date} · {meeting.topic}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Businesses Interested</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{interestedBusinesses}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Founding Partners</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{foundingPartnerCount}</p>
                </div>
              </div>
            </article>

            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Publish Today</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Stories ready to publish</h2>
              <p className="mt-1 text-sm text-slate-600">{readyToPublishCount} stories are currently ready.</p>
              <div className="mt-5 space-y-3">
                {publishTodayItems.map((item) => (
                  <Link key={item.title} href={item.href} className="flex items-center justify-between gap-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] px-4 py-3 transition hover:bg-white">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 uppercase tracking-[0.14em]">{item.type}</p>
                    </div>
                    <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                      Open
                    </span>
                  </Link>
                ))}
              </div>
            </article>

            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Today</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Metrics</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Visitors</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">2,143</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Trips Planned</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">186</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Businesses Clicked</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">94</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Top Story</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{weeklyIssue.coverStory.title}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Top Business</p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">{partnerFollowUps[0]?.businessName ?? "Grafton Inn"}</p>
                </div>
              </div>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">This Week&apos;s Issue</p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900">{weeklyIssue.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{weeklyIssue.theme}</p>
              <div className="mt-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Completion</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">{weeklyIssue.completionPercent}%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[linear-gradient(90deg,#d8b15d,#1f5a3d)]" style={{ width: `${weeklyIssue.completionPercent}%` }} />
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Cover Story</p>
                  <p className="mt-1 font-semibold text-slate-900">{weeklyIssue.coverStory.title}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Stories Remaining</p>
                  <p className="mt-1 font-semibold text-slate-900">{weeklyIssue.metrics.storiesInProgress}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Photo Progress</p>
                  <p className="mt-1 font-semibold text-slate-900">{Math.max(0, 100 - weeklyIssue.metrics.photosOutstanding * 10)}%</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Verification Progress</p>
                  <p className="mt-1 font-semibold text-slate-900">{Math.max(0, 100 - weeklyIssue.metrics.verificationOutstanding * 15)}%</p>
                </div>
              </div>
              <Link href="/basecamp/editorial-issue" className="mt-4 inline-flex rounded-full bg-[#1f3b2f] px-5 py-2 text-sm font-semibold text-white">
                Open Editorial Issue
              </Link>
            </article>

            <article className="rounded-[30px] border border-[#e8dfc8] bg-white/95 p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">SouthernVT 100</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Coverage Progress</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Published</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{southernVT100Published}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Research</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{southernVT100Research}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Photography</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{southernVT100Photography}</p>
                </div>
                <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Verification</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{southernVT100Verification}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Top Categories</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {topCategories.map(([category, count]) => (
                    <span key={category} className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold text-slate-700">
                      {category} ({count})
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <MorningBriefingNote />
        </main>
      </div>
    </div>
  );
}
