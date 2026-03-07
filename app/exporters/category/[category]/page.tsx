// app/exporters/category/[category]/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Building2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  MapPin,
  Package,
  User
} from 'lucide-react';

export default async function CategoryExportersPage({ 
  params,
  searchParams 
}: { 
  params: { category: string },
  searchParams: { 
    page?: string,
    nom?: string,
    ville?: string,
    wilaya?: string,
    produit?: string
  }
}) {
  const supabase = await createServerSupabaseClient();
  
  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-red-800 font-semibold text-xl mb-2">Erreur de connexion</h2>
          <p className="text-red-600">Impossible de se connecter à la base de données</p>
        </div>
      </div>
    );
  }

  // Récupération du paramètre category depuis l'URL
  let category = '';
  if (params && params.category) {
    category = decodeURIComponent(params.category);
  }

  const currentPage = parseInt(searchParams.page || '1');
  const itemsPerPage = 20;

  // Construction de la requête de base
  let query = supabase
    .from('official_directory')
    .select('*', { count: 'exact' })
    .eq('entity_type', 'company');

  // Filtrage par catégorie (si elle est définie et valide)
  if (category && category !== 'Toutes les catégories') {
    query = query.eq('category', category);
  }

  // Filtres optionnels
  if (searchParams.nom) {
    query = query.ilike('name', `%${searchParams.nom}%`);
  }

  if (searchParams.ville) {
    query = query.ilike('address', `%${searchParams.ville}%`);
  }

  if (searchParams.wilaya) {
    query = query.ilike('address', `%${searchParams.wilaya}%`);
  }

  if (searchParams.produit) {
    query = query.contains('products', [searchParams.produit]);
  }

  // Pagination
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data: exporters, count, error } = await query
    .range(from, to);

  if (error) {
    console.error('Erreur:', error);
    notFound();
  }

  const totalPages = Math.ceil((count || 0) / itemsPerPage);

  // Fonction pour construire l'URL avec les filtres
  const buildUrl = (params: Record<string, string>) => {
    const url = new URLSearchParams(searchParams as any);
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        url.set(key, value);
      } else {
        url.delete(key);
      }
    });
    return `/exporters/category/${encodeURIComponent(category)}?${url.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header avec retour aux catégories */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href="/categories" 
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Retour aux catégories
          </Link>
        </div>
      </div>

      {/* Titre de la catégorie */}
      <div className="bg-gradient-to-r from-green-900 to-red-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category}
            </h1>
            <p className="text-xl text-green-100">
              {count || 0} entreprises référencées dans cette catégorie
            </p>
          </div>
        </div>
      </div>

      {/* Barre de filtres */}
      <div className="container mx-auto px-4 py-8">
        <form className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" />
            Filtres de recherche
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Nom de l'entreprise
              </label>
              <input
                type="text"
                name="nom"
                defaultValue={searchParams.nom}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: SARL AMARIUS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Ville
              </label>
              <input
                type="text"
                name="ville"
                defaultValue={searchParams.ville}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Alger, Oran..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <MapPin className="w-4 h-4 inline mr-1" />
                Wilaya
              </label>
              <input
                type="text"
                name="wilaya"
                defaultValue={searchParams.wilaya}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Alger, Blida..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Package className="w-4 h-4 inline mr-1" />
                Produit
              </label>
              <input
                type="text"
                name="produit"
                defaultValue={searchParams.produit}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Dattes, Huile d'olive..."
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-red-600 text-white rounded-lg font-medium hover:shadow-lg transition"
              >
                Rechercher
              </button>
              
              {category && (
                <Link
                  href={`/exporters/category/${encodeURIComponent(category)}`}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                >
                  Réinitialiser
                </Link>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Liste des entreprises */}
      <div className="container mx-auto px-4 py-8">
        {!exporters || exporters.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Aucune entreprise trouvée
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exporters.map((exporter) => (
                <Link
                  key={exporter.id}
                  href={`/exporters/${exporter.id}`}
                  className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                      {exporter.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      {exporter.address && (
                        <p className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{exporter.address}</span>
                        </p>
                      )}
                      
                      {exporter.products && exporter.products.length > 0 && (
                        <p className="flex items-start gap-2">
                          <Package className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">
                            {exporter.products.slice(0, 3).join(' • ')}
                            {exporter.products.length > 3 && '...'}
                          </span>
                        </p>
                      )}
                    </div>
                    
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={buildUrl({ page: (currentPage - 1).toString() })}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    Précédent
                  </Link>
                )}
                
                <span className="px-4 py-2">
                  Page {currentPage} sur {totalPages}
                </span>
                
                {currentPage < totalPages && (
                  <Link
                    href={buildUrl({ page: (currentPage + 1).toString() })}
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    Suivant
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}