import Link from "next/link";

type ExplorerCTAProps = {
  plannerHref: string;
};

export function ExplorerCTA({ plannerHref }: ExplorerCTAProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Link href={plannerHref} className="rounded-2xl bg-[#1f3b2f] px-5 py-4 text-center text-sm font-semibold text-[#f8f2e4] shadow-sm transition hover:bg-[#29493a]">
        Build this trip
      </Link>
      <Link href="/map" className="rounded-2xl border border-[#d7cbb3] bg-white px-5 py-4 text-center text-sm font-semibold text-slate-800 transition hover:bg-[#fcfaf6]">
        Open map placeholder
      </Link>
    </section>
  );
}
