import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Types pour les piliers
interface Pillar {
  id: string
  title: string
  description: string
  progress: number
  status: 'production' | 'operational' | 'development' | 'agreements' | 'studies'
  objectives: string[]
  projects: {
    name: string
    description: string
    status: 'completed' | 'in-progress' | 'planned'
    completion?: number
  }[]
}

// Mapping des statuts
const statusColors: Record<string, string> = {
  production: 'bg-green-100 text-green-800 border-green-200',
  operational: 'bg-blue-100 text-blue-800 border-blue-200',
  development: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  agreements: 'bg-purple-100 text-purple-800 border-purple-200',
  studies: 'bg-gray-100 text-gray-800 border-gray-200'
}

const statusLabels: Record<string, string> = {
  production: 'En production',
  operational: 'Opérationnel',
  development: 'En développement',
  agreements: 'Conventions signées',
  studies: 'Études en cours'
}

const projectStatusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  planned: 'bg-gray-100 text-gray-800'
}

const projectStatusLabels: Record<string, string> = {
  completed: 'Terminé',
  'in-progress': 'En cours',
  planned: 'Planifié'
}

// Données des piliers
const pillars: Pillar[] = [
  {
    id: 'justice',
    title: 'Justice pour tous',
    description: 'Consolidation de l\'État de droit et modernisation de la justice',
    progress: 65,
    status: 'operational',
    objectives: [
      'Numérisation complète des tribunaux',
      'Réduction des délais de justice à 6 mois',
      'Formation de 5000 magistrats et greffiers'
    ],
    projects: [
      {
        name: 'Tribunal numérique',
        description: 'Dématérialisation des procédures judiciaires dans 48 wilayas',
        status: 'in-progress',
        completion: 70
      },
      {
        name: 'École de la magistrature',
        description: 'Construction de 3 nouveaux centres de formation',
        status: 'completed'
      },
      {
        name: 'Aide juridictionnelle',
        description: 'Extension du dispositif d\'aide aux justiciables',
        status: 'planned'
      }
    ]
  },
  {
    id: 'well-being',
    title: 'Bien-être de la population',
    description: 'Amélioration des conditions de vie et renforcement de la protection sociale',
    progress: 45,
    status: 'development',
    objectives: [
      'Couverture sociale universelle d\'ici 2026',
      'Construction de 50 nouveaux hôpitaux',
      'Réduction du chômage à 8%'
    ],
    projects: [
      {
        name: 'Carte Chifa',
        description: 'Extension de la carte de santé à 10 millions de bénéficiaires',
        status: 'in-progress',
        completion: 55
      },
      {
        name: 'Hôpitaux de proximité',
        description: 'Construction de 25 hôpitaux dans les zones rurales',
        status: 'in-progress',
        completion: 30
      },
      {
        name: 'Aide au logement AADL',
        description: 'Attribution de 500 000 logements',
        status: 'in-progress',
        completion: 40
      }
    ]
  },
  {
    id: 'economy',
    title: 'Économie compétitive',
    description: 'Diversification de l\'économie hors hydrocarbures',
    progress: 55,
    status: 'operational',
    objectives: [
      'Augmentation des exportations hors hydrocarbures à 10 Mds $',
      'Création de 500 000 PME/PMI',
      'Développement des énergies renouvelables (15 000 MW)'
    ],
    projects: [
      {
        name: 'Zone industrielle Bellara',
        description: 'Complexe sidérurgique de 2 millions de tonnes/an',
        status: 'completed',
        completion: 100
      },
      {
        name: 'Parcs solaires',
        description: 'Construction de 15 centrales solaires',
        status: 'in-progress',
        completion: 45
      },
      {
        name: 'Start-up Act',
        description: 'Accompagnement de 1000 start-up innovantes',
        status: 'in-progress',
        completion: 60
      }
    ]
  },
  {
    id: 'education',
    title: 'Éducation et savoir',
    description: 'Modernisation du système éducatif et universitaire',
    progress: 50,
    status: 'development',
    objectives: [
      'Rénovation de 5000 écoles primaires',
      'Création de 10 universités nouvelles générations',
      'Formation professionnelle pour 1 million de jeunes'
    ],
    projects: [
      {
        name: 'Écoles numériques',
        description: 'Équipement de 3000 écoles en tablettes et connexion internet',
        status: 'in-progress',
        completion: 40
      },
      {
        name: 'Universités 4.0',
        description: 'Construction de 5 universités technologiques',
        status: 'planned'
      },
      {
        name: 'Bourses à l\'étranger',
        description: 'Programme de 10 000 bourses d\'excellence',
        status: 'completed',
        completion: 100
      }
    ]
  },
  {
    id: 'governance',
    title: 'Gouvernance',
    description: 'Modernisation de l\'administration et digitalisation des services publics',
    progress: 60,
    status: 'operational',
    objectives: [
      '100% des services publics en ligne d\'ici 2025',
      'Simplification de 500 procédures administratives',
      'Lutte contre la bureaucratie'
    ],
    projects: [
      {
        name: 'Portail numérique',
        description: 'Plateforme unique des services publics',
        status: 'in-progress',
        completion: 75
      },
      {
        name: 'Archives nationales',
        description: 'Numérisation des archives administratives',
        status: 'completed'
      },
      {
        name: 'Centre de données',
        description: 'Construction du data center gouvernemental',
        status: 'in-progress',
        completion: 80
      }
    ]
  },
  {
    id: 'sovereignty',
    title: 'Souveraineté nationale',
    description: 'Renforcement de la sécurité et de la défense nationale',
    progress: 85,
    status: 'production',
    objectives: [
      'Modernisation de l\'ANP',
      'Sécurisation des frontières',
      'Autosuffisance en équipements militaires'
    ],
    projects: [
      {
        name: 'Industrie militaire',
        description: 'Production locale de véhicules blindés',
        status: 'completed',
        completion: 100
      },
      {
        name: 'Système de surveillance',
        description: 'Installation de radars et drones de surveillance',
        status: 'completed'
      },
      {
        name: 'Base navale',
        description: 'Construction de la base navale de Mers El Kébir',
        status: 'in-progress',
        completion: 90
      }
    ]
  },
  {
    id: 'diplomacy',
    title: 'Diplomatie d\'influence',
    description: 'Rayonnement international et partenariats stratégiques',
    progress: 70,
    status: 'agreements',
    objectives: [
      'Adhésion aux BRICS',
      'Développement des échanges commerciaux avec l\'Afrique',
      'Accords de partenariat avec l\'UE'
    ],
    projects: [
      {
        name: 'BRICS',
        description: 'Processus d\'adhésion aux BRICS',
        status: 'in-progress',
        completion: 60
      },
      {
        name: 'Zones de libre-échange',
        description: 'Négociation d\'accords avec l\'Afrique',
        status: 'in-progress',
        completion: 45
      },
      {
        name: 'Assistance technique',
        description: 'Programme d\'échange avec l\'UE',
        status: 'planned'
      }
    ]
  }
]

export default function StrategicPillarsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Algérie 2035</span>
          </h1>
          <p className="text-xl text-green-50 max-w-3xl">
            Les 7 piliers de la stratégie nationale pour une Algérie émergente
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">7</span>
              <span className="ml-2 text-green-50">piliers stratégiques</span>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">65%</span>
              <span className="ml-2 text-green-50">progression moyenne</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vue d'ensemble */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="grid" className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Projets et réalisations</h2>
            <TabsList>
              <TabsTrigger value="grid">Grille</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pillars.map((pillar) => (
                <Card key={pillar.id} className="overflow-hidden">
                  <CardHeader className={`border-l-4 ${
                    pillar.status === 'production' ? 'border-green-500' :
                    pillar.status === 'operational' ? 'border-blue-500' :
                    pillar.status === 'development' ? 'border-yellow-500' :
                    pillar.status === 'agreements' ? 'border-purple-500' :
                    'border-gray-500'
                  }`}>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-[#003153]">{pillar.title}</h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[pillar.status]}`}>
                        {statusLabels[pillar.status]}
                      </span>
                    </div>
                    <CardDescription className="text-gray-600 mt-2">
                      {pillar.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {/* Progression */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">Progression globale</span>
                        <span className="text-green-600 font-bold">{pillar.progress}%</span>
                      </div>
                      <Progress value={pillar.progress} className="h-2" />
                    </div>

                    {/* Objectifs */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Objectifs clés</h4>
                      <ul className="space-y-2">
                        {pillar.objectives.map((objective, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-green-500 mt-1">•</span>
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Projets */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3">Projets phares</h4>
                      <div className="space-y-4">
                        {pillar.projects.map((project, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium text-gray-800">{project.name}</h5>
                                <p className="text-sm text-gray-500">{project.description}</p>
                              </div>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${projectStatusColors[project.status]}`}>
                                {projectStatusLabels[project.status]}
                              </span>
                            </div>
                            {project.completion && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-500">Avancement</span>
                                  <span className="text-green-600 font-medium">{project.completion}%</span>
                                </div>
                                <Progress value={project.completion} className="h-1" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            {pillars.map((pillar) => (
              <Card key={pillar.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#003153]">{pillar.title}</h3>
                      <p className="text-gray-600 mt-1">{pillar.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[pillar.status]}`}>
                      {statusLabels[pillar.status]}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Progression</span>
                      <span className="text-green-600 font-bold">{pillar.progress}%</span>
                    </div>
                    <Progress value={pillar.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Objectifs</h4>
                      <ul className="space-y-1">
                        {pillar.objectives.map((obj, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-green-500">•</span>
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Projets ({pillar.projects.length})</h4>
                      <div className="space-y-2">
                        {pillar.projects.map((project, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">{project.name}</span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${projectStatusColors[project.status]}`}>
                                {projectStatusLabels[project.status]}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}