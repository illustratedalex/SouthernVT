"use client";

import Link from "next/link";
import { ErrorState } from "@/components/ui";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-4xl items-center px-6 py-16">
      <section className="w-full space-y-5 rounded-[30px] border border-[#e8dfc8] bg-white p-8 shadow-sm">
        <ErrorState title="Something went off trail" description={error.message || "A temporary server issue interrupted this page."} actionLabel="Try again" onAction={reset} className="w-full" />
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="rounded-full bg-[#1f3b2f] px-5 py-3 text-sm font-semibold text-[#f8f2e4]">Back to homepage</Link>
          <Link href="/feedback" className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-5 py-3 text-sm font-semibold text-slate-700">Report this issue</Link>
        </div>
      </section>
    </main>
  );
}