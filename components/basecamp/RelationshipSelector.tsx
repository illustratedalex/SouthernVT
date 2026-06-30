"use client";

import Link from "next/link";
import { useState } from "react";
import { useRelationshipStore } from "@/components/relationships/RelationshipStoreProvider";
import type { RelationshipContentType, RelationshipType } from "@/types/Relationship";
import { relationshipTypeMeta } from "@/types/Relationship";

const contentTypes: RelationshipContentType[] = ["place", "collection", "media", "article", "event", "deal"];
const relationshipTypes: RelationshipType[] = [
  "nearby",
  "contains",
  "uses_media",
  "related",
  "featured_in",
  "has_deal",
  "hosts_event",
];

interface RelationshipSelectorProps {
  contentType: RelationshipContentType;
  contentId: string;
  onRelationshipCreated?: (relationshipId: string) => void;
}

export function RelationshipSelector({ contentType, contentId, onRelationshipCreated }: RelationshipSelectorProps) {
  const { addRelationship, getRelationships, searchContent } = useRelationshipStore();
  const [search, setSearch] = useState("");
  const [targetType, setTargetType] = useState<RelationshipContentType>("place");
  const [relationshipType, setRelationshipType] = useState<RelationshipType>("related");

  const matches = searchContent(search, targetType);

  const selectedRelationships = getRelationships({ contentType, contentId });

  const isAlreadyRelated = (type: RelationshipContentType, id: string) =>
    selectedRelationships.some(
      (relationship) =>
        ((relationship.fromType === contentType && relationship.fromId === contentId && relationship.toType === type && relationship.toId === id) ||
          (relationship.toType === contentType && relationship.toId === contentId && relationship.fromType === type && relationship.fromId === id)) &&
        relationship.relationshipType === relationshipType,
    );

  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Add relationship</h3>
      <p className="mt-1 text-sm text-slate-600">Type “Hamilton” to instantly find matching places, collections, media, articles, events, and deals.</p>

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Search content</label>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search places, collections, media..."
            className="h-11 w-full rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
          />
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Content type</label>
            <select
              value={targetType}
              onChange={(event) => setTargetType(event.target.value as RelationshipContentType)}
              className="h-11 w-full rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
            >
              {contentTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Relationship type</label>
            <select
              value={relationshipType}
              onChange={(event) => setRelationshipType(event.target.value as RelationshipType)}
              className="h-11 w-full rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 text-sm text-slate-700 outline-none transition focus:border-[#d8b15d] focus:ring-2 focus:ring-[#d8b15d]/20"
            >
              {relationshipTypes.map((item) => (
                <option key={item} value={item}>
                  {relationshipTypeMeta[item].label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="max-h-64 space-y-2 overflow-auto rounded-2xl border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-3">
          {matches.length ? (
            matches.map((match) => {
              const exists = isAlreadyRelated(match.type, match.id);

              return (
                <article key={match.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#ece3cf] bg-white px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{match.title}</p>
                    <p className="text-xs text-slate-600">{match.subtitle}</p>
                  </div>
                  {exists ? (
                    <span className="rounded-full bg-[#eef4f0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">
                      Added
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        const created = addRelationship({
                          fromType: contentType,
                          fromId: contentId,
                          toType: match.type,
                          toId: match.id,
                          relationshipType,
                          label: `${relationshipTypeMeta[relationshipType].label} link`,
                        });
                        onRelationshipCreated?.(created.id);
                      }}
                      className="rounded-full bg-[#1f3b2f] px-3 py-1.5 text-xs font-semibold text-[#f8f2e4] transition hover:bg-[#3e5b4a]"
                    >
                      Add
                    </button>
                  )}
                </article>
              );
            })
          ) : (
            <p className="text-sm text-slate-600">No matches yet. Try searching by title, city, or description.</p>
          )}
        </div>

        <p className="text-xs text-slate-500">
          Selecting a result adds it immediately. View details on the right or open directly in
          {" "}
          <Link href="/collections" className="font-semibold text-[#1f3b2f] underline decoration-[#d8b15d]/70 underline-offset-2">
            public pages
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
