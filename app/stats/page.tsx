import { createClient } from '@/lib/supabase-server';
import { Building2, TrendingUp, Calendar, PieChart, BarChart3, ArrowUp, Package, Grid, Layers, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function StatsPage() {
  const supabase = await createClient();
  
  // Récupérer TOUS les exportateurs
  const { data: exporters } = await supabase
    .from('exporters')
    .select('*');

  const totalExporters = exporters?.length || 0;

  // Compter par secteur
  const secteurCounts: { [key: string]: number } = {};
  exporters?.forEach(exporter => {
    const secteur = exporter.activity_sector || 'Non classé';
    secteurCounts[secteur] = (secteurCounts[secteur] || 0) + 1;
  });

  const secteurData = Object.entries(secteurCounts)
    .map(([secteur, count]) => ({ secteur, count }))
    .sort((a, b) => b.count - a.count);

  // Compter par type d'entreprise
  const typeCounts: { [key: string]: number } = {};
  exporters?.forEach(exporter => {
    const type = exporter.company_type?.toUpperCase() || 'AUTRE';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  });

  const typeData = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#003153]">Algeria<span className="text-[#2E7D32]">Export</span></span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-[#003153]">Accueil</Link>
              <Link href="/exporters" className="text-gray-600 hover:text-[#003153]">Exportateurs</Link>
              <Link href="/stats" className="text-[#003153] font-medium">Statistiques</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Stats */}
        <div className="bg-gradient-to-r from-[#003153] to-[#2E7D32] text-white rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">📊 Tableau de Bord Statistique</h1>
          <p className="text-xl opacity-90 max-w-3xl">
            Analyse complète de l'écosystème des exportateurs algériens
          </p>
        </div>

        {/* Cartes principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Building2 className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{totalExporters}</p>
            <p className="text-sm text-gray-500">Exportateurs référencés</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Grid className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">
                {secteurData.length} secteurs
              </span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{secteurData.length}</p>
            <p className="text-sm text-gray-500">Secteurs d'activité</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Package className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">
                Leader
              </span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">
              {secteurData[0]?.count || 0}
            </p>
            <p className="text-sm text-gray-500">
              dans <span className="font-medium">{secteurData[0]?.secteur || '...'}</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Calendar className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">
                {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{new Date().toLocaleDateString('fr-FR')}</p>
            <p className="text-sm text-gray-500">Dernière mise à jour</p>
          </div>
        </div>

        {/* Deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top secteurs avec liens Link */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#003153] mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top 5 secteurs d'activité
            </h2>
            <div className="space-y-4">
              {secteurData.slice(0, 5).map((item, index) => (
                <Link 
                  key={index} 
                  href={`/exporters?secteur=${encodeURIComponent(item.secteur)}`}
                  className="block hover:bg-gray-50 p-2 rounded-lg transition"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 truncate max-w-[200px]">{item.secteur}</span>
                    <span className="font-medium text-[#003153]">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#003153] to-[#2E7D32] h-2 rounded-full"
                      style={{ width: `${(item.count / secteurData[0].count) * 100}%` }}
                    ></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Top formes juridiques */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-[#003153] mb-6 flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Top 5 formes juridiques
            </h2>
            <div className="space-y-4">
              {typeData.slice(0, 5).map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 uppercase">{item.type}</span>
                    <span className="font-medium text-[#003153]">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-[#003153] to-[#2E7D32] h-2 rounded-full"
                      style={{ width: `${(item.count / typeData[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tableau détaillé des secteurs avec liens Link */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#003153] mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Répartition détaillée par secteur
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Secteur d'activité</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Nombre d'entreprises</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Pourcentage</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Visualisation</th>
                </tr>
              </thead>
              <tbody>
                {secteurData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <Link 
                        href={`/exporters?secteur=${encodeURIComponent(item.secteur)}`}
                        className="text-[#003153] font-medium hover:text-[#2E7D32] hover:underline"
                      >
                        {item.secteur}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      <Link 
                        href={`/exporters?secteur=${encodeURIComponent(item.secteur)}`}
                        className="hover:text-[#2E7D32]"
                      >
                        {item.count}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {Math.round((item.count / totalExporters) * 100)}%
                    </td>
                    <td className="py-3 px-4 w-48">
                      <Link href={`/exporters?secteur=${encodeURIComponent(item.secteur)}`}>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-[#003153] h-2 rounded-full"
                            style={{ width: `${(item.count / secteurData[0].count) * 100}%` }}
                          ></div>
                        </div>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 text-right">
            <Link 
              href="/exporters" 
              className="inline-flex items-center gap-2 text-[#2E7D32] hover:underline"
            >
              Voir tous les exportateurs
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}