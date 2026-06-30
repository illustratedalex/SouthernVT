import Link from "next/link";

type PhotoMissionCardProps = {
  placeName: string;
  missions: string[];
  href: string;
};

export function PhotoMissionCard({ placeName, missions, href }: PhotoMissionCardProps) {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f3b2f]">Photography Mission</p>
      <h3 className="mt-2 text-xl font-semibold text-slate-900">{placeName}</h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Missing</p>
      <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
        {missions.map((mission) => (
          <li key={mission} className="rounded-xl border border-[#eee6d4] bg-[#fcfaf6] px-3 py-2">{mission}</li>
        ))}
      </ul>
      <Link href={href} className="mt-4 inline-flex rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white">
        Open Place
      </Link>
    </article>
  );
}
