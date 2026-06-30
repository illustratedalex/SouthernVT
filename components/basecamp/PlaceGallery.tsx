interface PlaceGalleryProps {
  images: string[];
}

export function PlaceGallery({ images }: PlaceGalleryProps) {
  if (!images.length) {
    return <p className="text-sm text-slate-500">No gallery images added yet.</p>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image) => (
        <div key={image} className="overflow-hidden rounded-2xl border border-[#e8dfc8] bg-white shadow-sm">
          <img src={image} alt="Place gallery image" className="h-40 w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
