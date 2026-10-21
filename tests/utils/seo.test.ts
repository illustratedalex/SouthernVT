import { afterEach, describe, expect, it, vi } from "vitest";
import { absoluteUrl, createPageMetadata, getSiteUrl } from "@/lib/seo";

afterEach(() => vi.unstubAllEnvs());

describe("production canonical host", () => {
  it.each([undefined, "https://southernvt.com", "https://southernvt.com/", "http://www.southernvt.com/", "https://www.southernvt.com/", "invalid-url"])("normalizes %s to the live HTTPS www host", (configured) => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", configured);
    expect(getSiteUrl()).toBe("https://www.southernvt.com");
    expect(absoluteUrl("/places")).toBe("https://www.southernvt.com/places");
    const metadata = createPageMetadata({ title: "Places", description: "Explore the region", path: "/places" });
    expect(metadata.alternates?.canonical).toBe("https://www.southernvt.com/places");
    expect(metadata.openGraph).toMatchObject({ url: "https://www.southernvt.com/places" });
  });

  it("preserves explicit custom/preview configuration and external URLs", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.org/");
    expect(absoluteUrl("guides")).toBe("https://preview.example.org/guides");
    expect(absoluteUrl("https://external.example.org/photo.jpg")).toBe("https://external.example.org/photo.jpg");
  });
});
