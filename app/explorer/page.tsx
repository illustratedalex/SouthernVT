import { ExplorerExperience } from "@/components/explorer/ExplorerExperience";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ExplorerService } from "@/lib/discovery/ExplorerService";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Explorer Mode | SouthernVT",
  description: "Tap into a curated Southern Vermont surprise adventure with places, food, guides, deals, and optional events.",
  path: "/explorer",
});

export default async function ExplorerPage() {
  const results = ExplorerService.getExplorerResults();
  const detailedResults = await Promise.all(results.map((result) => ExplorerService.buildExplorerResultDetails(result)));

  return (
    <main className="min-h-screen bg-(--color-cream) text-(--color-slate)">
      <Navbar />
      <ExplorerExperience detailedResults={detailedResults} />
      <Footer />
    </main>
  );
}
