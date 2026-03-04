import { Building2, Package, MessageSquare, TrendingUp, Users, Settings, LogOut, Globe, Shield, Clock, FileCheck, Bell, Eye } from "lucide-react"; 
import Link from "next/link"; 
 
export default function DashboardPage() { 
  return ( 
    <div className="min-h-screen bg-[#F8FAFC]"> 
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50"> 
        <div className="container mx-auto px-4 py-4 flex justify-between items-center"> 
          <Link href="/" className="text-2xl font-bold"> 
            <span className="text-[#003153]">Algeria<span className="text-[#2E7D32]">Export</span></span> 
          </Link> 
          <div className="flex items-center gap-6"> 
            <button className="relative"> 
              <Bell className="h-5 w-5 text-gray-600" /> 
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D21034] rounded-full text-[10px] flex items-center justify-center text-white">3</span> 
            </button> 
            <div className="flex items-center gap-3"> 
              <div className="text-right"> 
                <p className="text-sm font-medium text-[#003153]">Algeria Export Group</p> 
                <p className="text-xs text-gray-500">Verified Supplier</p> 
              </div> 
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#003153] to-[#2E7D32] flex items-center justify-center text-white font-bold text-lg shadow-md">AG</div> 
            </div> 
          </div> 
        </div> 
      </nav> 
 
      <div className="container mx-auto px-4 py-8"> 
        <div className="flex justify-between items-center mb-8"> 
          <div> 
            <h1 className="text-3xl font-bold text-[#003153]">Trade Infrastructure Dashboard</h1> 
            <p className="text-gray-600 mt-1">Monitor and manage your export activities in real-time</p> 
          </div> 
          <div className="flex gap-3"> 
            <button className="px-4 py-2 bg-[#003153] text-white rounded-lg hover:bg-[#002244] transition flex items-center gap-2 text-sm font-medium"> 
              <Package className="h-4 w-4" /> Add Product</button> 
            <button className="px-4 py-2 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition flex items-center gap-2 text-sm font-medium text-gray-700"> 
              <FileCheck className="h-4 w-4" /> Export Report</button> 
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
            <p className="text-3xl font-bold text-[#003153] mb-1">247</p> 
            <p className="text-sm text-gray-500">Profile Views</p> 
          </div> 
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"> 
            <div className="flex items-center justify-between mb-4"> 
              <div className="p-3 bg-[#003153]/10 rounded-lg"> 
                <MessageSquare className="h-6 w-6 text-[#003153]" /> 
              </div> 
              <span className="text-xs bg-[#D21034]/10 text-[#D21034] px-2 py-1 rounded-full">+5 new</span> 
            </div> 
            <p className="text-3xl font-bold text-[#003153] mb-1">18</p> 
            <p className="text-sm text-gray-500">Active Inquiries</p> 
          </div> 
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"> 
            <div className="flex items-center justify-between mb-4"> 
              <div className="p-3 bg-[#003153]/10 rounded-lg"> 
                <Package className="h-6 w-6 text-[#003153]" /> 
              </div> 
              <span className="text-xs bg-[#2E7D32]/10 text-[#2E7D32] px-2 py-1 rounded-full">All verified</span> 
            </div> 
            <p className="text-3xl font-bold text-[#003153] mb-1">32</p> 
            <p className="text-sm text-gray-500">Active Products</p> 
          </div> 
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"> 
            <div className="flex items-center justify-between mb-4"> 
              <div className="p-3 bg-[#003153]/10 rounded-lg"> 
                <Globe className="h-6 w-6 text-[#003153]" /> 
              </div> 
              <span className="text-xs bg-[#003153]/10 text-[#003153] px-2 py-1 rounded-full">8 countries</span> 
            </div> 
            <p className="text-3xl font-bold text-[#003153] mb-1">14</p> 
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
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"> 
                <div className="flex items-center gap-4"> 
                  <div className="w-10 h-10 bg-[#003153]/10 rounded-full flex items-center justify-center text-[#003153] font-bold">IT</div> 
                  <div> 
                    <p className="font-medium text-[#003153]">Olive Oil Importer - Italy</p> 
                    <p className="text-sm text-gray-500">Requesting 500L of Extra Virgin Olive Oil</p> 
                  </div> 
                </div> 
                <span className="text-xs bg-[#2E7D32] text-white px-2 py-1 rounded-full">New</span> 
              </div> 
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"> 
                <div className="flex items-center gap-4"> 
                  <div className="w-10 h-10 bg-[#003153]/10 rounded-full flex items-center justify-center text-[#003153] font-bold">DE</div> 
                  <div> 
                    <p className="font-medium text-[#003153]">German Food Distributor</p> 
                    <p className="text-sm text-gray-500">Dates Deglet Nour - 2 tons monthly</p> 
                  </div> 
                </div> 
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">In Progress</span> 
              </div> 
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"> 
                <div className="flex items-center gap-4"> 
                  <div className="w-10 h-10 bg-[#003153]/10 rounded-full flex items-center justify-center text-[#003153] font-bold">TR</div> 
                  <div> 
                    <p className="font-medium text-[#003153]">Turkish Trading Company</p> 
                    <p className="text-sm text-gray-500">Cement and construction materials</p> 
                  </div> 
                </div> 
                <span className="text-xs bg-[#003153]/10 text-[#003153] px-2 py-1 rounded-full">Quote Sent</span> 
              </div> 
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
                  <span className="text-gray-600">Export Readiness</span> 
                  <span className="font-medium text-[#2E7D32]">85%</span> 
                </div> 
                <div className="w-full bg-gray-200 rounded-full h-2"> 
                  <div className="bg-[#2E7D32] h-2 rounded-full" style={{width: '85%'}}></div> 
                </div> 
              </div> 
              <div> 
                <div className="flex justify-between text-sm mb-2"> 
                  <span className="text-gray-600">Documentation</span> 
                  <span className="font-medium text-[#2E7D32]">90%</span> 
                </div> 
                <div className="w-full bg-gray-200 rounded-full h-2"> 
                  <div className="bg-[#2E7D32] h-2 rounded-full" style={{width: '90%'}}></div> 
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
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
} 
