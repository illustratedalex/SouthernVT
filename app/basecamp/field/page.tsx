import Link from "next/link";

export default function FieldModePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(31,77,58,0.12),transparent_35%),linear-gradient(140deg,#f8f2e4_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-[#d7cbb3] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Basecamp</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Field Mode</h1>
          <p className="mt-3 text-base leading-8 text-slate-600">
            Mobile-first field capture for destination discovery while onsite.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/basecamp/field/new"
            className="min-h-16 rounded-3xl bg-[#1f3b2f] px-6 py-5 text-center text-lg font-semibold text-[#f8f2e4] shadow-sm transition hover:bg-[#2b493a]"
          >
            Start New Field Draft
          </Link>
          <Link
            href="/basecamp/places"
            className="min-h-16 rounded-3xl border border-[#1f3b2f] bg-white px-6 py-5 text-center text-lg font-semibold text-[#1f3b2f] transition hover:bg-[#f2ead6]"
          >
            Open Place Library
          </Link>
        </section>

        <section className="rounded-3xl border border-dashed border-[#d7cbb3] bg-[#fcfaf6] p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Future TODO</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">GPS weather lookup, offline sync, drone import, and Supabase sync will be added in future milestones.</p>
        </section>
      </div>
    </div>
  );
}
