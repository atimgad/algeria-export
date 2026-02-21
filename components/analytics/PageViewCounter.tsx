'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface PageViewCounterProps {
  path: string;
  className?: string;
}

export default function PageViewCounter({ path, className = '' }: PageViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Récupérer le nombre de vues pour cette page
    fetch(`/api/analytics/views?path=${encodeURIComponent(path)}`)
      .then(res => res.json())
      .then(data => setViews(data.views))
      .catch(() => setViews(null));
  }, [path]);

  if (views === null) return null;

  return (
    <div className={`flex items-center gap-1 text-xs text-gray-400 ${className}`}>
      <Eye className="h-3 w-3" />
      <span>{views.toLocaleString()} vues</span>
    </div>
  );
}