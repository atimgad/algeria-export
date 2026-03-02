// lib/useTranslations.js
'use client';

import { usePathname } from 'next/navigation';
import fr from './locales/fr';
import en from './locales/en';

// Importer les autres langues au fur et à mesure
// import de from './locales/de';
// import it from './locales/it';
// import es from './locales/es';
// import ar from './locales/ar';
// import ru from './locales/ru';
// import zh from './locales/zh';
// import ja from './locales/ja';
// import ko from './locales/ko';
// import th from './locales/th';
// import id from './locales/id';
// import ms from './locales/ms';
// import hi from './locales/hi';
// import pt from './locales/pt';
// import sw from './locales/sw';
// import ha from './locales/ha';
// import yo from './locales/yo';
// import ig from './locales/ig';
// import am from './locales/am';
// import so from './locales/so';

const translations = {
  fr,
  en,
  // de,
  // it,
  // es,
  // ar,
  // ru,
  // zh,
  // ja,
  // ko,
  // th,
  // id,
  // ms,
  // hi,
  // pt,
  // sw,
  // ha,
  // yo,
  // ig,
  // am,
  // so
};

export function useTranslations() {
  const pathname = usePathname();
  
  // Détecter la langue depuis l'URL
  const langCode = pathname?.split('/')[1] || 'fr';
  const lang = translations[langCode] || translations.fr;
  
  // Fonction pour récupérer une traduction par chemin (ex: 'common.home')
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = lang;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Remplacer les paramètres (ex: {{count}})
    if (typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (_, param) => params[param] || '');
    }
    
    return value;
  };
  
  return { t, langCode, lang };
}

// Version pour les composants serveur
export async function getTranslations(langCode = 'fr') {
  const lang = translations[langCode] || translations.fr;
  
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = lang;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    if (typeof value === 'string') {
      return value.replace(/\{\{(\w+)\}\}/g, (_, param) => params[param] || '');
    }
    
    return value;
  };
  
  return { t, langCode };
}