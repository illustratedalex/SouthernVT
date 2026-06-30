"use client";

export function MapLegend() {
  return (
    <div className="flex flex-wrap gap-2 text-xs text-slate-700">
      <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1 font-semibold">Mock Pins</span>
      <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1">Click pin to open place details</span>
      <span className="rounded-full border border-[#d7cbb3] bg-white px-3 py-1">Mapbox-ready shell architecture</span>
    </div>
  );
}
