"use client";

import { useMemo, useState } from "react";
import { getRelationshipLabel } from "@/lib/graph/RelationshipGraph";
import type { RelationshipGraphData } from "@/types/RelationshipGraph";

type RelationshipExplorerProps = {
  graph: RelationshipGraphData;
};

export function RelationshipExplorer({ graph }: RelationshipExplorerProps) {
  const [selectedId, setSelectedId] = useState<string>(graph.entities[0]?.id ?? "");
  const selected = graph.entities.find((entity) => entity.id === selectedId) ?? graph.entities[0];

  const connected = useMemo(() => {
    if (!selected) {
      return [];
    }

    const byId = new Map(graph.entities.map((entity) => [entity.id, entity]));
    return graph.links
      .filter((link) => link.fromId === selected.id || link.toId === selected.id)
      .map((link) => {
        const targetId = link.fromId === selected.id ? link.toId : link.fromId;
        return {
          link,
          entity: byId.get(targetId) ?? null,
        };
      })
      .filter((entry): entry is { link: RelationshipGraphData["links"][number]; entity: RelationshipGraphData["entities"][number] } => Boolean(entry.entity))
      .slice(0, 8);
  }, [graph.entities, graph.links, selected]);

  return (
    <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Basecamp Intelligence</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Relationship Explorer</h2>
          <p className="mt-2 text-sm text-slate-600">Everything can relate to everything. Select a node and inspect direct relationship lines.</p>
        </div>
        <select
          value={selected?.id ?? ""}
          onChange={(event) => setSelectedId(event.target.value)}
          className="h-11 rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none"
        >
          {graph.entities.map((entity) => (
            <option key={entity.id} value={entity.id}>{entity.name} ({entity.type})</option>
          ))}
        </select>
      </div>

      {selected ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
            <svg viewBox="0 0 720 420" className="h-[420px] w-full">
              <rect x={290} y={180} width={140} height={60} rx={12} fill="#1f3b2f" />
              <text x={360} y={214} textAnchor="middle" className="fill-white text-[12px] font-semibold">{selected.name}</text>

              {connected.map((entry, index) => {
                const angle = (index / Math.max(connected.length, 1)) * Math.PI * 2 - Math.PI / 2;
                const boxX = 360 + Math.cos(angle) * 220 - 70;
                const boxY = 210 + Math.sin(angle) * 150 - 30;
                const lineX = boxX + 70;
                const lineY = boxY + 30;
                return (
                  <g key={entry.link.id}>
                    <line x1={360} y1={210} x2={lineX} y2={lineY} stroke="#d8b15d" strokeWidth={2} />
                    <rect x={boxX} y={boxY} width={140} height={60} rx={12} fill="#ffffff" stroke="#d7cbb3" />
                    <text x={lineX} y={boxY + 24} textAnchor="middle" className="fill-[#1f3b2f] text-[11px] font-semibold">
                      {entry.entity.name}
                    </text>
                    <text x={lineX} y={boxY + 42} textAnchor="middle" className="fill-slate-500 text-[10px]">
                      {getRelationshipLabel(entry.link.type)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <aside className="space-y-3 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Connected Relationships</p>
            {connected.length ? (
              connected.map((entry) => (
                <article key={`${entry.link.id}-list`} className="rounded-xl border border-[#e8dfc8] bg-white px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900">{entry.entity.name}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{getRelationshipLabel(entry.link.type)}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-600">No direct relationships available.</p>
            )}
          </aside>
        </div>
      ) : null}
    </section>
  );
}
