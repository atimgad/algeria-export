// app/exporters/category/[category]/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const supabase = await createServerSupabaseClient();
  
  // Récupération directe de la catégorie depuis l'URL
  const categoryName = params.category;
  
  // Requête simple pour compter
  const { count } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', categoryName)
    .eq('entity_type', 'company');

  // Requête pour récupérer les entreprises
  const { data: exporters } = await supabase
    .from('official_directory')
    .select('*')
    .eq('category', categoryName)
    .eq('entity_type', 'company');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white border-b p-4">
        <Link href="/categories" className="text-green-600">
          ← Retour aux catégories
        </Link>
      </div>

      <div className="bg-gradient-to-r from-green-900 to-red-900 text-white p-12">
        <h1 className="text-5xl font-bold">{categoryName}</h1>
        <p className="text-xl mt-2">{count || 0} entreprises</p>
      </div>

      <div className="p-8">
        {!exporters?.length ? (
          <p className="text-center text-gray-500">Aucune entreprise trouvée</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exporters.map((exporter) => (
              <div key={exporter.id} className="bg-white rounded-lg shadow p-4 border">
                <h3 className="text-xl font-semibold">{exporter.name}</h3>
                <p className="text-gray-600">{exporter.address}</p>
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