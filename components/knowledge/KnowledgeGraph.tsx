"use client";

import { useMemo, useState } from "react";
import { KnowledgeMiniMap } from "@/components/knowledge/KnowledgeMiniMap";
import { KnowledgeSidebar } from "@/components/knowledge/KnowledgeSidebar";
import type { KnowledgeEdge } from "@/types/KnowledgeEdge";
import type { KnowledgeNode, KnowledgeNodeType } from "@/types/KnowledgeNode";

type KnowledgeGraphProps = {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  title?: string;
  initialNodeId?: string;
};

const GRAPH_SIZE = 640;
const CENTER = GRAPH_SIZE / 2;

function colorForType(type: KnowledgeNodeType): string {
  if (type === "place") return "#1f3b2f";
  if (type === "collection") return "#2f5a46";
  if (type === "article") return "#3c6653";
  if (type === "event") return "#d8b15d";
  if (type === "deal") return "#b7791f";
  if (type === "media") return "#6b4f2e";
  return "#4a5f56";
}

function short(value: string, max = 12): string {
  return value.length > max ? `${value.slice(0, max)}...` : value;
}

export function KnowledgeGraph({ nodes, edges, title = "Knowledge Graph", initialNodeId }: KnowledgeGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initialNodeId ?? nodes[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<KnowledgeNodeType | "all">("all");
  const [expanded, setExpanded] = useState(true);

  const selected = useMemo(() => nodes.find((node) => node.id === selectedNodeId) ?? null, [nodes, selectedNodeId]);

  const baseFiltered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return nodes.filter((node) => {
      const typeMatch = selectedType === "all" || node.type === selectedType;
      const textMatch = !needle || node.title.toLowerCase().includes(needle) || (node.subtitle ?? "").toLowerCase().includes(needle);
      return typeMatch && textMatch;
    });
  }, [nodes, search, selectedType]);

  const connectedIds = useMemo(() => {
    if (!selectedNodeId) {
      return new Set<string>();
    }

    const set = new Set<string>();
    edges.forEach((edge) => {
      if (edge.fromNodeId === selectedNodeId) {
        set.add(edge.toNodeId);
      }
      if (edge.toNodeId === selectedNodeId) {
        set.add(edge.fromNodeId);
      }
    });
    return set;
  }, [edges, selectedNodeId]);

  const visibleNodes = useMemo(() => {
    if (expanded || !selectedNodeId) {
      return baseFiltered;
    }
    return baseFiltered.filter((node) => node.id === selectedNodeId || connectedIds.has(node.id));
  }, [baseFiltered, expanded, selectedNodeId, connectedIds]);

  const positioned = useMemo(() => {
    return visibleNodes.map((node, index) => {
      const angle = (index / Math.max(visibleNodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
      const radius = expanded ? 240 : 180;
      return {
        ...node,
        x: CENTER + Math.cos(angle) * radius,
        y: CENTER + Math.sin(angle) * radius,
      };
    });
  }, [visibleNodes, expanded]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);
  const visibleEdges = useMemo(
    () => edges.filter((edge) => visibleNodeIds.has(edge.fromNodeId) && visibleNodeIds.has(edge.toNodeId)),
    [edges, visibleNodeIds],
  );

  const connected = useMemo(() => nodes.filter((node) => connectedIds.has(node.id)), [nodes, connectedIds]);
  const recommended = useMemo(() => {
    if (!selectedNodeId) {
      return [];
    }
    const direct = new Set(connected.map((node) => node.id));
    return nodes.filter((node) => node.id !== selectedNodeId && !direct.has(node.id)).slice(0, 8);
  }, [nodes, selectedNodeId, connected]);

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Compass Platform</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{title}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-700"
            >
              {expanded ? "Collapse Graph" : "Expand Graph"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search graph"
            className="h-11 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none"
          />
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value as KnowledgeNodeType | "all")}
            className="h-11 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none"
          >
            <option value="all">All node types</option>
            <option value="place">Place</option>
            <option value="collection">Collection</option>
            <option value="article">Article</option>
            <option value="event">Event</option>
            <option value="deal">Deal</option>
            <option value="media">Media</option>
            <option value="story">Story</option>
          </select>
        </div>
      </div>

      <KnowledgeMiniMap nodes={nodes} filteredNodes={visibleNodes} selectedType={selectedType} />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-3xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
          <div className="relative mx-auto max-w-full overflow-auto">
            <svg viewBox={`0 0 ${GRAPH_SIZE} ${GRAPH_SIZE}`} className="h-140 w-full min-w-140">
              {visibleEdges.map((edge) => {
                const from = positioned.find((node) => node.id === edge.fromNodeId);
                const to = positioned.find((node) => node.id === edge.toNodeId);
                if (!from || !to) {
                  return null;
                }
                return (
                  <line
                    key={edge.id}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="#d8c6a6"
                    strokeWidth={Math.max(1.5, Math.min(4, edge.weight / 8))}
                    opacity={0.8}
                  />
                );
              })}

              {positioned.map((node) => {
                const active = node.id === selectedNodeId;
                return (
                  <g key={node.id} transform={`translate(${node.x} ${node.y})`} onClick={() => setSelectedNodeId(node.id)} className="cursor-pointer">
                    <circle r={active ? 30 : 24} fill={colorForType(node.type)} opacity={active ? 1 : 0.92} />
                    <text x={0} y={4} textAnchor="middle" className="fill-[#f8f2e4] text-[11px] font-semibold">
                      {short(node.title)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        <KnowledgeSidebar selected={selected} connected={connected} recommended={recommended} edges={visibleEdges} onSelectNode={setSelectedNodeId} />
      </div>
    </section>
  );
}
