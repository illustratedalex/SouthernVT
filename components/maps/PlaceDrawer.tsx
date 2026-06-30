import Link from "next/link";
import type { Collection } from "@/types/Collection";
import type { Place } from "@/types/Place";

interface PlaceDrawerProps {
  place: Place | null;
  isOpen: boolean;
  nearby: Array<{ place: Place; distance: number }>;
  collections: Collection[];
  onClose: () => void;
}

export function PlaceDrawer({ place, isOpen, nearby, collections, onClose }: PlaceDrawerProps) {
  if (!place) {
    return null;
  }

  return (
    <aside
      className={`absolute right-0 top-0 z-30 h-full w-[92vw] max-w-[420px] transform overflow-y-auto border-l border-[#d7cbb3] bg-[#fcfaf6] p-4 shadow-[-20px_0_60px_rgba(31,59,47,0.24)] transition duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{place.name}</h2>
        <button type="button" onClick={onClose} className="rounded-full border border-[#d7cbb3] px-3 py-1 text-xs font-semibold text-slate-700">
          Close
        </button>
      </div>

      <div className="space-y-5">
        <div className="overflow-hidden rounded-2xl border border-[#e8dfc8] bg-white">
          <img src={place.featuredImage} alt={place.name} className="h-52 w-full object-cover" />
        </div>

        <section className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Gallery</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(place.gallery.length ? place.gallery : [place.featuredImage]).slice(0, 6).map((image) => (
              <div key={image} className="overflow-hidden rounded-xl border border-[#efe6d1]">
                <img src={image} alt={`${place.name} gallery`} className="h-20 w-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        <InfoBlock title="Hours" content={place.hours || "Hours are being verified by the Trailhead team."} />
        <InfoBlock title="Address" content={`${place.address}, ${place.city}, ${place.state} ${place.zip}`} />
        <InfoBlock title="Contact" content={`${place.phone}\n${place.email}`} />

        <section className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Amenities</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {place.amenities.map((amenity) => (
              <span key={amenity} className="rounded-full bg-[#f7efe1] px-3 py-1 text-xs font-semibold text-[#1f3b2f]">
                {amenity}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Nearby Places</h3>
          <div className="mt-3 space-y-2">
            {nearby.map((item) => (
              <div key={item.place.id} className="rounded-xl bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
                <p className="font-semibold">{item.place.name}</p>
                <p className="text-xs text-slate-500">{item.distance.toFixed(1)} mi · {item.place.placeType}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Collections</h3>
          <div className="mt-3 space-y-2">
            {collections.length ? (
              collections.map((collection) => (
                <Link key={collection.id} href={`/collections/${collection.slug}`} className="block rounded-xl bg-[#fcfaf6] px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f7efe1]">
                  {collection.title}
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-600">No published collections linked yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">Related Articles</h3>
          <div className="mt-3 space-y-2">
            {place.tags.slice(0, 3).map((tag) => (
              <div key={tag} className="rounded-xl bg-[#fcfaf6] px-3 py-2 text-sm text-slate-700">
                Story idea: {place.name} for {tag.toLowerCase()} travelers
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-2xl border border-[#e8dfc8] bg-white p-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#1f3b2f]">{title}</h3>
      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">{content}</p>
    </section>
  );
}
