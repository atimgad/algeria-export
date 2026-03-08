import { createServerSupabaseClient } from '@/utils/supabase/server';

export default async function TestCategoriePage() {
  const supabase = await createServerSupabaseClient();
  
  // Test 1 : Compter toutes les entreprises
  const { count: total, error: error1 } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('entity_type', 'company');

  // Test 2 : Compter les entreprises AGRICULTURE
  const { count: agri, error: error2 } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('entity_type', 'company')
    .eq('category', 'AGRICULTURE');

  // Test 3 : Récupérer 5 entreprises AGRICULTURE
  const { data: echantillon, error: error3 } = await supabase
    .from('official_directory')
    .select('name, category')
    .eq('entity_type', 'company')
    .eq('category', 'AGRICULTURE')
    .limit(5);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Page de test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Test 1 : Total entreprises</h2>
          <p>Résultat : {total || 0}</p>
          {error1 && <p className="text-red-600">Erreur : {error1.message}</p>}
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Test 2 : Entreprises AGRICULTURE</h2>
          <p>Résultat : {agri || 0}</p>
          {error2 && <p className="text-red-600">Erreur : {error2.message}</p>}
        </div>

        <div className="p-4 bg-gray-100 rounded">
          <h2 className="font-bold">Test 3 : Échantillon (5 premières)</h2>
          {echantillon ? (
            <pre className="text-sm">{JSON.stringify(echantillon, null, 2)}</pre>
          ) : (
            <p>Aucune donnée</p>
          )}
          {error3 && <p className="text-red-600">Erreur : {error3.message}</p>}
        </div>
      </div>
    </div>
  );
}