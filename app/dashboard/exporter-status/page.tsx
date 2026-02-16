'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Ship, CheckCircle, XCircle, AlertCircle, Clock, 
  FileText, Upload, Download, Award, Shield, Info,
  ChevronRight, Building2, Package, Globe
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';

interface ExporterStatus {
  id: string;
  code: string;
  name_fr: string;
  color: string;
  priority: number;
}

interface CompanyType {
  id: string;
  code: string;
  name_fr: string;
  is_exporter_by_default: boolean;
}

export default function ExporterStatusPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [statuses, setStatuses] = useState<ExporterStatus[]>([]);
  const [companyTypes, setCompanyTypes] = useState<CompanyType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [declareExporter, setDeclareExporter] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Récupérer les informations de l'entreprise
      const { data: companyData } = await supabase
        .from('exporters')
        .select('*, exporter_statuses(*)')
        .eq('id', user.id)
        .single();

      if (companyData) {
        setCompany(companyData);
        setSelectedType(companyData.company_type_id || '');
      }

      // Récupérer les statuts possibles
      const { data: statusData } = await supabase
        .from('exporter_statuses')
        .select('*')
        .order('priority', { ascending: false });

      setStatuses(statusData || []);

      // Récupérer les types d'entreprises
      const { data: typeData } = await supabase
        .from('company_types')
        .select('*');

      setCompanyTypes(typeData || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const uploadDocuments = async (): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const file of documents) {
      const fileName = `${company.id}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('exporter-documents')
        .upload(fileName, file);

      if (error) {
        console.error('Erreur upload:', error);
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from('exporter-documents')
        .getPublicUrl(fileName);

      urls.push(urlData.publicUrl);
    }

    return urls;
  };

  const handleSubmit = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Upload des documents
      let documentUrls: string[] = [];
      if (documents.length > 0) {
        documentUrls = await uploadDocuments();
      }

      // Déterminer le statut
      let statusId = company?.exporter_status_id;
      let canExport = false;

      if (declareExporter) {
        // Si l'utilisateur déclare vouloir exporter
        const declaredStatus = statuses.find(s => s.code === 'declared');
        statusId = declaredStatus?.id;
        canExport = true;
      } else {
        // Si l'utilisateur ne veut pas exporter
        const pendingStatus = statuses.find(s => s.code === 'pending');
        statusId = pendingStatus?.id;
        canExport = false;
      }

      // Mise à jour de l'entreprise
      const { error } = await supabase
        .from('exporters')
        .update({
          company_type_id: selectedType,
          exporter_status_id: statusId,
          exporter_declared_at: declareExporter ? new Date().toISOString() : null,
          exporter_documents: documentUrls,
          can_export: canExport,
          last_updated: new Date().toISOString()
        })
        .eq('id', company.id);

      if (error) throw error;

      // Ajouter à l'historique
      await supabase
        .from('exporter_status_history')
        .insert({
          exporter_id: company.id,
          old_status_id: company.exporter_status_id,
          new_status_id: statusId,
          reason: 'Déclaration utilisateur'
        });

      setMessage('Votre statut a été mis à jour avec succès !');
      
      // Recharger les données
      setTimeout(() => {
        loadData();
      }, 1000);

    } catch (error: any) {
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: any) => {
    if (!status) return null;

    const bgColor = status.color || '#FFA500';
    return (
      <span 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
        style={{ backgroundColor: bgColor }}
      >
        {status.code === 'certified' && <Award className="h-4 w-4" />}
        {status.code === 'verified' && <Shield className="h-4 w-4" />}
        {status.code === 'declared' && <CheckCircle className="h-4 w-4" />}
        {status.code === 'pending' && <Clock className="h-4 w-4" />}
        {status.code === 'rejected' && <XCircle className="h-4 w-4" />}
        {status.name_fr}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003153]"></div>
      </div>
    );
  }

  const currentStatus = statuses.find(s => s.id === company?.exporter_status_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-[#003153]">
              ← Retour au dashboard
            </Link>
            <h1 className="text-2xl font-bold text-[#003153] flex-1">Statut Exportateur</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Statut actuel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-[#003153] mb-4 flex items-center gap-2">
              <Ship className="h-5 w-5" />
              Votre statut actuel
            </h2>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500 mb-1">Entreprise</p>
                <p className="font-medium text-[#003153]">{company?.name}</p>
              </div>
              <div>
                {getStatusBadge(currentStatus)}
              </div>
            </div>

            {currentStatus?.code === 'certified' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <Award className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Exportateur certifié</p>
                  <p className="text-sm text-green-600 mt-1">
                    Votre entreprise est officiellement reconnue comme exportateur certifié par AlgeriaExport.
                    Vous bénéficiez d'une visibilité premium et d'un badge de confiance.
                  </p>
                </div>
              </div>
            )}

            {currentStatus?.code === 'verified' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Exportateur vérifié</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Votre statut d'exportateur a été vérifié par nos équipes.
                  </p>
                </div>
              </div>
            )}

            {currentStatus?.code === 'declared' && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">Exportateur déclaré</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Vous avez déclaré votre activité d'exportation. En attente de vérification.
                  </p>
                </div>
              </div>
            )}

            {currentStatus?.code === 'pending' && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Statut non défini</p>
                  <p className="text-sm text-yellow-600 mt-1">
                    Vous n'avez pas encore déclaré votre statut d'exportateur.
                    Complétez le formulaire ci-dessous.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Formulaire de déclaration */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-[#003153] mb-6">Déclarer votre activité</h2>

            <div className="space-y-6">
              {/* Type d'entreprise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'entreprise
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#003153]"
                >
                  <option value="">Sélectionnez un type</option>
                  {companyTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name_fr}
                    </option>
                  ))}
                </select>
                {companyTypes.find(t => t.id === selectedType)?.is_exporter_by_default && (
                  <p className="mt-2 text-sm text-green-600">
                    ⭐ Les fabricants sont automatiquement considérés comme exportateurs potentiels
                  </p>
                )}
              </div>

              {/* Déclaration exportateur */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={declareExporter}
                    onChange={(e) => setDeclareExporter(e.target.checked)}
                    className="h-5 w-5 text-[#003153]"
                  />
                  <div>
                    <span className="font-medium text-[#003153]">
                      Je déclare que mon entreprise exporte ou souhaite exporter
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      Cochez cette case si vous avez déjà des activités d'exportation ou si vous souhaitez 
                      développer votre présence à l'international.
                    </p>
                  </div>
                </label>
              </div>

              {/* Upload de documents */}
              {declareExporter && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Documents justificatifs (optionnel)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#003153] transition">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <Upload className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Cliquez pour uploader des documents (licences d'export, certificats, etc.)
                      </span>
                      <span className="text-xs text-gray-400">
                        PDF, JPEG, PNG (max 10MB)
                      </span>
                    </label>
                  </div>

                  {documents.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Documents sélectionnés :</p>
                      {documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>{doc.name}</span>
                          <span className="text-xs text-gray-400">
                            ({(doc.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('succès') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={saving || !selectedType}
                className="w-full px-4 py-3 bg-[#003153] text-white rounded-lg hover:bg-[#002244] transition disabled:opacity-50 font-medium"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer ma déclaration'}
              </button>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-[#003153] mb-2 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Pourquoi déclarer votre statut ?
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Les acheteurs internationaux filtrent par statut exportateur</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Les exportateurs certifiés apparaissent en priorité dans les recherches</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <span>Accès à des opportunités d'export exclusives</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}