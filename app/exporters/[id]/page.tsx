// app/exporters/[id]/page.tsx
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ChevronLeft,
  Package,
  Shield,
  Star
} from 'lucide-react';

export default async function ExporterDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();
  
  // Vérification que supabase est initialisé
  if (!supabase) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-red-800 font-semibold text-xl mb-2">Erreur de connexion</h2>
            <p className="text-red-600">Impossible de se connecter à la base de données</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { data: exporter, error } = await supabase
    .from('official_directory')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !exporter) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header avec retour */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/exporters" 
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Retour aux exportateurs
          </Link>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* En-tête avec titre */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Building2 className="w-8 h-8 text-green-800" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                    {exporter.name}
                  </span>
                </h1>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {exporter.category || 'Non catégorisé'}
                  </span>
                  {exporter.trust_level === 'verified' && (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <Shield className="w-4 h-4" />
                      Vérifié
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grille d'informations */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Contact */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  <Phone className="w-4 h-4" />
                </div>
                Informations de contact
              </h2>
              
              <div className="space-y-4">
                {exporter.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{exporter.address}</p>
                  </div>
                )}
                
                {exporter.phone && exporter.phone[0] && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a href={`tel:${exporter.phone[0]}`} className="text-green-600 hover:underline">
                      {exporter.phone[0]}
                    </a>
                  </div>
                )}
                
                {exporter.email && exporter.email[0] && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a href={`mailto:${exporter.email[0]}`} className="text-green-600 hover:underline">
                      {exporter.email[0]}
                    </a>
                  </div>
                )}
                
                {exporter.website && exporter.website[0] && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a 
                      href={exporter.website[0].startsWith('http') ? exporter.website[0] : `https://${exporter.website[0]}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      Site web
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Score de confiance */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  <Star className="w-4 h-4" />
                </div>
                Score de confiance
              </h2>
              
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {exporter.trust_score || 100}
                </div>
                <p className="text-sm text-gray-500 mb-4">/100</p>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                    style={{ width: `${exporter.trust_score || 100}%` }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600">
                  {exporter.trust_details || 'Entreprise vérifiée et certifiée'}
                </p>
              </div>
            </div>
          </div>

          {/* Produits */}
          {exporter.products && exporter.products.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-red-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  <Package className="w-4 h-4" />
                </div>
                Produits et services
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {exporter.products.map((product: string, index: number) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}