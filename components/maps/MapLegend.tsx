import { getTypeIcon } from "./MapMarker";

interface MapLegendProps {
  placeTypes: string[];
}

export function MapLegend({ placeTypes }: MapLegendProps) {
  const visibleTypes = placeTypes.slice(0, 10);

  return (
    <section className="rounded-2xl border border-[#e8dfc8] bg-white p-4 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Legend</h3>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {visibleTypes.map((type) => (
          <div key={type} className="flex items-center gap-2 rounded-xl bg-[#fcfaf6] px-2 py-1.5 text-xs font-semibold text-slate-700">
            <span>{getTypeIcon(type)}</span>
            <span className="truncate">{type}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
