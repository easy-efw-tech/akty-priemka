import React from 'react';
import { FormSection, FieldRow, TextField, SelectField, TwoCol } from '../ui/FormSection';
import { Info } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

export function GeneralSection({ order, onChange }: Props) {
  return (
    <FormSection title="Общая информация" icon={<Info size={16} />}>
      <TwoCol>
        <FieldRow label="Модель гитары">
          <TextField
            value={order.guitar_model}
            onChange={v => onChange('guitar_model', v)}
            placeholder="Например: Gibson Les Paul Standard"
          />
        </FieldRow>
        <FieldRow label="Серийный номер">
          <TextField
            value={order.serial_number}
            onChange={v => onChange('serial_number', v)}
            placeholder="Серийный №"
          />
        </FieldRow>
        <FieldRow label="Дата приёма">
          <TextField
            type="date"
            value={order.order_date}
            onChange={v => onChange('order_date', v)}
          />
        </FieldRow>
        <FieldRow label="Приёмщик">
          <TextField
            value={order.technician_name}
            onChange={v => onChange('technician_name', v)}
            placeholder="ФИО приёмщика"
          />
        </FieldRow>
        <FieldRow label="Email клиента">
          <TextField
            type="email"
            value={order.client_email}
            onChange={v => onChange('client_email', v)}
            placeholder="email@example.com"
          />
        </FieldRow>
        <FieldRow label="Телефон клиента">
          <TextField
            type="tel"
            value={order.client_phone}
            onChange={v => onChange('client_phone', v)}
            placeholder="+7 (___) ___-__-__"
          />
        </FieldRow>
        <FieldRow label="Отстройка">
          <SelectField
            value={order.setup_status}
            onChange={v => onChange('setup_status', v)}
            options={['не отстроен', 'отстроить', 'не отстраивать']}
          />
        </FieldRow>
        <FieldRow label="Филиал">
          <SelectField
            value={order.branch || 'Алматы'}
            onChange={v => onChange('branch', v)}
            options={['Алматы', 'Москва']}
          />
        </FieldRow>
      </TwoCol>
    </FormSection>
  );
}
