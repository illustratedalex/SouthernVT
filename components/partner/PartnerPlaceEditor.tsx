import type { Place } from "@/types/Place";

interface PartnerPlaceEditorProps {
  place: Place;
}

export function PartnerPlaceEditor({ place }: PartnerPlaceEditorProps) {
  return (
    <section className="space-y-5 rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Business listing editor</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">This is a shell editor for partner-managed listing updates.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Business name</label>
          <input defaultValue={place.name} className="h-12 w-full rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Hours</label>
          <input defaultValue={place.hours} className="h-12 w-full rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Description</label>
          <textarea defaultValue={place.description} rows={5} className="w-full rounded-3xl border border-[#d7cbb3] bg-white px-4 py-3 text-sm text-slate-700 outline-none" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Contact</label>
          <input defaultValue={place.phone} className="h-12 w-full rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Amenities</label>
          <input defaultValue={place.amenities.join(", ")} className="h-12 w-full rounded-full border border-[#d7cbb3] bg-white px-4 text-sm text-slate-700 outline-none" />
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-4 text-sm text-slate-600">
        Photos placeholder: partner photo uploads and gallery ordering will be added in a future iteration.
      </div>

      <div className="rounded-2xl border border-[#d7cbb3] bg-[#fff7e4] p-4 text-sm font-medium text-[#6b5a30]">
        Changes require approval before appearing publicly.
      </div>

      <button type="button" className="inline-flex rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">
        Submit for review
      </button>
    </section>
  );
}
