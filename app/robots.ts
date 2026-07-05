import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/basecamp", "/api", "/admin"],
    },
    sitemap: "https://www.southernvt.com/sitemap.xml",
  };
}
