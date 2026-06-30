import { notFound } from "next/navigation";
import { DealForm } from "@/components/basecamp";
import { getDealById } from "@/repositories/DealRepository";

interface DealDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BasecampDealDetailPage({ params }: DealDetailPageProps) {
  const { id } = await params;
  const deal = await getDealById(id);

  if (!deal) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(213,183,102,0.16),transparent_32%),linear-gradient(135deg,#f7efe1_0%,#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <DealForm initialDeal={deal} />
      </div>
    </div>
  );
}
