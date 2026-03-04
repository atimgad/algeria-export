'use client';

import { Building2, Phone, Package } from 'lucide-react';
import Link from 'next/link';

interface ExporterCardProps {
  id: string;
  name: string;
  company_type?: string | null;
  activity_sector?: string | null;
  products?: string[] | null;
  phone?: string | null;
}

export default function ExporterCard({
  id,
  name,
  company_type,
  activity_sector,
  products,
  phone
}: ExporterCardProps) {
  return (
    <Link 
      href={`/exporters/${id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#003153] mb-1">
            {name}
          </h2>
          <p className="text-sm text-gray-500">
            {company_type?.toUpperCase() || 'ENTREPRISE'}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-[#003153] to-[#2E7D32] rounded-lg flex items-center justify-center text-white font-bold text-lg">
          {name?.charAt(0) || 'E'}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {activity_sector && (
          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-[#003153] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">{activity_sector}</p>
          </div>
        )}
        
        {products && products.length > 0 && (
          <div className="flex items-start gap-2">
            <Package className="h-4 w-4 text-[#2E7D32] mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-600">
              {products.slice(0, 3).join(' • ')}
              {products.length > 3 && ' ...'}
            </p>
          </div>
        )}
        
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-[#003153] flex-shrink-0" />
            <p className="text-sm text-gray-600">{phone}</p>
          </div>
        )}
      </div>
    </Link>
  );
}