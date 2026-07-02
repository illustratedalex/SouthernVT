"use client";

import { Fragment, useEffect, useRef } from "react";

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
  const activeRef = useRef<HTMLDivElement>(null);

  // Keep the active step visible when navigating forward / backward.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [currentStep]);

  const readinessColor =
    readiness >= 80 ? "bg-[#1f5a3d]" : readiness >= 50 ? "bg-[#d8b15d]" : "bg-slate-400";
  const readinessTextColor =
    readiness >= 80 ? "text-[#1f5a3d]" : readiness >= 50 ? "text-[#7a5c17]" : "text-slate-500";

  return (
    <div className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-5 shadow-sm backdrop-blur">
      {/*
       * Step rail
       * — mobile / tablet : horizontal scroll, labels hidden, number circles only
       * — desktop (lg+)   : labels visible, connector lines grow to fill width
       * The scrollbar track is hidden on all browsers while the rail stays
       * scrollable, so the active step can be scrolled into view programmatically.
       */}
      <div
        className="flex items-center overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="list"
        aria-label="Wizard steps"
      >
        {STEP_LABELS.map((label, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <Fragment key={label}>
              {/* Step pill */}
              <div
                ref={isActive ? activeRef : null}
                role="listitem"
                aria-label={`Step ${step} of 7: ${label}${isActive ? " — current step" : isCompleted ? " — completed" : ""}`}
                aria-current={isActive ? "step" : undefined}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
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
                {/* Labels shown only at lg+ where all 7 fit without overflow */}
                <span className="hidden lg:inline">{label}</span>
              </div>

              {/* Connector line between steps.
                  On lg+ it grows (flex-1) so the rail fills the full card width. */}
              {index < STEP_LABELS.length - 1 ? (
                <div
                  role="none"
                  aria-hidden="true"
                  className="h-px min-w-3 shrink-0 bg-[#e8dfc8] lg:min-w-2 lg:flex-1"
                />
              ) : null}
            </Fragment>
          );
        })}
      </div>

      {/* Launch readiness bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-600">Launch Readiness</p>
          <p className={`text-xs font-bold ${readinessTextColor}`}>{readiness}%</p>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-[#f0e8d6]"
          role="progressbar"
          aria-valuenow={readiness}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Launch readiness"
        >
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
