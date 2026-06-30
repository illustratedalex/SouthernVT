import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <div className="w-full rounded-3xl border border-dashed border-[#d7cbb3] bg-[#fff9eb] p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className="mt-5 inline-flex rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">
          Back home
        </Link>
      </div>
    </main>
  );
}