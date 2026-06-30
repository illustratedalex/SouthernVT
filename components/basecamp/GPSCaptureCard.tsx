interface GPSCaptureCardProps {
  status: "requesting" | "ready" | "error";
  latitude: number | null;
  longitude: number | null;
  townLabel: string;
  onRequestGps: () => void;
}

export function GPSCaptureCard({ status, latitude, longitude, townLabel, onRequestGps }: GPSCaptureCardProps) {
  return (
    <section className="space-y-4 rounded-3xl border border-[#d7cbb3] bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#1f3b2f]">Step 1</p>
        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Capture location</h2>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          We request GPS automatically and keep a draft-friendly location snapshot while you are onsite.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Latitude</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{latitude !== null ? latitude.toFixed(6) : "Awaiting GPS"}</p>
        </div>
        <div className="rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Longitude</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{longitude !== null ? longitude.toFixed(6) : "Awaiting GPS"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-[#d7cbb3] bg-[#f8f2e4] p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Town</p>
        <p className="mt-2 text-lg font-semibold text-slate-900">{townLabel}</p>
      </div>

      <div className="rounded-3xl border border-[#d7cbb3] bg-[linear-gradient(135deg,#f3ead6_0%,#efe4cd_100%)] p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1f3b2f]">Map placeholder</p>
        <p className="mt-3 text-sm text-slate-700">Interactive field map preview coming soon.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onRequestGps}
          className="min-h-12 rounded-full bg-[#1f3b2f] px-6 text-sm font-semibold text-[#f8f2e4] transition hover:bg-[#2b493a]"
        >
          Request GPS again
        </button>
        <span className="rounded-full border border-[#d7cbb3] bg-white px-4 py-2 text-sm font-semibold text-slate-700">
          Status: {status === "requesting" ? "Requesting" : status === "ready" ? "Ready" : "Unavailable"}
        </span>
      </div>
    </section>
  );
}
