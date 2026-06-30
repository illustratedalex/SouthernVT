"use client";

import { useMemo } from "react";
import type { RelationshipContentType, RelationshipType } from "@/types/Relationship";
import { relationshipTypeMeta } from "@/types/Relationship";

interface GraphNode {
  id: string;
  title: string;
  type: RelationshipContentType;
  relationshipType: RelationshipType;
}

interface RelationshipGraphProps {
  centerLabel: string;
  nodes: GraphNode[];
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}

const GRAPH_SIZE = 320;
const CENTER = GRAPH_SIZE / 2;
const RADIUS = 108;

export function RelationshipGraph({ centerLabel, nodes, selectedNodeId, onSelectNode }: RelationshipGraphProps) {
  const safeNodes = Array.isArray(nodes) ? nodes : [];

  const positioned = useMemo(
    () =>
      safeNodes.map((node, index) => {
        const angle = (index / Math.max(safeNodes.length, 1)) * Math.PI * 2 - Math.PI / 2;
        const x = CENTER + Math.cos(angle) * RADIUS;
        const y = CENTER + Math.sin(angle) * RADIUS;
        return { ...node, x, y };
      }),
    [safeNodes],
  );

  const selectedRelationshipLabel = useMemo(() => {
    if (!selectedNodeId) {
      return null;
    }

    const selected = safeNodes.find((node) => node.id === selectedNodeId);
    if (!selected) {
      return null;
    }

    return relationshipTypeMeta[selected.relationshipType]?.label ?? relationshipTypeMeta.related.label;
  }, [safeNodes, selectedNodeId]);

  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Relationship Graph</h3>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Live</p>
      </div>

      <div className="relative mx-auto h-[320px] w-[320px] max-w-full">
        <svg viewBox={`0 0 ${GRAPH_SIZE} ${GRAPH_SIZE}`} className="h-full w-full">
          {positioned.map((node) => (
            <line
              key={`line-${node.id}`}
              x1={CENTER}
              y1={CENTER}
              x2={node.x}
              y2={node.y}
              className="stroke-[#d9cab1]"
              strokeWidth={selectedNodeId === node.id ? 3 : 2}
              style={{ transition: "all 220ms ease" }}
            />
          ))}

          <circle cx={CENTER} cy={CENTER} r={40} className="fill-[#1f3b2f]" />
          <text
            x={CENTER}
            y={CENTER - 2}
            textAnchor="middle"
            className="fill-[#f8f2e4] text-[11px] font-semibold uppercase tracking-[0.2em]"
          >
            Center
          </text>
          <text x={CENTER} y={CENTER + 13} textAnchor="middle" className="fill-[#f8f2e4] text-[12px] font-semibold">
            {centerLabel.length > 16 ? `${centerLabel.slice(0, 16)}...` : centerLabel}
          </text>

          {positioned.map((node) => {
            const isSelected = node.id === selectedNodeId;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x} ${node.y})`}
                onClick={() => onSelectNode(node.id)}
                className="cursor-pointer"
                style={{ transition: "transform 220ms ease" }}
              >
                <circle r={isSelected ? 26 : 22} className={isSelected ? "fill-[#d8b15d]" : "fill-white stroke-[#cfbea1]"} strokeWidth={2} />
                <text x={0} y={3} textAnchor="middle" className="fill-slate-800 text-[10px] font-semibold">
                  {node.title.length > 10 ? `${node.title.slice(0, 10)}...` : node.title}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {selectedRelationshipLabel ? (
        <p className="mt-3 text-sm text-slate-600">
          Selected relationship: <span className="font-semibold text-slate-900">{selectedRelationshipLabel}</span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-slate-600">Click a node to inspect and edit a relationship.</p>
      )}
    </section>
  );
}
