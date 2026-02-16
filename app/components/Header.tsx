'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Ship } from 'lucide-react';

interface HeaderProps {
  isAuthenticated?: boolean;
  userEmail?: string;
  userName?: string | null;
  companyName?: string | null;
  initials?: string;
  newInquiries?: number;
}

export default function Header({ 
  isAuthenticated,
  userEmail = '',
  userName = null,
  companyName = null,
  initials = 'U',
  newInquiries = 0
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const profileMenu = document.getElementById('profile-menu');
      const profileButton = document.getElementById('profile-button');
      if (profileMenu && profileButton &&
          !profileMenu.contains(event.target as Node) &&
          !profileButton.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[1000]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <span className="text-[#003153]">Algeria<span className="text-[#2E7D32]">Export</span></span>
          </Link>

          {/* Navigation desktop - conditionnelle selon auth */}
          <nav className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              // Menu pour utilisateur connecté
              <>
                <Link
                  href="/dashboard"
                  className={`${pathname === '/dashboard' ? 'text-[#003153] font-medium border-b-2 border-[#003153] pb-1' : 'text-gray-600 hover:text-[#003153] transition'}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/exporters"
                  className={`${pathname === '/exporters' ? 'text-[#003153] font-medium border-b-2 border-[#003153] pb-1' : 'text-gray-600 hover:text-[#003153] transition'}`}
                >
                  Exportateurs
                </Link>
                <Link
                  href="/stats"
                  className={`${pathname === '/stats' ? 'text-[#003153] font-medium border-b-2 border-[#003153] pb-1' : 'text-gray-600 hover:text-[#003153] transition'}`}
                >
                  Statistiques
                </Link>
              </>
            ) : (
              // Menu pour visiteur
              <>
                <Link href="/marketplace" className="text-gray-600 hover:text-[#003153] transition">Marketplace</Link>
                <Link href="/categories" className="text-gray-600 hover:text-[#003153] transition">Catégories</Link>
                <Link href="/about" className="text-gray-600 hover:text-[#003153] transition">À propos</Link>
                <Link href="/contact" className="text-gray-600 hover:text-[#003153] transition">Contact</Link>
              </>
            )}
          </nav>

          {/* Actions droite - conditionnelle selon auth */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              // Actions pour utilisateur connecté
              <>
                {/* Sélecteur de langue */}
                <button className="text-sm text-gray-600 hover:text-[#003153] transition flex items-center gap-1">
                  FR <ChevronDown className="h-3 w-3" />
                </button>

                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 rounded-full transition">
                  <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {newInquiries > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#D21034] rounded-full text-[10px] flex items-center justify-center text-white">
                      {newInquiries}
                    </span>
                  )}
                </button>

                {/* Menu profil */}
                <div className="relative">
                  <button
                    id="profile-button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition"
                  >
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium text-[#003153]">
                        {companyName || 'Entreprise non renseignée'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userEmail}
                      </p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#003153] to-[#2E7D32] flex items-center justify-center text-white font-bold shadow-md">
                      {initials}
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div
                      id="profile-menu"
                      className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[9999]"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-[#003153]">
                          {userName || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {userEmail}
                        </p>
                      </div>

                      <Link
                        href="/dashboard/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Mon profil
                      </Link>
                      <Link
                        href="/dashboard/exporter-status"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Ship className="h-4 w-4 inline mr-2" />
                        Statut exportateur
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Paramètres
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // Actions pour visiteur
              <>
                <button className="text-sm text-gray-600 hover:text-[#003153] transition flex items-center gap-1">
                  FR <ChevronDown className="h-3 w-3" />
                </button>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 hover:text-[#003153] transition"
                >
                  Connexion
                </Link>
                <Link
                  href="/register/supplier"
                  className="bg-[#003153] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#002244] transition"
                >
                  Devenir Fournisseur
                </Link>
              </>
            )}

            {/* Menu mobile button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="px-2 py-2 text-gray-600 hover:text-[#003153] hover:bg-gray-50 rounded-lg transition">Dashboard</Link>
                  <Link href="/exporters" className="px-2 py-2 text-gray-600 hover:text-[#003153] hover:bg-gray-50 rounded-lg transition">Exportateurs</Link>
                  <Link href="/stats" className="px-2 py-2 text-gray-600 hover:text-[#003153] hover:bg-gray-50 rounded-lg transition">Statistiques</Link>
                </>
              ) : (
                <>
                  <Link href="/marketplace" className="px-2 py-2 text-gray-600 hover:text-[#003153] hover:bg-gray-50 rounded-lg transition">Marketplace</Link>
                  <Link href="/categories" className="px-2 py-2 text-gray-600 hover:text-[#003153] hover:bg-gray-50 rounded-lg transition">Catégories</Link>
                  <Link href="/about" className="px-2 py-2 text-gray-600 hover:text-[#003153] hover:bg-gray-50 rounded-lg transition">À propos</Link>
                  <Link href="/contact" className="px-2 py-2 text-gray-600 hover:text-[#003153] hover:bg-gray-50 rounded-lg transition">Contact</Link>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <Link href="/login" className="block px-2 py-2 text-gray-600 hover:text-[#003153] hover:bg-gray-50 rounded-lg transition">Connexion</Link>
                    <Link href="/register/supplier" className="block px-2 py-2 text-[#003153] font-medium hover:bg-gray-50 rounded-lg transition">Devenir Fournisseur</Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}