'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Download, Calendar, Eye, Users, Globe, Smartphone } from 'lucide-react';

interface PageStats {
  path: string;
  views: number;
  unique_visitors: number;
  first_view?: string;
  last_view?: string;
}

interface DailyStats {
  date: string;
  views: number;
  visitors: number;
}

interface SourceStats {
  source: string;
  count: number;
}

interface DeviceStats {
  device: string;
  count: number;
}

interface AnalyticsSummary {
  total_views: number;
  total_unique_visitors: number;
  pages: PageStats[];
  daily: DailyStats[];
  sources: SourceStats[];
  devices: DeviceStats[];
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/analytics/stats?days=${days}`)
      .then(res => res.json())
      .then(data => setStats(data))
      .finally(() => setLoading(false));
  }, [days]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003153]"></div>
      </div>
    );
  }

  const COLORS = ['#003153', '#2E7D32', '#C6A75E', '#D21034', '#4B5563'];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#003153]">Analytics</h1>
            <p className="text-gray-600">Tableau de bord des performances</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setDays(7)}
              className={`px-4 py-2 rounded-lg ${days === 7 ? 'bg-[#003153] text-white' : 'bg-white text-gray-600'}`}
            >
              7 jours
            </button>
            <button
              onClick={() => setDays(30)}
              className={`px-4 py-2 rounded-lg ${days === 30 ? 'bg-[#003153] text-white' : 'bg-white text-gray-600'}`}
            >
              30 jours
            </button>
            <button
              onClick={() => setDays(90)}
              className={`px-4 py-2 rounded-lg ${days === 90 ? 'bg-[#003153] text-white' : 'bg-white text-gray-600'}`}
            >
              90 jours
            </button>
          </div>
        </div>

        {/* Cartes KPI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="h-5 w-5 text-[#2E7D32]" />
              <span className="text-sm text-gray-500">Vues totales</span>
            </div>
            <p className="text-3xl font-bold text-[#003153]">{stats?.total_views.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-[#2E7D32]" />
              <span className="text-sm text-gray-500">Visiteurs uniques</span>
            </div>
            <p className="text-3xl font-bold text-[#003153]">{stats?.total_unique_visitors.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Globe className="h-5 w-5 text-[#2E7D32]" />
              <span className="text-sm text-gray-500">Sources</span>
            </div>
            <p className="text-3xl font-bold text-[#003153]">{stats?.sources.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="h-5 w-5 text-[#2E7D32]" />
              <span className="text-sm text-gray-500">Taux mobile</span>
            </div>
            <p className="text-3xl font-bold text-[#003153]">
              {Math.round((stats?.devices.find(d => d.device === 'mobile')?.count || 0) / (stats?.total_views || 1) * 100)}%
            </p>
          </div>
        </div>

        {/* Graphique d'évolution */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-bold text-[#003153] mb-6">Évolution des visites</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#003153" name="Vues" />
                <Line type="monotone" dataKey="visitors" stroke="#2E7D32" name="Visiteurs" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top pages */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-[#003153] mb-6">Pages les plus vues</h2>
            <div className="space-y-4">
              {stats?.pages.slice(0, 10).map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                    <span className="text-sm text-gray-700">{page.path || '/'}</span>
                  </div>
                  <span className="text-sm font-bold text-[#003153]">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-[#003153] mb-6">Sources de trafic</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.sources}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.source}: ${entry.count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats?.sources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Export */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#003153] mb-2">Exporter les données</h2>
              <p className="text-gray-600">Téléchargez les statistiques au format CSV</p>
            </div>
            <button className="px-6 py-3 bg-[#003153] text-white rounded-lg hover:bg-[#002244] transition flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}