// app/exporters/category/[category]/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Building2, ChevronLeft } from 'lucide-react';

export default async function CategoryExportersPage({ 
  params 
}: { 
  params: { category: string }
}) {
  const supabase = await createServerSupabaseClient();
  
  if (!supabase) {
    return <div>Erreur de connexion</div>;
  }

  // Récupération de la catégorie depuis l'URL
  const categoryName = params?.category ? decodeURIComponent(params.category) : '';

  // Compter les entreprises dans cette catégorie
  const { count } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('entity_type', 'company')
    .eq('category', categoryName);

  // Récupérer les entreprises
  const { data: exporters } = await supabase
    .from('official_directory')
    .select('*')
    .eq('entity_type', 'company')
    .eq('category', categoryName)
    .limit(50);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm p-4">
        <Link href="/categories" className="text-green-600 flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          Retour aux catégories
        </Link>
      </div>

      {/* Titre */}
      <div className="bg-gradient-to-r from-green-900 to-red-900 text-white p-12">
        <h1 className="text-5xl font-bold mb-4">{categoryName}</h1>
        <p className="text-xl text-green-100">{count || 0} entreprises</p>
      </div>

      {/* Liste */}
      <div className="container mx-auto px-4 py-8">
        {!exporters?.length ? (
          <p className="text-center text-gray-500">Aucune entreprise trouvée</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exporters.map((exporter) => (
              <div key={exporter.id} className="bg-white rounded-lg shadow p-4 border">
                <h3 className="text-xl font-semibold">{exporter.name}</h3>
                <p className="text-gray-600 mt-2">{exporter.address}</p>
                {exporter.phone?.[0] && (
                  <p className="text-gray-500 mt-2">📞 {exporter.phone[0]}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}