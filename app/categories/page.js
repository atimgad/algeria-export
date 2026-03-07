// app/categories/page.js
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { 
  Building2, 
  ChevronRight,
  Sprout,
  FlaskConical,
  Factory,
  Utensils,
  Cpu,
  Zap,
  Gem,
  Hammer,
  Package,
  Ship,
  ShoppingBag,
  Leaf,
  Paintbrush,
  Truck,
  Briefcase,
  Globe,
  Shield,
  Plane,
  Newspaper,
  Fuel
} from 'lucide-react';

const translations = {
  fr: {
    title: "Catégories d'Exportateurs",
    subtitle: "Explorez notre annuaire par secteur d'activité",
    total: "entreprises référencées",
    entities: "entités"
  },
  en: {
    title: "Exporters Categories",
    subtitle: "Explore our directory by business sector",
    total: "registered companies",
    entities: "entities"
  }
};

// Catégories à exclure (celles qui vont dans Adresses Utiles)
const EXCLUDED_CATEGORIES = [
  'AMBASSADES D\'ALGERIE A L\'ETRANGER',
  'AMBASSADES EN ALGERIE',
  'BANQUES',
  'CHAMBRES D\'AGRICULTURE',
  'CHAMBRES D\'ARTISANAT',
  'CHAMBRES DE COMMERCE ET D\'INDUSTRIE',
  'CHAMBRES DE LA PÊCHE',
  'DIRECTIONS DE COMMERCE',
  'ENTREPRISES PORTUAIRES',
  'ORGANISMES OFFICIELS',
  'ASSURANCES',
  'HÔTELS'
];

// Icônes par catégorie
const categoryIcons = {
  'AGRICULTURE': Sprout,
  'AGROALIMENTAIRE': Utensils,
  'AQUACULTURE, ELEVAGE & PECHE': Ship,
  'INDUSTRIE CHIMIQUE': FlaskConical,
  'PLASTIQUES & CAOUTCHOUC': Factory,
  'SIDERURGIE & METALLURGIE': Hammer,
  'PAPIER & CARTONS': Package,
  'TRAVAIL DU BOIS & ARTICLES EN BOIS': Leaf,
  'MACHINES & EQUIPEMENTS': Cpu,
  'MACHINES & APPAREILS ELECTRIQUES': Zap,
  'MATERIELS DE TRANSPORT': Truck,
  'TRANSPORTS': Plane,
  'PRODUITS MINERAUX NON METALLIQUES': Gem,
  'TEXTILES, BONNETERIE & CONFECTION': ShoppingBag,
  'ARTISANAT': Paintbrush,
  'SERVICES': Briefcase,
  'COMMERCE MULTIPLE': ShoppingBag,
  'EDITION': Newspaper,
  'ENERGIE & MINES': Fuel,
  'AMBASSADES D\'ALGERIE A L\'ETRANGER': Globe,
  'AMBASSADES EN ALGERIE': Globe,
  'ASSURANCES': Shield,
  'BANQUES': Building2,
  'CHAMBRES D\'AGRICULTURE': Sprout,
  'CHAMBRES D\'ARTISANAT': Paintbrush,
  'CHAMBRES DE COMMERCE ET D\'INDUSTRIE': Building2,
  'CHAMBRES DE LA PÊCHE': Ship,
  'DIRECTIONS DE COMMERCE': Building2,
  'ENTREPRISES PORTUAIRES': Ship,
  'ORGANISMES OFFICIELS': Globe,
  'GROUPES INDUSTRIELS': Factory,
  'AGENCES DE VOYAGES': Plane,
  'default': Building2
};

// STYLE UNIQUE POUR TOUTES LES CATÉGORIES
const categoryStyle = {
  iconBg: 'bg-green-100',
  iconColor: 'text-green-800',
  badgeBg: 'bg-green-500',
  badgeText: 'text-white'
};

export default async function CategoriesPage({ params: { lang } = { lang: 'fr' } }) {
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

    if (error || !stats || stats.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
          <div className="container mx-auto px-4 py-12">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 max-w-3xl mx-auto">
              <h2 className="text-yellow-800 font-semibold text-xl mb-2">Aucune catégorie trouvée</h2>
              <p className="text-yellow-600">Les données ne sont pas encore disponibles</p>
            </div>
          </div>
        </div>
      );
    }

    // Filtrer pour exclure les adresses utiles
    const filteredStats = (stats || [])
      .filter(cat => !EXCLUDED_CATEGORIES.includes(cat.category))
      .sort((a, b) => (b.count || 0) - (a.count || 0));

    const totalEntries = filteredStats.reduce((sum, cat) => sum + (cat.count || 0), 0);

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                  {t('title')}
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                {t('subtitle')}
              </p>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium">
                <Building2 className="w-5 h-5" />
                <span>
                  {totalEntries} {t('total')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des catégories */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStats.map((category) => {
              const IconComponent = categoryIcons[category.category] || categoryIcons.default;
              
              return (
                <Link
                  key={category.category}
                  href={`/${lang}/exporters/category/${encodeURIComponent(category.category)}`}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  {/* Bande décorative VERT/ROUGE */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      {/* Icône avec fond vert */}
                      <div className={`p-3 rounded-xl ${categoryStyle.iconBg}`}>
                        <IconComponent className={`w-6 h-6 ${categoryStyle.iconColor}`} />
                      </div>
                      
                      {/* Badge VERT FONCÉ (bg-green-500) */}
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${categoryStyle.badgeBg} ${categoryStyle.badgeText}`}>
                        {category.count || 0} {t('entities')}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {category.category}
                    </h2>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(100, ((category.count || 0) / Math.max(...filteredStats.map(c => c.count))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
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
            <p className="text-red-600">Une erreur est survenue lors du chargement des catégories</p>
          </div>
        </div>
      </div>
    );
  }
}