type ContentHealthGaugeProps = {
  label: string;
  value: number;
  tone?: "forest" | "amber" | "rose";
};

function getToneColor(tone: "forest" | "amber" | "rose"): string {
  if (tone === "amber") {
    return "#b7791f";
  }
  if (tone === "rose") {
    return "#b42318";
  }
  return "#1f3b2f";
}

export function ContentHealthGauge({ label, value, tone = "forest" }: ContentHealthGaugeProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const toneColor = getToneColor(tone);

  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="mt-4 flex justify-center">
        <div
          className="relative h-40 w-40 rounded-full"
          style={{
            background: `conic-gradient(${toneColor} ${clamped * 3.6}deg, #e6dcc8 ${clamped * 3.6}deg 360deg)`,
          }}
        >
          <div className="absolute inset-[12px] flex items-center justify-center rounded-full bg-[#fcfaf6]">
            <p className="text-3xl font-semibold text-slate-900">{clamped}%</p>
          </div>
        </div>
      </div>
    </article>
  );
}
