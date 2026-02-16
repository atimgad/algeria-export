import { createClient } from '@/lib/supabase-server';
import { NIFVerificationResponse } from './types';

export class NIFCache {
  private static instance: NIFCache;
  private memoryCache: Map<string, { data: NIFVerificationResponse; timestamp: number }>;
  private readonly CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 jours

  private constructor() {
    this.memoryCache = new Map();
  }

  static getInstance(): NIFCache {
    if (!NIFCache.instance) {
      NIFCache.instance = new NIFCache();
    }
    return NIFCache.instance;
  }

  async get(nif: string): Promise<NIFVerificationResponse | null> {
    // Vérifier le cache mémoire
    const cached = this.memoryCache.get(nif);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    // Vérifier le cache Supabase
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from('nif_cache')
        .select('*')
        .eq('nif', nif)
        .single();

      if (data && new Date(data.verified_at).getTime() > Date.now() - this.CACHE_TTL) {
        const response = data.response as NIFVerificationResponse;
        this.memoryCache.set(nif, { data: response, timestamp: Date.now() });
        return response;
      }
    } catch (error) {
      console.error('Erreur lecture cache Supabase:', error);
    }

    return null;
  }

  async set(nif: string, data: NIFVerificationResponse): Promise<void> {
    // Cache mémoire
    this.memoryCache.set(nif, { data, timestamp: Date.now() });

    // Cache Supabase
    try {
      const supabase = await createClient();
      await supabase
        .from('nif_cache')
        .upsert({
          nif,
          response: data,
          verified_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + this.CACHE_TTL).toISOString()
        });
    } catch (error) {
      console.error('Erreur écriture cache Supabase:', error);
    }
  }

  clear(): void {
    this.memoryCache.clear();
  }
}