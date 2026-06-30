import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
      <section className="w-full rounded-[30px] border border-[#e8dfc8] bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">404</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">This trail marker is missing</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">The page you were looking for does not exist, moved, or is still being published in beta.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <Link href="/places/hamilton-falls" className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white">Popular place: Hamilton Falls</Link>
          <Link href="/places/jamaica-state-park" className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white">Popular place: Jamaica State Park</Link>
          <Link href="/collections" className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white">Browse collections</Link>
          <Link href="/explorer" className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white">Try Explorer Mode</Link>
          <Link href="/places" className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] px-4 py-3 text-sm font-medium text-slate-700 hover:bg-white">Open Places Search</Link>
          <Link href="/" className="rounded-2xl border border-[#1f3b2f] bg-[#1f3b2f] px-4 py-3 text-sm font-semibold text-[#f8f2e4] hover:bg-[#29493a]">Go to homepage</Link>
        </div>
      </section>
    </main>
  );
}