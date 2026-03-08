import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function CategoryPage({ params }) {
  const supabase = await createServerSupabaseClient();
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
    <div>
      <h1>{categoryName}</h1>
      <p>Total: {count} entreprises</p>
      <pre>{JSON.stringify(companies, null, 2)}</pre>
    </div>
  );
}