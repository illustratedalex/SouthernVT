const STEP_LABELS = [
  "Basic Info",
  "Story",
  "Visitor Info",
  "Photography",
  "Relationships",
  "SEO",
  "Preview",
];

interface PlaceBuilderProgressProps {
  currentStep: number;
  readiness: number;
}

export function PlaceBuilderProgress({ currentStep, readiness }: PlaceBuilderProgressProps) {
  const readinessColor =
    readiness >= 80 ? "bg-[#1f5a3d]" : readiness >= 50 ? "bg-[#d8b15d]" : "bg-slate-400";
  const readinessTextColor =
    readiness >= 80 ? "text-[#1f5a3d]" : readiness >= 50 ? "text-[#7a5c17]" : "text-slate-500";

  return (
    <div className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm backdrop-blur">
      {/* Step pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2" role="list" aria-label="Wizard progress">
        {STEP_LABELS.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <div key={label} className="flex shrink-0 items-center gap-1" role="listitem">
              <div
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#1f3b2f] text-[#f8f2e4]"
                    : isCompleted
                      ? "bg-[#eef4f0] text-[#1f3b2f]"
                      : "bg-[#fcfaf6] text-slate-500"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isActive
                      ? "bg-[#d8b15d] text-[#1f3b2f]"
                      : isCompleted
                        ? "bg-[#1f3b2f] text-white"
                        : "bg-slate-200 text-slate-600"
                  }`}
                  aria-hidden="true"
                >
                  {isCompleted ? "✓" : step}
                </span>
                <span className="hidden md:inline">{label}</span>
              </div>
              {index < STEP_LABELS.length - 1 ? (
                <div className="h-px w-3 shrink-0 bg-[#e8dfc8]" aria-hidden="true" />
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Launch readiness bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-600">Launch Readiness</p>
          <p className={`text-xs font-bold ${readinessTextColor}`}>{readiness}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f0e8d6]" role="progressbar" aria-valuenow={readiness} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`h-full rounded-full transition-all duration-500 ${readinessColor}`}
            style={{ width: `${readiness}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-slate-500">
          {readiness >= 80
            ? "Ready for launch — great work!"
            : readiness >= 50
              ? "Good progress. Fill in story, hero image, and SEO to reach 80%."
              : "Fill in the required fields and story to increase readiness."}
        </p>
      </div>
    </div>
  );
}
