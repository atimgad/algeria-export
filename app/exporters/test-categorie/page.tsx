import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function TestCategoriePage() {
  const supabase = await createServerSupabaseClient();
  
  const { count } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', 'AGRICULTURE');

  return (
    <div className="p-8">
      <Link href="/categories" className="text-green-600">← Retour</Link>
      <h1 className="text-3xl font-bold mt-4">Test Catégorie Fixe</h1>
      <p className="mt-2">Entreprises en AGRICULTURE : {count}</p>
    </div>
  );
}