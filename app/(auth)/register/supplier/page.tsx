'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Building2, Mail, Lock, User, Phone, MapPin, Globe, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SupplierRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Compte
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    
    // Entreprise
    companyName: '',
    companyDescription: '',
    companyWebsite: '',
    companyCountry: 'Algeria',
    companyCity: '',
    companyAddress: '',
    
    // Spécifique export
    exportMarkets: [] as string[],
    certifications: [] as string[],
    productCategories: [] as string[],
  });

  const markets = [
    'Europe', 'Moyen-Orient', 'Afrique', 'Asie', 'Amérique du Nord', 'Amérique du Sud'
  ];

  const certs = [
    'ISO 9001', 'HACCP', 'Bio', 'Halal', 'GlobalG.A.P.', 'BRC', 'IFS'
  ];

  const categories = [
    'Dattes', 'Huile d\'olive', 'Conserves', 'Épices', 'Produits de terroir', 'Autre'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleArrayToggle = (field: 'exportMarkets' | 'certifications' | 'productCategories', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      // Validation étape 1
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
      setError('');
      setStep(2);
      return;
    }

    if (step === 2) {
      setStep(3);
      return;
    }

    // Soumission finale
    setLoading(true);
    setError('');

    try {
      // 1. Créer l'utilisateur dans auth.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'supplier',
          }
        }
      });

      if (authError) throw authError;

      if (!authData.user) throw new Error('Erreur lors de la création du compte');

      // 2. Créer l'entrée dans la table companies
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            name: formData.companyName,
            description: formData.companyDescription,
            website: formData.companyWebsite || null,
            country: formData.companyCountry,
            city: formData.companyCity,
            address: formData.companyAddress,
            verified_status: 'pending',
            export_markets: formData.exportMarkets,
            certifications: formData.certifications,
          }
        ])
        .select()
        .single();

      if (companyError) throw companyError;

      // 3. Lier l'utilisateur à l'entreprise dans la table users
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            role: 'supplier',
            company_id: companyData.id,
          }
        ]);

      if (userError) throw userError;

      // Redirection vers la page de confirmation
      router.push('/register/supplier/success');
      
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= i 
                      ? 'bg-amber-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > i ? <Check className="h-5 w-5" /> : i}
                  </div>
                  {i < 3 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      step > i ? 'bg-amber-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-center flex-1">Compte</span>
              <span className="text-center flex-1">Entreprise</span>
              <span className="text-center flex-1">Export</span>
            </div>
          </div>

          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                Devenir Fournisseur Exportateur
              </CardTitle>
              <CardDescription className="text-lg">
                Rejoignez la première plateforme B2B d'exportation algérienne
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Étape 1 - Informations du compte */}
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email professionnel</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="contact@entreprise.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+213 XX XX XX XX"
                          className="pl-10"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          className="pl-10"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          className="pl-10"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Étape 2 - Informations de l'entreprise */}
                {step === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Nom de l'entreprise</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="companyName"
                          name="companyName"
                          className="pl-10"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDescription">Description</Label>
                      <textarea
                        id="companyDescription"
                        name="companyDescription"
                        rows={4}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        value={formData.companyDescription}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Site web (optionnel)</Label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="companyWebsite"
                          name="companyWebsite"
                          placeholder="https://"
                          className="pl-10"
                          value={formData.companyWebsite}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyCountry">Pays</Label>
                        <Input
                          id="companyCountry"
                          name="companyCountry"
                          value={formData.companyCountry}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyCity">Ville</Label>
                        <Input
                          id="companyCity"
                          name="companyCity"
                          value={formData.companyCity}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyAddress">Adresse</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="companyAddress"
                          name="companyAddress"
                          className="pl-10"
                          value={formData.companyAddress}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Étape 3 - Informations d'exportation */}
                {step === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label className="text-lg mb-3 block">Marchés d'exportation cibles</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {markets.map((market) => (
                          <button
                            key={market}
                            type="button"
                            onClick={() => handleArrayToggle('exportMarkets', market)}
                            className={`p-3 border rounded-lg text-left transition-colors ${
                              formData.exportMarkets.includes(market)
                                ? 'bg-amber-50 border-amber-600 text-amber-700'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {market}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-lg mb-3 block">Certifications</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {certs.map((cert) => (
                          <button
                            key={cert}
                            type="button"
                            onClick={() => handleArrayToggle('certifications', cert)}
                            className={`p-3 border rounded-lg text-left transition-colors ${
                              formData.certifications.includes(cert)
                                ? 'bg-amber-50 border-amber-600 text-amber-700'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {cert}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-lg mb-3 block">Catégories de produits</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleArrayToggle('productCategories', cat)}
                            className={`p-3 border rounded-lg text-left transition-colors ${
                              formData.productCategories.includes(cat)
                                ? 'bg-amber-50 border-amber-600 text-amber-700'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      Retour
                    </Button>
                  )}
                  <Button
                    type="submit"
                    className="bg-amber-600 hover:bg-amber-700 text-white ml-auto"
                    disabled={loading}
                  >
                    {loading ? 'Inscription...' : step === 3 ? 'S\'inscrire' : 'Suivant'}
                    {!loading && step < 3 && <ArrowRight className="ml-2 h-5 w-5" />}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                Déjà inscrit ?{' '}
                <Link href="/login" className="text-amber-600 hover:underline font-medium">
                  Se connecter
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}