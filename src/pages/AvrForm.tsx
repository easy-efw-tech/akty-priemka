import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronLeft, Plus, Trash2, Download, Save, Loader2, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';
import { FormSection, FieldRow, TextField } from '../components/ui/FormSection';
import { SignaturePad } from '../components/SignaturePad';
import { AvrPreview } from '../components/AvrPreview';
import { supabase } from '../lib/supabase';
import { htmlElementToPdf } from '../lib/htmlToPdf';
import type { RepairOrder, AvrItem, Organization } from '../types';
import { OrganizationSelector } from '../components/form/OrganizationSelector';

interface Props {
  order: RepairOrder;
  onBack: () => void;
}

type ToastType = 'success' | 'error';
interface Toast { message: string; type: ToastType; }

function newItem(): AvrItem {
  return { id: `avr-${Date.now()}-${Math.random()}`, description: '', price: 0 };
}

export function AvrForm({ order: initialOrder, onBack }: Props) {
  const [order, setOrder] = useState<RepairOrder>({
    ...initialOrder,
    avr_items: initialOrder.avr_items?.length ? initialOrder.avr_items : [newItem()],
    avr_date: initialOrder.avr_date || new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const items = order.avr_items || [];

  const updateItem = useCallback((id: string, field: keyof AvrItem, value: string | number) => {
    setOrder(prev => ({
      ...prev,
      avr_items: (prev.avr_items || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const addItem = () => {
    setOrder(prev => ({ ...prev, avr_items: [...(prev.avr_items || []), newItem()] }));
  };

  const removeItem = (id: string) => {
    setOrder(prev => ({ ...prev, avr_items: (prev.avr_items || []).filter(i => i.id !== id) }));
  };

  const handleChange = (field: keyof RepairOrder, value: unknown) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  };

  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const symbol = order.currency === 'RUB' ? '₽' : '₸';

  const handleSave = async () => {
    if (!order.id) {
      showToast('Сначала сохраните основной акт диагностики', 'error');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('repair_orders')
        .update({
          avr_items: order.avr_items,
          avr_date: order.avr_date,
          avr_technician_signature: order.avr_technician_signature,
          avr_client_signature: order.avr_client_signature,
        })
        .eq('id', order.id);
      if (error) throw error;
      showToast('АВР сохранён', 'success');
    } catch (err) {
      console.error(err);
      showToast('Ошибка при сохранении', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    setGeneratingPdf(true);
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:0;left:-9999px;width:794px;z-index:-1;pointer-events:none;';
    document.body.appendChild(container);
    try {
      const root = createRoot(container);
      await new Promise<void>(resolve => {
        root.render(<AvrPreview order={order} items={items} avrDate={order.avr_date || ''} ref={(el) => { if (el) resolve(); }} />);
      });
      await new Promise(resolve => setTimeout(resolve, 500));
      const el = container.firstElementChild as HTMLElement;
      if (el) await htmlElementToPdf(el, `АВР_${order.job_number || order.id || 'акт'}.pdf`);
      root.unmount();
    } catch (err) {
      console.error(err);
      showToast('Ошибка при генерации PDF', 'error');
    } finally {
      document.body.removeChild(container);
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <FileCheck size={20} className="text-amber-400" />
            <div>
              <h1 className="text-sm font-bold leading-tight">Акт выполненных работ</h1>
              {order.job_number && <p className="text-xs text-amber-400">{order.job_number}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={generatingPdf}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
          >
            {generatingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            <span className="hidden sm:inline">{generatingPdf ? '...' : 'PDF'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors min-h-[40px]"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </header>

      {toast && (
        <div className={`fixed top-16 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto p-4 space-y-4 pb-10">
        <FormSection title="Реквизиты акта" icon={<FileCheck size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow label="Дата составления АВР">
              <TextField
                type="date"
                value={order.avr_date || ''}
                onChange={v => handleChange('avr_date', v)}
              />
            </FieldRow>
            <FieldRow label="Заказ №">
              <TextField value={order.job_number || '—'} onChange={() => {}} />
            </FieldRow>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldRow label="Исполнитель">
              <TextField value={order.technician_name || '—'} onChange={() => {}} />
            </FieldRow>
            <FieldRow label="Заказчик">
              <TextField value={order.client_name || '—'} onChange={() => {}} />
            </FieldRow>
            <FieldRow label="Инструмент">
              <TextField value={order.guitar_model || '—'} onChange={() => {}} />
            </FieldRow>
            <FieldRow label="Серийный номер">
              <TextField value={order.serial_number || '—'} onChange={() => {}} />
            </FieldRow>
          </div>
        </FormSection>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-800 px-5 py-3 flex items-center justify-between">
            <h2 className="text-white font-semibold text-base tracking-wide">Выполненные работы и услуги</h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Plus size={14} />
              Добавить строку
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 w-10">№</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5">Наименование работы / услуги / расходника</th>
                  <th className="text-right text-xs font-semibold text-gray-500 px-4 py-2.5 w-36">Стоимость ({symbol})</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-2 text-sm text-gray-400 font-medium">{i + 1}</td>
                    <td className="px-2 py-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Введите описание работы или услуги..."
                        className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent min-h-[40px]"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        value={item.price || ''}
                        onChange={e => updateItem(item.id, 'price', Number(e.target.value))}
                        placeholder="0"
                        min={0}
                        className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-right min-h-[40px]"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length <= 1}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-amber-50 border-t-2 border-amber-200">
                  <td colSpan={2} className="px-4 py-3 text-sm font-bold text-gray-700 text-right">ИТОГО:</td>
                  <td className="px-4 py-3 text-base font-bold text-amber-700 text-right">
                    {total.toLocaleString('ru-RU')} {symbol}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-5">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 leading-relaxed">
                Вышеперечисленные работы (услуги) выполнены полностью. Заказчик претензий по объему и качеству оказания услуг не имеет.
              </p>
            </div>
          </div>
        </div>

        <FormSection title="Подписи" icon={<CheckCircle2 size={16} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Исполнитель: <span className="text-gray-500">{order.technician_name || '—'}</span></p>
              <SignaturePad
                label="Подпись исполнителя"
                value={order.avr_technician_signature || ''}
                onChange={v => handleChange('avr_technician_signature', v)}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Заказчик: <span className="text-gray-500">{order.client_name || '—'}</span></p>
              <SignaturePad
                label="Подпись заказчика"
                value={order.avr_client_signature || ''}
                onChange={v => handleChange('avr_client_signature', v)}
              />
            </div>
          </div>
        </FormSection>

        <OrganizationSelector
          value={order.organization_id}
          onChange={(id, org: Organization) => {
            setOrder(prev => ({ ...prev, organization_id: id, organization: org }));
          }}
        />

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-base"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? 'Сохранение...' : 'Сохранить АВР'}
          </button>
          <button
            onClick={handleDownload}
            disabled={generatingPdf}
            className="flex items-center gap-2 px-6 py-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-base"
          >
            {generatingPdf ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
            {generatingPdf ? 'Генерация...' : 'Скачать PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
