// app/south-south/page.js
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { 
  Globe2, 
  Users, 
  Handshake, 
  ArrowRight,
  MapPin,
  Briefcase,
  ChevronRight,
  Building2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SouthSouthPage() {
  // Initialisation du client Supabase avec gestion d'erreur
  const supabase = await createServerSupabaseClient();
  
  // VÉRIFICATION CRITIQUE - Le client doit exister
  if (!supabase) {
    console.error('❌ Client Supabase non initialisé - Variables d\'environnement manquantes?');
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section avec message adapté */}
        <div className="relative bg-gradient-to-r from-green-900 to-red-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                <Globe2 className="w-5 h-5" />
                <span className="text-sm font-medium">Initiative Présidentielle • Commerce Sud-Sud</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="block text-white">L'Afrique se lève,</span>
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  l'Afrique commerce
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                "Le commerce Sud-Sud n'est pas une option, c'est le destin de notre continent. 
                L'Algérie tend la main à ses frères africains pour construire ensemble 
                la prospérité de demain."
              </p>
              
              <p className="text-lg text-white/80 mb-12">
                — Son Excellence Monsieur Abdelmadjid Tebboune, Président de la République Algérienne
              </p>
            </div>
          </div>
        </div>

        {/* Message d'information temporaire */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">Information</h2>
            <p className="text-yellow-700 text-lg">
              La liste des exposants africains sera disponible prochainement. 
              Notre équipe travaille à l'intégration des premiers partenaires.
            </p>
            <p className="text-yellow-600 mt-4">
              Vous pouvez dès maintenant explorer les catégories d'exportateurs algériens.
            </p>
            <Link 
              href="/categories"
              className="inline-block mt-6 bg-gradient-to-r from-green-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
            >
              Voir les catégories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si le client est initialisé, on récupère les données
  try {
    const { data: featuredExporters, error } = await supabase
      .from('official_directory')
      .select('*')
      .limit(6);

    if (error) {
      console.error('Erreur chargement exportateurs:', error);
      throw error;
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Hero Section Spéciale Sud-Sud - CHARTE GRAPHIQUE */}
        <div className="relative bg-gradient-to-r from-green-900 to-red-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,50 T100,50" stroke="white" fill="none" strokeWidth="0.5"/>
            </svg>
          </div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                <Globe2 className="w-5 h-5" />
                <span className="text-sm font-medium">Initiative Présidentielle • Commerce Sud-Sud</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="block text-white">L'Afrique se lève,</span>
                <span className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  l'Afrique commerce
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                "Le commerce Sud-Sud n'est pas une option, c'est le destin de notre continent. 
                L'Algérie tend la main à ses frères africains pour construire ensemble 
                la prospérité de demain."
              </p>
              
              <p className="text-lg text-white/80 mb-12">
                — Son Excellence Monsieur Abdelmadjid Tebboune, Président de la République Algérienne
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/african-exporters/join"
                  className="bg-gradient-to-r from-green-600 to-red-600 text-white font-bold px-8 py-4 rounded-xl text-lg hover:shadow-xl transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  Exposant Africain ? Rejoignez-nous
                  <ArrowRight className="w-5 h-5" />
                </Link>
                
                <Link 
                  href="/partenaires-africains"
                  className="bg-white border-2 border-green-600 text-green-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-green-50 transition flex items-center justify-center gap-2"
                >
                  <Handshake className="w-5 h-5" />
                  Trouver des partenaires africains
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Section Invitation Spéciale */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-12 mb-20 border-2 border-green-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-green-500 rounded-full -mr-32 -mt-32 opacity-10"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500 rounded-full -ml-24 -mb-24 opacity-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                    <Globe2 className="w-8 h-8 text-green-800" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                      À nos frères du continent
                    </span>
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-green-800" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">54 Pays invités</h3>
                    <p className="text-gray-600">
                      Du Sénégal au Kenya, du Maroc à l'Afrique du Sud, tous les pays africains 
                      sont les bienvenus sur notre plateforme.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Briefcase className="w-6 h-6 text-green-800" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Exposition gratuite</h3>
                    <p className="text-gray-600">
                      Les 6 premiers mois, exposition gratuite pour tous les exportateurs africains. 
                      Montrez vos produits sans frais.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Handshake className="w-6 h-6 text-green-800" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Mise en relation directe</h3>
                    <p className="text-gray-600">
                      Accès privilégié aux importateurs algériens et aux acheteurs de la zone 
                      MENA via notre réseau.
                    </p>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl">
                  <p className="text-lg text-gray-700">
                    <span className="font-bold text-yellow-700">Initiative Présidentielle :</span> Dans le cadre de la vision 
                    de Son Excellence le Président Tebboune pour une Afrique unie et prospère, 
                    nous offrons aux exportateurs africains une vitrine privilégiée sur le marché algérien 
                    et au-delà.
                  </p>
                </div>
              </div>
            </div>

            {/* Section des exposants */}
            {featuredExporters && featuredExporters.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-center mb-12">
                  <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                    Premiers exposants africains
                  </span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredExporters.slice(0, 3).map((exporter, index) => (
                    <div key={index} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
                      <div className="h-48 bg-gradient-to-br from-green-100 to-red-100 relative">
                        <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          Nouveau
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {exporter.category || 'Afrique'}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
                          {exporter.name || 'Exportateur africain'}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          Produits de qualité disponibles à l'export
                        </p>
                        <Link 
                          href={`/exporters/${exporter.id}`} 
                          className="text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          Voir le catalogue <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Erreur critique south-south:', error);
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 max-w-3xl mx-auto">
            <h2 className="text-red-800 font-semibold text-xl mb-2">Erreur inattendue</h2>
            <p className="text-red-600">Une erreur est survenue. Veuillez réessayer plus tard.</p>
          </div>
        </div>
      </div>
    );
  }
}