import React from 'react';
import type { RepairOrder, AvrItem } from '../types';

interface Props {
  order: RepairOrder;
  items: AvrItem[];
  avrDate: string;
}

function sym(currency?: string) {
  return currency === 'RUB' ? '₽' : '₸';
}

function Row({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
      {items.map((item, i) => (
        <div key={i} style={{ flex: 1, borderRight: i < items.length - 1 ? '1px solid #e5e7eb' : 'none', padding: '4px 8px', background: '#fafafa' }}>
          <div style={{ fontSize: 8, color: '#9ca3af', marginBottom: 2 }}>{item.label}</div>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#111827' }}>{item.value || '—'}</div>
        </div>
      ))}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ background: '#1f2937', color: '#fff', padding: '5px 10px', fontSize: 11, fontWeight: 700, letterSpacing: 1, marginTop: 10 }}>
      {title.toUpperCase()}
    </div>
  );
}

export const AvrPreview = React.forwardRef<HTMLDivElement, Props>(({ order, items, avrDate }, ref) => {
  const s = sym(order.currency);
  const date = avrDate ? new Date(avrDate).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU');
  const total = items.reduce((sum, item) => sum + (item.price || 0), 0);

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
        <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: 1 }}>АКТ ВЫПОЛНЕННЫХ РАБОТ</div>
        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>ТОО «Гитарная мастерская»</div>
        <div style={{ borderBottom: '2px solid #374151', marginTop: 8 }} />
      </div>

      <Row items={[
        { label: 'Заказ №', value: order.job_number || '—' },
        { label: 'Дата составления', value: date },
        { label: 'Филиал', value: order.branch || '—' },
      ]} />

      <SectionHeader title="Исполнитель и заказчик" />
      <Row items={[{ label: 'Исполнитель', value: order.technician_name }, { label: 'Заказчик', value: order.client_name }]} />
      <Row items={[{ label: 'Наименование инструмента', value: order.guitar_model }, { label: 'Серийный номер', value: order.serial_number }]} />

      <SectionHeader title="Выполненные работы и услуги" />

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 0 }}>
        <thead>
          <tr style={{ background: '#e5e7eb' }}>
            <th style={{ border: '1px solid #d1d5db', padding: '6px 8px', width: 32, fontSize: 10, textAlign: 'center' }}>№</th>
            <th style={{ border: '1px solid #d1d5db', padding: '6px 8px', fontSize: 10, textAlign: 'left' }}>Наименование работы / услуги / расходника</th>
            <th style={{ border: '1px solid #d1d5db', padding: '6px 8px', width: 120, fontSize: 10, textAlign: 'right' }}>Стоимость</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={item.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
              <td style={{ border: '1px solid #e5e7eb', padding: '6px 8px', textAlign: 'center', fontSize: 10, color: '#6b7280' }}>{i + 1}</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '6px 8px', fontSize: 10 }}>{item.description || '—'}</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '6px 8px', textAlign: 'right', fontSize: 10, fontWeight: 600 }}>
                {(item.price || 0).toLocaleString('ru-RU')} {s}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr style={{ background: '#fef3c7' }}>
            <td colSpan={2} style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', fontSize: 11, fontWeight: 800 }}>ИТОГО:</td>
            <td style={{ border: '1px solid #d1d5db', padding: '8px', textAlign: 'right', fontSize: 12, fontWeight: 800, color: '#92400e' }}>
              {total.toLocaleString('ru-RU')} {s}
            </td>
          </tr>
        </tfoot>
      </table>

      <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 4, padding: '10px 12px', marginTop: 14, fontSize: 10, color: '#14532d', lineHeight: 1.6 }}>
        Вышеперечисленные работы (услуги) выполнены полностью. Заказчик претензий по объему и качеству оказания услуг не имеет.
      </div>

      <div style={{ marginTop: 14, fontSize: 10 }}>
        Дата: <strong>{date}</strong>
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 4, padding: '10px', minHeight: 70, background: '#f9fafb' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Исполнитель:</div>
          <div style={{ fontSize: 9, color: '#9ca3af', marginBottom: 4 }}>Подпись</div>
          {order.avr_technician_signature && (
            <img src={order.avr_technician_signature} alt="sig" style={{ maxHeight: 40, maxWidth: '100%', display: 'block' }} />
          )}
          <div style={{ marginTop: 8, borderTop: '1px solid #d1d5db', paddingTop: 4, fontSize: 10 }}>{order.technician_name || '___________________'}</div>
        </div>
        <div style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 4, padding: '10px', minHeight: 70, background: '#f9fafb' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Заказчик:</div>
          <div style={{ fontSize: 9, color: '#9ca3af', marginBottom: 4 }}>Подпись</div>
          {order.avr_client_signature && (
            <img src={order.avr_client_signature} alt="sig" style={{ maxHeight: 40, maxWidth: '100%', display: 'block' }} />
          )}
          <div style={{ marginTop: 8, borderTop: '1px solid #d1d5db', paddingTop: 4, fontSize: 10 }}>{order.client_name || '___________________'}</div>
        </div>
      </div>
    </div>
  );
});

AvrPreview.displayName = 'AvrPreview';
