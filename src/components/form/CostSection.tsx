import React from 'react';
import { FormSection, FieldRow, NumberField, TwoCol } from '../ui/FormSection';
import { DollarSign } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

export function CostSection({ order, onChange }: Props) {
  const total = (order.service_cost || 0) + (order.parts_cost || 0);
  const currency = order.currency || 'KZT';
  const symbol = currency === 'KZT' ? '₸' : '₽';

  return (
    <FormSection title="Стоимость" icon={<DollarSign size={16} />}>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-gray-600">Валюта:</span>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            type="button"
            onClick={() => onChange('currency', 'KZT')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              currency === 'KZT'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ₸ Тенге
          </button>
          <button
            type="button"
            onClick={() => onChange('currency', 'RUB')}
            className={`px-3 py-1.5 text-sm font-medium transition-colors border-l border-gray-200 ${
              currency === 'RUB'
                ? 'bg-amber-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            ₽ Рубль
          </button>
        </div>
      </div>
      <TwoCol>
        <FieldRow label={`Сумма услуг (${symbol})`}>
          <NumberField
            value={order.service_cost}
            onChange={v => onChange('service_cost', v)}
            placeholder="0"
            min={0}
          />
        </FieldRow>
        <FieldRow label={`Сумма запчастей (${symbol})`}>
          <NumberField
            value={order.parts_cost}
            onChange={v => onChange('parts_cost', v)}
            placeholder="0"
            min={0}
          />
        </FieldRow>
        <FieldRow label={`Предоплата (${symbol})`}>
          <NumberField
            value={order.prepayment}
            onChange={v => onChange('prepayment', v)}
            placeholder="0"
            min={0}
          />
        </FieldRow>
      </TwoCol>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Итого к оплате:</span>
          <span className="text-xl font-bold text-amber-700">{total.toLocaleString('ru-RU')} {symbol}</span>
        </div>
        {order.prepayment > 0 && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-500">Остаток:</span>
            <span className="text-base font-semibold text-gray-700">
              {Math.max(0, total - (order.prepayment || 0)).toLocaleString('ru-RU')} {symbol}
            </span>
          </div>
        )}
      </div>
    </FormSection>
  );
}
