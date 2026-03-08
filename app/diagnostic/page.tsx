import { createServerSupabaseClient } from '@/utils/supabase/server';

export default async function DiagnosticPage() {
  const supabase = await createServerSupabaseClient();
  
  if (!supabase) {
    return <div className="p-8 text-red-600">❌ Supabase non initialisé</div>;
  }

  // Test 1 : Connexion
  const { error: connectError } = await supabase
    .from('official_directory')
    .select('count', { count: 'exact', head: true });

  // Test 2 : Compter AGRICULTURE
  const { count: agriCount, error: agriError } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'AGRICULTURE')
    .eq('entity_type', 'company');

  // Test 3 : Voir 3 entreprises
  const { data: companies, error: companiesError } = await supabase
    .from('official_directory')
    .select('name, category')
    .eq('category', 'AGRICULTURE')
    .eq('entity_type', 'company')
    .limit(3);

  return (
    <div className="p-8 font-mono">
      <h1 className="text-2xl font-bold mb-4">🔍 DIAGNOSTIC</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <p><strong>✅ Connexion Supabase :</strong> {connectError ? '❌' : '✅'}</p>
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p><strong>📊 Entreprises AGRICULTURE :</strong> {agriCount ?? '?'}</p>
          {agriError && <p className="text-red-600">Erreur: {agriError.message}</p>}
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <p><strong>🏢 3 premières entreprises :</strong></p>
          <pre className="mt-2 text-sm bg-white p-2 rounded">
            {JSON.stringify(companies, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}