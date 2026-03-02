'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from '@/components/recharts/ClientRecharts'
import React from 'react'

interface Stats {
  totalViews: number
  uniqueVisitors: number
  topPages: Array<{ path: string; count: number }>
  viewsByDay: Array<{ date: string; count: number }>
  viewsBySource: Array<{ source: string; count: number }>
  viewsByCategory: Array<{ category: string; count: number }>
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

export function AnalyticsDashboard({ initialStats }: { initialStats: Stats }) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent>
            <div className="h-80 bg-gray-200 animate-pulse rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Cartes récapitulatives */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Vues totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{initialStats.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Visiteurs uniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{initialStats.uniqueVisitors.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Graphique des vues par jour */}
      <Card>
        <CardHeader>
          <CardTitle>Évolution des visites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={initialStats.viewsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Nombre de vues" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Graphiques en bas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top pages */}
        <Card>
          <CardHeader>
            <CardTitle>Pages les plus visitées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={initialStats.topPages}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="path" 
                    width={90}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sources de trafic */}
        <Card>
          <CardHeader>
            <CardTitle>Sources de trafic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={initialStats.viewsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => {
                      const safePercent = percent || 0
                      return `${name} (${(safePercent * 100).toFixed(0)}%)`
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="source"
                  >
                    {initialStats.viewsBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Catégories populaires */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Catégories populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={initialStats.viewsByCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45} 
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}