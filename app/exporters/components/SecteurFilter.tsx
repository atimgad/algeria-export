'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface SecteurFilterProps {
  currentSecteur?: string;
  secteurs: string[];
}

export default function SecteurFilter({ currentSecteur, secteurs }: SecteurFilterProps) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [selectedValue, setSelectedValue] = useState(currentSecteur || '');

  useEffect(() => {
    setIsClient(true);
    setSelectedValue(currentSecteur || '');
  }, [currentSecteur]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    
    // Navigation directe sans setTimeout
    if (value) {
      router.push(`/exporters?secteur=${encodeURIComponent(value)}`);
    } else {
      router.push('/exporters');
    }
  };

  if (!isClient) {
    return (
      <select
        className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003153] focus:border-transparent"
        defaultValue={currentSecteur || ''}
      >
        <option value="">Tous les secteurs</option>
        {secteurs.map(s => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
    );
  }

  return (
    <select
      className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003153] focus:border-transparent"
      value={selectedValue}
      onChange={handleChange}
    >
      <option value="">Tous les secteurs</option>
      {secteurs.map(s => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}