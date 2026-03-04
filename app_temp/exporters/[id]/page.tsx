import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { Building2, Phone, Mail, Globe, Package, MapPin, Printer, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function ExporterDetailPage(props: { 
  params: Promise<{ id: string }>
}) {
  const params = await props.params;
  const supabase = await createClient();
  
  const { data: exporter } = await supabase
    .from('exporters')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!exporter) {
    notFound();
  }

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

      <main className="container mx-auto px-4 py-8">
        {/* Bouton retour */}
        <Link href="/exporters" className="inline-flex items-center gap-2 text-gray-600 hover:text-[#003153] mb-6">
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Link>

        {/* En-tête entreprise */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {exporter.name?.charAt(0) || 'E'}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#003153] mb-2">{exporter.name}</h1>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#003153]/10 text-[#003153] rounded-full text-sm font-medium">
                    {exporter.company_type?.toUpperCase() || 'ENTREPRISE'}
                  </span>
                  {exporter.activity_sector && (
                    <span className="px-3 py-1 bg-[#2E7D32]/10 text-[#2E7D32] rounded-full text-sm">
                      {exporter.activity_sector}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Produits */}
            {exporter.products && exporter.products.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-[#003153] mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Produits exportés
                </h2>
                <div className="flex flex-wrap gap-2">
                  {exporter.products.map((product: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Adresse */}
            {exporter.address && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-[#003153] mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresse
                </h2>
                <p className="text-gray-600">{exporter.address}</p>
              </div>
            )}
          </div>

          {/* Colonne latérale - Contacts */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-[#003153] mb-4">Contacts</h2>
              <div className="space-y-4">
                {exporter.phone && (
                  <a href={`tel:${exporter.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-[#2E7D32] group">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#2E7D32]/10">
                      <Phone className="h-5 w-5" />
                    </div>
                    <span>{exporter.phone}</span>
                  </a>
                )}
                
                {exporter.fax && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Printer className="h-5 w-5" />
                    </div>
                    <span>{exporter.fax}</span>
                  </div>
                )}
                
                {exporter.email && (
                  <a href={`mailto:${exporter.email}`} className="flex items-center gap-3 text-gray-600 hover:text-[#2E7D32] group">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#2E7D32]/10">
                      <Mail className="h-5 w-5" />
                    </div>
                    <span className="truncate">{exporter.email}</span>
                  </a>
                )}
                
                {exporter.website && (
                  <a href={exporter.website.startsWith('http') ? exporter.website : `https://${exporter.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center gap-3 text-gray-600 hover:text-[#2E7D32] group">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-[#2E7D32]/10">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="truncate">{exporter.website}</span>
                  </a>
                )}

                {exporter.created_at && (
                  <div className="flex items-center gap-3 text-gray-600 pt-4 border-t border-gray-100">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <span className="text-sm">
                      Inscrit le {new Date(exporter.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}