type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

export class CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, value: T, ttlMs = 60_000) {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  delete(key: string) {
    this.store.delete(key);
  }

  clear() {
    this.store.clear();
  }
}

export const cacheService = new CacheService();