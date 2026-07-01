import Link from "next/link";
import { KnowledgeNodeCard } from "@/components/knowledge/KnowledgeNodeCard";
import type { KnowledgeEdge } from "@/types/KnowledgeEdge";
import type { KnowledgeNode } from "@/types/KnowledgeNode";

type KnowledgeSidebarProps = {
  selected: KnowledgeNode | null;
  connected: KnowledgeNode[];
  recommended: KnowledgeNode[];
  edges: KnowledgeEdge[];
  onSelectNode: (id: string) => void;
};

export function KnowledgeSidebar({ selected, connected, recommended, edges, onSelectNode }: KnowledgeSidebarProps) {
  return (
    <aside className="space-y-4 rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Knowledge Sidebar</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">{selected?.title ?? "Select a node"}</h3>
        {selected?.description ? <p className="mt-2 text-sm leading-7 text-slate-600">{selected.description}</p> : null}
        {selected?.href ? (
          <Link href={selected.href} className="mt-3 inline-flex rounded-full bg-[#1f3b2f] px-4 py-2 text-xs font-semibold text-[#f8f2e4]">
            Open node
          </Link>
        ) : null}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Relationships</p>
        {selected ? (
          <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
            {edges
              .filter((edge) => edge.fromNodeId === selected.id || edge.toNodeId === selected.id)
              .slice(0, 8)
              .map((edge) => (
                <li key={edge.id} className="rounded-lg bg-[#fcfaf6] px-3 py-2">
                  {edge.label} · {edge.type}
                </li>
              ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-500">Click a node to inspect relationships.</p>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Connected Nodes</p>
        <div className="mt-2 space-y-2">
          {connected.length ? (
            connected.slice(0, 6).map((node) => <KnowledgeNodeCard key={node.id} node={node} onClick={() => onSelectNode(node.id)} />)
          ) : (
            <p className="text-sm text-slate-500">No direct connections yet.</p>
          )}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Recommended Connections</p>
        <div className="mt-2 space-y-2">
          {recommended.length ? (
            recommended.slice(0, 6).map((node) => <KnowledgeNodeCard key={node.id} node={node} onClick={() => onSelectNode(node.id)} />)
          ) : (
            <p className="text-sm text-slate-500">No recommendations available.</p>
          )}
        </div>
      </div>
    </aside>
  );
}
