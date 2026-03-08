import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  try {
    const supabase = await createServerSupabaseClient();
    
    if (!supabase) {
      return <div style={{padding: '2rem'}}>❌ Supabase non initialisé</div>;
    }

    const categoryName = params.category;

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
      <div style={{ padding: '2rem' }}>
        <Link href="/categories">← Retour aux catégories</Link>
        <h1 style={{ fontSize: '2rem', marginTop: '1rem' }}>{categoryName}</h1>
        <p style={{ fontSize: '1.2rem', color: '#166534' }}>Total: {count} entreprises</p>
        <pre style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem', marginTop: '1rem' }}>
          {JSON.stringify(companies, null, 2)}
        </pre>
      </div>
    );

  } catch (err) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1 style={{ color: 'red' }}>❌ ERREUR</h1>
        <pre>{JSON.stringify(err, null, 2)}</pre>
      </div>
    );
  }
}