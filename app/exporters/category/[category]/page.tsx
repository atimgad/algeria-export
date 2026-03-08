import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategoryPage({ params, searchParams }: any) {
  const supabase = await createServerSupabaseClient();
  
  // Afficher ce qu'on reçoit
  console.log('Params reçus:', params);
  console.log('SearchParams reçus:', searchParams);

  const categoryName = params?.category;

  if (!categoryName) {
    return (
      <div className="p-8">
        <Link href="/categories" className="text-green-600">← Retour</Link>
        <h1 className="text-3xl font-bold mt-4 text-red-600">Paramètre manquant</h1>
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {JSON.stringify({ params, searchParams }, null, 2)}
        </pre>
      </div>
    );
  }

  const { count } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', categoryName);

  return (
    <div className="p-8">
      <Link href="/categories" className="text-green-600">← Retour</Link>
      <h1 className="text-3xl font-bold mt-4">{categoryName}</h1>
      <p className="mt-2">{count || 0} entreprises</p>
    </div>
  );
}