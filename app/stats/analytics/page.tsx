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

    // Récupérer les statistiques depuis Supabase
    const { data: categoryStats } = await supabase
      .from('category_stats')
      .select('*');

    const { count: totalViews } = await supabase
      .from('official_directory')
      .select('*', { count: 'exact', head: true });

    // Transformer les données pour correspondre au format attendu par AnalyticsDashboard
    const stats = {
      totalViews: totalViews || 0,
      uniqueVisitors: Math.floor((totalViews || 0) * 0.7), // Approximation
      viewsByDay: [],
      topPages: (categoryStats || []).map(cat => ({
        path: cat.category,
        views: cat.count || 0
      })),
      viewsBySource: [
        { name: 'Direct', value: 45 },
        { name: 'Recherche', value: 30 },
        { name: 'Réseaux', value: 15 },
        { name: 'Partenaires', value: 10 }
      ],
      viewsByCategory: (categoryStats || []).map(cat => ({
        name: cat.category,
        value: cat.count || 0
      }))
    };

    return <AnalyticsDashboard initialStats={stats} />;

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
}