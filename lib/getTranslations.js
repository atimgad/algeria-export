// lib/getTranslations.js
// Version serveur - pas de 'use client'

// Importer les traductions directement
import fr from './locales/fr';
import en from './locales/en';

const translations = {
  fr,
  en,
};

export async function getTranslations(lang = 'fr') {
  return translations[lang] || translations.fr;
}