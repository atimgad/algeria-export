'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, User, LogOut, Package, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇩🇿', dir: 'rtl' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [currentLang, setCurrentLang] = useState('fr');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserMenuOpen(false);
  };

  const navItems = [
    { href: '/marketplace', label: 'Marketplace' },
    { href: '/categories', label: 'Catégories' },
    { href: '/about', label: 'À propos' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-lg py-3">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <span className="text-2xl font-bold text-[#006233]">
              Algeria<span className="text-[#D21034]">Export</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-medium text-[#006233] hover:text-[#D21034] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                <Globe className="h-5 w-5 text-[#006233]" />
                <span className="text-[#006233]">
                  {languages.find(l => l.code === currentLang)?.flag}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform ${langOpen ? 'rotate-180' : ''} text-[#006233]`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setLangOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3"
                      >
                        <span>{lang.flag}</span>
                        <span className="text-[#006233]">{lang.name}</span>
                        {lang.code === currentLang && (
                          <span className="ml-auto text-[#D21034]">✓</span>
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  {/* AVATAR CORRIGÉ */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold relative overflow-hidden" style={{boxShadow: "0 8px 20px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.1)"}}>
                    <div className="absolute inset-0 w-1/2 bg-white left-0" />
                    <div className="absolute inset-0 w-1/2 bg-[#006233] right-0" />
                    <span className="relative z-10 text-[#D21034] text-4xl font-bold">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border"
                    >
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="h-5 w-5 text-[#006233]" />
                        <span className="text-[#006233]">Dashboard</span>
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-5 w-5 text-[#006233]" />
                        <span className="text-[#006233]">Mon Profil</span>
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-5 w-5 text-[#006233]" />
                        <span className="text-[#006233]">Paramètres</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 text-[#D21034]"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Déconnexion</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button variant="ghost" className="text-[#006233] hover:text-[#D21034]">
                    Connexion
                  </Button>
                </Link>
                <Link href="/register/supplier">
                  <Button className="bg-[#006233] hover:bg-[#004d29] text-white">
                    Devenir Fournisseur
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-10"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-[#006233]" />
            ) : (
              <Menu className="h-6 w-6 text-[#006233]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-[#006233] hover:text-[#D21034] font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr />
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-3 text-[#006233] hover:text-[#D21034] py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <Package className="h-5 w-5 text-[#006233]" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 text-[#006233] hover:text-[#D21034] py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-5 w-5 text-[#006233]" />
                      <span>Mon Profil</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 text-[#D21034] hover:text-[#b01030] py-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Déconnexion</span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4">
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full border-[#006233] text-[#006233]">Connexion</Button>
                    </Link>
                    <Link href="/register/supplier" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-[#006233] hover:bg-[#004d29] text-white">
                        Devenir Fournisseur
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
