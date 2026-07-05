export type SearchResultType = "place" | "business" | "stay" | "guide" | "collection" | "event";

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: SearchResultType;
  url: string;
  keywords: string[];
  premium?: boolean;
}

export interface GroupedSearchResults {
  places: SearchResult[];
  businesses: SearchResult[];
  stays: SearchResult[];
  guides: SearchResult[];
  collections: SearchResult[];
  events: SearchResult[];
}
