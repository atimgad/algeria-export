interface CacheEntry {
  valid: boolean;
  data: any;
  source: string;
  timestamp: number;
}

export class NIFCache {
  private static cache: Map<string, CacheEntry> = new Map();
  private static readonly TTL = 24 * 60 * 60 * 1000; // 24 heures

  static async get(nif: string): Promise<CacheEntry | null> {
    const entry = this.cache.get(nif);
    
    if (!entry) {
      return null;
    }

    // Vérifier si le cache n'a pas expiré
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(nif);
      return null;
    }

    return entry;
  }

  static async set(nif: string, data: any, source: string): Promise<void> {
    this.cache.set(nif, {
      valid: true,
      data,
      source,
      timestamp: Date.now()
    });
  }

  static async clear(): Promise<void> {
    this.cache.clear();
  }

  static async remove(nif: string): Promise<void> {
    this.cache.delete(nif);
  }
}