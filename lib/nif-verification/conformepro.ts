import { NIFVerificationResponse } from './types';

// Configuration de l'API ConformePro
const CONFORMEPRO_API_URL = 'https://api.conformepro.dz/v1';
const CONFORMEPRO_API_KEY = process.env.CONFORMEPRO_API_KEY;

export async function verifyNIFWithConformePro(nif: string): Promise<NIFVerificationResponse> {
  try {
    if (!CONFORMEPRO_API_KEY) {
      console.warn('API Key ConformePro non configurée');
      return { success: false, error: 'Service non configuré', source: 'conformepro' };
    }

    // Normaliser le NIF (supprimer les espaces)
    const cleanNIF = nif.replace(/\s/g, '');

    const response = await fetch(`${CONFORMEPRO_API_URL}/nif/${cleanNIF}`, {
      headers: {
        'Authorization': `Bearer ${CONFORMEPRO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { 
        success: false, 
        error: `Erreur API: ${response.status}`,
        source: 'conformepro'
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: {
        nif: data.nif,
        legalName: data.raison_sociale,
        commercialRegister: data.registre_commerce,
        taxStatus: data.statut_fiscal === 'A' ? 'ACTIF' : 'RADIE',
        taxOffice: data.centre_impots,
        articleImposition: data.article_imposition,
        address: data.adresse,
        activity: data.activite,
        legalForm: data.forme_juridique,
        creationDate: data.date_creation,
        lastUpdate: data.date_mise_a_jour
      },
      source: 'conformepro'
    };
  } catch (error) {
    console.error('Erreur vérification NIF ConformePro:', error);
    return { 
      success: false, 
      error: 'Erreur de connexion au service',
      source: 'conformepro'
    };
  }
}