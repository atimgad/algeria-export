// app/stats/analytics/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export default async function AnalyticsPage({ params: { lang } = { lang: 'fr' } }) {
  try {
    const supabase = await createServerSupabaseClient();
    
    if (!supabase) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-red-800 font-semibold text-xl mb-2">Erreur de connexion</h2>
            <p className="text-red-600">Impossible de se connecter à la base de données</p>
          </div>
        </div>
      );
    }

    const { data: categoryStats, error: catError } = await supabase
      .from('category_stats')
      .select('*');

    if (catError) {
      console.error('Erreur catégories:', catError);
      throw catError;
    }

    const { count, error: countError } = await supabase
      .from('official_directory')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Erreur comptage:', countError);
      throw countError;
    }

    return (
      <AnalyticsDashboard 
        initialStats={{
          categoryStats: categoryStats || [],
          totalCount: count || 0
        }}
      />
    );

  } catch (error) {
    console.error('Erreur critique stats:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-red-800 font-semibold text-xl mb-2">Erreur de chargement</h2>
          <p className="text-red-600">Une erreur est survenue lors du chargement des statistiques</p>
        </div>
      </div>
    );
  }
// Version finale absolue - 2 Mars 2026 - Cache purgé
}