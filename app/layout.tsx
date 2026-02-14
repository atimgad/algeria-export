import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AlgeriaExport.com - Plateforme B2B d\'exportation algérienne',
  description: 'Connecter les fournisseurs algériens aux marchés mondiaux. Dattes, huile d\'olive, épices et produits du terroir.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}