import React from 'react';
import { FormSection, FieldRow, SelectField, TextField, NumberField, CheckboxField, TextArea, TwoCol } from '../ui/FormSection';
import { Guitar } from 'lucide-react';
import type { RepairOrder } from '../../types';

interface Props {
  order: RepairOrder;
  onChange: (field: keyof RepairOrder, value: unknown) => void;
}

export function NeckSection({ order, onChange }: Props) {
  return (
    <FormSection title="Гриф" icon={<Guitar size={16} />}>
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Лады</h3>
        <TwoCol>
          <FieldRow label="Состояние ладов">
            <SelectField
              value={order.frets_condition}
              onChange={v => onChange('frets_condition', v)}
              options={['не в плоскости', 'в норме']}
              placeholder="Выберите..."
            />
          </FieldRow>
          <FieldRow label="Решение по ладам">
            <SelectField
              value={order.frets_action}
              onChange={v => onChange('frets_action', v)}
              options={['отшлифовать верхушки', 'торцовка', 'нет']}
            />
          </FieldRow>
        </TwoCol>
      </div>

      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Прогиб грифа</h3>
        <TwoCol>
          <FieldRow label="1 струна (мм)">
            <TextField
              value={order.neck_relief_1}
              onChange={v => onChange('neck_relief_1', v)}
              placeholder="0.00"
            />
          </FieldRow>
          <FieldRow label="6/7/8 струна (мм)">
            <TextField
              value={order.neck_relief_6}
              onChange={v => onChange('neck_relief_6', v)}
              placeholder="0.00"
            />
          </FieldRow>
        </TwoCol>
        <FieldRow label="Решение по прогибу" className="mt-3">
          <SelectField
            value={order.neck_relief_action}
            onChange={v => onChange('neck_relief_action', v)}
            options={[
              'правка ладами',
              'правка геометрии накладки',
              'отогрев накладки',
              'не править',
            ]}
            placeholder="Выберите решение..."
          />
        </FieldRow>
        <FieldRow label="Направление винта грифа" className="mt-3">
          <SelectField
            value={order.truss_screw_direction}
            onChange={v => onChange('truss_screw_direction', v)}
            options={['влево', 'вправо', 'нет']}
            placeholder="Выберите..."
          />
        </FieldRow>
        <FieldRow label="Степень проблемы" className="mt-3">
          <SelectField
            value={order.neck_condition_degree}
            onChange={v => onChange('neck_condition_degree', v)}
            options={['поправимо ладами', 'нужна замена ладов']}
            placeholder="Выберите степень..."
          />
        </FieldRow>
      </div>

      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Дефекты грифа</h3>
        <div className="space-y-3">
          <CheckboxField
            label="Горб"
            checked={order.neck_hump}
            onChange={v => onChange('neck_hump', v)}
          />
          {order.neck_hump && (
            <FieldRow label="Центральный лад №">
              <TextField
                value={order.neck_hump_fret}
                onChange={v => onChange('neck_hump_fret', v)}
                placeholder="Номер лада"
                className="max-w-xs"
              />
            </FieldRow>
          )}
          <CheckboxField
            label="Завал/подъем пятки грифа"
            checked={order.neck_heel_issue}
            onChange={v => onChange('neck_heel_issue', v)}
          />
          {order.neck_heel_issue && (
            <FieldRow label="Тип дефекта пятки">
              <SelectField
                value={order.neck_heel_direction}
                onChange={v => onChange('neck_heel_direction', v)}
                options={['завал', 'подъем']}
                placeholder="Выберите..."
              />
            </FieldRow>
          )}
          <CheckboxField
            label="Завал/подъем начала грифа"
            checked={order.neck_start_issue}
            onChange={v => onChange('neck_start_issue', v)}
          />
          {order.neck_start_issue && (
            <FieldRow label="Тип дефекта начала">
              <SelectField
                value={order.neck_start_direction}
                onChange={v => onChange('neck_start_direction', v)}
                options={['завал', 'подъем']}
                placeholder="Выберите..."
              />
            </FieldRow>
          )}
        </div>
      </div>

      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Анкер</h3>
        <div className="space-y-2">
          <CheckboxField
            label="Срыв шлица гайки"
            checked={order.truss_slot_damage}
            onChange={v => onChange('truss_slot_damage', v)}
          />
          <CheckboxField
            label="Наличие крышки"
            checked={order.truss_cover_present}
            onChange={v => onChange('truss_cover_present', v)}
          />
          <CheckboxField
            label="Есть запас 0.5 оборота"
            checked={order.truss_reserve}
            onChange={v => onChange('truss_reserve', v)}
          />
        </div>
        <FieldRow label="Иное" className="mt-3">
          <TextArea
            value={order.truss_other_notes}
            onChange={v => onChange('truss_other_notes', v)}
            placeholder="Дополнительные заметки по анкеру..."
            rows={2}
          />
        </FieldRow>
      </div>

      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Замена ладов</h3>
        <TwoCol>
          <FieldRow label="Износ ладов (%)">
            <NumberField
              value={order.fret_wear_percent}
              onChange={v => onChange('fret_wear_percent', v)}
              placeholder="0"
              min={0}
              max={100}
            />
          </FieldRow>
          <FieldRow label="Решение">
            <SelectField
              value={order.fret_action}
              onChange={v => onChange('fret_action', v)}
              options={['замена ладов', 'не менять']}
            />
          </FieldRow>
          <FieldRow label="Профиль ладов">
            <TextField
              value={order.fret_profile}
              onChange={v => onChange('fret_profile', v)}
              placeholder="Например: 6105"
            />
          </FieldRow>
          <FieldRow label="Сплав ладов">
            <SelectField
              value={order.fret_alloy}
              onChange={v => onChange('fret_alloy', v)}
              options={['нейзильбер', 'сталь', 'бронза']}
            />
          </FieldRow>
        </TwoCol>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Особенности</h3>
        <div className="grid grid-cols-2 gap-2">
          <CheckboxField
            label="Окантовка"
            checked={order.neck_binding}
            onChange={v => onChange('neck_binding', v)}
          />
          <CheckboxField
            label="Вклеенный гриф"
            checked={order.neck_glued}
            onChange={v => onChange('neck_glued', v)}
          />
          <CheckboxField
            label="Лакированная накладка"
            checked={order.neck_lacquered_fretboard}
            onChange={v => onChange('neck_lacquered_fretboard', v)}
          />
          <CheckboxField
            label="Черное дерево"
            checked={order.neck_ebony}
            onChange={v => onChange('neck_ebony', v)}
          />
        </div>
      </div>
    </FormSection>
  );
}
