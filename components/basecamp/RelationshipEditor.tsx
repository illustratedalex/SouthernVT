"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRelationshipStore } from "@/components/relationships/RelationshipStoreProvider";
import type { Relationship, RelationshipContentType, RelationshipType } from "@/types/Relationship";
import { relationshipTypeMeta } from "@/types/Relationship";
import { RelationshipGraph } from "./RelationshipGraph";
import { RelationshipSelector } from "./RelationshipSelector";

interface RelationshipEditorProps {
  contentType: RelationshipContentType;
  contentId: string;
  centerLabel: string;
}

const groupedTypes: RelationshipType[] = ["nearby", "featured_in", "contains", "related", "uses_media", "hosts_event", "has_deal"];

function formatNodeTitle(value: string) {
  return value.length > 18 ? `${value.slice(0, 18)}...` : value;
}

export function RelationshipEditor({ contentType, contentId, centerLabel }: RelationshipEditorProps) {
  const { getRelationships, getCatalogItem, removeRelationship, updateRelationship, reorderRelationshipInType } = useRelationshipStore();
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const relationships = useMemo(
    () =>
      getRelationships({ contentType, contentId }).filter(
        (item) =>
          (item.fromType === contentType && item.fromId === contentId) ||
          (item.toType === contentType && item.toId === contentId),
      ),
    [contentId, contentType, getRelationships],
  );

  const resolved = useMemo(
    () =>
      relationships
        .map((relationship) => {
          const isFromCurrent = relationship.fromType === contentType && relationship.fromId === contentId;
          const targetType = isFromCurrent ? relationship.toType : relationship.fromType;
          const targetId = isFromCurrent ? relationship.toId : relationship.fromId;
          const target = getCatalogItem(targetType, targetId);
          if (!target) {
            return null;
          }
          return { relationship, target };
        })
        .filter((item): item is { relationship: Relationship; target: NonNullable<ReturnType<typeof getCatalogItem>> } => Boolean(item)),
    [relationships, contentType, contentId, getCatalogItem],
  );

  const grouped = useMemo(
    () =>
      groupedTypes.map((type) => ({
        type,
        title: relationshipTypeMeta[type].label,
        items: resolved.filter((entry) => entry.relationship.relationshipType === type),
      })),
    [resolved],
  );

  const selected = useMemo(
    () => (selectedRelationshipId ? resolved.find((entry) => entry.relationship.id === selectedRelationshipId) ?? null : null),
    [resolved, selectedRelationshipId],
  );

  const graphNodes = useMemo(
    () =>
      resolved.map((entry) => ({
        id: entry.relationship.id,
        title: formatNodeTitle(entry.target.title),
        type: entry.target.type,
        relationshipType: entry.relationship.relationshipType,
      })),
    [resolved],
  );

  return (
    <>
      <RelationshipSelector contentType={contentType} contentId={contentId} onRelationshipCreated={setSelectedRelationshipId} />

      <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Relationships</h3>
        <p className="mt-1 text-sm text-slate-600">Drag to reorder inside each relationship type. Changes persist in memory instantly.</p>

        <div className="mt-4 space-y-5">
          {grouped.map((group) => (
            <div key={group.type}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{group.title}</p>
              {group.items.length ? (
                <div className="mt-2 space-y-2">
                  {group.items.map((entry) => (
                    <article
                      key={entry.relationship.id}
                      draggable
                      onDragStart={() => setDraggedId(entry.relationship.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (draggedId) {
                          reorderRelationshipInType(contentType, contentId, group.type, draggedId, entry.relationship.id);
                        }
                      }}
                      className={`rounded-2xl border p-3 transition ${
                        selectedRelationshipId === entry.relationship.id ? "border-[#d8b15d] bg-[#fff7ea]" : "border-[#ece3cf] bg-[#fcfaf6]"
                      }`}
                      onClick={() => setSelectedRelationshipId(entry.relationship.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{entry.target.title}</p>
                          <p className="mt-1 text-xs text-slate-600">{entry.target.subtitle}</p>
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${relationshipTypeMeta[group.type].badgeClassName}`}>
                          {relationshipTypeMeta[group.type].label}
                        </span>
                      </div>

                      <input
                        value={entry.relationship.label}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => updateRelationship(entry.relationship.id, { label: event.target.value })}
                        className="mt-2 h-9 w-full rounded-full border border-[#d7cbb3] bg-white px-3 text-xs text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
                        aria-label="Relationship label"
                      />

                      <div className="mt-3 flex gap-2">
                        <Link href={entry.target.url} className="rounded-full bg-[#1f3b2f] px-3 py-1.5 text-xs font-semibold text-[#f8f2e4] transition hover:bg-[#3e5b4a]">
                          Open
                        </Link>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeRelationship(entry.relationship.id);
                            if (selectedRelationshipId === entry.relationship.id) {
                              setSelectedRelationshipId(null);
                            }
                          }}
                          className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-[#f8f2e4]"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No linked items yet.</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <RelationshipGraph centerLabel={centerLabel} nodes={graphNodes} selectedNodeId={selectedRelationshipId} onSelectNode={setSelectedRelationshipId} />

      <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Related Content Preview</h3>
        {selected ? (
          <article className="mt-4 rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
            <img src={selected.target.image || "https://placehold.co/960x540?text=Related+Content"} alt={selected.target.title} className="h-36 w-full rounded-xl object-cover" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">{selected.target.type}</p>
            <h4 className="mt-1 text-lg font-semibold text-slate-900">{selected.target.title}</h4>
            <p className="mt-2 text-sm text-slate-600">{selected.target.description}</p>
            <div className="mt-4 flex gap-2">
              <Link href={selected.target.url} className="rounded-full bg-[#1f3b2f] px-4 py-2 text-xs font-semibold text-[#f8f2e4] transition hover:bg-[#3e5b4a]">
                Open
              </Link>
              <button
                type="button"
                onClick={() => setSelectedRelationshipId(selected.relationship.id)}
                className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-[#f8f2e4]"
              >
                Edit
              </button>
            </div>
          </article>
        ) : (
          <p className="mt-3 text-sm text-slate-600">Click a relationship card or graph node to preview related content.</p>
        )}
      </section>
    </>
  );
}
