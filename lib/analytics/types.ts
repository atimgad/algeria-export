export interface PageView {
  id?: number;
  path: string;
  title?: string;
  referrer?: string;
  user_agent?: string;
  ip_hash?: string;
  session_id: string;
  country?: string;
  device_type?: 'mobile' | 'desktop' | 'tablet';
  created_at?: string;
}

export interface PageStats {
  path: string;
  views: number;
  unique_visitors: number;
  first_view?: string;
  last_view?: string;
}

export interface AnalyticsSummary {
  total_views: number;
  total_unique_visitors: number;
  pages: PageStats[];
  daily: { date: string; views: number; visitors: number }[];
  sources: { source: string; count: number }[];
  devices: { device: string; count: number }[];
}