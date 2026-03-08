import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function Page({ params }) {
  const supabase = await createServerSupabaseClient();
  const categoryName = params.category;

  const { count } = await supabase
    .from('official_directory')
    .select('*', { count: 'exact', head: true })
    .eq('category', categoryName);

  return (
    <div className="p-8">
      <Link href="/categories">← Retour</Link>
      <h1 className="text-3xl mt-4">{categoryName}</h1>
      <p className="mt-2">{count} entreprises</p>
    </div>
  );
}