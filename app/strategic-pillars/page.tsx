import Link from 'next/link';
import { 
  ArrowRight, ChevronRight, MapPin, Train, Ship, Zap, Wind, Factory, 
  BarChart3, Calendar, Globe, TrendingUp, Award, CheckCircle, 
  Sun, Truck, Droplet, Wheat, Mountain, Fuel, LineChart 
} from 'lucide-react';

export default function StrategicPillarsPage() {
  const pillars = [
    {
      id: 1,
      icon: Mountain,
      title: "Pilier Minier",
      project: "Gara Djebilet",
      description: "Le plus grand gisement de fer d'Afrique (3,5 Mds tonnes)",
      role: "Industrie lourde & sidérurgie",
      stats: [
        { label: "Réserves", value: "3,5 Mds t", highlight: true },
        { label: "Ligne ferroviaire", value: "950 km" },
        { label: "Production 2026", value: "4 M t/an" },
        { label: "Objectif 2050", value: "50 M t/an" },
        { label: "Investissement", value: "3,5 Mds $", highlight: true }
      ],
      timeline: [
        { date: "2024", status: "Ligne ferroviaire Béchar-Tindouf finalisée", done: true },
        { date: "2025", status: "Début extraction commerciale", done: true },
        { date: "2026", status: "Production à 4M tonnes", done: true },
        { date: "2030", status: "Extension capacité 12M tonnes", done: false },
        { date: "2050", status: "Capacité maximale 50M tonnes", done: false }
      ],
      partners: ["FERAAL", "Tosyali Algérie", "Groupe Manadjim"],
      location: "Tindouf → Béchar → Oran",
      source: "Ministère des Mines & de l'Industrie",
      status: "production",
      color: "from-amber-600 to-orange-700"
    },
    {
      id: 2,
      icon: Truck,
      title: "Pilier Transport",
      project: "Rail & Autoroute Nord-Sud",
      description: "L'ossature du désenclavement territorial et de l'intégration économique nationale",
      role: "Intégration nationale & logistique",
      stats: [
        { label: "Rail minier", value: "950 km", highlight: true },
        { label: "Autoroute Nord-Sud", value: "2 300 km" },
        { label: "Villes connectées", value: "12" },
        { label: "Zone désenclavée", value: "2 M km²" },
        { label: "Investissement", value: "2,5 Mds $", highlight: true }
      ],
      timeline: [
        { date: "2022", status: "Lancement programme national", done: true },
        { date: "2023", status: "Section Alger-Ouargla finalisée", done: true },
        { date: "2024", status: "Ouargla-Tamanrasset en cours", done: true },
        { date: "2025", status: "Tamanrasset-frontières sud", done: true },
        { date: "2026", status: "Intégration CEDEAO/UMA", done: false }
      ],
      partners: ["Ministère TP", "Groupes algériens BTP", "Fonds africains"],
      location: "Alger → Ouargla → Tamanrasset → Frontières sud",
      source: "Ministère des Travaux Publics",
      status: "operational",
      color: "from-blue-600 to-indigo-700"
    },
    {
      id: 3,
      icon: Fuel,
      title: "Pilier Gaz",
      project: "TSGP - Trans-Saharan Gas Pipeline",
      description: "Le gazoduc stratégique Nigeria → Niger → Algérie → Europe",
      role: "Hub énergétique euro-africain",
      stats: [
        { label: "Longueur", value: "4 128 km", highlight: true },
        { label: "Capacité", value: "30 Mds m³/an" },
        { label: "Investissement", value: "15 Mds $", highlight: true },
        { label: "Pays traversés", value: "4" }
      ],
      timeline: [
        { date: "2009", status: "Premier accord tripartite signé", done: true },
        { date: "2022", status: "Relance des négociations", done: true },
        { date: "Fév 2026", status: "Accord Algérie-Niger finalisé", done: true },
        { date: "Post-Ramadan 2026", status: "Début travaux tronçon Niger", done: false },
        { date: "2030-2032", status: "Mise en service complète", done: false }
      ],
      partners: ["Sonatrach", "NNPC (Nigeria)", "SONIDEP (Niger)"],
      location: "Nigeria → Niger → Algérie → Europe",
      source: "Présidence de la République / Xinhua",
      status: "development",
      highlight: "Tronçons Algérie et Nigeria déjà finalisés",
      color: "from-red-600 to-rose-700"
    },
    {
      id: 4,
      icon: Sun,
      title: "Pilier Solaire",
      project: "DESERTEC - Énergie solaire saharienne",
      description: "Exploitation massive du potentiel solaire du Sahara pour produire de l'électricité verte à grande échelle",
      role: "Électricité verte & export",
      stats: [
        { label: "Potentiel solaire", value: "3 500 h/an", highlight: true },
        { label: "Capacité visée", value: "15 000 MW" },
        { label: "Investissement", value: "30 Mds $", highlight: true },
        { label: "Pays impliqués", value: "12" }
      ],
      timeline: [
        { date: "2009", status: "Fondation Desertec créée", done: true },
        { date: "2023", status: "Nouvel accord Algérie-UE", done: true },
        { date: "2025", status: "Études de faisabilité", done: true },
        { date: "2027", status: "Début construction", done: false },
        { date: "2035", status: "Premières exportations", done: false }
      ],
      partners: ["Sonelgaz", "Desertec Foundation", "Dii Desert Energy"],
      location: "Sahara algérien → Europe (HVDC)",
      source: "Desertec Foundation / Sonelgaz",
      status: "studies",
      color: "from-yellow-500 to-amber-600"
    },
    {
      id: 5,
      icon: Wind,
      title: "Pilier Hydrogène",
      project: "SouthH2 Corridor",
      description: "Export d'hydrogène vert produit en Algérie vers l'Europe",
      role: "Transition énergétique & Green Deal",
      stats: [
        { label: "Longueur", value: "3 300 km", highlight: true },
        { label: "Capacité", value: "4 M t/an" },
        { label: "Part UE 2030", value: "40%", highlight: true },
        { label: "Investissement", value: "10 Mds $" }
      ],
      timeline: [
        { date: "2023", status: "Protocole d'accord initial", done: true },
        { date: "2024", status: "Études de faisabilité", done: true },
        { date: "2026", status: "Ingénierie détaillée", done: false },
        { date: "2028", status: "Début construction", done: false },
        { date: "2030", status: "Premières livraisons", done: false }
      ],
      partners: ["Sonatrach", "Sonelgaz", "SNAM (Italie)", "VNG (Allemagne)", "Verbund (Autriche)"],
      location: "Algérie → Tunisie → Italie → Autriche → Allemagne",
      source: "Mémorandum SouthH2 / Commission Européenne",
      status: "agreements",
      color: "from-green-600 to-emerald-700"
    },
    {
      id: 6,
      icon: Wheat,
      title: "Pilier Agro-industriel",
      project: "Baladna (Adrar)",
      description: "L'un des plus grands projets agro-industriels intégrés d'Afrique",
      role: "Sécurité alimentaire nationale",
      stats: [
        { label: "Investissement", value: "3,5 Mds $", highlight: true },
        { label: "Superficie", value: "117 000 ha" },
        { label: "Cheptel", value: "270 000 vaches" },
        { label: "Production", value: "1,7 Md L/an", highlight: true }
      ],
      timeline: [
        { date: "2020", status: "Lancement du projet", done: true },
        { date: "2022", status: "Premières productions", done: true },
        { date: "2024", status: "Extension du cheptel", done: true },
        { date: "2025", status: "Capacité nominale atteinte", done: true },
        { date: "2026", status: "Autosuffisance nationale", done: false }
      ],
      partners: ["Baladna", "Ministère de l'Agriculture"],
      location: "Adrar",
      source: "Ministère de l'Agriculture / Baladna",
      status: "operational",
      color: "from-lime-600 to-green-700"
    },
    {
      id: 7,
      icon: Ship,
      title: "Pilier Logistique",
      project: "Port de Djen Djen",
      description: "Port en eau profonde, futur hub logistique méditerranéen majeur",
      role: "Hub logistique & transbordement",
      stats: [
        { label: "Tirant d'eau", value: "18 m", highlight: true },
        { label: "Capacité", value: "6,5 M conteneurs" },
        { label: "Zone arrière", value: "200 ha" },
        { label: "Investissement", value: "1,5 Md $", highlight: true }
      ],
      timeline: [
        { date: "2023", status: "Première opération de transbordement", done: true },
        { date: "2024", status: "Extension terminal conteneurs", done: true },
        { date: "2025", status: "Modernisation équipements", done: true },
        { date: "2026", status: "Hub régional confirmé", done: false },
        { date: "2028", status: "Capacité maximale", done: false }
      ],
      partners: ["MSC", "CMA CGM", "Ministère des Transports"],
      location: "Jijel - Connecté à l'autoroute Est-Ouest",
      source: "Ministère des Transports",
      status: "operational",
      color: "from-cyan-600 to-teal-700"
    }
  ];

  const statusColors = {
    production: "bg-green-100 text-green-800 border-green-200",
    operational: "bg-blue-100 text-blue-800 border-blue-200",
    development: "bg-amber-100 text-amber-800 border-amber-200",
    agreements: "bg-purple-100 text-purple-800 border-purple-200",
    studies: "bg-gray-100 text-gray-800 border-gray-200"
  };

  const statusLabels = {
    production: "🚧 Production",
    operational: "✅ Opérationnel",
    development: "🏗️ En développement",
    agreements: "🤝 Accords signés",
    studies: "📝 Études"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section Époustouflante */}
      <div className="relative bg-[#003153] text-white overflow-hidden">
        {/* Carte de fond stylisée */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
            <path d="M200,100 L600,100 L700,300 L600,500 L200,500 L100,300 L200,100" fill="none" stroke="white" strokeWidth="2" />
            <circle cx="400" cy="300" r="50" fill="none" stroke="white" strokeWidth="2" />
            <path d="M400,250 L400,350 M350,300 L450,300" stroke="white" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/30">
              🇩🇿 STRATÉGIE NATIONALE 2026-2035
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Les <span className="text-[#C6A75E]">7 piliers</span><br />
              de la souveraineté
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8 leading-relaxed">
              Mines · Transport · Gaz · Solaire · Hydrogène · Agro-industrie · Logistique<br />
              Une transformation structurelle intégrée pour positionner l'Algérie comme hub stratégique entre l'Afrique et l'Europe.
            </p>
            
            {/* Badges des 7 piliers */}
            <div className="flex flex-wrap gap-3 mt-8">
              <span className="px-4 py-2 bg-amber-600/20 backdrop-blur-sm rounded-full text-sm border border-amber-500/30">⛏️ Minier</span>
              <span className="px-4 py-2 bg-blue-600/20 backdrop-blur-sm rounded-full text-sm border border-blue-500/30">🚆 Transport</span>
              <span className="px-4 py-2 bg-red-600/20 backdrop-blur-sm rounded-full text-sm border border-red-500/30">🛢️ Gaz</span>
              <span className="px-4 py-2 bg-yellow-600/20 backdrop-blur-sm rounded-full text-sm border border-yellow-500/30">☀️ Solaire</span>
              <span className="px-4 py-2 bg-green-600/20 backdrop-blur-sm rounded-full text-sm border border-green-500/30">⚡ Hydrogène</span>
              <span className="px-4 py-2 bg-lime-600/20 backdrop-blur-sm rounded-full text-sm border border-lime-500/30">🌾 Agro</span>
              <span className="px-4 py-2 bg-cyan-600/20 backdrop-blur-sm rounded-full text-sm border border-cyan-500/30">🚢 Logistique</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </div>

      {/* Dashboard Chiffres Clés */}
      <div className="container mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-[#003153] mb-1">3,5 Mds t</div>
            <div className="text-sm text-gray-500">Réserves de fer (Gara Djebilet)</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-[#003153] mb-1">4 128 km</div>
            <div className="text-sm text-gray-500">Gazoduc TSGP (Nigeria→Europe)</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-[#003153] mb-1">15 000 MW</div>
            <div className="text-sm text-gray-500">Capacité solaire visée (2035)</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="text-3xl font-bold text-[#003153] mb-1">1,7 Md L/an</div>
            <div className="text-sm text-gray-500">Production laitière (Baladna)</div>
          </div>
        </div>
      </div>

      {/* Introduction Vision */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#003153] mb-6">Une vision intégrée pour l'Algérie de 2035</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            L'Algérie construit un système économique intégré reposant sur <span className="font-bold text-[#003153]">7 piliers stratégiques</span>. 
            De l'extraction minière à la production d'hydrogène vert, en passant par le transport, l'énergie et la logistique, 
            ces projets interconnectés forment la base d'une souveraineté économique durable et d'un leadership régional affirmé.
          </p>
        </div>
      </div>

      {/* Les 7 piliers en détail */}
      <div className="container mx-auto px-4 pb-24">
        <div className="space-y-6">
          {pillars.map((pillar) => (
            <div 
              key={pillar.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className={`bg-gradient-to-r ${pillar.color} h-2`}></div>
              <div className="p-8">
                {/* En-tête du pilier */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 bg-gradient-to-r ${pillar.color} rounded-xl text-white shadow-lg`}>
                      <pillar.icon className="h-8 w-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-[#003153]">{pillar.title}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[pillar.status]}`}>
                          {statusLabels[pillar.status]}
                        </span>
                      </div>
                      <p className="text-xl font-semibold text-gray-700 mt-1">{pillar.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span>{pillar.location}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 text-lg">{pillar.description}</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Statistiques clés */}
                  <div className="lg:col-span-1">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">INDICATEURS CLÉS</h4>
                    <div className="space-y-3">
                      {pillar.stats.map((stat, idx) => (
                        <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="text-sm text-gray-500">{stat.label}</span>
                          <span className={`font-bold ${stat.highlight ? 'text-[#003153] text-lg' : 'text-gray-700'}`}>
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="lg:col-span-1">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      FEUILLE DE ROUTE
                    </h4>
                    <div className="space-y-3">
                      {pillar.timeline.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${item.done ? 'bg-[#2E7D32]' : 'bg-gray-300'}`}></div>
                          <div className="flex-1">
                            <span className="text-xs font-mono text-gray-400">{item.date}</span>
                            <p className={`text-sm ${item.done ? 'text-gray-700' : 'text-gray-500'}`}>{item.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Partenaires & rôle stratégique */}
                  <div className="lg:col-span-1">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">RÔLE STRATÉGIQUE</h4>
                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                      <p className="text-[#003153] font-medium">{pillar.role}</p>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-4">PARTENAIRES</h4>
                    <div className="flex flex-wrap gap-2">
                      {pillar.partners.map((partner, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {partner}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 text-xs text-gray-400">
                      Source: {pillar.source}
                    </div>
                  </div>
                </div>

                {/* Note spéciale pour le TSGP */}
                {pillar.highlight && (
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800 font-medium flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      {pillar.highlight}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tableau récapitulatif */}
      <div className="bg-gray-50 py-16 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-[#003153] text-center mb-8">Synthèse des 7 piliers stratégiques</h3>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg">
              <thead className="bg-[#003153] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Projet</th>
                  <th className="px-6 py-4 text-left">Secteur</th>
                  <th className="px-6 py-4 text-left">Rôle stratégique</th>
                  <th className="px-6 py-4 text-left">Statut</th>
                  <th className="px-6 py-4 text-left">Investissement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Gara Djebilet</td>
                  <td className="px-6 py-4">Mines</td>
                  <td className="px-6 py-4">Industrie lourde</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Production 2026</span></td>
                  <td className="px-6 py-4">3,5 Mds $</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Rail & Autoroute</td>
                  <td className="px-6 py-4">Transport</td>
                  <td className="px-6 py-4">Intégration nationale</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">En service</span></td>
                  <td className="px-6 py-4">2,5 Mds $</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">TSGP</td>
                  <td className="px-6 py-4">Gaz</td>
                  <td className="px-6 py-4">Hub énergétique</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs">Lancement 2026</span></td>
                  <td className="px-6 py-4">15 Mds $</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">DESERTEC</td>
                  <td className="px-6 py-4">Solaire</td>
                  <td className="px-6 py-4">Électricité verte</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Études</span></td>
                  <td className="px-6 py-4">30 Mds $</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">SouthH2</td>
                  <td className="px-6 py-4">Hydrogène</td>
                  <td className="px-6 py-4">Transition énergétique</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">Accords signés</span></td>
                  <td className="px-6 py-4">10 Mds $</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Baladna</td>
                  <td className="px-6 py-4">Agro-industrie</td>
                  <td className="px-6 py-4">Sécurité alimentaire</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Opérationnel</span></td>
                  <td className="px-6 py-4">3,5 Mds $</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">Djen Djen</td>
                  <td className="px-6 py-4">Portuaire</td>
                  <td className="px-6 py-4">Hub logistique</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Extension</span></td>
                  <td className="px-6 py-4">1,5 Md $</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Données mises à jour au 20 Février 2026 • Sources ministérielles et officielles
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl font-bold text-[#003153] mb-4">Suivre l'avancement des projets</h3>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Recevez les mises à jour trimestrielles sur les 7 piliers stratégiques algériens
        </p>
        <div className="flex max-w-md mx-auto gap-4">
          <input 
            type="email" 
            placeholder="Votre email professionnel" 
            className="flex-1 px-6 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
          />
          <button className="px-6 py-3 bg-[#2E7D32] text-white rounded-xl hover:bg-[#1B5E20] transition font-medium">
            S'abonner
          </button>
        </div>
      </div>

      {/* Sources et mentions légales */}
      <div className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-xs text-gray-400">
          <p>Sources officielles : Ministère des Mines • Ministère de l'Énergie • Sonatrach • Sonelgaz • Présidence de la République • Xinhua • APS • Desertec Foundation • Baladna • Commission Européenne</p>
          <p className="mt-2">© 2026 AlgeriaExport - Observatoire des projets stratégiques nationaux</p>
        </div>
      </div>
    </div>
  );
}