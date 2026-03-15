import React from 'react';
import { FormSection, FieldRow, SelectField, TextField, CheckboxField, TwoCol } from '../ui/FormSection';
import { Music, RotateCcw } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

export function BridgeSection({ order, onChange }: Props) {
  return (
    <FormSection title="Бридж TOM" icon={<RotateCcw size={16} />}>
      <div className="space-y-3">
        <CheckboxField
          label="Прогиб бриджа"
          checked={order.bridge_bend}
          onChange={v => onChange('bridge_bend', v)}
        />
        {order.bridge_bend && (
          <FieldRow label="Решение">
            <SelectField
              value={order.bridge_action}
              onChange={v => onChange('bridge_action', v)}
              options={['выправление', 'замена']}
              placeholder="Выберите решение..."
            />
          </FieldRow>
        )}
      </div>
    </FormSection>
  );
}

export function TunersSection({ order, onChange }: Props) {
  return (
    <FormSection title="Колки" icon={<Music size={16} />}>
      <div className="space-y-3">
        <TwoCol>
          <FieldRow label="Проскальзывание (колок №)">
            <TextField
              value={order.tuner_slipping}
              onChange={v => onChange('tuner_slipping', v)}
              placeholder="Например: 1, 3, 6"
            />
          </FieldRow>
          <FieldRow label="Люфт (колок №)">
            <TextField
              value={order.tuner_play}
              onChange={v => onChange('tuner_play', v)}
              placeholder="Например: 2, 4"
            />
          </FieldRow>
        </TwoCol>
        {(order.tuner_slipping || order.tuner_play) && (
          <FieldRow label="Решение">
            <SelectField
              value={order.tuner_action}
              onChange={v => onChange('tuner_action', v)}
              options={['замена', 'не менять']}
            />
          </FieldRow>
        )}
      </div>
    </FormSection>
  );
}
