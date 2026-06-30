export type SearchResultType = "place" | "collection" | "media" | "basecamp";

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: SearchResultType;
  url: string;
  keywords: string[];
}

export interface GroupedSearchResults {
  places: SearchResult[];
  collections: SearchResult[];
  media: SearchResult[];
  basecamp: SearchResult[];
}
