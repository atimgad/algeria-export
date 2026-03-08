import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Page({ params }) {
  const supabase = await createServerSupabaseClient();
  const nomCategorie = params.categorie;

  const { count } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', nomCategorie);

  return (
    <div className="p-8">
      <Link href="/categories" className="text-green-600">← Retour</Link>
      <h1 className="text-3xl mt-4">{nomCategorie}</h1>
      <p className="mt-2">{count} entreprises</p>
    </div>
  );
}