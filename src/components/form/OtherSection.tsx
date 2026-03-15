import React from 'react';
import { FormSection, FieldRow, SelectField, TextField, TextArea, TwoCol } from '../ui/FormSection';
import { FileText } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

export function OtherSection({ order, onChange }: Props) {
  return (
    <FormSection title="Прочее" icon={<FileText size={16} />}>
      <TwoCol>
        <FieldRow label="Отсутствующие детали">
          <TextField
            value={order.missing_parts}
            onChange={v => onChange('missing_parts', v)}
            placeholder="Перечислите отсутствующие детали"
          />
        </FieldRow>
        <FieldRow label="Минимальный срок ремонта">
          <TextField
            value={order.repair_deadline}
            onChange={v => onChange('repair_deadline', v)}
            placeholder="Например: 5 рабочих дней"
          />
        </FieldRow>
        <FieldRow label="Струны">
          <SelectField
            value={order.strings_source}
            onChange={v => onChange('strings_source', v)}
            options={['мастерская', 'клиент']}
          />
        </FieldRow>
      </TwoCol>
      <TwoCol>
        <FieldRow label="Запчасти клиента">
          <TextArea
            value={order.client_parts}
            onChange={v => onChange('client_parts', v)}
            placeholder="Перечислите запчасти клиента..."
            rows={2}
          />
        </FieldRow>
        <FieldRow label="Запчасти мастерской">
          <TextArea
            value={order.workshop_parts}
            onChange={v => onChange('workshop_parts', v)}
            placeholder="Перечислите запчасти мастерской..."
            rows={2}
          />
        </FieldRow>
      </TwoCol>
      <FieldRow label="Примечания">
        <TextArea
          value={order.notes}
          onChange={v => onChange('notes', v)}
          placeholder="Дополнительные замечания и пожелания клиента..."
          rows={4}
        />
      </FieldRow>
    </FormSection>
  );
}
