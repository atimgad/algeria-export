// app/stats/analytics/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';

export const dynamic = 'force-dynamic';

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

    // Récupérer les statistiques par catégorie
    const { data: categoryStats, error: catError } = await supabase
      .from('category_stats')
      .select('*');

    if (catError) {
      console.error('Erreur catégories:', catError);
      throw catError;
    }

    // Récupérer le nombre total d'entrées
    const { count: totalCount, error: countError } = await supabase
      .from('official_directory')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Erreur comptage:', countError);
      throw countError;
    }

    // Construction de l'objet stats conforme au type Stats attendu
    const stats = {
      totalViews: totalCount || 0,
      uniqueVisitors: Math.floor((totalCount || 0) * 0.8),
      viewsByDay: [],
      topPages: (categoryStats || []).map(cat => ({
        path: cat.category,
        count: cat.count || 0
      })),
      viewsBySource: [
        { source: 'Direct', count: 40 },
        { source: 'Recherche', count: 35 },
        { source: 'Réseaux sociaux', count: 15 },
        { source: 'Partenaires', count: 10 }
      ],
      viewsByCategory: (categoryStats || []).map(cat => ({
        name: cat.category,
        value: cat.count || 0
      }))
    };

    console.log('Stats envoyées:', JSON.stringify(stats, null, 2));
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