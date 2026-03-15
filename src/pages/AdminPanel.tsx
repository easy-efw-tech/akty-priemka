import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search,
  Download,
  Plus,
  Guitar,
  Calendar,
  User,
  Hash,
  ChevronRight,
  Loader2,
  RefreshCw,
  Wrench,
  CheckCircle,
  Clock,
  Package,
  Trash2,
  FileCheck,
  Phone,
  Pencil,
  Check,
  X,
  Building2,
  ListOrdered,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { htmlElementToPdf } from '../lib/htmlToPdf';
import { DiagnosticsPreview } from '../components/DiagnosticsPreview';
import { OrganizationsManager } from './OrganizationsManager';
import type { RepairOrder } from '../types';

type AdminTab = 'orders' | 'organizations';

interface Props {
  onNewOrder: () => void;
  onEditOrder: (order: RepairOrder) => void;
  onOpenAvr: (order: RepairOrder) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  'новый': { label: 'Новый', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock size={12} /> },
  'в работе': { label: 'В работе', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <Wrench size={12} /> },
  'готов': { label: 'Готов', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={12} /> },
  'выдан': { label: 'Выдан', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: <Package size={12} /> },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

export function AdminPanel({ onNewOrder, onEditOrder, onOpenAvr }: Props) {
  const [tab, setTab] = useState<AdminTab>('orders');
  const [orders, setOrders] = useState<RepairOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchClient, setSearchClient] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searchSerial, setSearchSerial] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('repair_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchClient.trim()) {
        query = query.ilike('client_name', `%${searchClient.trim()}%`);
      }
      if (searchPhone.trim()) {
        query = query.ilike('client_phone', `%${searchPhone.trim()}%`);
      }
      if (searchSerial.trim()) {
        query = query.ilike('serial_number', `%${searchSerial.trim()}%`);
      }
      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }
      if (filterBranch) {
        query = query.eq('branch', filterBranch);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchClient, searchPhone, searchSerial, filterStatus, filterBranch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingStatus(id);
    try {
      await supabase.from('repair_orders').update({ status: newStatus }).eq('id', id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleJobNumberChange = async (id: string, newJobNumber: string) => {
    try {
      await supabase.from('repair_orders').update({ job_number: newJobNumber }).eq('id', id);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, job_number: newJobNumber } : o));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Удалить этот заказ?')) return;
    try {
      await supabase.from('repair_orders').delete().eq('id', id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPDF = async (order: RepairOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);
      const root = createRoot(container);
      await new Promise<void>(resolve => {
        root.render(<DiagnosticsPreview order={order} ref={(el) => { if (el) resolve(); }} />);
        setTimeout(resolve, 300);
      });
      const el = container.firstElementChild as HTMLElement;
      if (el) {
        await htmlElementToPdf(el, `акт_${order.job_number || order.id}.pdf`);
      }
      root.unmount();
      document.body.removeChild(container);
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'новый').length,
    inProgress: orders.filter(o => o.status === 'в работе').length,
    ready: orders.filter(o => o.status === 'готов').length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-4 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
              <Guitar size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Гитарная мастерская</h1>
              <p className="text-xs text-gray-400">Система управления заказами</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {tab === 'orders' && (
              <>
                <div className="flex rounded-lg border border-gray-600 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setFilterBranch('')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                      filterBranch === '' ? 'bg-amber-500 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Все
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterBranch('Алматы')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-600 ${
                      filterBranch === 'Алматы' ? 'bg-amber-500 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Алматы
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterBranch('Москва')}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-600 ${
                      filterBranch === 'Москва' ? 'bg-amber-500 text-white' : 'bg-transparent text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    Москва
                  </button>
                </div>
                <button
                  onClick={onNewOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-medium rounded-lg transition-colors text-sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Новый заказ</span>
                  <span className="sm:hidden">+</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-3 flex gap-1">
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'orders' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <ListOrdered size={15} />
            Заказы
          </button>
          <button
            onClick={() => setTab('organizations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === 'organizations' ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            <Building2 size={15} />
            Организации
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4">
        {tab === 'organizations' ? (
          <OrganizationsManager />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard label="Всего заказов" value={stats.total} color="bg-gray-800 text-white" />
              <StatCard label="Новых" value={stats.new} color="bg-blue-600 text-white" />
              <StatCard label="В работе" value={stats.inProgress} color="bg-orange-500 text-white" />
              <StatCard label="Готово" value={stats.ready} color="bg-green-600 text-white" />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Search size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Поиск и фильтрация</span>
                <button
                  onClick={fetchOrders}
                  className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Обновить"
                >
                  <RefreshCw size={15} className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchClient}
                    onChange={e => setSearchClient(e.target.value)}
                    placeholder="Поиск по клиенту..."
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchPhone}
                    onChange={e => setSearchPhone(e.target.value)}
                    placeholder="Поиск по телефону..."
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="relative">
                  <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchSerial}
                    onChange={e => setSearchSerial(e.target.value)}
                    placeholder="Поиск по серийному №..."
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                >
                  <option value="">Все статусы</option>
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-amber-500" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <Guitar size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">Заказы не найдены</p>
                <p className="text-sm mt-1">Создайте первый заказ или измените параметры поиска</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onEdit={() => onEditOrder(order)}
                    onOpenAvr={() => onOpenAvr(order)}
                    onStatusChange={(s) => handleStatusChange(order.id!, s)}
                    onDownload={(e) => handleDownloadPDF(order, e)}
                    onDelete={(e) => handleDelete(order.id!, e)}
                    onJobNumberChange={(n) => handleJobNumberChange(order.id!, n)}
                    updatingStatus={updatingStatus === order.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`${color} rounded-xl p-4 shadow-sm`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs opacity-80 mt-0.5">{label}</p>
    </div>
  );
}

function OrderCard({
  order,
  onEdit,
  onOpenAvr,
  onStatusChange,
  onDownload,
  onDelete,
  onJobNumberChange,
  updatingStatus,
}: {
  order: RepairOrder;
  onEdit: () => void;
  onOpenAvr: () => void;
  onStatusChange: (s: string) => void;
  onDownload: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onJobNumberChange: (n: string) => void;
  updatingStatus: boolean;
}) {
  const [editingJobNumber, setEditingJobNumber] = useState(false);
  const [jobNumberDraft, setJobNumberDraft] = useState(order.job_number || '');
  const jobInputRef = useRef<HTMLInputElement>(null);

  const status = order.status || 'новый';
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG['новый'];
  const date = order.order_date ? new Date(order.order_date).toLocaleDateString('ru-RU') : '—';
  const total = (order.service_cost || 0) + (order.parts_cost || 0);
  const symbol = order.currency === 'RUB' ? '₽' : '₸';

  const startEditJobNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    setJobNumberDraft(order.job_number || '');
    setEditingJobNumber(true);
    setTimeout(() => jobInputRef.current?.select(), 50);
  };

  const commitJobNumber = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (jobNumberDraft.trim() !== (order.job_number || '')) {
      onJobNumberChange(jobNumberDraft.trim());
    }
    setEditingJobNumber(false);
  };

  const cancelJobNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingJobNumber(false);
  };

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer overflow-hidden"
      onClick={onEdit}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {editingJobNumber ? (
                <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                  <input
                    ref={jobInputRef}
                    type="text"
                    value={jobNumberDraft}
                    onChange={e => setJobNumberDraft(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') commitJobNumber(e); if (e.key === 'Escape') cancelJobNumber(e as unknown as React.MouseEvent); }}
                    className="border border-amber-400 rounded px-2 py-0.5 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 w-36"
                  />
                  <button onClick={commitJobNumber} className="p-1 hover:bg-green-50 rounded text-green-600">
                    <Check size={13} />
                  </button>
                  <button onClick={cancelJobNumber} className="p-1 hover:bg-red-50 rounded text-red-400">
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 group">
                  <span className="font-bold text-gray-900 text-sm">{order.job_number || '—'}</span>
                  <button
                    onClick={startEditJobNumber}
                    className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-amber-50 text-amber-500 transition-opacity"
                    title="Изменить номер заказа"
                  >
                    <Pencil size={11} />
                  </button>
                </div>
              )}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusCfg.color}`}>
                {statusCfg.icon}
                {statusCfg.label}
              </span>
            </div>
            <p className="text-base font-semibold text-gray-800 mt-1 truncate">{order.guitar_model || 'Без модели'}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
              {order.client_name && (
                <span className="flex items-center gap-1">
                  <User size={11} />
                  {order.client_name}
                </span>
              )}
              {order.serial_number && (
                <span className="flex items-center gap-1">
                  <Hash size={11} />
                  {order.serial_number}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                {date}
              </span>
              {order.branch && (
                <span className="font-medium text-gray-600">{order.branch}</span>
              )}
              {total > 0 && (
                <span className="font-medium text-amber-700">{total.toLocaleString('ru-RU')} {symbol}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onOpenAvr(); }}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors text-gray-400 hover:text-green-600"
              title="Акт выполненных работ"
            >
              <FileCheck size={16} />
            </button>
            <button
              onClick={onDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
              title="Скачать PDF"
            >
              <Download size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(e); }}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500"
              title="Удалить"
            >
              <Trash2 size={16} />
            </button>
            <ChevronRight size={16} className="text-gray-400 ml-1" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <span className="text-xs text-gray-500">Статус:</span>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map(s => (
              <button
                key={s}
                onClick={() => onStatusChange(s)}
                disabled={updatingStatus}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                  status === s
                    ? STATUS_CONFIG[s].color + ' shadow-sm scale-105'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {STATUS_CONFIG[s].label}
              </button>
            ))}
            {updatingStatus && <Loader2 size={14} className="animate-spin text-gray-400 mt-1" />}
          </div>
        </div>
      </div>
    </div>
  );
}
