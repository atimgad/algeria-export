'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, LogOut } from 'lucide-react';

interface ProfileMenuProps {
  userEmail: string;
  userName: string | null;
  companyName: string | null;
  initials: string;
  newInquiries: number;
}

export default function ProfileMenu({ 
  userEmail, 
  userName, 
  companyName, 
  initials, 
  newInquiries 
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById('profile-menu');
      const button = document.getElementById('profile-button');
      if (menu && button && !menu.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  return (
    <div className="relative">
      <button
        id="profile-button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 focus:outline-none"
      >
        <div className="text-right">
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

      {isOpen && (
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
            onClick={() => setIsOpen(false)}
          >
            Mon profil
          </Link>
          <Link
            href="/dashboard/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            onClick={() => setIsOpen(false)}
          >
            Paramètres
          </Link>
          
          <div className="border-t border-gray-100 my-1"></div>
          
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
}