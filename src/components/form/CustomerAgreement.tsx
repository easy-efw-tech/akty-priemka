import React from 'react';
import { FormSection, FieldRow, TextField } from '../ui/FormSection';
import { SignaturePad } from '../SignaturePad';
import { Shield } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

export function CustomerAgreement({ order, onChange }: Props) {
  return (
    <FormSection title="Согласие и подписи" icon={<Shield size={16} />}>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
        <p className="text-sm text-amber-800 leading-relaxed">
          Клиент согласен с наличием перечисленных дефектов и стоимостью ремонта, осведомлен о минимальных сроках.
          Стоимость ремонта может изменяться по обоснованному согласованию с заказчиком.
        </p>
        <p className="text-sm text-amber-800 leading-relaxed">
          Заказчик ознакомлен, что платное хранение в размере 1% от суммы ремонта за каждый день хранения начинается
          спустя 10 дней после звонка и/или сообщения о готовности инструмента, если иное не согласовано при приемке.
        </p>
      </div>

      <FieldRow label="Заказчик (ФИО / Наименование)">
        <TextField
          value={order.client_name}
          onChange={v => onChange('client_name', v)}
          placeholder="Полное имя или название организации"
        />
      </FieldRow>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <SignaturePad
          label="Подпись заказчика"
          value={order.client_signature}
          onChange={v => onChange('client_signature', v)}
        />
        <SignaturePad
          label="Подпись приёмщика"
          value={order.technician_signature}
          onChange={v => onChange('technician_signature', v)}
        />
      </div>
    </FormSection>
  );
}
