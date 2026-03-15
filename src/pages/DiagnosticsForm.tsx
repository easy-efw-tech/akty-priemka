import React, { useState, useCallback } from 'react';
import { Save, Download, ChevronLeft, Guitar, AlertCircle, CheckCircle2, Loader2, FileCheck } from 'lucide-react';
import { GeneralSection } from '../components/form/GeneralSection';
import { NeckSection } from '../components/form/NeckSection';
import { ElectronicsSection } from '../components/form/ElectronicsSection';
import { NutSection } from '../components/form/NutSection';
import { TremoloSection } from '../components/form/TremoloSection';
import { BridgeSection, TunersSection } from '../components/form/BridgeAndTunersSection';
import { OtherSection } from '../components/form/OtherSection';
import { CostSection } from '../components/form/CostSection';
import { CustomerAgreement } from '../components/form/CustomerAgreement';
import { FormSection } from '../components/ui/FormSection';
import { CosmeticMap } from '../components/CosmeticMap';
import { supabase } from '../lib/supabase';
import { generateDiagnosticsPDF } from '../lib/pdfGenerator';
import type { RepairOrder, Organization } from '../types';
import { defaultOrder } from '../types';
import { OrganizationSelector } from '../components/form/OrganizationSelector';
import { Map } from 'lucide-react';

interface Props {
  onBack: () => void;
  editOrder?: RepairOrder | null;
  onOpenAvr?: (order: RepairOrder) => void;
}

type ToastType = 'success' | 'error';

interface Toast {
  message: string;
  type: ToastType;
}

function generateJobNumber(): string {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `GM-${y}${m}${d}-${rand}`;
}

export function DiagnosticsForm({ onBack, editOrder, onOpenAvr }: Props) {
  const [order, setOrder] = useState<RepairOrder>(editOrder || { ...defaultOrder });
  const [saving, setSaving] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [savedId, setSavedId] = useState<string | null>(editOrder?.id || null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = useCallback((field: keyof RepairOrder, value: unknown) => {
    setOrder(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    if (!order.guitar_model.trim()) {
      showToast('Укажите модель гитары', 'error');
      return;
    }

    setSaving(true);
    try {
      const jobNumber = order.job_number || generateJobNumber();
      const payload = {
        ...order,
        job_number: jobNumber,
        cosmetic_defects: order.cosmetic_defects,
      };
      delete (payload as { id?: string }).id;
      delete (payload as { created_at?: string }).created_at;
      delete (payload as { updated_at?: string }).updated_at;

      let result;
      if (savedId) {
        result = await supabase
          .from('repair_orders')
          .update(payload)
          .eq('id', savedId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('repair_orders')
          .insert(payload)
          .select()
          .single();
      }

      if (result.error) throw result.error;

      setOrder(prev => ({ ...prev, job_number: jobNumber, id: result.data.id }));
      setSavedId(result.data.id);
      showToast(`Заказ ${jobNumber} успешно сохранён`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Ошибка при сохранении. Попробуйте ещё раз.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!savedId && !order.job_number) {
      showToast('Сначала сохраните заказ', 'error');
      return;
    }
    setGeneratingPdf(true);
    try {
      const doc = generateDiagnosticsPDF(order);
      doc.save(`акт_${order.job_number || 'диагностики'}.pdf`);
    } catch (err) {
      console.error(err);
      showToast('Ошибка при генерации PDF', 'error');
    } finally {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Guitar size={20} className="text-amber-400" />
            <div>
              <h1 className="text-sm font-bold leading-tight">Акт диагностики</h1>
              {order.job_number && (
                <p className="text-xs text-amber-400">{order.job_number}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {savedId && (
            <button
              onClick={handleDownloadPDF}
              disabled={generatingPdf}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
            >
              {generatingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              <span className="hidden sm:inline">{generatingPdf ? '...' : 'PDF'}</span>
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors min-h-[40px]"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            <span>{saving ? 'Сохранение...' : 'Сохранить'}</span>
          </button>
        </div>
      </header>

      {toast && (
        <div className={`fixed top-16 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="max-w-3xl mx-auto p-4 space-y-4 pb-10">
        <GeneralSection order={order} onChange={handleChange} />
        <NeckSection order={order} onChange={handleChange} />
        <ElectronicsSection order={order} onChange={handleChange} />
        <NutSection order={order} onChange={handleChange} />
        <TremoloSection order={order} onChange={handleChange} />
        <BridgeSection order={order} onChange={handleChange} />
        <TunersSection order={order} onChange={handleChange} />
        <OtherSection order={order} onChange={handleChange} />
        <CostSection order={order} onChange={handleChange} />

        <FormSection title="Косметическое состояние" icon={<Map size={16} />}>
          <p className="text-xs text-gray-500 -mt-1">
            Нажмите на область гитары для отметки дефекта. Нажмите на маркер, чтобы удалить его.
          </p>
          <CosmeticMap
            defects={order.cosmetic_defects}
            photos={order.cosmetic_photos}
            onChange={v => handleChange('cosmetic_defects', v)}
            onPhotosChange={v => handleChange('cosmetic_photos', v)}
          />
        </FormSection>

        <CustomerAgreement order={order} onChange={handleChange} />

        <OrganizationSelector
          value={order.organization_id}
          onChange={(id, org) => {
            setOrder(prev => ({ ...prev, organization_id: id, organization: org }));
          }}
        />

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-base"
            >
              {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
              {saving ? 'Сохранение...' : 'Сохранить акт'}
            </button>
            {savedId && (
              <button
                onClick={handleDownloadPDF}
                disabled={generatingPdf}
                className="flex items-center gap-2 px-6 py-4 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors text-base"
              >
                {generatingPdf ? <Loader2 size={20} className="animate-spin" /> : <Download size={20} />}
                {generatingPdf ? 'Генерация...' : 'Скачать PDF'}
              </button>
            )}
          </div>
          {savedId && onOpenAvr && (
            <button
              onClick={() => onOpenAvr(order)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors text-base"
            >
              <FileCheck size={20} />
              Сформировать АВР
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
