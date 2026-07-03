import {
  EditorialIssueHeader,
  EditorialIssueCard,
  AssignmentBoard,
  IssueChecklist,
  CoverStoryCard,
  PhotoNeedsPanel,
} from "@/components/basecamp/editorial";
import { Sidebar } from "@/components/admin";
import { getActiveEditorialIssue, getEditorialIssues } from "@/lib/repositories/EditorialIssueRepository";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Newsroom", href: "/basecamp/content", active: false },
  { label: "Editorial Studio", href: "/basecamp/content" },
  { label: "Editorial Issue", href: "/basecamp/editorial-issue", active: true },
  { label: "Knowledge Graph", href: "/basecamp/graph" },
  { label: "Content Report", href: "/basecamp/content/report" },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Photo Desk", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
];

export default function EditorialIssuePlannerPage() {
  const activeIssue = getActiveEditorialIssue();
  const allIssues = getEditorialIssues();
  const upcomingIssues = allIssues.filter((i) => i.status === "planning" || i.status === "active");

  const currentDate = new Date();
  const landscapeImages = [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1455849318169-8d779cb6676f?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1554080221-cbf01cb2d51d?auto=format&fit=crop&w=1400&q=80",
  ];
  const landscapeImage = landscapeImages[currentDate.getDate() % landscapeImages.length];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          {/* Hero Section */}
          <section className="overflow-hidden rounded-[30px] border border-[#e8dfc8] bg-white shadow-sm">
            <div className="relative grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#1f3b2f]">Editorial Management</p>
                <h1 className="text-4xl font-semibold text-slate-900">Editorial Issue Planner</h1>
                <p className="text-sm leading-7 text-slate-600">
                  {currentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="max-w-2xl text-sm leading-8 text-slate-600">
                  Plan weekly SouthernVT stories, photography, assignments, and featured destinations like a professional digital magazine.
                </p>
              </div>
              <div className="h-64 lg:h-full">
                <img src={landscapeImage} alt="Editorial inspiration" className="h-full w-full object-cover" />
              </div>
            </div>
          </section>

          {/* Active Issue */}
          {activeIssue && (
            <>
              <EditorialIssueHeader issue={activeIssue} />

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <AssignmentBoard assignments={activeIssue.assignments} />
                </div>
                <div className="space-y-6">
                  <PhotoNeedsPanel assignments={activeIssue.assignments} />
                  <IssueChecklist issue={activeIssue} />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <CoverStoryCard
                  storyTitle={activeIssue.title}
                  theme={activeIssue.theme}
                  description={activeIssue.notes}
                />
                <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Featured Content</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900">Curated for This Issue</h2>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">Featured Places</p>
                      <p className="text-lg font-bold text-slate-900">{activeIssue.featuredPlaces.length} destinations</p>
                    </div>
                    <div className="border-t border-[#ece3cf] pt-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">Collections</p>
                      <p className="text-lg font-bold text-slate-900">{activeIssue.featuredCollections.length} curated</p>
                    </div>
                    <div className="border-t border-[#ece3cf] pt-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-600 mb-2">Deals & Events</p>
                      <p className="text-lg font-bold text-slate-900">
                        {activeIssue.featuredDeals.length + activeIssue.featuredEvents.length} total
                      </p>
                    </div>
                  </div>
                </article>
              </div>
            </>
          )}

          {/* Upcoming Issues */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Publication Pipeline</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Upcoming Issues</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {upcomingIssues.map((issue) => (
                <EditorialIssueCard
                  key={issue.id}
                  issue={issue}
                  isActive={activeIssue?.id === issue.id}
                />
              ))}
            </div>
          </section>

          {/* All Issues */}
          <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Archive</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">All Editorial Issues</h2>
            <p className="mt-1 text-sm text-slate-600">Browse planning, active, published, and archived issues</p>

            <div className="mt-6 space-y-2">
              {allIssues.map((issue) => {
                const completedAssignments = issue.assignments.filter((a) => a.status === "complete").length;
                const weekOfDate = new Date(issue.weekOf);

                return (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between p-3 border border-[#ece3cf] rounded-lg hover:bg-[#fcfaf6] transition"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm text-slate-900 truncate">{issue.title}</h3>
                      <p className="text-xs text-slate-600 mt-1">
                        {weekOfDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {issue.assignments.length} assignments ·{" "}
                        {completedAssignments} complete
                      </p>
                    </div>
                    <span className="ml-2 inline-block text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">
                      {issue.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Quick Tips */}
          <section className="rounded-3xl border border-[#e8dfc8] bg-[#fcfaf6] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">💡 Editorial Planning Tips</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Plan issues 2-4 weeks in advance to allow time for photography and editing</li>
              <li>• Create a cover story that ties together the theme and featured destinations</li>
              <li>• Assign all photography upfront so photographers can plan shoots</li>
              <li>• Include at least 3 featured places and 2 collections per issue</li>
              <li>• Use the checklist to ensure all content requirements are met before publishing</li>
              <li>• Review assignment board regularly to keep work flowing through the workflow</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
