import React from 'react';
import { FormSection, FieldRow, SelectField, TwoCol } from '../ui/FormSection';
import { AlignCenter } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

const NUT_CONDITIONS = ['дребезг открытых струн', 'струны высоко', 'оптимальная высота'];
const NUT_MATERIALS = ['кость', 'пластик', 'латунь', 'граф-тек'];

function NutSubSection({
  title,
  condition,
  action,
  material,
  actionOptions,
  onConditionChange,
  onActionChange,
  onMaterialChange,
}: {
  title: string;
  condition: string;
  action: string;
  material: string;
  actionOptions: string[];
  onConditionChange: (v: string) => void;
  onActionChange: (v: string) => void;
  onMaterialChange: (v: string) => void;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-600 mb-3">{title}</h3>
      <div className="space-y-3">
        <FieldRow label="Состояние">
          <SelectField
            value={condition}
            onChange={onConditionChange}
            options={NUT_CONDITIONS}
            placeholder="Выберите состояние..."
          />
        </FieldRow>
        <TwoCol>
          <FieldRow label="Решение">
            <SelectField
              value={action}
              onChange={onActionChange}
              options={actionOptions}
              placeholder="Выберите решение..."
            />
          </FieldRow>
          {(action === 'замена порога' || action.startsWith('замена')) && (
            <FieldRow label="Материал порога">
              <SelectField
                value={material}
                onChange={onMaterialChange}
                options={NUT_MATERIALS}
                placeholder="Выберите материал..."
              />
            </FieldRow>
          )}
        </TwoCol>
      </div>
    </div>
  );
}

export function NutSection({ order, onChange }: Props) {
  const topActions = ['замена порога', 'отрегулировать высоту', 'нет ремонта', 'правка посадочного паза'];
  const bottomActions = ['замена порога', 'отрегулировать высоту', 'нет ремонта'];

  return (
    <FormSection title="Порог" icon={<AlignCenter size={16} />}>
      <NutSubSection
        title="Верхний порог"
        condition={order.top_nut_condition}
        action={order.top_nut_action}
        material={order.top_nut_material}
        actionOptions={topActions}
        onConditionChange={v => onChange('top_nut_condition', v)}
        onActionChange={v => onChange('top_nut_action', v)}
        onMaterialChange={v => onChange('top_nut_material', v)}
      />
      <NutSubSection
        title="Нижний порог"
        condition={order.bottom_nut_condition}
        action={order.bottom_nut_action}
        material={order.bottom_nut_material}
        actionOptions={bottomActions}
        onConditionChange={v => onChange('bottom_nut_condition', v)}
        onActionChange={v => onChange('bottom_nut_action', v)}
        onMaterialChange={v => onChange('bottom_nut_material', v)}
      />
    </FormSection>
  );
}
