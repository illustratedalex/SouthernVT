import type { KnowledgeNode } from "@/types/KnowledgeNode";

type KnowledgeNodeCardProps = {
  node: KnowledgeNode;
  active?: boolean;
  onClick?: () => void;
};

export function KnowledgeNodeCard({ node, active = false, onClick }: KnowledgeNodeCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-3 text-left transition ${
        active ? "border-[#d8b15d] bg-[#fff7ea]" : "border-[#ece3cf] bg-[#fcfaf6] hover:border-[#d7cbb3] hover:bg-white"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">{node.type}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{node.title}</p>
      {node.subtitle ? <p className="mt-1 text-xs text-slate-600">{node.subtitle}</p> : null}
    </button>
  );
}
