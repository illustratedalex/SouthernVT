import type { ReactNode } from "react";

type TripStepProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function TripStep({ title, description, children }: TripStepProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white/85 p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}
