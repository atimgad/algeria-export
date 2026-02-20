import { verifyNifConformepro } from './conformepro';
import { verifyNifDGI } from './dgi-scraper';
import { NIFCache } from './cache';

export async function verifyNIF(nif: string, request: any) {
  try {
    const cached = await NIFCache.get(nif);
    if (cached) {
      return {
        valid: cached.valid,
        data: cached.data,
        source: 'cache'
      };
    }

    const conformeProResult = await verifyNifConformepro(nif);
    if (conformeProResult.valid) {
      await NIFCache.set(nif, conformeProResult, 'conformepro');
      return {
        valid: true,
        data: conformeProResult,
        source: 'conformepro'
      };
    }

    const dgiResult = await verifyNifDGI(nif);
    if (dgiResult.valid) {
      await NIFCache.set(nif, dgiResult, 'dgi');
      return {
        valid: true,
        data: dgiResult,
        source: 'dgi'
      };
    }

    return {
      valid: false,
      error: 'NIF non trouvé',
      source: 'none'
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Erreur technique',
      source: 'error'
    };
  }
}