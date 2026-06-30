import Link from "next/link";
import { FieldWizard } from "@/components/basecamp/FieldWizard";

export default function NewFieldDraftPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(31,77,58,0.12),transparent_35%),linear-gradient(140deg,#f8f2e4_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6 lg:px-8">
        <header className="rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Basecamp Field</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">New Field Capture</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600">One-handed, touch-first place capture for mobile onsite collection.</p>
          <div className="mt-3">
            <Link href="/basecamp/field" className="text-sm font-semibold text-[#1f3b2f]">Back to Field Mode</Link>
          </div>
        </header>

        <FieldWizard />
      </div>
    </div>
  );
}
