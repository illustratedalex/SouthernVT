import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { CommandPalette } from "@/components/search/CommandPalette";
import { RelationshipStoreProvider } from "@/components/relationships/RelationshipStoreProvider";
import { SearchProvider } from "@/components/search/SearchProvider";
import { ErrorBoundary, ToastProvider } from "@/components/ui";
import { RepositoryProvider } from "@/lib/repositories/RepositoryProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Southern Vermont | Travel & Adventure",
  description: "Discover Southern Vermont with curated guides, local events, scenic adventures, and partner offers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-(--color-cream) text-(--color-slate)">
        <ErrorBoundary>
          <RepositoryProvider mode="auto">
            <ToastProvider>
              <SearchProvider>
                <RelationshipStoreProvider>
                  <CommandPalette />
                  {children}
                </RelationshipStoreProvider>
              </SearchProvider>
            </ToastProvider>
          </RepositoryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
