interface PlaceGalleryProps {
  title?: string;
  images: string[];
  altPrefix: string;
}

export function PlaceGallery({ title = "Photo gallery", images, altPrefix }: PlaceGalleryProps) {
  const gallery = images.length
    ? images
    : ["https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80"];

  return (
    <section className="rounded-[30px] border border-[#e8dfc8] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">{title}</h2>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-pine)">Preview</p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.slice(0, 6).map((image, index) => (
          <div key={`${image}-${index}`} className="overflow-hidden rounded-2xl border border-[#e8dfc8] bg-[#fcfaf6]">
            <img src={image} alt={`${altPrefix} gallery ${index + 1}`} className="h-48 w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
