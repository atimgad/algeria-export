import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  Home, 
  LayoutGrid, 
  Users, 
  Globe2, 
  Award,
  BarChart3,
  LogIn,
  UserPlus
} from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'ALGERIA EXPORT - Portail du Commerce Algérien',
  description: 'La vitrine d\'excellence du commerce algérien et africain',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AE</span>
                </div>
                <span className="font-bold text-xl text-gray-800 hidden sm:block">
                  ALGERIA EXPORT
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-1">
                <Link href="/" className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <Home className="w-4 h-4" />
                  <span>Accueil</span>
                </Link>
                <Link href="/categories" className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <LayoutGrid className="w-4 h-4" />
                  <span>Catégories</span>
                </Link>
                <Link href="/exporters" className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <Users className="w-4 h-4" />
                  <span>Exportateurs</span>
                </Link>
                <Link href="/south-south" className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <Globe2 className="w-4 h-4" />
                  <span>Sud-Sud</span>
                </Link>
                <Link href="/president-word" className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <Award className="w-4 h-4" />
                  <span>Mot du Président</span>
                </Link>
                <Link href="/stats/analytics" className="px-3 py-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-gray-700">
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistiques</span>
                </Link>
              </div>

              {/* Right side - Language + Auth */}
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                
                <div className="hidden sm:flex items-center gap-2">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Connexion</span>
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-red-600 text-white rounded-lg flex items-center gap-2 hover:shadow-lg transition"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Inscription</span>
                  </Link>
                </div>

                {/* Mobile menu button */}
                <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main>
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">AE</span>
                  </div>
                  <span className="font-bold text-xl">ALGERIA EXPORT</span>
                </div>
                <p className="text-gray-400 text-sm">
                  La vitrine d'excellence du commerce algérien et africain.
                  Initiative présidentielle pour le développement du commerce Sud-Sud.
                </p>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Navigation</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/" className="hover:text-white">Accueil</Link></li>
                  <li><Link href="/categories" className="hover:text-white">Catégories</Link></li>
                  <li><Link href="/exporters" className="hover:text-white">Exportateurs</Link></li>
                  <li><Link href="/south-south" className="hover:text-white">Commerce Sud-Sud</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Informations</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/president-word" className="hover:text-white">Mot du Président</Link></li>
                  <li><Link href="/stats/analytics" className="hover:text-white">Statistiques</Link></li>
                  <li><Link href="/strategic-pillars" className="hover:text-white">Stratégie 2035</Link></li>
                  <li><Link href="/about" className="hover:text-white">À propos</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>contact@algeriaexport.dz</li>
                  <li>+213 (0) 23 45 67 89</li>
                  <li>Alger, Algérie</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>© 2026 ALGERIA EXPORT - Tous droits réservés</p>
              <p className="mt-2">Initiative Présidentielle pour le développement du commerce Sud-Sud</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}