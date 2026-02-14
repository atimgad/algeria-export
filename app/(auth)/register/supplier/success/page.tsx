'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Mail, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SupplierSuccessPage() {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/dashboard';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-0 shadow-2xl overflow-hidden">
          {/* Success Header with Animation */}
          <div className="bg-gradient-to-r from-green-600 to-amber-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex bg-white rounded-full p-4 mb-4"
            >
              <CheckCircle className="h-16 w-16 text-green-600" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white"
            >
              Félicitations !
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/90 text-lg mt-2"
            >
              Votre demande d'inscription a été envoyée
            </motion.p>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <p className="text-gray-600 text-lg">
                Notre équipe va vérifier vos informations et vous contactera dans les plus brefs délais.
              </p>
            </motion.div>

            {/* Steps */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6"
            >
              {[
                { icon: Mail, title: 'Email de confirmation', desc: 'Vous recevrez un email sous 24h' },
                { icon: Building2, title: 'Vérification', desc: 'Validation de votre entreprise' },
                { icon: ArrowRight, title: 'Accès dashboard', desc: 'Gérez vos produits et exportations' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex bg-amber-100 p-3 rounded-full mb-3">
                    <item.icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Countdown */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-gray-500 mb-4">
                Redirection vers votre tableau de bord dans <span className="font-bold text-amber-600">{countdown} secondes</span>
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    Aller au tableau de bord maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}