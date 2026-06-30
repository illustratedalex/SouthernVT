import type { PassportMember, PassportReward, PassportStamp } from "@/types/Passport";
import { RewardCard } from "@/components/passport/RewardCard";
import { StampCard } from "@/components/passport/StampCard";

interface PassportProgressProps {
  member: PassportMember;
  stamps: PassportStamp[];
  rewards: PassportReward[];
}

export function PassportProgress({ member, stamps, rewards }: PassportProgressProps) {
  const sortedRewards = [...rewards].sort((a, b) => a.requiredStamps - b.requiredStamps);
  const nextReward = sortedRewards.find((reward) => reward.requiredStamps > stamps.length && reward.status === "active") ?? null;

  return (
    <section className="space-y-5 rounded-[30px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Mock progress preview</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{member.displayName}</h2>
        <p className="mt-2 text-sm text-slate-600">{stamps.length} total stamp{stamps.length === 1 ? "" : "s"}</p>
        {nextReward ? <p className="mt-1 text-sm text-slate-600">Next reward: {nextReward.title} at {nextReward.requiredStamps} stamps</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">Recent stamps</h3>
          {stamps.length ? stamps.slice(0, 4).map((stamp) => <StampCard key={stamp.id} stamp={stamp} />) : <p className="text-sm text-slate-500">No stamps yet.</p>}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">Reward track</h3>
          {sortedRewards.slice(0, 3).map((reward) => (
            <RewardCard key={reward.id} reward={reward} stampCount={stamps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
