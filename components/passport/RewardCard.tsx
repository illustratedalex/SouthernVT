import type { PassportReward } from "@/types/Passport";

interface RewardCardProps {
  reward: PassportReward;
  stampCount?: number;
}

export function RewardCard({ reward, stampCount = 0 }: RewardCardProps) {
  const unlocked = reward.status === "active" && stampCount >= reward.requiredStamps;

  return (
    <article className="rounded-[26px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-[#eef5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#1f3b2f]">
          {reward.rewardType}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${unlocked ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
          {unlocked ? "Unlocked" : reward.status}
        </span>
      </div>

      <h3 className="mt-3 text-xl font-semibold text-slate-900">{reward.title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-700">{reward.description}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Requires {reward.requiredStamps} stamps</p>
      {reward.expiresAt ? <p className="mt-1 text-xs text-slate-500">Expires {reward.expiresAt}</p> : null}
    </article>
  );
}
