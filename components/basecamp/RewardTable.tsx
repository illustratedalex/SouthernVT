import type { PassportReward } from "@/types/Passport";

interface RewardTableProps {
  rewards: PassportReward[];
}

export function RewardTable({ rewards }: RewardTableProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#e8dfc8] bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left">
        <thead className="bg-[#f7efe1] text-sm uppercase tracking-[0.2em] text-slate-600">
          <tr>
            <th className="px-4 py-3">Reward</th>
            <th className="px-4 py-3">Type</th>
            <th className="px-4 py-3">Required stamps</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Expires</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
          {rewards.map((reward) => (
            <tr key={reward.id}>
              <td className="px-4 py-4">
                <p className="font-semibold text-slate-900">{reward.title}</p>
                <p className="mt-1 text-xs text-slate-500">{reward.description}</p>
              </td>
              <td className="px-4 py-4">{reward.rewardType}</td>
              <td className="px-4 py-4">{reward.requiredStamps}</td>
              <td className="px-4 py-4">{reward.status}</td>
              <td className="px-4 py-4">{reward.expiresAt ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
