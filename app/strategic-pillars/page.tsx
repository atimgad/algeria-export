// app/strategic-pillars/page.tsx
import { getTranslations } from '@/lib/getTranslations';
import { 
  Target, 
  Globe2, 
  Factory, 
  GraduationCap,
  Leaf,
  Shield,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default async function StrategicPillarsPage({ params: { lang } = { lang: 'fr' } }) {
  const translations = await getTranslations(lang);
  
  const pillars = [
    {
      icon: <Target className="w-8 h-8" />,
      title: translations?.pillars?.sovereignty?.title || "Souveraineté économique",
      description: translations?.pillars?.sovereignty?.description || "Renforcement de l'indépendance économique nationale par la diversification et la production locale.",
      color: "from-green-600 to-green-700"
    },
    {
      icon: <Globe2 className="w-8 h-8" />,
      title: translations?.pillars?.continental?.title || "Rayonnement continental",
      description: translations?.pillars?.continental?.description || "Positionner l'Algérie comme porte d'entrée de l'Afrique vers le monde et hub du commerce Sud-Sud.",
      color: "from-green-500 to-red-500"
    },
    {
      icon: <Factory className="w-8 h-8" />,
      title: translations?.pillars?.industry?.title || "Industrie compétitive",
      description: translations?.pillars?.industry?.description || "Développement d'une industrie nationale aux standards internationaux, capable d'exporter et de conquérir.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: translations?.pillars?.humanCapital?.title || "Capital humain",
      description: translations?.pillars?.humanCapital?.description || "Formation et développement des compétences algériennes pour l'économie du savoir.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: translations?.pillars?.energy?.title || "Transition énergétique",
      description: translations?.pillars?.energy?.description || "Développement des énergies renouvelables et de l'agriculture durable pour l'export.",
      color: "from-green-600 to-green-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: translations?.pillars?.foodSecurity?.title || "Sécurité alimentaire",
      description: translations?.pillars?.foodSecurity?.description || "Garantir l'autosuffisance et développer une agriculture exportatrice de qualité.",
      color: "from-red-600 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-gradient-to-r from-green-900 to-red-900 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block">{translations?.strategy?.title || "Algérie 2035"}</span>
              <span className="text-3xl md:text-4xl text-green-200">{translations?.strategy?.subtitle || "La vision d'une nation"}</span>
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              {translations?.strategy?.description || "Cinq piliers stratégiques pour faire de l'Algérie la porte d'entrée de l'Afrique vers le monde et un acteur majeur du commerce international."}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
              {translations?.strategy?.pillars || "Les 6 piliers de la stratégie 2035"}
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`h-2 bg-gradient-to-r ${pillar.color}`}></div>
                
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${pillar.color} bg-opacity-10 flex items-center justify-center mb-6 text-white`}>
                    <div className="text-white">{pillar.icon}</div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{pillar.title}</h3>
                  <p className="text-gray-600 mb-6">{pillar.description}</p>
                  
                  <Link 
                    href={`/${lang}/strategic-pillars/${index + 1}`}
                    className="inline-flex items-center gap-2 text-green-600 font-medium hover:gap-3 transition-all"
                  >
                    {translations?.common?.readMore || "En savoir plus"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-white rounded-2xl shadow-xl p-12 border border-gray-100">
            <h3 className="text-2xl font-bold text-center mb-12">
              <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
                {translations?.strategy?.objectives || "Objectifs 2035"}
              </span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">+50%</div>
                <div className="text-gray-600">{translations?.strategy?.targets?.nonHydrocarbon || "Exportations hors hydrocarbures"}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">2000+</div>
                <div className="text-gray-600">{translations?.strategy?.targets?.newExporters || "Nouvelles entreprises exportatrices"}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">54</div>
                <div className="text-gray-600">{translations?.strategy?.targets?.countries || "Pays africains partenaires"}</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">#1</div>
                <div className="text-gray-600">{translations?.strategy?.targets?.digitalHub || "Hub numérique africain"}</div>
              </div>
            </div>
          </div>

          <div className="mt-20 bg-gradient-to-r from-green-600 to-red-600 rounded-3xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">{translations?.strategy?.cta?.title || "Rejoignez la dynamique 2035"}</h3>
            <p className="text-xl mb-8 text-green-100">
              {translations?.strategy?.cta?.subtitle || "Soyez acteur de la transformation économique de l'Algérie"}
            </p>
            <Link
              href={`/${lang}/register`}
              className="inline-block bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition transform hover:scale-105"
            >
              {translations?.strategy?.cta?.button || "Devenir exportateur"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}