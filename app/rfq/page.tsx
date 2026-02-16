'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Building2, Package, Phone, Mail, Calendar, FileText, Send, ArrowLeft, 
  Search, Filter, X, ChevronRight, Plus, Check, Info, Star, Briefcase,
  Store, Factory, Truck, Users, Grid, List
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Exporter {
  id: string;
  name: string;
  activity_sector: string;
  company_type?: string;
  products?: string[];
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export default function RFQPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [allSuppliers, setAllSuppliers] = useState<Exporter[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Exporter[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [suggestedSuppliers, setSuggestedSuppliers] = useState<Exporter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const [formData, setFormData] = useState({
    buyerName: '',
    buyerEmail: '',
    buyerCompany: '',
    buyerPhone: '',
    productId: '',
    productName: '',
    quantity: '',
    unit: '',
    deadline: '',
    specifications: ''
  });

  // Charger les fournisseurs
  useEffect(() => {
    fetch('/api/exporters')
      .then(res => res.json())
      .then(data => {
        setAllSuppliers(data.exporters || []);
        setFilteredSuppliers(data.exporters || []);
      })
      .catch(err => console.error('Erreur chargement fournisseurs:', err));
  }, []);

  // Filtrer les fournisseurs selon les critères
  useEffect(() => {
    let filtered = [...allSuppliers];
    
    // Filtre par secteur
    if (selectedSector) {
      filtered = filtered.filter(s => s.activity_sector === selectedSector);
    }
    
    // Filtre par type d'entreprise
    if (selectedType) {
      filtered = filtered.filter(s => {
        const type = s.company_type?.toLowerCase() || '';
        if (selectedType === 'manufacturer') {
          return type.includes('spa') || type.includes('sarl') || type.includes('industrie');
        }
        if (selectedType === 'distributor') {
          return type.includes('distrib') || type.includes('commercial') || type.includes('trading');
        }
        return true;
      });
    }
    
    // Recherche textuelle
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(term) ||
        s.products?.some(p => p.toLowerCase().includes(term)) ||
        s.activity_sector?.toLowerCase().includes(term)
      );
    }
    
    setFilteredSuppliers(filtered);
  }, [selectedSector, selectedType, searchTerm, allSuppliers]);

  // Générer des suggestions (fournisseurs similaires à ceux choisis)
  useEffect(() => {
    if (selectedSuppliers.length > 0) {
      const selectedSectors = selectedSuppliers
        .map(id => allSuppliers.find(s => s.id === id)?.activity_sector)
        .filter(Boolean);
      
      const suggestions = allSuppliers
        .filter(s => 
          !selectedSuppliers.includes(s.id) &&
          selectedSectors.includes(s.activity_sector)
        )
        .slice(0, 5);
      
      setSuggestedSuppliers(suggestions);
    } else {
      setSuggestedSuppliers([]);
    }
  }, [selectedSuppliers, allSuppliers]);

  // Extraire les secteurs uniques
  const sectors = [...new Set(allSuppliers.map(s => s.activity_sector).filter(Boolean))];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const toggleSupplier = (id: string) => {
    setSelectedSuppliers(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const addSuggestedSupplier = (id: string) => {
    setSelectedSuppliers(prev => [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSuppliers.length === 0) {
      alert('Veuillez sélectionner au moins un fournisseur');
      return;
    }

    try {
      // Envoyer une RFQ pour chaque fournisseur sélectionné
      const promises = selectedSuppliers.map(supplierId =>
        fetch('/api/rfqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            supplierId,
            ...formData,
            productName: formData.productName || 'Demande générale'
          })
        })
      );

      const results = await Promise.all(promises);
      
      if (results.every(r => r.ok)) {
        router.push('/rfq/success');
      } else {
        alert('Erreur lors de l\'envoi des demandes');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi');
    }
  };

  const getSupplierTypeIcon = (type?: string) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('spa') || t.includes('industrie')) return <Factory className="h-4 w-4" />;
    if (t.includes('distrib') || t.includes('commercial')) return <Store className="h-4 w-4" />;
    if (t.includes('trading')) return <Truck className="h-4 w-4" />;
    return <Building2 className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[#003153] hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-[#003153] mb-2">Demande de devis (RFQ)</h1>
            <p className="text-gray-600 mb-8">Sélectionnez vos fournisseurs et envoyez votre demande</p>

            {/* Stepper */}
            <div className="flex items-center mb-8">
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#003153] text-white' : 'bg-gray-200 text-gray-600'}`}>1</div>
                <div className="flex-1 h-1 mx-2 bg-gray-200">
                  <div className={`h-full bg-[#003153] transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#003153] text-white' : 'bg-gray-200 text-gray-600'}`}>2</div>
                <div className="flex-1 h-1 mx-2 bg-gray-200">
                  <div className={`h-full bg-[#003153] transition-all ${step >= 3 ? 'w-full' : 'w-0'}`}></div>
                </div>
              </div>
              <div className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-[#003153] text-white' : 'bg-gray-200 text-gray-600'}`}>3</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-[#003153]">1. Sélectionnez vos fournisseurs</h2>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition ${viewMode === 'grid' ? 'bg-[#003153] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <Grid className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition ${viewMode === 'list' ? 'bg-[#003153] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Barre de recherche et filtres */}
                  <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher un fournisseur par nom, produit ou secteur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <select
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153]"
                      >
                        <option value="">Tous les secteurs</option>
                        {sectors.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>

                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153]"
                      >
                        <option value="">Tous les types</option>
                        <option value="manufacturer">Fabricants / Producteurs</option>
                        <option value="distributor">Distributeurs / Grossistes</option>
                        <option value="trading">Sociétés de trading</option>
                      </select>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {filteredSuppliers.length} fournisseurs trouvés
                        </span>
                        {selectedSuppliers.length > 0 && (
                          <span className="text-sm bg-[#003153] text-white px-2 py-1 rounded-full">
                            {selectedSuppliers.length} sélectionné(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Liste des fournisseurs */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto p-2">
                      {filteredSuppliers.map((supplier) => (
                        <div
                          key={supplier.id}
                          onClick={() => toggleSupplier(supplier.id)}
                          className={`p-4 border rounded-xl cursor-pointer transition relative ${
                            selectedSuppliers.includes(supplier.id)
                              ? 'border-[#003153] bg-[#003153]/5 ring-2 ring-[#003153]'
                              : 'border-gray-200 hover:border-[#003153] hover:shadow-md'
                          }`}
                        >
                          {selectedSuppliers.includes(supplier.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-[#003153] rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                          
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-lg flex items-center justify-center text-white font-bold text-lg">
                              {supplier.name?.charAt(0) || 'E'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-[#003153] truncate" title={supplier.name}>
                                {supplier.name}
                              </h3>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                {getSupplierTypeIcon(supplier.company_type)}
                                {supplier.company_type?.toUpperCase() || 'ENTREPRISE'}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                              <Building2 className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600 truncate">{supplier.activity_sector}</span>
                            </div>
                            
                            {supplier.products && supplier.products.length > 0 && (
                              <div className="flex items-center gap-2 text-xs">
                                <Package className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600 truncate">
                                  {supplier.products.slice(0, 2).join(', ')}
                                  {supplier.products.length > 2 && '...'}
                                </span>
                              </div>
                            )}
                          </div>

                          <Link
                            href={`/exporters/${supplier.id}`}
                            target="_blank"
                            className="mt-3 text-xs text-[#003153] hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info className="h-3 w-3" />
                            Voir la fiche détaillée
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="max-h-[600px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sélection</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Fournisseur</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Secteur</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSuppliers.map((supplier) => (
                            <tr
                              key={supplier.id}
                              className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                selectedSuppliers.includes(supplier.id) ? 'bg-[#003153]/5' : ''
                              }`}
                              onClick={() => toggleSupplier(supplier.id)}
                            >
                              <td className="py-3 px-4">
                                <div className={`w-5 h-5 rounded border ${
                                  selectedSuppliers.includes(supplier.id)
                                    ? 'bg-[#003153] border-[#003153]'
                                    : 'border-gray-300'
                                } flex items-center justify-center`}>
                                  {selectedSuppliers.includes(supplier.id) && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 font-medium text-[#003153]">{supplier.name}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{supplier.activity_sector}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {supplier.company_type?.toUpperCase() || '-'}
                              </td>
                              <td className="py-3 px-4">
                                <Link
                                  href={`/exporters/${supplier.id}`}
                                  target="_blank"
                                  className="text-[#003153] hover:underline text-sm flex items-center gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Info className="h-3 w-3" />
                                  Détails
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Suggestions de fournisseurs */}
                  {showSuggestions && suggestedSuppliers.length > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <h3 className="font-medium text-[#003153] mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Fournisseurs susceptibles de vous intéresser
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {suggestedSuppliers.map((supplier) => (
                          <div
                            key={supplier.id}
                            className="bg-white p-3 rounded-lg border border-blue-200 flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium text-sm text-[#003153]">{supplier.name}</p>
                              <p className="text-xs text-gray-500">{supplier.activity_sector}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addSuggestedSupplier(supplier.id)}
                              className="p-1 bg-[#003153] text-white rounded hover:bg-[#002244] transition"
                              title="Ajouter à la sélection"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowSuggestions(false)}
                        className="mt-2 text-xs text-gray-500 hover:text-[#003153] flex items-center gap-1"
                      >
                        <X className="h-3 w-3" />
                        Masquer les suggestions
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={selectedSuppliers.length === 0}
                      className="px-6 py-3 bg-[#003153] text-white rounded-lg hover:bg-[#002244] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      Continuer ({selectedSuppliers.length} fournisseur{selectedSuppliers.length > 1 ? 's' : ''} sélectionné{selectedSuppliers.length > 1 ? 's' : ''})
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-[#003153]">2. Vos informations</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                      <input
                        id="buyerName"
                        type="text"
                        required
                        value={formData.buyerName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="buyerEmail"
                          type="email"
                          required
                          value={formData.buyerEmail}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="buyerCompany"
                          type="text"
                          value={formData.buyerCompany}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="buyerPhone"
                          type="tel"
                          value={formData.buyerPhone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-1 px-4 py-3 bg-[#003153] text-white rounded-lg hover:bg-[#002244] transition font-medium"
                    >
                      Continuer
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-[#003153]">3. Détails de la demande</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Produit recherché</label>
                      <input
                        id="productName"
                        type="text"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                        placeholder="Ex: Huile d'olive extra vierge"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                      <input
                        id="quantity"
                        type="text"
                        value={formData.quantity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                        placeholder="Ex: 1000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unité</label>
                      <select
                        id="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                      >
                        <option value="">Sélectionnez une unité</option>
                        <option value="kg">Kilogramme (kg)</option>
                        <option value="tonne">Tonne (t)</option>
                        <option value="litre">Litre (L)</option>
                        <option value="m3">Mètre cube (m³)</option>
                        <option value="unite">Unité</option>
                        <option value="carton">Carton</option>
                        <option value="palette">Palette</option>
                        <option value="conteneur">Conteneur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="deadline"
                          type="date"
                          value={formData.deadline}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Spécifications</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        id="specifications"
                        rows={5}
                        value={formData.specifications}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153] focus:border-transparent"
                        placeholder="Décrivez précisément votre besoin, les certifications requises, etc."
                      />
                    </div>
                  </div>

                  {/* Récapitulatif des fournisseurs sélectionnés */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-[#003153] mb-2">Fournisseurs sélectionnés :</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSuppliers.map(id => {
                        const supplier = allSuppliers.find(s => s.id === id);
                        return supplier ? (
                          <span key={id} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-sm">
                            {supplier.name}
                            <button
                              type="button"
                              onClick={() => toggleSupplier(id)}
                              className="ml-1 text-gray-400 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                    >
                      Retour
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-[#2E7D32] text-white rounded-lg hover:bg-[#1e5f22] transition font-medium flex items-center justify-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      Envoyer la demande
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}