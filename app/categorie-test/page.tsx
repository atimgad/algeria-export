import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategorieTestPage() {
  const supabase = await createServerSupabaseClient();
  
  if (!supabase) {
    return <div className="p-8">Erreur de connexion</div>;
  }

  const { count } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'AGRICULTURE');

  return (
    <div className="p-8">
      <Link href="/" className="text-green-600">← Accueil</Link>
      <h1 className="text-3xl font-bold mt-4">Test Catégorie</h1>
      <p className="mt-4">Entreprises en AGRICULTURE : {count}</p>
    </div>
  );
}