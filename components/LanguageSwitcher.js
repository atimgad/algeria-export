'use client';

import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Détecter la langue actuelle depuis l'URL
  const currentLang = pathname?.split('/')[1] || 'fr';
  
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'Europe' },
    { code: 'en', name: 'English', flag: '🇬🇧', region: 'Europe' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', region: 'Europe' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', region: 'Europe' },
    { code: 'es', name: 'Español', flag: '🇪🇸', region: 'Europe' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', region: 'Europe' },
    { code: 'ar', name: 'العربية', flag: '🇩🇿', region: 'Moyen-Orient' },
    { code: 'zh', name: '中文', flag: '🇨🇳', region: 'Asie' },
    { code: 'ja', name: '日本語', flag: '🇯🇵', region: 'Asie' },
    { code: 'ko', name: '한국어', flag: '🇰🇷', region: 'Asie' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭', region: 'Asie du Sud-Est' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Asie du Sud-Est' },
    { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾', region: 'Asie du Sud-Est' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', region: 'Asie du Sud' },
    { code: 'pt', name: 'Português', flag: '🇵🇹', region: 'Europe' }, // Ajout pour Angola, Mozambique
    { code: 'sw', name: 'Kiswahili', flag: '🇹🇿', region: 'Afrique de l\'Est' }, // Ajout pour Tanzanie, Kenya
    { code: 'ha', name: 'Hausa', flag: '🇳🇬', region: 'Afrique de l\'Ouest' }, // Ajout pour Nigeria, Niger
    { code: 'yo', name: 'Yorùbá', flag: '🇳🇬', region: 'Afrique de l\'Ouest' }, // Ajout pour Nigeria, Bénin
    { code: 'ig', name: 'Igbo', flag: '🇳🇬', region: 'Afrique de l\'Ouest' }, // Ajout pour Nigeria
    { code: 'am', name: 'አማርኛ', flag: '🇪🇹', region: 'Afrique de l\'Est' }, // Ajout pour Éthiopie
    { code: 'so', name: 'Af-Soomaali', flag: '🇸🇴', region: 'Corne de l\'Afrique' } // Ajout pour Somalie, Djibouti
  ];

  // Grouper par région
  const groupedLanguages = languages.reduce((acc, lang) => {
    if (!acc[lang.region]) {
      acc[lang.region] = [];
    }
    acc[lang.region].push(lang);
    return acc;
  }, {});

  const switchLanguage = (langCode) => {
    if (langCode === currentLang) return;
    
    // Enlever le code langue actuel de l'URL et mettre le nouveau
    const pathParts = pathname?.split('/') || [];
    if (languages.some(l => l.code === pathParts[1])) {
      pathParts[1] = langCode;
    } else {
      pathParts.unshift(langCode);
    }
    
    const newPath = pathParts.join('/') || `/${langCode}`;
    router.push(newPath);
    setIsOpen(false);
  };
  
  const currentLangInfo = languages.find(l => l.code === currentLang) || languages[0];
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition border border-gray-200"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="font-medium hidden sm:inline">{currentLangInfo.flag} {currentLangInfo.name}</span>
        <span className="font-medium sm:hidden">{currentLangInfo.flag}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border py-2 z-50 max-h-96 overflow-y-auto">
          {Object.entries(groupedLanguages).map(([region, langs]) => (
            <div key={region}>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 uppercase tracking-wider">
                {region}
              </div>
              {langs.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLanguage(lang.code)}
                  className={`w-full text-left px-4 py-2 hover:bg-green-50 flex items-center gap-3 ${
                    currentLang === lang.code ? 'bg-green-100 text-green-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="flex-1">{lang.name}</span>
                  {currentLang === lang.code && (
                    <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">Actif</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}