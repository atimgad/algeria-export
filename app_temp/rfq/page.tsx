'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Building2, Package, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function RFQPage() {
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [formData, setFormData] = useState({
    supplier_id: '',
    product_name: '',
    quantity: '',
    unit: 'kg',
    specifications: '',
    delivery_country: '',
    delivery_city: '',
    deadline: '',
    additional_info: ''
  })

  useEffect(() => {
    loadSuppliers()
  }, [])

  async function loadSuppliers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, company_name, activity_sector')
        .eq('user_type', 'exporter')
        .eq('verification_status', 'verified')
        .order('company_name')

      if (error) throw error
      setSuppliers(data || [])
    } catch (error) {
      console.error('Error loading suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Extraire les secteurs uniques
  const sectors = Array.from(new Set(suppliers.map(s => s.activity_sector).filter(Boolean)))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      const { error } = await supabase
        .from('rfqs')
        .insert({
          buyer_id: session.user.id,
          supplier_id: formData.supplier_id,
          product_name: formData.product_name,
          quantity: parseFloat(formData.quantity),
          unit: formData.unit,
          specifications: formData.specifications,
          delivery_country: formData.delivery_country,
          delivery_city: formData.delivery_city,
          deadline: formData.deadline,
          additional_info: formData.additional_info,
          status: 'pending'
        })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003153]"></div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-[#2E7D32] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#003153] mb-2">RFQ Envoyé !</h2>
          <p className="text-gray-600 mb-4">
            Votre demande de devis a été transmise au fournisseur. Vous serez redirigé vers votre tableau de bord.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-[#003153]/10 rounded-lg">
              <Package className="h-6 w-6 text-[#003153]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#003153]">Demande de Devis</h1>
              <p className="text-gray-600">Soumettez votre demande aux fournisseurs certifiés</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection du fournisseur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sélectionner un fournisseur *
              </label>
              <select
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
              >
                <option value="">Choisir un fournisseur</option>
                {sectors.map(sector => (
                  <optgroup key={sector} label={sector}>
                    {suppliers
                      .filter(s => s.activity_sector === sector)
                      .map(supplier => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.company_name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Produit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                required
                placeholder="ex: Huile d'olive extra vierge"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
              />
            </div>

            {/* Quantité */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantité *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unité *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                >
                  <option value="kg">Kilogrammes (kg)</option>
                  <option value="ton">Tonnes (t)</option>
                  <option value="litre">Litres (L)</option>
                  <option value="unité">Unités</option>
                  <option value="caisse">Caisses</option>
                  <option value="palette">Palettes</option>
                  <option value="conteneur">Conteneurs</option>
                </select>
              </div>
            </div>

            {/* Spécifications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécifications techniques
              </label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleChange}
                rows={3}
                placeholder="Qualité, conditionnement, certifications requises..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
              />
            </div>

            {/* Livraison */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays de livraison *
                </label>
                <input
                  type="text"
                  name="delivery_country"
                  value={formData.delivery_country}
                  onChange={handleChange}
                  required
                  placeholder="France"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville de livraison
                </label>
                <input
                  type="text"
                  name="delivery_city"
                  value={formData.delivery_city}
                  onChange={handleChange}
                  placeholder="Paris"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
                />
              </div>
            </div>

            {/* Date limite */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date limite de réponse
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
              />
            </div>

            {/* Informations supplémentaires */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informations complémentaires
              </label>
              <textarea
                name="additional_info"
                value={formData.additional_info}
                onChange={handleChange}
                rows={2}
                placeholder="Toute information utile pour le fournisseur..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-transparent"
              />
            </div>

            {/* Bouton de soumission */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#2E7D32] text-white py-3 px-4 rounded-lg hover:bg-[#1B5E20] transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Soumettre la demande
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}