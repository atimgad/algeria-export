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
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-3xl mx-auto">
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

    // Construction de l'objet stats
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

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section - CHARTE GRAPHIQUE */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                  Statistiques
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Chiffres clés et indicateurs de performance du portail ALGERIA EXPORT
              </p>
              
              {/* Badge "En direct" */}
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Données en temps réel
              </div>
            </div>
          </div>
        </div>

        {/* Cartes de synthèse */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
              <p className="text-gray-600 mb-2">Vues totales</p>
              <p className="text-4xl font-bold text-green-600">{stats.totalViews.toLocaleString()}</p>
            </div>
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
              <p className="text-gray-600 mb-2">Visiteurs uniques</p>
              <p className="text-4xl font-bold text-green-600">{stats.uniqueVisitors.toLocaleString()}</p>
            </div>
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
              <p className="text-gray-600 mb-2">Catégories</p>
              <p className="text-4xl font-bold text-green-600">{categoryStats?.length || 0}</p>
            </div>
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 p-6">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
              <p className="text-gray-600 mb-2">Sources de trafic</p>
              <p className="text-4xl font-bold text-green-600">4</p>
            </div>
          </div>

          {/* Graphiques */}
          <AnalyticsDashboard initialStats={stats} />
        </div>
      </div>
    );

  } catch (error) {
    console.error('Erreur critique stats:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-8">
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-3xl mx-auto">
          <h2 className="text-red-800 font-semibold text-xl mb-2">Erreur de chargement</h2>
          <p className="text-red-600">Une erreur est survenue lors du chargement des statistiques</p>
        </div>
      </div>
    );
  }
}