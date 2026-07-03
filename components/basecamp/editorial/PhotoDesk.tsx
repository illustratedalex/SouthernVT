"use client";

interface PhotoNeed {
  id: string;
  placeName: string;
  type: "Hero Photo" | "Gallery" | "Drone" | "Vertical Reel" | "Winter Photos";
  priority: "Critical" | "High" | "Medium";
}

const photoNeeds: PhotoNeed[] = [
  { id: "1", placeName: "Jamaica State Park", type: "Drone", priority: "High" },
  { id: "2", placeName: "Putney Mountain", type: "Winter Photos", priority: "Critical" },
  { id: "3", placeName: "Mount Equinox", type: "Gallery", priority: "High" },
  { id: "4", placeName: "Bellows Falls", type: "Vertical Reel", priority: "Medium" },
  { id: "5", placeName: "Lye Brook Falls", type: "Hero Photo", priority: "Critical" },
];

const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-800",
  High: "bg-orange-100 text-orange-800",
  Medium: "bg-yellow-100 text-yellow-800",
};

const typeIcons: Record<PhotoNeed["type"], string> = {
  "Hero Photo": "🖼️",
  Gallery: "📸",
  Drone: "🛸",
  "Vertical Reel": "📹",
  "Winter Photos": "❄️",
};

export function PhotoDesk() {
  return (
    <article className="rounded-3xl border border-[#e8dfc8] bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Photo Desk</p>
      <h2 className="mt-2 text-2xl font-semibold text-slate-900">Photography Assignments</h2>
      <p className="mt-1 text-sm text-slate-600">Places needing photography</p>

      <div className="mt-6 space-y-3">
        {photoNeeds.map((need) => (
          <div
            key={need.id}
            className="flex items-center justify-between p-3 bg-[#fcfaf6] rounded-lg border border-[#ece3cf]"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{typeIcons[need.type]}</span>
              <div>
                <p className="font-medium text-sm text-slate-900">{need.placeName}</p>
                <p className="text-xs text-slate-500">{need.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${priorityColors[need.priority]}`}>
                {need.priority}
              </span>
              <button className="rounded-full border border-[#d7cbb3] bg-[#fcfaf6] px-3 py-1 text-xs font-semibold text-slate-800 hover:bg-white">
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
