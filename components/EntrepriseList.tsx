'use client'

import { Building2, MapPin, Phone, Globe } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'

interface Entreprise {
  id: number
  nom: string
  secteur: string
  description: string
  ville: string
  telephone?: string
  site_web?: string
}

export default function EntrepriseList() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntreprises()
  }, [])

  async function loadEntreprises() {
    setLoading(true)
    try {
      // Essaie de charger depuis Supabase
      const { data, error } = await supabase
        .from('entreprises')
        .select('*')
      
      if (error) {
        console.log('Base vide, on utilise les exemples')
        setEntreprises(getExemples())
      } else if (data && data.length > 0) {
        setEntreprises(data)
      } else {
        setEntreprises(getExemples())
      }
    } catch (error) {
      console.error('Erreur:', error)
      setEntreprises(getExemples())
    }
    setLoading(false)
  }

  function getExemples(): Entreprise[] {
    return [
      {
        id: 1,
        nom: "Entreprise Agro Alimentaire",
        secteur: "Agroalimentaire",
        description: "Producteur d'huile d'olive extra vierge",
        ville: "Alger",
        telephone: "+213 XXX XX XX XX",
        site_web: "https://exemple.dz"
      },
      {
        id: 2,
        nom: "Textiles Algériens SA",
        secteur: "Textile",
        description: "Fabricant de tissus traditionnels et modernes",
        ville: "Oran",
        telephone: "+213 XXX XX XX XX",
        site_web: "https://textiles.dz"
      },
      {
        id: 3,
        nom: "TechSolutions Algeria",
        secteur: "Technologie",
        description: "Développement logiciel et solutions IT",
        ville: "Constantine",
        telephone: "+213 XXX XX XX XX",
        site_web: "https://tech.dz"
      }
    ]
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-4 text-gray-600">Chargement des entreprises...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entreprises.map((entreprise) => (
        <div key={entreprise.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div className="p-6">
            {/* Header entreprise */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                {entreprise.secteur}
              </span>
            </div>

            {/* Nom et description */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {entreprise.nom}
            </h3>
            <p className="text-gray-600 mb-4">
              {entreprise.description}
            </p>

            {/* Infos contact */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{entreprise.ville}, Algérie</span>
              </div>
              {entreprise.telephone && (
                <div className="flex items-center text-gray-500">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>{entreprise.telephone}</span>
                </div>
              )}
              {entreprise.site_web && (
                <div className="flex items-center text-blue-500">
                  <Globe className="w-4 h-4 mr-2" />
                  <a href={entreprise.site_web} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Site web
                  </a>
                </div>
              )}
            </div>

            {/* Boutons action */}
            <div className="mt-6 flex gap-3">
              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition">
                Voir produits
              </button>
              <button className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg font-medium hover:bg-green-50 transition">
                Contacter
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}