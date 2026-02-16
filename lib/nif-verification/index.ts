import { verifyNIFWithConformePro } from './conformepro';
import { verifyNIFWithDGI } from './dgi-scraper';
import { NIFCache } from './cache';
import { NIFVerificationResponse, NIFVerificationRequest } from './types';
import { createClient } from '@/lib/supabase-server';

const cache = NIFCache.getInstance();

export async function verifyNIF(
  request: NIFVerificationRequest,
  options?: { useCache?: boolean; forceRefresh?: boolean }
): Promise<NIFVerificationResponse> {
  const { useCache = true, forceRefresh = false } = options || {};
  const cleanNIF = request.nif.replace(/\s/g, '');

  // 1. Vérifier le cache si autorisé
  if (useCache && !forceRefresh) {
    const cached = await cache.get(cleanNIF);
    if (cached) {
      return cached;
    }
  }

  // 2. Essayer ConformePro (API sécurisée)
  let result = await verifyNIFWithConformePro(cleanNIF);
  
  // 3. Fallback sur validation locale si ConformePro échoue
  if (!result.success) {
    console.log('Fallback sur validation locale pour NIF:', cleanNIF);
    result = await verifyNIFWithDGI(cleanNIF);
  }

  // 4. Mettre en cache si réussi
  if (result.success) {
    await cache.set(cleanNIF, result);
    
    // Mettre à jour l'exportateur si existant
    await updateExporterWithNIFData(cleanNIF, result);
  }

  return result;
}

async function updateExporterWithNIFData(nif: string, verification: NIFVerificationResponse) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('exporters')
      .update({
        nif_verified: verification.success,
        nif_verification_date: new Date().toISOString(),
        nif_data: verification.data,
        tax_status: verification.data?.taxStatus,
        legal_name: verification.data?.legalName,
        tax_office: verification.data?.taxOffice,
        last_updated: new Date().toISOString()
      })
      .eq('nif', nif);

    if (error) {
      console.error('Erreur mise à jour exportateur:', error);
    }
  } catch (error) {
    console.error('Erreur mise à jour base:', error);
  }
}

export async function batchVerifyNIF(nifs: string[]): Promise<Map<string, NIFVerificationResponse>> {
  const results = new Map();
  
  // Traiter par lots pour éviter de surcharger
  const batchSize = 20;
  for (let i = 0; i < nifs.length; i += batchSize) {
    const batch = nifs.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (nif) => {
        const result = await verifyNIF({ nif });
        results.set(nif, result);
      })
    );
    
    // Pause entre les lots
    if (i + batchSize < nifs.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return results;
}