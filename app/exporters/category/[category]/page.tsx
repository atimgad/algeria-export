import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  // ===== LOGS DE DEBUG ULTIME =====
  console.log('\n=== 🚀 DEBUG CATEGORY PAGE ===');
  console.log('1. params reçus (brut):', JSON.stringify(params));
  
  const categoryName = params?.category;
  console.log('2. categoryName:', categoryName);
  console.log('3. type:', typeof categoryName);
  console.log('4. length:', categoryName?.length);
  if (categoryName) {
    console.log('5. caractères (codes):', categoryName.split('').map(c => c.charCodeAt(0)));
    console.log('6. caractères (visibles):', categoryName.split('').map(c => `'${c}'`).join(' '));
  }
  // =================================

  try {
    console.log('7. Tentative de connexion Supabase...');
    const supabase = await createServerSupabaseClient();
    
    if (!supabase) {
      console.error('❌ ERREUR: Supabase non initialisé');
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: 'red' }}>❌ ERREUR</h1>
          <p>Supabase non initialisé</p>
        </div>
      );
    }
    console.log('8. ✅ Supabase connecté');

    console.log('9. Exécution requête COUNT avec category =', categoryName);
    const { count, error: countError } = await supabase
      .from('official_directory')
      .select('*', { count: 'exact', head: true })
      .eq('category', categoryName);

    if (countError) {
      console.error('❌ ERREUR COUNT:', countError);
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: 'red' }}>❌ ERREUR</h1>
          <p>Erreur comptage: {countError.message}</p>
        </div>
      );
    }
    console.log('10. ✅ COUNT résultat:', count);

    console.log('11. Exécution requête DATA...');
    const { data: companies, error: dataError } = await supabase
      .from('official_directory')
      .select('*')
      .eq('category', categoryName)
      .limit(10);

    if (dataError) {
      console.error('❌ ERREUR DATA:', dataError);
      return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
          <h1 style={{ color: 'red' }}>❌ ERREUR</h1>
          <p>Erreur données: {dataError.message}</p>
        </div>
      );
    }
    console.log('12. ✅ DATA résultat:', companies?.length || 0, 'entreprises');
    if (companies?.length > 0) {
      console.log('13. Première entreprise:', companies[0]?.name);
    }

    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <Link href="/categories" style={{ color: '#166534', textDecoration: 'none' }}>
          ← Retour aux catégories
        </Link>
        
        <h1 style={{ fontSize: '2rem', marginTop: '1rem', color: '#166534' }}>
          {categoryName}
        </h1>
        
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>
          Total: {count} entreprises
        </p>
        
        <div style={{ 
          background: '#f3f4f6', 
          padding: '1rem', 
          borderRadius: '0.5rem', 
          marginTop: '1rem',
          overflow: 'auto'
        }}>
          <pre style={{ margin: 0 }}>
            {JSON.stringify(companies, null, 2)}
          </pre>
        </div>

        {/* Mini diagnostic visible */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#e5e7eb',
          borderRadius: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <p><strong>🔍 Diagnostic technique:</strong></p>
          <p>Catégorie reçue: "{categoryName}"</p>
          <p>Longueur: {categoryName?.length} caractères</p>
          <p>Requête COUNT: {count} résultats</p>
          <p>Requête DATA: {companies?.length || 0} résultats</p>
        </div>
      </div>
    );

  } catch (err) {
    console.error('❌ EXCEPTION:', err);
    return (
      <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
        <h1 style={{ color: 'red' }}>❌ ERREUR</h1>
        <pre>{JSON.stringify(err, null, 2)}</pre>
      </div>
    );
  }
}