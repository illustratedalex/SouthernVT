export interface ImageDescriptor {
  id: string;
  url: string;
  alt: string;
  title?: string;
}

export interface ImageService {
  getPlaceholderImage(title: string): ImageDescriptor;
  normalizeAltText(alt: string, fallback: string): string;
}

class MockImageService implements ImageService {
  getPlaceholderImage(title: string): ImageDescriptor {
    const seed = encodeURIComponent(title || "Southern Vermont");
    return {
      id: `image-${seed}`,
      url: `https://placehold.co/1600x900/png?text=${seed}`,
      alt: `${title || "Southern Vermont"} placeholder image`,
      title,
    };
  }

  normalizeAltText(alt: string, fallback: string) {
    return alt.trim() || fallback;
  }
}

export const imageService: ImageService = new MockImageService();