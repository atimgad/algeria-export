// app/adresses-utiles/page.js
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { 
  Building2, 
  ChevronRight,
  Landmark,
  Anchor,
  Banknote,
  Globe2,
  Shield,
  Ship,
  Factory,
  MapPin
} from 'lucide-react';

const translations = {
  fr: {
    title: "Adresses Utiles",
    subtitle: "Organismes publics, consulaires et infrastructures",
    total: "organismes référencés",
    entities: "entités"
  },
  en: {
    title: "Useful Addresses",
    subtitle: "Public institutions, consular bodies and infrastructure",
    total: "organizations listed",
    entities: "entities"
  }
};

// Mapping des catégories vers les icônes (toutes de la même famille)
const categoryIcons = {
  'BANQUES': Banknote,
  'CHAMBRES D\'AGRICULTURE': Landmark,
  'CHAMBRES D\'ARTISANAT': Landmark,
  'CHAMBRES DE COMMERCE ET D\'INDUSTRIE': Landmark,
  'CHAMBRES DE LA PÊCHE': Ship,
  'DIRECTIONS DE COMMERCE': Building2,
  'ENTREPRISES PORTUAIRES': Anchor,
  'ORGANISMES OFFICIELS': Globe2,
  'AMBASSADES D\'ALGERIE A L\'ETRANGER': Globe2,
  'AMBASSADES EN ALGERIE': Globe2,
  'ASSURANCES': Shield,
  'default': Building2
};

// Couleurs par catégorie (charte graphique - fonds colorés)
const categoryColors = {
  'BANQUES': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'CHAMBRES D\'AGRICULTURE': 'bg-green-100 text-green-800 border-green-200',
  'CHAMBRES D\'ARTISANAT': 'bg-amber-100 text-amber-800 border-amber-200',
  'CHAMBRES DE COMMERCE ET D\'INDUSTRIE': 'bg-blue-100 text-blue-800 border-blue-200',
  'CHAMBRES DE LA PÊCHE': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'DIRECTIONS DE COMMERCE': 'bg-purple-100 text-purple-800 border-purple-200',
  'ENTREPRISES PORTUAIRES': 'bg-sky-100 text-sky-800 border-sky-200',
  'ORGANISMES OFFICIELS': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'AMBASSADES D\'ALGERIE A L\'ETRANGER': 'bg-red-100 text-red-800 border-red-200',
  'AMBASSADES EN ALGERIE': 'bg-red-100 text-red-800 border-red-200',
  'ASSURANCES': 'bg-violet-100 text-violet-800 border-violet-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

export default async function AdressesUtilesPage({ params: { lang } = { lang: 'fr' } }) {
  try {
    const t = (key) => {
      return translations[lang]?.[key] || translations.fr[key] || key;
    };

    const supabase = await createServerSupabaseClient();
    
    if (!supabase || typeof supabase.from !== 'function') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-3xl mx-auto">
              <h2 className="text-red-800 font-semibold text-xl mb-2">Erreur de connexion</h2>
              <p className="text-red-600">Impossible de se connecter à la base de données</p>
            </div>
          </div>
        </div>
      );
    }

    const { data: stats, error } = await supabase
      .from('category_stats')
      .select('*');

    if (error) {
      console.error('Erreur stats:', error);
      throw error;
    }

    const adressesCategories = [
      'BANQUES',
      'CHAMBRES D\'AGRICULTURE',
      'CHAMBRES D\'ARTISANAT',
      'CHAMBRES DE COMMERCE ET D\'INDUSTRIE',
      'CHAMBRES DE LA PÊCHE',
      'DIRECTIONS DE COMMERCE',
      'ENTREPRISES PORTUAIRES',
      'ORGANISMES OFFICIELS',
      'AMBASSADES D\'ALGERIE A L\'ETRANGER',
      'AMBASSADES EN ALGERIE',
      'ASSURANCES'
    ];

    const filteredStats = (stats || [])
      .filter(cat => adressesCategories.includes(cat.category))
      .sort((a, b) => (b.count || 0) - (a.count || 0));

    const totalEntries = filteredStats.reduce((sum, cat) => sum + (cat.count || 0), 0);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section - CHARTE GRAPHIQUE */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                  {t('title')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {t('subtitle')}
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-6 py-3">
                <Building2 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800 font-medium">
                  {totalEntries} {t('total')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des catégories avec icônes uniformes */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStats.map((category) => {
              const IconComponent = categoryIcons[category.category] || categoryIcons.default;
              const colorClass = categoryColors[category.category] || categoryColors.default;
              
              return (
                <Link
                  key={category.category}
                  href={`/${lang}/exporters?category=${encodeURIComponent(category.category)}`}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  {/* Bande décorative VERT/ROUGE */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {/* Fond coloré pour l'icône */}
                      <div className={`p-3 rounded-xl ${colorClass.split(' ')[0]}`}>
                        <IconComponent className={`w-6 h-6 ${colorClass.split(' ')[1]}`} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                        {category.count || 0} {t('entities')}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {category.category}
                    </h2>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="flex-1">
                        {Math.round((category.count / totalEntries) * 100)}% du total
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Erreur critique:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-red-800 font-semibold text-xl mb-2">Erreur inattendue</h2>
            <p className="text-red-600">Une erreur est survenue lors du chargement des adresses utiles</p>
          </div>
        </div>
      </div>
    );
  }
}