import { createClient } from '@/lib/supabase-server';
import { Building2, Phone, Mail, Globe, Package, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import SecteurFilter from './components/SecteurFilter';
import ExporterCard from './components/ExporterCard';

const ITEMS_PER_PAGE = 20;

export default async function ExportersPage(props: { 
  searchParams: Promise<{ secteur?: string; page?: string }> 
}) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  
  const secteur = searchParams.secteur;
  const currentPage = Number(searchParams.page) || 1;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  // Compter le total pour la pagination
  let countQuery = supabase.from('exporters').select('*', { count: 'exact', head: true });
  
  // Requête pour les données
  let dataQuery = supabase
    .from('exporters')
    .select('*')
    .order('name')
    .range(offset, offset + ITEMS_PER_PAGE - 1);
  
  // Filtrer par secteur si spécifié
  if (secteur) {
    countQuery = countQuery.eq('activity_sector', secteur);
    dataQuery = dataQuery.eq('activity_sector', secteur);
  }
  
  const [{ count }, { data: exporters }] = await Promise.all([
    countQuery,
    dataQuery
  ]);

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  // Récupérer tous les secteurs pour le filtre
  const { data: allExporters } = await supabase
    .from('exporters')
    .select('activity_sector')
    .limit(5000);
  
  const secteurs = [...new Set(allExporters?.map(e => e.activity_sector).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#003153]">Algeria<span className="text-[#2E7D32]">Export</span></span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-[#003153]">Accueil</Link>
              <Link href="/exporters" className="text-[#003153] font-medium">Exportateurs</Link>
              <Link href="/stats" className="text-gray-600 hover:text-[#003153]">Statistiques</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-[#003153] to-[#2E7D32] text-white rounded-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {secteur ? `Secteur : ${secteur}` : 'Répertoire des Exportateurs Algériens'}
          </h1>
          <p className="text-xl opacity-90 max-w-3xl">
            {secteur 
              ? `${exporters?.length || 0} entreprises dans ce secteur`
              : 'Découvrez la liste complète des entreprises algériennes exportatrices'}
          </p>
          {secteur && (
            <Link 
              href="/exporters" 
              className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 hover:bg-white/30 transition"
            >
              ← Voir tous les secteurs
            </Link>
          )}
        </div>

        {/* Search and filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une entreprise..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003153] focus:border-transparent"
              />
            </div>
            <SecteurFilter currentSecteur={secteur} secteurs={secteurs} />
          </div>
        </div>

        {/* Exporters grid */}
        {exporters && exporters.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exporters.map((exporter) => (
              <ExporterCard
                key={exporter.id}
                id={exporter.id}
                name={exporter.name}
                company_type={exporter.company_type}
                activity_sector={exporter.activity_sector}
                products={exporter.products}
                phone={exporter.phone}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#003153] mb-2">
              Aucune entreprise trouvée
            </h3>
            <p className="text-gray-500">
              {secteur 
                ? `Aucune entreprise dans le secteur "${secteur}"`
                : 'La liste des exportateurs sera bientôt disponible.'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={`/exporters?${secteur ? `secteur=${encodeURIComponent(secteur)}&` : ''}page=${currentPage - 1}`}
                className="p-2 bg-white rounded-lg border border-gray-200 hover:border-[#003153] transition"
              >
                <ChevronLeft className="h-5 w-5 text-[#003153]" />
              </Link>
            )}
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (currentPage > 3) {
                  pageNum = currentPage - 2 + i;
                }
                if (pageNum <= totalPages) {
                  return (
                    <Link
                      key={pageNum}
                      href={`/exporters?${secteur ? `secteur=${encodeURIComponent(secteur)}&` : ''}page=${pageNum}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition ${
                        currentPage === pageNum
                          ? 'bg-[#003153] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                }
                return null;
              })}
            </div>

            {currentPage < totalPages && (
              <Link
                href={`/exporters?${secteur ? `secteur=${encodeURIComponent(secteur)}&` : ''}page=${currentPage + 1}`}
                className="p-2 bg-white rounded-lg border border-gray-200 hover:border-[#003153] transition"
              >
                <ChevronRight className="h-5 w-5 text-[#003153]" />
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}