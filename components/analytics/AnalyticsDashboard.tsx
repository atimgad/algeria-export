// components/analytics/AnalyticsDashboard.tsx
'use client';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface Stats {
  totalViews: number;
  uniqueVisitors: number;
  viewsByDay: Array<{ date: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  viewsBySource: Array<{ source: string; count: number }>;
  viewsByCategory: Array<{ name: string; value: number }>;
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6', '#8b5cf6'];

export function AnalyticsDashboard({ initialStats }: { initialStats: Stats }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center">
            <span className="bg-gradient-to-r from-green-600 to-red-600 text-transparent bg-clip-text">
              Statistiques
            </span>
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Cartes de synthèse */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 mb-2">Vues totales</p>
            <p className="text-4xl font-bold text-green-600">
              {initialStats.totalViews.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 mb-2">Visiteurs uniques</p>
            <p className="text-4xl font-bold text-red-600">
              {initialStats.uniqueVisitors.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Top pages */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold mb-6">Top catégories</h2>
          <div className="space-y-4">
            {initialStats.topPages.map((page, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700">{page.path}</span>
                  <span className="font-semibold">{page.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                    style={{ width: `${(page.count / Math.max(...initialStats.topPages.map(p => p.count))) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de trafic */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold mb-6">Sources de trafic</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={initialStats.viewsBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {initialStats.viewsBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Catégories */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Répartition par catégorie</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialStats.viewsByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}