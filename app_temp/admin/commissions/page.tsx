import { createClient } from '@/lib/supabase-server';
import { TrendingUp, DollarSign, Users, Percent, Eye, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function AdminCommissionsPage() {
  const supabase = await createClient();
  
  // Statistiques des commissions
  const { data: stats } = await supabase
    .from('transactions')
    .select('*');
  
  const totalCommissions = stats?.reduce((acc, t) => acc + (t.commission_amount || 0), 0) || 0;
  const pendingCommissions = stats?.filter(t => t.status === 'pending')
    .reduce((acc, t) => acc + (t.commission_amount || 0), 0) || 0;
  
  // Top fournisseurs
  const { data: topSuppliers } = await supabase
    .from('transactions')
    .select('supplier_id, amount, commission_amount')
    .order('created_at', { ascending: false });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#003153]">Administration - Commissions</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* Cartes récapitulatives */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <DollarSign className="h-6 w-6 text-[#003153]" />
              </div>
              <p className="text-sm text-gray-500">Total commissions</p>
            </div>
            <p className="text-3xl font-bold text-[#003153]">{totalCommissions.toLocaleString()} DA</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-sm text-gray-500">En attente</p>
            </div>
            <p className="text-3xl font-bold text-yellow-600">{pendingCommissions.toLocaleString()} DA</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#2E7D32]/10 rounded-lg">
                <CheckCircle className="h-6 w-6 text-[#2E7D32]" />
              </div>
              <p className="text-sm text-gray-500">Transactions</p>
            </div>
            <p className="text-3xl font-bold text-[#2E7D32]">{stats?.length || 0}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-500">Taux moyen</p>
            </div>
            <p className="text-3xl font-bold text-purple-600">5.2%</p>
          </div>
        </div>
        
        {/* Liste des fournisseurs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-[#003153] mb-6">Fournisseurs et commissions</h2>
          
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4">Fournisseur</th>
                <th className="text-left py-3 px-4">Plan</th>
                <th className="text-right py-3 px-4">Commission</th>
                <th className="text-right py-3 px-4">Transactions</th>
                <th className="text-right py-3 px-4">Total dû</th>
                <th className="text-center py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Les données viendront de la base */}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}