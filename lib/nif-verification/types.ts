export interface NIFVerificationRequest {
  nif: string;
}

export interface NIFVerificationResponse {
  success: boolean;
  data?: {
    nif: string;
    legalName: string; // Raison sociale
    commercialRegister?: string; // Registre de commerce
    taxStatus: 'ACTIF' | 'RADIE' | 'SUSPENDU';
    taxOffice?: string; // Centre des impôts
    articleImposition?: string;
    address?: string;
    activity?: string;
    legalForm?: string; // SARL, SPA, EURL, etc.
    creationDate?: string;
    lastUpdate?: string;
  };
  error?: string;
  source: 'conformepro' | 'dgi' | 'cnrc' | 'cache';
}