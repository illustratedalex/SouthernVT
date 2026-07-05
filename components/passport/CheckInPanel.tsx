"use client";

import { useMemo, useState } from "react";
import { trackPassportCheckIn } from "@/lib/analytics/events";
import type { PassportMember, PassportReward } from "@/types/Passport";

interface CheckInPanelProps {
  member: PassportMember;
  placeId: string;
  placeName: string;
  currentStampCount: number;
  rewards: PassportReward[];
  previewMode: boolean;
}

export function CheckInPanel({ member, placeId, placeName, currentStampCount, rewards, previewMode }: CheckInPanelProps) {
  const [collected, setCollected] = useState(false);

  const stampCount = collected ? currentStampCount + 1 : currentStampCount;

  const eligibleRewards = useMemo(
    () => rewards.filter((reward) => reward.status === "active" && stampCount >= reward.requiredStamps),
    [rewards, stampCount],
  );

  return (
    <section className="space-y-5 rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      {previewMode ? (
        <div className="rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] p-4 text-sm font-medium text-[#6b5a30]">
          Adventure Passport is in preview mode.
        </div>
      ) : null}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Check-in preview</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{placeName}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">Collect a mock stamp for {member.displayName} without sign-in. This flow is preview-only for now.</p>
      </div>

      <div className="rounded-2xl border border-[#e8dfc8] bg-[#fdfbf8] p-4">
        <p className="text-sm font-semibold text-slate-900">Stamp preview</p>
        <p className="mt-1 text-sm text-slate-600">Type: visit</p>
        <p className="mt-1 text-sm text-slate-600">Place ID: {placeId}</p>
      </div>

      <button
        type="button"
        onClick={() => {
          setCollected(true);
          trackPassportCheckIn({ member_id: member.id, place_id: placeId, place_name: placeName });
        }}
        disabled={collected}
        className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4] disabled:opacity-50"
      >
        {collected ? "Stamp Collected" : "Collect Stamp"}
      </button>

      {collected ? <p className="text-sm font-semibold text-emerald-700">Success! A new stamp was added to this preview member.</p> : null}

      <section className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-600">Eligible rewards preview</h3>
        {eligibleRewards.length ? (
          <ul className="space-y-2 text-sm text-slate-700">
            {eligibleRewards.map((reward) => (
              <li key={reward.id} className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2">
                {reward.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">No eligible rewards yet. Collect more stamps in this preview flow.</p>
        )}
      </section>
    </section>
  );
}
