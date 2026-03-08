import { createServerSupabaseClient } from '@/utils/supabase/server';

export default async function DebugPage() {
  try {
    const supabase = await createServerSupabaseClient();
    
    if (!supabase) {
      return <div style={{padding: '2rem'}}>❌ Supabase null</div>;
    }

    const { count } = await supabase
      .from('official_directory')
      .select('*', { count: 'exact', head: true });

    return (
      <div style={{padding: '2rem'}}>
        <h1>✅ OK</h1>
        <p>Total entreprises: {count}</p>
      </div>
    );

  } catch (err) {
    return <div style={{padding: '2rem'}}>❌ Erreur: {JSON.stringify(err)}</div>;
  }
}