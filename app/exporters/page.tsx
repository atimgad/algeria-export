// app/exporters/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Building2, Filter, Search, ChevronRight } from 'lucide-react';

// Catégories à exclure (adresses utiles)
const excludedCategories = [
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

export default async function ExportersPage({ searchParams }: { searchParams: { category?: string } }) {
  const supabase = await createServerSupabaseClient();
  
  // Vérification que supabase est initialisé
  if (!supabase) {
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
  
  let query = supabase
    .from('official_directory')
    .select('*')
    .not('category', 'in', `(${excludedCategories.map(c => `'${c.replace(/'/g, "''")}'`).join(',')})`);
  
  if (searchParams.category) {
    query = query.eq('category', searchParams.category);
  }
  
  const { data: exporters } = await query.limit(50);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section - CHARTE GRAPHIQUE EXACTE */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                Exportateurs Algériens Certifiés
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez notre réseau de fournisseurs vérifiés, leaders dans leurs secteurs respectifs
            </p>
            
            {/* Badge "Vérifiés" */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium mb-12">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {exporters?.length || 0} exportateurs certifiés
            </div>

            {/* Barre de recherche et filtres */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un exportateur..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                />
              </div>
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-red-600 text-white rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des exportateurs */}
      <div className="container mx-auto px-4 py-16">
        {(!exporters || exporters.length === 0) ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Aucun exportateur trouvé
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto">
              {searchParams.category 
                ? `Aucun exportateur dans la catégorie ${searchParams.category}`
                : 'Aucun exportateur disponible pour le moment'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exporters.map((exporter) => (
              <Link
                key={exporter.id}
                href={`/exporters/${exporter.id}`}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
              >
                {/* Bande décorative VERT/ROUGE */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Building2 className="w-6 h-6 text-green-800" />
                    </div>
                    <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                      {exporter.category || 'Non catégorisé'}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {exporter.name}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {exporter.address || 'Adresse non disponible'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {exporter.phone?.[0] || 'Contactez-nous'}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}