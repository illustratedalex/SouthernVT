import { MediaLibraryClient } from "@/components/basecamp/MediaLibraryClient";
import { getMediaAssets } from "@/lib/repositories/mediaRepository";

export default async function MediaLibraryPage() {
  const assets = await getMediaAssets();

  return <MediaLibraryClient initialAssets={Array.isArray(assets) ? assets : []} />;
}
