import { PlaceForm } from "@/components/basecamp";

export default function NewPlacePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-forest-green)]">Basecamp</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create a place</h1>
          <p className="mt-2 text-base leading-8 text-slate-600">
            Add a rich, type-aware destination entry with metadata and flexible content fields.
          </p>
        </div>
        <PlaceForm />
      </div>
    </div>
  );
}
