'use client';

import { Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  // Détecter la langue actuelle depuis l'URL
  const currentLang = pathname?.startsWith('/en') ? 'en' : 'fr';
  
  const switchLanguage = (lang) => {
    if (lang === currentLang) return;
    
    // Rediriger vers la même page dans l'autre langue
    const newPath = pathname?.replace(/^\/(en|fr)/, `/${lang}`) || `/${lang}`;
    router.push(newPath);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="font-medium">{currentLang === 'fr' ? 'FR' : 'EN'}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border py-1 z-50">
          <button
            onClick={() => switchLanguage('fr')}
            className={`w-full text-left px-4 py-2 hover:bg-green-50 flex items-center gap-2 ${currentLang === 'fr' ? 'bg-green-100 text-green-700' : ''}`}
          >
            <span className="text-xl">🇫🇷</span>
            <span>Français</span>
          </button>
          <button
            onClick={() => switchLanguage('en')}
            className={`w-full text-left px-4 py-2 hover:bg-green-50 flex items-center gap-2 ${currentLang === 'en' ? 'bg-green-100 text-green-700' : ''}`}
          >
            <span className="text-xl">🇬🇧</span>
            <span>English</span>
          </button>
        </div>
      )}
    </div>
  );
}