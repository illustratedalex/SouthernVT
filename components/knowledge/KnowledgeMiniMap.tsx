import type { KnowledgeNode, KnowledgeNodeType } from "@/types/KnowledgeNode";

type KnowledgeMiniMapProps = {
  nodes: KnowledgeNode[];
  filteredNodes: KnowledgeNode[];
  selectedType: KnowledgeNodeType | "all";
};

const order: Array<KnowledgeNodeType> = ["place", "collection", "article", "event", "deal", "media", "story"];

export function KnowledgeMiniMap({ nodes, filteredNodes, selectedType }: KnowledgeMiniMapProps) {
  const counts = order.map((type) => ({
    type,
    count: nodes.filter((node) => node.type === type).length,
  }));

  return (
    <section className="rounded-3xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Mini Map</p>
        <p className="text-xs text-slate-600">{filteredNodes.length} visible</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
        {counts.map((entry) => (
          <div key={entry.type} className={`rounded-xl border p-2 ${selectedType === entry.type ? "border-[#d8b15d] bg-[#fff7ea]" : "border-[#ece3cf] bg-[#fcfaf6]"}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">{entry.type}</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">{entry.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
