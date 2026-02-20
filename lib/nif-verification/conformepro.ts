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

export async function verifyNifConformepro(nif: string): Promise<NifResult> {
  // Validation basique du format NIF algérien (15 ou 20 chiffres)
  if (!/^\d{15,20}$/.test(nif)) {
    return {
      valid: false,
      error: 'Format NIF invalide',
      source: 'validation'
    };
  }

  try {
    // Simulation d'une vérification ConformePro
    // À remplacer par un vrai appel API ConformePro
    if (nif.length >= 15 && nif.startsWith('0')) {
      return {
        valid: true,
        entreprise: 'ENTREPRISE CONFORMEPRO',
        siege: 'Siège Social',
        wilaya: 'Alger',
        commune: 'Alger Centre',
        activite: 'Commerce',
        adresse: '123 Rue ConformePro',
        source: 'conformepro'
      };
    }

    return {
      valid: false,
      error: 'NIF non trouvé dans ConformePro',
      source: 'conformepro'
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Erreur lors de la vérification ConformePro',
      source: 'conformepro'
    };
  }
}

// Garder l'ancien nom pour la compatibilité
export const verifyNIFWithConformePro = verifyNifConformepro;