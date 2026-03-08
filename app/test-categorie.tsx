import { createServerSupabaseClient } from '@/utils/supabase/server';

export default async function TestPage() {
  const supabase = await createServerSupabaseClient();
  
  if (!supabase) {
    return <div>Erreur Supabase non initialisé</div>;
  }

  // Test 1 : Connexion à la base
  const { data: testConnection, error: connectionError } = await supabase
    .from('official_directory')
    .select('count', { count: 'exact', head: true });

  // Test 2 : Compter AGRICULTURE
  const { count: agriCount, error: agriError } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'AGRICULTURE')
    .eq('entity_type', 'company');

  // Test 3 : Voir la première entreprise
  const { data: firstCompany, error: firstError } = await supabase
    .from('official_directory')
    .select('name, category')
    .eq('category', 'AGRICULTURE')
    .eq('entity_type', 'company')
    .limit(1);

  return (
    <div className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">🔍 DIAGNOSTIC</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <p><strong>✅ Test connexion :</strong> {connectionError ? '❌' : '✅'}</p>
          {connectionError && <p className="text-red-600">Erreur: {connectionError.message}</p>}
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p><strong>📊 Entreprises AGRICULTURE :</strong> {agriCount ?? '?'}</p>
          {agriError && <p className="text-red-600">Erreur: {agriError.message}</p>}
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p><strong>🏢 Première entreprise :</strong></p>
          <pre className="mt-2 text-sm">
            {JSON.stringify(firstCompany, null, 2)}
          </pre>
          {firstError && <p className="text-red-600">Erreur: {firstError.message}</p>}
        </div>
      </div>
    </div>
  );
}