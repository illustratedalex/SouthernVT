interface GalleryGridProps {
  images: string[];
  alt: string;
}

export function GalleryGrid({ images, alt }: GalleryGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <div key={`${image}-${index}`} className="overflow-hidden rounded-[24px] border border-[#e8dfc8] bg-[#fcfaf6]">
          <img src={image} alt={`${alt} ${index + 1}`} className="h-48 w-full object-cover transition duration-500 hover:scale-[1.02]" />
        </div>
      ))}
    </div>
  );
}