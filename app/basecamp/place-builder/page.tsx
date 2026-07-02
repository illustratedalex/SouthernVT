import { PlaceBuilderWizard } from "@/components/basecamp/place-builder/PlaceBuilderWizard";

export default function PlaceBuilderPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(213,183,102,0.16),_transparent_32%),linear-gradient(135deg,_#f7efe1_0%,_#fcfaf6_100%)] text-slate-800">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <PlaceBuilderWizard />
      </div>
    </div>
  );
}
