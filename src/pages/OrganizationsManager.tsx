import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Building2, Check, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Organization } from '../types';

const emptyOrg: Organization = {
  name: '',
  short_name: '',
  bin_inn: '',
  address: '',
  phone: '',
  email: '',
  bank_details: '',
  director: '',
  logo_url: '',
  is_active: true,
};

interface OrgFormProps {
  initial: Organization;
  onSave: (org: Organization) => void;
  onCancel: () => void;
  saving: boolean;
}

function OrgForm({ initial, onSave, onCancel, saving }: OrgFormProps) {
  const [form, setForm] = useState<Organization>(initial);

  const set = (field: keyof Organization, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Полное наименование *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="ТОО «Название организации»"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Короткое название *</label>
          <input
            type="text"
            value={form.short_name}
            onChange={e => set('short_name', e.target.value)}
            placeholder="GuitarMaster"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">БИН / ИНН</label>
          <input
            type="text"
            value={form.bin_inn}
            onChange={e => set('bin_inn', e.target.value)}
            placeholder="123456789012"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Телефон</label>
          <input
            type="text"
            value={form.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="+7 (777) 000-00-00"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            placeholder="info@company.kz"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Директор (ФИО)</label>
          <input
            type="text"
            value={form.director}
            onChange={e => set('director', e.target.value)}
            placeholder="Иванов Иван Иванович"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Юридический адрес</label>
          <input
            type="text"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="г. Алматы, ул. Абая, д. 1"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Банковские реквизиты</label>
          <textarea
            value={form.bank_details}
            onChange={e => set('bank_details', e.target.value)}
            rows={3}
            placeholder="ИИК: KZ..., БИК: KCJBKZKX, Банк: Kaspi Bank"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            checked={form.is_active}
            onChange={e => set('is_active', e.target.checked)}
            className="w-4 h-4 accent-amber-500"
          />
          <label htmlFor="is_active" className="text-sm text-gray-700">Организация активна</label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onSave(form)}
          disabled={saving || !form.name.trim() || !form.short_name.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          Сохранить
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg text-sm transition-colors"
        >
          <X size={15} />
          Отмена
        </button>
      </div>
    </div>
  );
}

export function OrganizationsManager() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrgs();
  }, []);

  async function fetchOrgs() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) throw error;
      setOrgs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(org: Organization) {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .insert({ ...org })
        .select()
        .single();
      if (error) throw error;
      setOrgs(prev => [...prev, data]);
      setCreating(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, org: Organization) {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update({ ...org })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      setOrgs(prev => prev.map(o => o.id === id ? data : o));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить организацию? Все заказы останутся в базе.')) return;
    try {
      await supabase.from('organizations').delete().eq('id', id);
      setOrgs(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Организации</h2>
          <p className="text-sm text-gray-500 mt-0.5">Юридические лица для оформления актов</p>
        </div>
        {!creating && (
          <button
            onClick={() => { setCreating(true); setEditingId(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            <Plus size={16} />
            Добавить
          </button>
        )}
      </div>

      {creating && (
        <OrgForm
          initial={emptyOrg}
          onSave={handleCreate}
          onCancel={() => setCreating(false)}
          saving={saving}
        />
      )}

      {orgs.length === 0 && !creating && (
        <div className="text-center py-16 text-gray-400">
          <Building2 size={40} className="mx-auto mb-3 opacity-40" />
          <p className="font-medium">Нет организаций</p>
          <p className="text-sm mt-1">Добавьте первую организацию</p>
        </div>
      )}

      <div className="space-y-3">
        {orgs.map(org => (
          <div key={org.id} className={`bg-white border rounded-xl overflow-hidden transition-all ${org.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
            {editingId === org.id ? (
              <div className="p-4">
                <OrgForm
                  initial={org}
                  onSave={updated => handleUpdate(org.id!, updated)}
                  onCancel={() => setEditingId(null)}
                  saving={saving}
                />
              </div>
            ) : (
              <>
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(expandedId === org.id ? null : org.id!)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Building2 size={16} className="text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate">{org.short_name}</div>
                      <div className="text-xs text-gray-500 truncate">{org.name}</div>
                    </div>
                    {org.bin_inn && (
                      <span className="hidden sm:inline-block text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        БИН/ИНН: {org.bin_inn}
                      </span>
                    )}
                    {!org.is_active && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                        неактивна
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <button
                      onClick={e => { e.stopPropagation(); setEditingId(org.id!); setCreating(false); }}
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(org.id!); }}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    {expandedId === org.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                  </div>
                </div>

                {expandedId === org.id && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {org.address && (
                      <div>
                        <span className="text-xs text-gray-400">Адрес</span>
                        <p className="text-sm text-gray-700">{org.address}</p>
                      </div>
                    )}
                    {org.phone && (
                      <div>
                        <span className="text-xs text-gray-400">Телефон</span>
                        <p className="text-sm text-gray-700">{org.phone}</p>
                      </div>
                    )}
                    {org.email && (
                      <div>
                        <span className="text-xs text-gray-400">Email</span>
                        <p className="text-sm text-gray-700">{org.email}</p>
                      </div>
                    )}
                    {org.director && (
                      <div>
                        <span className="text-xs text-gray-400">Директор</span>
                        <p className="text-sm text-gray-700">{org.director}</p>
                      </div>
                    )}
                    {org.bank_details && (
                      <div className="sm:col-span-2">
                        <span className="text-xs text-gray-400">Банковские реквизиты</span>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{org.bank_details}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
