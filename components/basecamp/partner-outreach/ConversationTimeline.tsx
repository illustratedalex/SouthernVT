import type { OutreachBusiness, OutreachConversationEvent } from "@/types/PartnerOutreach";

export function ConversationTimeline({ events, businesses }: { events: OutreachConversationEvent[]; businesses: OutreachBusiness[] }) {
  const byBusinessId = new Map(businesses.map((item) => [item.id, item.businessName]));

  return (
    <article className="rounded-[28px] border border-[#e8dfc8] bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Conversation Timeline</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent outreach activity</h2>

      <div className="mt-5 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-2xl border border-[#ece3cf] bg-[#fcfaf6] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-900">{event.title}</p>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
            </div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#1f3b2f]">
              {byBusinessId.get(event.businessId) ?? "Business"}
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-600">{event.detail}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
