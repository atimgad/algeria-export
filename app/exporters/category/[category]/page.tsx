import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const supabase = await createServerSupabaseClient();
  
  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <Link href="/categories" className="text-green-600">← Retour</Link>
        <h1 className="text-3xl font-bold mt-4 text-red-600">Erreur de connexion</h1>
      </div>
    );
  }

  const categoryName = params.category;

  // ===== LOGS DE DEBUG ULTIME =====
  console.log('\n=== 🚀 DEBUG CATEGORY PAGE ===');
  console.log('1. params reçus:', JSON.stringify(params));
  console.log('2. categoryName:', categoryName);
  console.log('3. type:', typeof categoryName);
  console.log('4. length:', categoryName?.length);
  console.log('5. caractères (codes):', categoryName?.split('').map(c => c.charCodeAt(0)));
  console.log('6. caractères (visibles):', categoryName?.split('').map(c => `'${c}'`).join(' '));
  // =================================

  // MÊME REQUÊTE QUE LA PAGE TEST
  const { count } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', categoryName);

  const { data: companies } = await supabase
    .from('official_directory')
    .select('*')
    .eq('category', categoryName)
    .limit(10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white border-b p-4">
        <Link href="/categories" className="text-green-600">← Retour aux catégories</Link>
      </div>

      <div className="bg-gradient-to-r from-green-900 to-red-900 text-white p-12">
        <h1 className="text-5xl font-bold">{categoryName}</h1>
        <p className="text-xl mt-2">{count || 0} entreprises</p>
      </div>

      {/* Diagnostic visible */}
      <div className="container mx-auto px-4 py-4">
        <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
          <p><strong>🔍 Diagnostic:</strong></p>
          <p>Catégorie reçue: "{categoryName}"</p>
          <p>Longueur: {categoryName?.length} caractères</p>
          <p>Codes: {categoryName?.split('').map(c => c.charCodeAt(0)).join(', ')}</p>
          <p>Résultat COUNT: {count}</p>
          <p>Entreprises trouvées: {companies?.length || 0}</p>
        </div>
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