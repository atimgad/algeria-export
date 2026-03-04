import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Building2, Package, MessageSquare, TrendingUp, Users, Settings, LogOut, Globe, Shield, Clock, FileCheck, Bell, Eye } from "lucide-react";
import Link from "next/link";
import Header from '../components/Header';

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id);

  const { data: inquiries } = await supabase
    .from('messages')
    .select('*')
    .eq('recipient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const productCount = products?.length || 0;
  const inquiryCount = inquiries?.length || 0;
  const newInquiries = inquiries?.filter(i => i.status === 'new').length || 0;
  const profileViews = 247;
  const internationalBuyers = 14;

  const initials = userData?.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || user.email?.[0].toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header
        isAuthenticated={true}
        userEmail={user.email || ''}
        userName={userData?.full_name || null}
        companyName={userData?.company_name || null}
        initials={initials}
        newInquiries={newInquiries}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#003153]">Trade Infrastructure Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {userData?.full_name?.split(' ')[0] || user.email}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#003153] text-white rounded-lg hover:bg-[#002244] transition flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4" /> Add Product
            </button>
            <button className="px-4 py-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileCheck className="h-4 w-4" /> Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Eye className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">+12% vs last month</span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{profileViews}</p>
            <p className="text-sm text-gray-500">Profile Views</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <MessageSquare className="h-6 w-6 text-[#003153]" />
              </div>
              {newInquiries > 0 && (
                <span className="text-xs bg-[#D21034]/10 text-[#D21034] px-2 py-1 rounded-full">+{newInquiries} new</span>
              )}
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{inquiryCount}</p>
            <p className="text-sm text-gray-500">Active Inquiries</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Package className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">All verified</span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{productCount}</p>
            <p className="text-sm text-gray-500">Active Products</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#003153]/10 rounded-lg">
                <Globe className="h-6 w-6 text-[#003153]" />
              </div>
              <span className="text-xs bg-[#003153]/10 text-[#003153] px-2 py-1 rounded-full">8 countries</span>
            </div>
            <p className="text-3xl font-bold text-[#003153] mb-1">{internationalBuyers}</p>
            <p className="text-sm text-gray-500">International Buyers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#003153]">Recent Trade Inquiries</h2>
              <Link href="#" className="text-sm text-[#2E7D32] hover:underline">View all</Link>
            </div>
            <div className="space-y-4">
              {inquiries && inquiries.length > 0 ? (
                inquiries.map((inquiry: any) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#003153]/10 rounded-full flex items-center justify-center text-[#003153] font-bold">
                        {inquiry.sender_company?.substring(0, 2).toUpperCase() || 'BU'}
                      </div>
                      <div>
                        <p className="font-medium text-[#003153]">{inquiry.subject || 'New Inquiry'}</p>
                        <p className="text-sm text-gray-500">{inquiry.message?.substring(0, 50)}...</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      inquiry.status === 'new'
                        ? 'bg-[#2E7D32] text-white'
                        : inquiry.status === 'in_progress'
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-[#003153]/10 text-[#003153]'
                    }`}>
                      {inquiry.status === 'new' ? 'New' : inquiry.status === 'in_progress' ? 'In Progress' : 'Quote Sent'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No inquiries yet. They will appear here when buyers contact you.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 text-[#003153]">Infrastructure Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Verification Status</span>
                  <span className="font-medium text-[#2E7D32]">Verified</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#2E7D32] h-2 rounded-full" style={{width: '100%'}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-medium text-[#2E7D32]">
                    {userData?.full_name && userData?.company_name ? '85%' : '60%'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#2E7D32] h-2 rounded-full"
                       style={{width: userData?.full_name && userData?.company_name ? '85%' : '60%'}}>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Products Listed</span>
                  <span className="font-medium text-[#2E7D32]">{productCount}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#2E7D32] h-2 rounded-full"
                       style={{width: `${Math.min((productCount / 10) * 100, 100)}%`}}>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="font-medium text-[#003153] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
                  <Package className="h-4 w-4 text-[#2E7D32] mb-1" />
                  <span className="text-xs font-medium text-[#003153]">Add Product</span>
                </button>
                <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
                  <FileCheck className="h-4 w-4 text-[#2E7D32] mb-1" />
                  <span className="text-xs font-medium text-[#003153]">Documents</span>
                </button>
                <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
                  <Building2 className="h-4 w-4 text-[#2E7D32] mb-1" />
                  <span className="text-xs font-medium text-[#003153]">Edit Profile</span>
                </button>
                <button className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition text-left">
                  <Settings className="h-4 w-4 text-[#2E7D32] mb-1" />
                  <span className="text-xs font-medium text-[#003153]">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}