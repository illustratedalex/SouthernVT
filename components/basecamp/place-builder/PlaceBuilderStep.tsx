import type { ReactNode } from "react";

interface PlaceBuilderStepProps {
  stepNumber: number;
  title: string;
  description: string;
  children: ReactNode;
}

export function PlaceBuilderStep({ stepNumber, title, description, children }: PlaceBuilderStepProps) {
  return (
    <div className="rounded-[32px] border border-[#e8dfc8] bg-white/80 p-6 shadow-[0_20px_80px_rgba(31,59,47,0.08)] backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Step {stepNumber} of 7</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-6 space-y-5">{children}</div>
    </div>
  );
}
