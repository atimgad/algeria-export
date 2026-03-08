import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const supabase = await createServerSupabaseClient();
  
  // Récupération directe du paramètre
  const categoryName = params?.category;

  if (!categoryName) {
    return (
      <div className="p-8">
        <Link href="/categories" className="text-green-600">← Retour</Link>
        <h1 className="text-3xl font-bold mt-4 text-red-600">Paramètre manquant</h1>
        <p className="mt-2">URL: {JSON.stringify(params)}</p>
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