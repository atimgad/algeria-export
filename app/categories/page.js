// app/categories/page.js
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { getTranslations } from '@/lib/useTranslations';
import Link from 'next/link';
import { Building2, ChevronRight } from 'lucide-react';

const categoryIcons = {
  'AGRICULTURE': '🌾',
  'AGROALIMENTAIRE': '🥫',
  'AQUACULTURE, ELEVAGE & PECHE': '🐟',
  'INDUSTRIE CHIMIQUE': '🧪',
  'PLASTIQUES & CAOUTCHOUC': '🧴',
  'SIDERURGIE & METALLURGIE': '⚙️',
  'PAPIER & CARTONS': '📦',
  'TRAVAIL DU BOIS & ARTICLES EN BOIS': '🪑',
  'MACHINES & EQUIPEMENTS': '🔧',
  'MACHINES & APPAREILS ELECTRIQUES': '⚡',
  'MATERIELS DE TRANSPORT': '🚛',
  'TRANSPORTS': '🚚',
  'PRODUITS MINERAUX NON METALLIQUES': '🪨',
  'TEXTILES, BONNETERIE & CONFECTION': '👕',
  'ARTISANAT': '🪘',
  'SERVICES': '💼',
  'COMMERCE MULTIPLE': '🛍️',
  'EDITION': '📰',
  'ENERGIE & MINES': '⛽',
  'AMBASSADES D\'ALGERIE A L\'ETRANGER': '🏛️',
  'AMBASSADES EN ALGERIE': '🏛️',
  'ASSURANCES': '🛡️',
  'default': '🏢'
};

const categoryColors = {
  'AGRICULTURE': 'bg-green-100 text-green-800 border-green-200',
  'INDUSTRIE CHIMIQUE': 'bg-purple-100 text-purple-800 border-purple-200',
  'PLASTIQUES & CAOUTCHOUC': 'bg-blue-100 text-blue-800 border-blue-200',
  'AGROALIMENTAIRE': 'bg-amber-100 text-amber-800 border-amber-200',
  'MACHINES & EQUIPEMENTS': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'MACHINES & APPAREILS ELECTRIQUES': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'PRODUITS MINERAUX NON METALLIQUES': 'bg-gray-100 text-gray-800 border-gray-200',
  'SIDERURGIE & METALLURGIE': 'bg-stone-100 text-stone-800 border-stone-200',
  'PAPIER & CARTONS': 'bg-orange-100 text-orange-800 border-orange-200',
  'AQUACULTURE, ELEVAGE & PECHE': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'TEXTILES, BONNETERIE & CONFECTION': 'bg-pink-100 text-pink-800 border-pink-200',
  'TRAVAIL DU BOIS & ARTICLES EN BOIS': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'ARTISANAT': 'bg-amber-100 text-amber-800 border-amber-200',
  'MATERIELS DE TRANSPORT': 'bg-sky-100 text-sky-800 border-sky-200',
  'SERVICES': 'bg-teal-100 text-teal-800 border-teal-200',
  'ENERGIE & MINES': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'EDITION': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'COMMERCE MULTIPLE': 'bg-rose-100 text-rose-800 border-rose-200',
  'AMBASSADES D\'ALGERIE A L\'ETRANGER': 'bg-red-100 text-red-800 border-red-200',
  'AMBASSADES EN ALGERIE': 'bg-red-100 text-red-800 border-red-200',
  'ASSURANCES': 'bg-violet-100 text-violet-800 border-violet-200',
  'TRANSPORTS': 'bg-sky-100 text-sky-800 border-sky-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

export default async function CategoriesPage({ params: { lang } = { lang: 'fr' } }) {
  try {
    const { t } = await getTranslations(lang);
    const supabase = await createServerSupabaseClient();
    
    if (!supabase || typeof supabase.from !== 'function') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-3xl mx-auto">
              <h2 className="text-red-800 font-semibold text-xl mb-2">{t('errors.connection')}</h2>
              <p className="text-red-600">{t('errors.database')}</p>
            </div>
          </div>
        </div>
      );
    }

    const { data: stats, error } = await supabase
      .from('category_stats')
      .select('*');

    if (error || !stats || stats.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 max-w-3xl mx-auto">
              <h2 className="text-yellow-800 font-semibold text-xl mb-2">{t('categories.noData')}</h2>
              <p className="text-yellow-600">{t('categories.error')}</p>
            </div>
          </div>
        </div>
      );
    }

    const totalEntries = stats.reduce((sum, cat) => sum + (cat.count || 0), 0);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                  {t('categories.title')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {t('categories.subtitle')}
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-6 py-3">
                <Building2 className="w-5 h-5 text-gray-600" />
                <span className="text-gray-800 font-medium">
                  {totalEntries} {t('categories.total')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des catégories */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((category) => {
              const iconEmoji = categoryIcons[category.category] || categoryIcons.default;
              const colorClass = categoryColors[category.category] || categoryColors.default;
              
              return (
                <Link
                  key={category.category}
                  href={`/${lang}/exporters?category=${encodeURIComponent(category.category)}`}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  {/* Bande décorative verte/rouge */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 flex items-center justify-center text-2xl rounded-xl ${colorClass.split(' ')[0]}`}>
                        {iconEmoji}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
                        {category.count || 0} {t('categories.entities')}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {category.category}
                    </h2>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, ((category.count || 0) / Math.max(...stats.map(c => c.count))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex-1">
                        {Math.round((category.count / totalEntries) * 100)}{t('categories.percentOfTotal')}
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
            <p className="text-red-600">Une erreur est survenue lors du chargement des catégories</p>
          </div>
        </div>
      </div>
    );
  }
}