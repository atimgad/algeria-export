import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Package, Award, Building2, Search } from 'lucide-react'
import SecteurFilter from './components/SecteurFilter'

export default async function ExportersPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        remove(name: string, options: any) {
          cookieStore.set(name, '', options)
        },
      },
    }
  )
  
  const { data: exporters, error } = await supabase
    .from('profiles')
    .select(`
      *,
      products:products(*)
    `)
    .eq('user_type', 'exporter')
    .eq('verification_status', 'verified')
    .order('company_name')
    .limit(5000);

  const secteurs = Array.from(new Set(exporters?.map(e => e.activity_sector).filter(Boolean) || []));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#003153] to-[#2E7D32] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Exportateurs Algériens Certifiés</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Découvrez notre réseau de fournisseurs vérifiés, leaders dans leurs secteurs respectifs
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filtres */}
          <aside className="lg:w-64">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-[#2E7D32]" />
                Filtres
              </h2>
              <SecteurFilter secteurs={secteurs} />
            </div>
          </aside>

          {/* Liste des exportateurs */}
          <div className="flex-1">
            {/* En-tête avec compteur */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                <span className="font-bold text-[#003153]">{exporters?.length || 0}</span> exportateurs certifiés
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Award className="h-4 w-4 text-[#2E7D32]" />
                <span>Vérifiés par AlgeriaExport</span>
              </div>
            </div>

            {/* Grille des exportateurs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {exporters?.map((exporter) => (
                <Link 
                  key={exporter.id}
                  href={`/exporters/${exporter.id}`}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden group"
                >
                  {/* En-tête avec logo/initiale */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-md">
                        {exporter.company_name?.charAt(0) || 'E'}
                      </div>
                      <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-3 py-1 rounded-full font-medium">
                        Certifié
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#003153] mb-1 group-hover:text-[#2E7D32] transition">
                      {exporter.company_name}
                    </h3>
                    
                    {exporter.activity_sector && (
                      <p className="text-sm text-[#2E7D32] mb-3 font-medium">
                        {exporter.activity_sector}
                      </p>
                    )}

                    {exporter.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {exporter.description}
                      </p>
                    )}

                    {/* Localisation */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <MapPin className="h-4 w-4 text-[#2E7D32]" />
                      <span>{exporter.city || 'Algérie'}</span>
                    </div>

                    {/* Produits */}
                    {exporter.products && exporter.products.length > 0 && (
                      <div className="border-t border-gray-100 pt-4 mt-2">
                        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          Produits principaux
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {exporter.products.slice(0, 3).map((product: any) => (
                            <span 
                              key={product.id}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                              {product.name}
                            </span>
                          ))}
                          {exporter.products.length > 3 && (
                            <span className="text-xs text-gray-400">
                              +{exporter.products.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {(!exporters || exporters.length === 0) && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun exportateur trouvé</h3>
                <p className="text-gray-500">
                  Il n'y a pas encore d'exportateurs certifiés dans cette catégorie.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}