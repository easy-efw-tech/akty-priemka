import React from 'react';
import type { RepairOrder } from '../types';
import { GuitarMapStatic } from './GuitarMapStatic';

interface Props {
  order: RepairOrder;
}

function yn(v: boolean | undefined) {
  return v ? 'Да' : 'Нет';
}

function sym(currency?: string) {
  return currency === 'RUB' ? '₽' : '₸';
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ background: '#1f2937', color: '#fff', padding: '5px 10px', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginTop: 10 }}>
      {title.toUpperCase()}
    </div>
  );
}

function Row({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
      {items.map((item, i) => (
        <div key={i} style={{ flex: 1, borderRight: i < items.length - 1 ? '1px solid #e5e7eb' : 'none', padding: '4px 8px', background: '#fafafa' }}>
          <div style={{ fontSize: 8, color: '#9ca3af', marginBottom: 2 }}>{item.label}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#111827', wordBreak: 'break-word' }}>{item.value || '—'}</div>
        </div>
      ))}
    </div>
  );
}


export const DiagnosticsPreview = React.forwardRef<HTMLDivElement, Props>(({ order }, ref) => {
  const s = sym(order.currency);
  const date = order.order_date ? new Date(order.order_date).toLocaleDateString('ru-RU') : '—';
  const total = (order.service_cost || 0) + (order.parts_cost || 0);

  const trussNotes = `Срыв шлица: ${yn(order.truss_slot_damage)} | Крышка: ${yn(order.truss_cover_present)} | Запас 0.5 об.: ${yn(order.truss_reserve)}`;
  const loose = [
    order.tremolo_loose_saddles ? 'Гребенка' : '',
    order.tremolo_loose_locknut ? 'Топлок' : '',
    order.tremolo_loose_posts ? 'Стойки' : '',
  ].filter(Boolean).join(', ');
  const extras = [
    order.neck_binding ? 'Окантовка' : '',
    order.neck_glued ? 'Вклеенный гриф' : '',
    order.neck_lacquered_fretboard ? 'Лак. накладка' : '',
    order.neck_ebony ? 'Черное дерево' : '',
  ].filter(Boolean).join(', ');
  const neckDefects = [
    order.neck_hump ? `Горб (лад №${order.neck_hump_fret || '?'})` : '',
    order.neck_heel_issue ? `Завал/подъем пятки: ${order.neck_heel_direction || ''}` : '',
    order.neck_start_issue ? `Завал/подъем начала: ${order.neck_start_direction || ''}` : '',
  ].filter(Boolean).join('; ');

  return (
    <div
      ref={ref}
      style={{
        width: 794,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 10,
        color: '#111827',
        background: '#fff',
        padding: '24px 28px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>АКТ ДИАГНОСТИКИ И ДЕФЕКТОВКИ</div>
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>Электрогитары / Бас-гитары — ТОО «Гитарная мастерская»</div>
        <div style={{ borderBottom: '2px solid #374151', marginTop: 8 }} />
      </div>

      <Row items={[
        { label: 'Заказ №', value: order.job_number || '—' },
        { label: 'Дата приёма', value: date },
        { label: 'Филиал', value: order.branch || '—' },
        { label: 'Приёмщик', value: order.technician_name || '—' },
      ]} />

      <SectionHeader title="Инструмент и клиент" />
      <Row items={[{ label: 'Модель гитары', value: order.guitar_model }, { label: 'Серийный номер', value: order.serial_number }]} />
      <Row items={[{ label: 'ФИО Заказчика', value: order.client_name }, { label: 'Телефон', value: order.client_phone }]} />
      <Row items={[{ label: 'Email', value: order.client_email }, { label: 'Отстройка', value: order.setup_status }]} />

      <SectionHeader title="Гриф и лады" />
      <Row items={[{ label: 'Состояние ладов', value: order.frets_condition }, { label: 'Решение по ладам', value: order.frets_action }]} />
      <Row items={[{ label: 'Прогиб 1 струна (мм)', value: order.neck_relief_1 }, { label: 'Прогиб 6/7/8 струна (мм)', value: order.neck_relief_6 }]} />
      <Row items={[{ label: 'Решение по прогибу', value: order.neck_relief_action }, { label: 'Направление винта грифа', value: order.truss_screw_direction }]} />
      {order.neck_condition_degree && <Row items={[{ label: 'Степень проблемы', value: order.neck_condition_degree }]} />}
      {neckDefects && <Row items={[{ label: 'Дефекты грифа', value: neckDefects }]} />}
      <Row items={[{ label: 'Анкер', value: trussNotes }]} />
      {order.truss_other_notes && <Row items={[{ label: 'Иное (анкер)', value: order.truss_other_notes }]} />}

      <SectionHeader title="Замена ладов" />
      <Row items={[
        { label: 'Износ (%)', value: String(order.fret_wear_percent || 0) },
        { label: 'Решение', value: order.fret_action },
        { label: 'Профиль', value: order.fret_profile },
        { label: 'Сплав', value: order.fret_alloy },
      ]} />
      {extras && <Row items={[{ label: 'Особенности грифа', value: extras }]} />}

      <SectionHeader title="Электроника" />
      <Row items={[
        { label: 'Потенциометр', value: `${yn(order.pot_issue)} | Кол-во: ${order.pot_quantity || 0} | ${order.pot_position || '—'}` },
        { label: 'Решение (пот.)', value: order.pot_action },
      ]} />
      <Row items={[
        { label: 'Свитч/Джек', value: `${yn(order.switch_jack_issue)} | ${order.switch_jack_notes || '—'}` },
        { label: 'Решение', value: order.switch_jack_action },
      ]} />

      <SectionHeader title="Верхний и нижний порог" />
      <Row items={[
        { label: 'Верхний порог — состояние', value: order.top_nut_condition },
        { label: 'Решение | Материал', value: `${order.top_nut_action}${order.top_nut_material ? ' | ' + order.top_nut_material : ''}` },
      ]} />
      <Row items={[
        { label: 'Нижний порог — состояние', value: order.bottom_nut_condition },
        { label: 'Решение | Материал', value: `${order.bottom_nut_action}${order.bottom_nut_material ? ' | ' + order.bottom_nut_material : ''}` },
      ]} />

      <SectionHeader title="Тремоло" />
      <Row items={[{ label: 'Срыв винтов', value: order.tremolo_screws_damage }, { label: 'Решение (винты)', value: order.tremolo_screws_action }]} />
      <Row items={[
        { label: 'Пружины растянуты', value: `${yn(order.tremolo_springs_stretched)}${order.tremolo_springs_add_qty ? ' | +' + order.tremolo_springs_add_qty + ' шт.' : ''}` },
        { label: 'Решение (пружины)', value: order.tremolo_springs_action },
      ]} />
      <Row items={[{ label: 'Люфты', value: loose || 'Нет' }, { label: 'Решение (люфты)', value: order.tremolo_loose_action }]} />

      <SectionHeader title="Бридж и колки" />
      <Row items={[
        { label: 'Бридж TOM — прогиб', value: `${yn(order.bridge_bend)} | ${order.bridge_action || '—'}` },
        { label: 'Колки — люфт / проскальзывание', value: `${order.tuner_slipping || '—'} / ${order.tuner_play || '—'} | ${order.tuner_action || '—'}` },
      ]} />

      <SectionHeader title="Дополнительно" />
      {order.missing_parts && <Row items={[{ label: 'Отсутствующие детали', value: order.missing_parts }]} />}
      <Row items={[{ label: 'Мин. срок ремонта', value: order.repair_deadline }, { label: 'Струны', value: order.strings_source }]} />
      <Row items={[{ label: 'Запчасти клиента', value: order.client_parts }, { label: 'Запчасти мастерской', value: order.workshop_parts }]} />
      {order.notes && <Row items={[{ label: 'Примечания', value: order.notes }]} />}

      <SectionHeader title="Стоимость" />
      <Row items={[
        { label: `Сумма услуг`, value: `${(order.service_cost || 0).toLocaleString('ru-RU')} ${s}` },
        { label: `Сумма запчастей`, value: `${(order.parts_cost || 0).toLocaleString('ru-RU')} ${s}` },
        { label: `Предоплата`, value: `${(order.prepayment || 0).toLocaleString('ru-RU')} ${s}` },
        { label: `Итого`, value: `${total.toLocaleString('ru-RU')} ${s}` },
      ]} />

      <div style={{ background: '#fffbeb', border: '1px solid #f59e0b', borderRadius: 4, padding: '8px 10px', marginTop: 10, fontSize: 9, color: '#78350f', lineHeight: 1.5 }}>
        Клиент согласен с наличием перечисленных дефектов и стоимостью ремонта, осведомлен о минимальных сроках. Стоимость ремонта может изменяться по обоснованному согласованию с заказчиком. Заказчик ознакомлен, что платное хранение в размере 1% от суммы ремонта за каждый день хранения начинается спустя 10 дней после звонка и/или сообщения о готовности инструмента, если иное не согласовано при приемке.
      </div>

      <div style={{ marginTop: 12, fontSize: 10 }}>
        Заказчик (ФИО): <strong>{order.client_name || '____________________________'}</strong>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 4, padding: '8px', minHeight: 60, background: '#f9fafb' }}>
          <div style={{ fontSize: 8, color: '#9ca3af', marginBottom: 4 }}>Подпись заказчика</div>
          {order.client_signature && <img src={order.client_signature} alt="sig" style={{ maxHeight: 44, maxWidth: '100%' }} />}
        </div>
        <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 4, padding: '8px', minHeight: 60, background: '#f9fafb' }}>
          <div style={{ fontSize: 8, color: '#9ca3af', marginBottom: 4 }}>Подпись приёмщика</div>
          {order.technician_signature && <img src={order.technician_signature} alt="sig" style={{ maxHeight: 44, maxWidth: '100%' }} />}
        </div>
      </div>

      <div style={{ borderTop: '2px solid #374151', marginTop: 20, paddingTop: 14 }}>
        <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>КОСМЕТИЧЕСКОЕ СОСТОЯНИЕ</div>
        <div style={{ fontSize: 9, color: '#6b7280', marginBottom: 6 }}>
          Обозначения: С – скол, П – потертость, Г – грязь, Т – трещина
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: 4, overflow: 'hidden', background: '#f9fafb' }}>
          <GuitarMapStatic defects={order.cosmetic_defects || []} />
        </div>

        {(order.cosmetic_photos || []).length > 0 && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Фото дефектов ({order.cosmetic_photos.length}):
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {order.cosmetic_photos.map((photo, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img
                    src={photo}
                    alt={`Фото ${i + 1}`}
                    style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 4, border: '1px solid #e5e7eb', display: 'block' }}
                  />
                  <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.55)', color: '#fff', fontSize: 8, padding: '1px 4px', borderRadius: 3 }}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
          <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 4, padding: '8px', minHeight: 50, background: '#f9fafb' }}>
            <div style={{ fontSize: 8, color: '#9ca3af', marginBottom: 4 }}>Подпись заказчика</div>
            {order.client_signature && <img src={order.client_signature} alt="sig" style={{ maxHeight: 36, maxWidth: '100%' }} />}
          </div>
          <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 4, padding: '8px', minHeight: 50, background: '#f9fafb' }}>
            <div style={{ fontSize: 8, color: '#9ca3af', marginBottom: 4 }}>Подпись приёмщика</div>
            {order.technician_signature && <img src={order.technician_signature} alt="sig" style={{ maxHeight: 36, maxWidth: '100%' }} />}
          </div>
        </div>
      </div>
    </div>
  );
});

DiagnosticsPreview.displayName = 'DiagnosticsPreview';
