// app/south-south/page.js
import { createServerSupabaseClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { 
  Globe2, 
  Users, 
  Handshake, 
  TrendingUp,
  ArrowRight,
  MapPin,
  Briefcase,
  Star,
  ChevronRight
} from 'lucide-react';

export default async function SouthSouthPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: featuredExporters } = await supabase
    .from('official_directory')
    .select('*')
    .limit(6);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section Spéciale Sud-Sud */}
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
              <span className="block">L'Afrique se lève,</span>
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
                className="bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold px-8 py-4 rounded-xl text-lg transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
              >
                <Users className="w-5 h-5" />
                Exposant Africain ? Rejoignez-nous
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                href="/partenaires-africains"
                className="bg-white/20 hover:bg-white/30 text-white font-bold px-8 py-4 rounded-xl text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2 border border-white/30"
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
                  <Globe2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  À nos frères du continent : <span className="text-green-600">L'Algérie vous ouvre ses portes</span>
                </h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">54 Pays invités</h3>
                  <p className="text-gray-600">
                    Du Sénégal au Kenya, du Maroc à l'Afrique du Sud, tous les pays africains 
                    sont les bienvenus sur notre plateforme.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Exposition gratuite</h3>
                  <p className="text-gray-600">
                    Les 6 premiers mois, exposition gratuite pour tous les exportateurs africains. 
                    Montrez vos produits sans frais.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center mb-4">
                    <Handshake className="w-6 h-6 text-green-700" />
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

          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
              Premiers exposants africains
            </span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="h-48 bg-gradient-to-br from-green-100 to-red-100 relative">
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-700">
                    Nouveau
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Côte d'Ivoire
                    </span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
                      Cacao
                    </span>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Coopérative de producteurs de cacao</h3>
                  <p className="text-gray-600 mb-4">Cacao premium certifié bio, exportation directe d'Abidjan</p>
                  <Link href="/african-exporters/1" className="text-green-600 font-medium flex items-center gap-1 hover:gap-2 transition-all">
                    Voir le catalogue <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}