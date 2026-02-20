interface NifResult {
  valid: boolean;
  entreprise?: string;
  siege?: string;
  wilaya?: string;
  commune?: string;
  activite?: string;
  adresse?: string;
  error?: string;
  source: 'conformepro' | 'dgi' | 'cnrc' | 'cache' | 'validation';
}

export async function verifyNif(nif: string): Promise<NifResult> {
  // Validation basique du format NIF algérien (15 ou 20 chiffres)
  if (!/^\d{15,20}$/.test(nif)) {
    return {
      valid: false,
      error: 'Format NIF invalide',
      source: 'validation'
    };
  }

  try {
    // Simulation d'une vérification (à remplacer par un vrai appel API)
    // Pour l'instant, on simule une entreprise valide pour les tests
    if (nif.length >= 15) {
      return {
        valid: true,
        entreprise: 'ENTREPRISE TEST',
        siege: 'Siège Social',
        wilaya: 'Alger',
        commune: 'Alger Centre',
        activite: 'Commerce',
        adresse: '123 Rue Test',
        source: 'dgi'
      };
    }

    return {
      valid: false,
      error: 'NIF non trouvé',
      source: 'dgi'
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Erreur lors de la vérification',
      source: 'dgi'
    };
  }
}

export async function verifyNifConformepro(nif: string): Promise<NifResult> {
  return verifyNif(nif);
}

export async function verifyNifDGI(nif: string): Promise<NifResult> {
  return verifyNif(nif);
}

export async function verifyNifCNRC(nif: string): Promise<NifResult> {
  return verifyNif(nif);
}