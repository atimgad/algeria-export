import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Package, MessageSquare, Eye, Globe, Bell, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Vérifier si l'utilisateur est connecté
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }

  // Récupérer les données de l'utilisateur depuis la table users
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Récupérer les produits
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id);

  // Récupérer les messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const productCount = products?.length || 0;
  const messageCount = messages?.length || 0;
  const newMessages = messages?.filter(m => m.status === 'new').length || 0;

  // Initiales pour l'avatar
  const initials = userData?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user.email?.[0].toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header NEC PLUS ULTRA */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-[#003153]">Algeria<span className="text-[#2E7D32]">Export</span></span>
            </Link>
            
            <div className="flex items-center gap-6">
              <button className="relative">
                <Bell className="h-5 w-5 text-gray-600 hover:text-[#003153] transition" />
                {newMessages > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D21034] rounded-full text-[10px] flex items-center justify-center text-white">
                    {newMessages}
                  </span>
                )}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#003153]">
                    {userData?.company_name || 'Entreprise non renseignée'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#003153] to-[#2E7D32] flex items-center justify-center text-white font-bold">
                  {initials}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003153]">
            Bonjour, {userData?.full_name?.split(' ')[0] || 'cher exportateur'}
          </h1>
          <p className="text-gray-600 mt-1">
            Voici un résumé de votre activité sur AlgeriaExport.com
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Eye className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">247</p>
            <p className="text-sm text-gray-500">Vues du profil</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-[#003153]" />
              </div>
              {newMessages > 0 && (
                <span className="text-xs bg-[#D21034]/10 text-[#D21034] px-2 py-1 rounded-full">
                  +{newMessages} nouveau(x)
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{messageCount}</p>
            <p className="text-sm text-gray-500">Messages</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Package className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">
                {productCount > 0 ? 'Actifs' : 'À compléter'}
              </span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{productCount}</p>
            <p className="text-sm text-gray-500">Produits</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Globe className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#003153]/10 text-[#003153] px-2 py-1 rounded-full">
                8 pays
              </span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">14</p>
            <p className="text-sm text-gray-500">Acheteurs internationaux</p>
          </div>
        </div>

        {/* Messages section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#003153]">Messages récents</h2>
            <Link href="/dashboard/messages" className="text-sm text-[#2E7D32] hover:underline">
              Voir tous les messages
            </Link>
          </div>

          {messages && messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg: any) => (
                <div key={msg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-[#003153]/10 rounded-full flex items-center justify-center text-[#003153] font-bold">
                      {msg.sender_id?.substring(0, 2).toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#003153]">
                        {msg.subject || 'Nouveau message'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {msg.message?.substring(0, 100)}
                        {msg.message?.length > 100 ? '...' : ''}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    msg.status === 'new' 
                      ? 'bg-[#2E7D32] text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {msg.status === 'new' ? 'Nouveau' : 'Lu'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucun message pour le moment</p>
              <p className="text-sm text-gray-400 mt-2">
                Les acheteurs vous contacteront ici
              </p>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-3">
            <Package className="h-5 w-5 text-[#2E7D32]" />
            <span className="font-medium text-[#003153]">Ajouter un produit</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-3">
            <Settings className="h-5 w-5 text-[#2E7D32]" />
            <span className="font-medium text-[#003153]">Modifier mon profil</span>
          </button>
          <button className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center gap-3">
            <LogOut className="h-5 w-5 text-[#D21034]" />
            <span className="font-medium text-[#003153]">Déconnexion</span>
          </button>
        </div>
      </main>
    </div>
  );
}