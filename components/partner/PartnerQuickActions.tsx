import Link from "next/link";

const quickActions = [
  { label: "Update Listing", href: "/partner-portal/place" },
  { label: "Add Deal", href: "/partner-portal/deals" },
  { label: "Submit Event", href: "/partner-portal/events" },
  { label: "View Passport Check-ins", href: "/partner-portal/dashboard#passport-check-ins" },
];

export function PartnerQuickActions() {
  return (
    <section className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <Link key={action.label} href={action.href} className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-[#f4ebd5]">
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
