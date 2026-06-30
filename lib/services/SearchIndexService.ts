import { cacheService } from "./CacheService";
import { buildGlobalSearchIndex, runGlobalSearch, type GlobalSearchItem } from "@/lib/search/globalSearch";

const CACHE_KEY = "trailhead:search-index";

export class SearchIndexService {
  async getIndex(): Promise<GlobalSearchItem[]> {
    const cached = cacheService.get<GlobalSearchItem[]>(CACHE_KEY);
    if (cached) {
      return cached;
    }

    const index = buildGlobalSearchIndex();
    cacheService.set(CACHE_KEY, index, 5 * 60 * 1000);
    return index;
  }

  async search(query: string): Promise<GlobalSearchItem[]> {
    const index = await this.getIndex();
    return runGlobalSearch(query, index);
  }
}

export const searchIndexService = new SearchIndexService();