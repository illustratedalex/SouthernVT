"use client";

import type { PartnerReadinessScore } from "@/types/PartnerReadiness";

interface PartnerReadinessScoreProps {
  score: PartnerReadinessScore;
}

export function PartnerReadinessScore({ score }: PartnerReadinessScoreProps) {
  const getScoreColor = (percent: number) => {
    if (percent >= 85) return "text-green-700";
    if (percent >= 70) return "text-amber-700";
    return "text-orange-700";
  };

  const getScoreBg = (percent: number) => {
    if (percent >= 85) return "bg-green-100";
    if (percent >= 70) return "bg-amber-100";
    return "bg-orange-100";
  };

  return (
    <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">Partner Readiness</h2>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <div className="flex items-end gap-4">
            <div className={`rounded-3xl ${getScoreBg(score.overallScore)} p-8`}>
              <p className={`text-4xl font-bold ${getScoreColor(score.overallScore)}`}>{score.overallScore}%</p>
            </div>
            <div className="pb-2">
              <p className="text-sm text-slate-600">Overall readiness score</p>
              <p className="text-xs text-slate-500 mt-1">{score.criteria.filter((c) => c.status === "present").length} of {score.criteria.length} items complete</p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-full bg-[#f0ebe2] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1f3b2f] rounded-full transition-all"
                  style={{ width: `${score.overallScore}%` }}
                />
              </div>
            </div>
            <p className="text-xs text-slate-500">{score.overallScore}% complete</p>
          </div>
        </div>

        {score.missingItems.length > 0 ? (
          <div>
            <p className="text-sm font-semibold text-slate-900 mb-3">Items to complete:</p>
            <ul className="space-y-2">
              {score.missingItems.slice(0, 5).map((item) => (
                <li key={item.id} className="flex items-start gap-2">
                  <span className="text-[#d7cbb3] mt-1">●</span>
                  <div>
                    <p className="text-sm text-slate-600">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                </li>
              ))}
              {score.missingItems.length > 5 ? (
                <li className="text-sm text-slate-600 pt-2">
                  +{score.missingItems.length - 5} more items
                </li>
              ) : null}
            </ul>
          </div>
        ) : (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-semibold text-green-700">Profile Complete</p>
            <p className="text-sm text-green-600 mt-1">Your profile is fully optimized for discovery.</p>
          </div>
        )}
      </div>

      {score.recommendedActions.length > 0 ? (
        <div className="mt-6 rounded-2xl border border-[#f0ebe2] bg-[#fcfaf6] p-4">
          <p className="text-sm font-semibold text-slate-900 mb-3">Recommended next steps:</p>
          <ol className="space-y-2">
            {score.recommendedActions.map((action, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#f8f2e4] text-xs font-semibold text-[#1f3b2f]">
                  {i + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="text-xs text-slate-500 mt-6">Last updated: {new Date(score.lastUpdated).toLocaleDateString()}</p>
    </section>
  );
}
