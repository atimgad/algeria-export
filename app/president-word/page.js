// app/president-word/page.js
import { Quote, Award, Heart } from 'lucide-react';
import Link from 'next/link';

export default function PresidentWordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero section avec portrait - CHARTE GRAPHIQUE */}
      <div className="relative bg-gradient-to-r from-green-900 to-red-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/algeria-map.png')] bg-center bg-no-repeat bg-contain"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-50 to-transparent"></div>
        
        <div className="container mx-auto px-4 h-full flex items-end pb-20 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-6 py-3 mb-8">
              <Award className="w-5 h-5" />
              <span>Message à la Nation • 2026</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              Mot du Président
            </h1>
            <p className="text-2xl text-green-100">
              Son Excellence Monsieur Abdelmadjid Tebboune
            </p>
            <p className="text-xl text-white/80 mt-2">
              Président de la République Algérienne Démocratique et Populaire
            </p>
          </div>
        </div>
      </div>

      {/* Contenu du message */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Citation d'ouverture */}
          <div className="mb-16 relative">
            <Quote className="absolute -top-6 -left-6 w-16 h-16 text-green-200" />
            <p className="text-3xl font-light text-gray-700 leading-relaxed pl-12">
              "L'Algérie nouvelle que nous construisons ensemble ne se contente pas 
              de regarder vers l'avenir - elle l'invente, le façonne et le partage 
              avec ses frères du continent."
            </p>
          </div>

          {/* Message principal */}
          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-xl text-gray-600 leading-relaxed">
              Mesdames, Messieurs, chers opérateurs économiques,
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              C'est avec une fierté légitime que je salue aujourd'hui la naissance 
              d'ALGERIA EXPORT, cette plateforme qui incarne la vision que je porte 
              pour notre pays : une Algérie digitale, ouverte sur le monde, et résolument 
              tournée vers son destin africain.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Notre pays a toujours été un carrefour, un pont entre les rives de la 
              Méditerranée et les profondeurs de l'Afrique. Aujourd'hui, nous faisons 
              franchir à cette vocation historique un cap décisif : celui du numérique.
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-8 my-12 rounded-r-xl">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                  Le commerce Sud-Sud : notre priorité stratégique
                </span>
              </h2>
              <p className="text-green-700">
                J'ai personnellement insisté pour que cette plateforme offre une place 
                privilégiée à nos frères africains. L'Afrique doit commercer avec 
                l'Afrique. Nos richesses complémentaires, notre jeunesse dynamique, 
                notre soif commune de prospérité sont les atouts d'une renaissance 
                économique dont l'Algérie sera le moteur.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              Aux exportateurs algériens, je dis : votre pays est fier de vous. 
              Vous portez haut les couleurs de notre nation. Cette plateforme est 
              votre vitrine vers le monde.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              À nos partenaires africains, je lance un appel fraternel : l'Algérie 
              vous ouvre ses portes grandes. Venez présenter vos produits, venez 
              conquérir nos marchés, venez construire avec nous l'Afrique prospère 
              et unie de demain.
            </p>

            {/* Signature */}
            <div className="mt-20 pt-10 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    Abdelmadjid Tebboune
                  </p>
                  <p className="text-gray-500">
                    Président de la République Algérienne Démocratique et Populaire
                  </p>
                  <p className="text-gray-400 mt-2">
                    Alger, le 1er mars 2026
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-red-600">
                    <Heart className="w-5 h-5 fill-current" />
                    <span className="font-medium">Pour l'Algérie et l'Afrique</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chiffres clés - CARTES CHARTE GRAPHIQUE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 p-6 text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
              <div className="text-4xl font-bold text-green-600 mb-2">54</div>
              <div className="text-gray-600">Pays africains invités</div>
            </div>
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 p-6 text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
              <div className="text-4xl font-bold text-green-600 mb-2">1200+</div>
              <div className="text-gray-600">Exportateurs algériens</div>
            </div>
            <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100 p-6 text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-red-500"></div>
              <div className="text-4xl font-bold text-green-600 mb-2">2026</div>
              <div className="text-gray-600">Année du commerce Sud-Sud</div>
            </div>
          </div>

          {/* Bouton de retour */}
          <div className="text-center mt-12">
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-green-600 to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}