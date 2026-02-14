'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { name: 'Dattes Deglet Nour', icon: '🌴', color: 'from-amber-600 to-amber-800' },
    { name: 'Huile d\'olive', icon: '🫒', color: 'from-green-600 to-green-800' },
    { name: 'Produits de terroir', icon: '🏺', color: 'from-terracotta-600 to-terracotta-800' },
    { name: 'Conserves', icon: '🥫', color: 'from-red-600 to-red-800' },
    { name: 'Épices', icon: '🌶️', color: 'from-orange-600 to-orange-800' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay - VERT ALGÉRIEN */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/algeria-hero.jpg"
          alt="Algérie - Terre d'exportation"
          fill
          className="object-cover"
          priority
      />
       <div className="absolute inset-0 bg-gradient-to-r from-[#006233] via-[#006233]/80 to-[#006233]/60" />
      </div> 

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            {/* Badge Algérie */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">🇩🇿 Fierté Algérienne</span>
            </div>

            {/* Main Title */}
	    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
               <span className="text-white [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">Connecter les fournisseurs algériens</span>
               <span className="block text-[#C6A75E] [text-shadow:_0_4px_12px_rgb(0_0_0_/_50%)]">aux marchés mondiaux</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl">
              La plateforme B2B premium pour l'exportation des produits du terroir algérien. Dattes, huile d'olive, épices et plus encore.
            </p>

            {/* Search Bar */}
	    <div className="relative max-w-2xl mb-8">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                 <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Rechercher un produit, une entreprise, une catégorie..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 py-6 text-lg bg-white/95 backdrop-blur-sm border-0 text-gray-900 placeholder:text-gray-500 rounded-full shadow-lg"
  />
  <Button className="absolute right-2 top-1/2 -translate-y-1/2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-5 rounded-full shadow-lg">
    Rechercher
  </Button>
</div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg rounded-full group">
                Devenir Fournisseur
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
                Trouver des Produits
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80"
        >
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Nos Catégories Agroalimentaires</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez la richesse et la diversité des produits algériens, sélectionnés pour leur qualité exceptionnelle.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
              >
                <div className={`relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br ${category.color}`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <span className="text-6xl mb-4">{category.icon}</span>
                    <h3 className="text-xl font-bold text-center">{category.name}</h3>
                    <Button variant="ghost" size="sm" className="mt-4 text-white/80 group-hover:text-white">
                      Explorer
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}