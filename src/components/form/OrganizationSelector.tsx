import React, { useState, useEffect } from 'react';
import { Building2, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Organization } from '../../types';

interface Props {
  value: string | undefined;
  onChange: (id: string, org: Organization) => void;
}

export function OrganizationSelector({ value, onChange }: Props) {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('organizations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setOrgs(data || []);
        setLoading(false);
      });
  }, []);

  const selected = orgs.find(o => o.id === value);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Building2 size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-gray-800">Организация</h3>
      </div>

      {loading ? (
        <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
      ) : orgs.length === 0 ? (
        <p className="text-sm text-gray-400 italic">Нет организаций. Добавьте их в разделе «Организации».</p>
      ) : (
        <div className="relative">
          <select
            value={value || ''}
            onChange={e => {
              const org = orgs.find(o => o.id === e.target.value);
              if (org) onChange(e.target.value, org);
            }}
            className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="">— Выберите организацию —</option>
            {orgs.map(org => (
              <option key={org.id} value={org.id}>{org.short_name} — {org.name}</option>
            ))}
          </select>
          <ChevronDown size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      )}

      {selected && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          {selected.bin_inn && <span>БИН/ИНН: <span className="text-gray-700 font-medium">{selected.bin_inn}</span></span>}
          {selected.address && <span>Адрес: <span className="text-gray-700">{selected.address}</span></span>}
          {selected.phone && <span>Тел: <span className="text-gray-700">{selected.phone}</span></span>}
          {selected.director && <span>Директор: <span className="text-gray-700">{selected.director}</span></span>}
        </div>
      )}
    </div>
  );
}
