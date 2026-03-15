import React from 'react';
import { FormSection, FieldRow, SelectField, TextField, NumberField, CheckboxField, TwoCol } from '../ui/FormSection';
import { Settings } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

export function TremoloSection({ order, onChange }: Props) {
  return (
    <FormSection title="Тремоло" icon={<Settings size={16} />}>
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Винты</h3>
        <TwoCol>
          <FieldRow label="Срыв (описание)">
            <TextField
              value={order.tremolo_screws_damage}
              onChange={v => onChange('tremolo_screws_damage', v)}
              placeholder="Какие винты..."
            />
          </FieldRow>
          <FieldRow label="Решение">
            <TextField
              value={order.tremolo_screws_action}
              onChange={v => onChange('tremolo_screws_action', v)}
              placeholder="Замена каких винтов..."
            />
          </FieldRow>
        </TwoCol>
      </div>

      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Пружины</h3>
        <CheckboxField
          label="Пружины растянуты"
          checked={order.tremolo_springs_stretched}
          onChange={v => onChange('tremolo_springs_stretched', v)}
        />
        {order.tremolo_springs_stretched && (
          <div className="mt-3">
            <TwoCol>
              <FieldRow label="Решение">
                <SelectField
                  value={order.tremolo_springs_action}
                  onChange={v => onChange('tremolo_springs_action', v)}
                  options={['замена', 'добавить']}
                  placeholder="Выберите..."
                />
              </FieldRow>
              {order.tremolo_springs_action === 'добавить' && (
                <FieldRow label="Количество пружин">
                  <NumberField
                    value={order.tremolo_springs_add_qty}
                    onChange={v => onChange('tremolo_springs_add_qty', v)}
                    placeholder="0"
                    min={0}
                  />
                </FieldRow>
              )}
            </TwoCol>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Люфты</h3>
        <div className="flex flex-wrap gap-3 mb-3">
          <CheckboxField
            label="Гребенка"
            checked={order.tremolo_loose_saddles}
            onChange={v => onChange('tremolo_loose_saddles', v)}
          />
          <CheckboxField
            label="Топлок"
            checked={order.tremolo_loose_locknut}
            onChange={v => onChange('tremolo_loose_locknut', v)}
          />
          <CheckboxField
            label="Стойки"
            checked={order.tremolo_loose_posts}
            onChange={v => onChange('tremolo_loose_posts', v)}
          />
        </div>
        {(order.tremolo_loose_saddles || order.tremolo_loose_locknut || order.tremolo_loose_posts) && (
          <FieldRow label="Решение по люфтам">
            <TextField
              value={order.tremolo_loose_action}
              onChange={v => onChange('tremolo_loose_action', v)}
              placeholder="Замена/вклеить..."
            />
          </FieldRow>
        )}
      </div>
    </FormSection>
  );
}
