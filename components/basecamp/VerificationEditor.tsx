"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, Button } from "@/components/ui";
import { getVerificationByPlaceId, updateVerification } from "@/lib/repositories/VerificationRepository";
import type { VerificationLevel, VerificationRecord, VerificationStatus } from "@/types/Verification";
import { VerificationHistory } from "./VerificationHistory";
import { VerificationStatusBadge } from "./VerificationStatusBadge";

type VerificationEditorProps = {
  placeId?: string;
  placeName?: string;
};

const levelOptions: Array<{ key: VerificationLevel; label: string }> = [
  { key: "location_verified", label: "📍 Location Verified" },
  { key: "photo_verified", label: "📸 Photo Verified" },
  { key: "personally_visited", label: "🥾 Personally Visited" },
  { key: "southernvt_recommended", label: "⭐ SouthernVT Recommended" },
];

const statusOptions: VerificationStatus[] = ["unverified", "partial", "verified", "expired", "review_needed"];

function createEmptyRecord(placeId: string): VerificationRecord {
  const now = new Date().toISOString();
  return {
    id: `verification-${placeId}`,
    placeId,
    levels: [],
    status: "unverified",
    verifiedBy: "",
    verifiedAt: now,
    expiresAt: "",
    lastReviewedAt: "",
    nextReviewAt: "",
    notes: "",
    history: [],
  };
}

function toDateInput(value?: string): string {
  if (!value) {
    return "";
  }
  return value.slice(0, 10);
}

function fromDateInput(value: string): string {
  if (!value) {
    return "";
  }
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}

export function VerificationEditor({ placeId, placeName }: VerificationEditorProps) {
  const [record, setRecord] = useState<VerificationRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadRecord() {
      if (!placeId) {
        setRecord(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const existing = await getVerificationByPlaceId(placeId);
      if (!mounted) {
        return;
      }

      setRecord(existing ?? createEmptyRecord(placeId));
      setLoading(false);
    }

    void loadRecord();

    return () => {
      mounted = false;
    };
  }, [placeId]);

  const hasLevels = useMemo(() => Boolean(record?.levels.length), [record?.levels.length]);

  if (!placeId) {
    return (
      <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Save this place first to manage verification.</p>
      </section>
    );
  }

  if (loading || !record) {
    return (
      <section className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Loading verification…</p>
      </section>
    );
  }

  const toggleLevel = (level: VerificationLevel) => {
    setRecord((current) => {
      if (!current) {
        return current;
      }
      const nextLevels = current.levels.includes(level) ? current.levels.filter((value) => value !== level) : [...current.levels, level];
      return {
        ...current,
        levels: nextLevels,
        status: nextLevels.length === 0 ? "unverified" : nextLevels.length >= 3 ? "verified" : "partial",
      };
    });
  };

  const saveRecord = async () => {
    if (!record) {
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();
    const saved = await updateVerification({
      ...record,
      lastReviewedAt: now,
      history: [
        ...record.history,
        {
          id: `history-${Date.now()}`,
          date: now,
          action: "Updated verification record",
          verifiedBy: record.verifiedBy || "SouthernVT Editor",
          note: `Verification updated for ${placeName || record.placeId}.`,
        },
      ],
    });
    setRecord(saved);
    setSaving(false);
  };

  return (
    <section className="space-y-5 rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Verification</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{placeName || "Place"} Verification</h3>
        </div>
        <VerificationStatusBadge status={record.status} />
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        {levelOptions.map((option) => (
          <label key={option.key} className="flex items-center gap-3 rounded-xl border border-[#ece3cf] bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={record.levels.includes(option.key)} onChange={() => toggleLevel(option.key)} />
            {option.label}
          </label>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Verification Status</label>
          <select
            value={record.status}
            onChange={(event) => setRecord((current) => (current ? { ...current, status: event.target.value as VerificationStatus } : current))}
            className="h-12 w-full rounded-full border border-(--color-pine)/25 bg-white px-4 text-sm text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Verified By</label>
          <Input value={record.verifiedBy} onChange={(event) => setRecord((current) => (current ? { ...current, verifiedBy: event.target.value } : current))} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Verified Date</label>
          <Input
            type="date"
            value={toDateInput(record.verifiedAt)}
            onChange={(event) => setRecord((current) => (current ? { ...current, verifiedAt: fromDateInput(event.target.value) } : current))}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Expiration Date</label>
          <Input
            type="date"
            value={toDateInput(record.expiresAt)}
            onChange={(event) => setRecord((current) => (current ? { ...current, expiresAt: fromDateInput(event.target.value) } : current))}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Last Reviewed</label>
          <Input
            type="date"
            value={toDateInput(record.lastReviewedAt)}
            onChange={(event) => setRecord((current) => (current ? { ...current, lastReviewedAt: fromDateInput(event.target.value) } : current))}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Next Review</label>
          <Input
            type="date"
            value={toDateInput(record.nextReviewAt)}
            onChange={(event) => setRecord((current) => (current ? { ...current, nextReviewAt: fromDateInput(event.target.value) } : current))}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">Notes</label>
        <textarea
          rows={4}
          value={record.notes ?? ""}
          onChange={(event) => setRecord((current) => (current ? { ...current, notes: event.target.value } : current))}
          className="w-full rounded-3xl border border-(--color-pine)/25 bg-white px-4 py-4 text-sm text-(--color-slate) outline-none transition focus:border-(--color-maple-gold) focus:ring-2 focus:ring-(--color-maple-gold)/20"
        />
      </div>

      {!hasLevels ? <p className="text-sm text-slate-600">Details are being reviewed by SouthernVT.</p> : null}

      <div className="flex justify-end">
        <Button onClick={saveRecord} disabled={saving}>
          {saving ? "Saving..." : "Save Verification"}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">History</p>
        <VerificationHistory history={record.history} />
      </div>
    </section>
  );
}

