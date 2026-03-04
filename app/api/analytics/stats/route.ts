import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const days = parseInt(request.nextUrl.searchParams.get('days') || '30');
  
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  try {
    // Total des vues
    const { count: total_views } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', fromDate.toISOString());

    // Visiteurs uniques
    const { count: total_unique } = await supabase
      .from('page_views')
      .select('session_id', { count: 'exact', head: true })
      .gte('created_at', fromDate.toISOString());

    // Stats par page
    const { data: pages } = await supabase
      .from('page_views')
      .select('path, created_at, session_id')
      .gte('created_at', fromDate.toISOString());

    // Stats par jour
    const { data: daily } = await supabase
      .from('page_views')
      .select('created_at, session_id')
      .gte('created_at', fromDate.toISOString())
      .order('created_at');

    // Stats par source
    const { data: sources } = await supabase
      .from('page_views')
      .select('referrer')
      .gte('created_at', fromDate.toISOString())
      .not('referrer', 'is', null);

    // Stats par appareil
    const { data: devices } = await supabase
      .from('page_views')
      .select('device_type')
      .gte('created_at', fromDate.toISOString())
      .not('device_type', 'is', null);

    // Agrégation par page
    const pageMap = new Map();
    pages?.forEach(view => {
      const path = view.path || '/';
      const page = pageMap.get(path) || { views: 0, visitors: new Set() };
      page.views++;
      if (view.session_id) page.visitors.add(view.session_id);
      pageMap.set(path, page);
    });

    const pageStats = Array.from(pageMap.entries()).map(([path, data]) => ({
      path,
      views: data.views,
      unique_visitors: data.visitors.size
    })).sort((a, b) => b.views - a.views);

    // Agrégation par jour
    const dailyMap = new Map();
    daily?.forEach(view => {
      const date = new Date(view.created_at).toISOString().split('T')[0];
      const day = dailyMap.get(date) || { views: 0, visitors: new Set() };
      day.views++;
      if (view.session_id) day.visitors.add(view.session_id);
      dailyMap.set(date, day);
    });

    const dailyStats = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      views: data.views,
      visitors: data.visitors.size
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Agrégation par source
    const sourceMap = new Map();
    sources?.forEach(s => {
      let source = 'direct';
      try {
        if (s.referrer) {
          source = new URL(s.referrer).hostname.replace('www.', '');
        }
      } catch {
        source = 'direct';
      }
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });

    // Agrégation par appareil
    const deviceMap = new Map();
    devices?.forEach(d => {
      deviceMap.set(d.device_type || 'desktop', (deviceMap.get(d.device_type || 'desktop') || 0) + 1);
    });

    return NextResponse.json({
      total_views: total_views || 0,
      total_unique_visitors: total_unique || 0,
      pages: pageStats,
      daily: dailyStats,
      sources: Array.from(sourceMap.entries()).map(([source, count]) => ({ source, count })),
      devices: Array.from(deviceMap.entries()).map(([device, count]) => ({ device, count }))
    });

  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}