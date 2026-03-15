import React from 'react';
import { FormSection, FieldRow, SelectField, TextField, NumberField, CheckboxField, TwoCol } from '../ui/FormSection';
import { Zap } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

export function ElectronicsSection({ order, onChange }: Props) {
  return (
    <FormSection title="Электроника" icon={<Zap size={16} />}>
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Потенциометры</h3>
        <CheckboxField
          label="Неисправность потенциометра"
          checked={order.pot_issue}
          onChange={v => onChange('pot_issue', v)}
        />
        {order.pot_issue && (
          <div className="mt-3 space-y-3">
            <TwoCol>
              <FieldRow label="Количество">
                <NumberField
                  value={order.pot_quantity}
                  onChange={v => onChange('pot_quantity', v)}
                  placeholder="0"
                  min={0}
                />
              </FieldRow>
              <FieldRow label="Решение">
                <SelectField
                  value={order.pot_action}
                  onChange={v => onChange('pot_action', v)}
                  options={['замена', 'не менять']}
                />
              </FieldRow>
            </TwoCol>
            <FieldRow label="Положение в схеме">
              <TextField
                value={order.pot_position}
                onChange={v => onChange('pot_position', v)}
                placeholder="Например: Volume #1, Tone #2..."
              />
            </FieldRow>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Свитч / Джек</h3>
        <CheckboxField
          label="Неисправность свитча/джека"
          checked={order.switch_jack_issue}
          onChange={v => onChange('switch_jack_issue', v)}
        />
        {order.switch_jack_issue && (
          <div className="mt-3 space-y-3">
            <FieldRow label="Описание неисправности">
              <TextField
                value={order.switch_jack_notes}
                onChange={v => onChange('switch_jack_notes', v)}
                placeholder="Описание проблемы..."
              />
            </FieldRow>
            <FieldRow label="Решение">
              <SelectField
                value={order.switch_jack_action}
                onChange={v => onChange('switch_jack_action', v)}
                options={['замена', 'не менять']}
              />
            </FieldRow>
          </div>
        )}
      </div>
    </FormSection>
  );
}
