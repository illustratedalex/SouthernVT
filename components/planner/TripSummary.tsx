import Link from "next/link";
import type { Trip } from "@/types/Trip";

type TripSummaryProps = {
  trip: Trip;
  tripLink?: string;
};

export function TripSummary({ trip, tripLink }: TripSummaryProps) {
  return (
    <section className="rounded-[28px] border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Trip summary</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">{trip.title}</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">{trip.notes}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-700">
        <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-1.5">{trip.startDate} to {trip.endDate}</span>
        <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-1.5">Home base: {trip.homeBase}</span>
        <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-1.5">{trip.days.length} days</span>
        <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-1.5">{trip.travelers} travelers</span>
        <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-1.5">{trip.budget} budget</span>
        <span className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-1.5">{trip.pace} pace</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-700">
        {trip.interests.length ? trip.interests.map((interest) => (
          <span key={interest} className="rounded-full bg-[#eef5f1] px-3 py-1 text-[#1f3b2f]">
            {interest}
          </span>
        )) : <span className="text-slate-500">No interests selected.</span>}
      </div>

      {tripLink ? (
        <Link href={tripLink} className="mt-5 inline-flex rounded-full bg-[#1f3b2f] px-5 py-2 text-sm font-semibold text-[#f8f2e4]">
          Open trip detail
        </Link>
      ) : null}
    </section>
  );
}
