import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const supabase = await createServerSupabaseClient();
  const categoryName = params.category;

  // Utiliser category_stats (qui fonctionne déjà)
  const { data: stats } = await supabase
    .from('category_stats')
    .select('*')
    .eq('category', categoryName)
    .single();

  // Récupérer les entreprises
  const { data: companies } = await supabase
    .from('official_directory')
    .select('*')
    .eq('category', categoryName)
    .limit(10);

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <Link href="/categories" className="text-green-600">← Retour</Link>
        <h1 className="text-3xl font-bold mt-4">{categoryName}</h1>
        <p className="text-gray-600 mt-2">Aucune entreprise trouvée dans cette catégorie</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white border-b p-4">
        <Link href="/categories" className="text-green-600">← Retour aux catégories</Link>
      </div>

      <div className="bg-gradient-to-r from-green-900 to-red-900 text-white p-12">
        <h1 className="text-5xl font-bold">{categoryName}</h1>
        <p className="text-xl mt-2">{stats.count} entreprises</p>
      </div>

      <div className="container mx-auto p-8">
        {!companies?.length ? (
          <p className="text-center text-gray-500">Aucune entreprise trouvée</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {companies.map((company) => (
              <div key={company.id} className="bg-white rounded-lg shadow p-6 border">
                <h3 className="text-xl font-semibold">{company.name}</h3>
                <p className="text-gray-600 mt-2">{company.address}</p>
                {company.phone?.[0] && (
                  <p className="text-gray-500 mt-2">📞 {company.phone[0]}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}