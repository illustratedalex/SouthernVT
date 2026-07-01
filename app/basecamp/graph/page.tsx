import { Sidebar } from "@/components/admin";
import { KnowledgeGraph } from "@/components/knowledge/KnowledgeGraph";
import { getAllNodes, getEdges } from "@/lib/repositories/KnowledgeGraphRepository";

const navItems = [
  { label: "Dashboard", href: "/basecamp" },
  { label: "Content Studio", href: "/basecamp/content" },
  { label: "Knowledge Graph", href: "/basecamp/graph", active: true },
  { label: "Places", href: "/basecamp/places" },
  { label: "Import", href: "/basecamp/import" },
  { label: "Collections", href: "/basecamp/collections" },
  { label: "Media Library", href: "/basecamp/media" },
  { label: "Activity", href: "/basecamp/activity" },
  { label: "Feature Flags", href: "/basecamp/settings/features" },
  { label: "Articles", href: "/basecamp/articles" },
  { label: "Events", href: "/basecamp/events" },
  { label: "Deals", href: "/basecamp/deals" },
  { label: "Reviews", href: "/basecamp/reviews" },
  { label: "Analytics", href: "/basecamp/analytics" },
  { label: "Passport", href: "/basecamp/passport" },
  { label: "Partner Portal", href: "/basecamp/partner-portal" },
];

interface BasecampGraphPageProps {
  searchParams: Promise<{ node?: string }>;
}

export default async function BasecampGraphPage({ searchParams }: BasecampGraphPageProps) {
  const { node } = await searchParams;
  const [nodes, edges] = await Promise.all([getAllNodes(), getEdges()]);
  const initialNodeId = node && nodes.some((entry) => entry.id === node) ? node : undefined;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:flex-row lg:px-8 lg:py-6">
        <Sidebar items={navItems} />

        <main className="flex-1 space-y-6">
          <section className="rounded-4xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Basecamp Intelligence</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Knowledge Graph</h1>
            <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">
              Explore the internal relationship network between places, collections, guides, deals, events, media assets, and story nodes.
            </p>
          </section>

          <KnowledgeGraph nodes={nodes} edges={edges} title="Southern Vermont Knowledge Graph" initialNodeId={initialNodeId} />
        </main>
      </div>
    </div>
  );
}
