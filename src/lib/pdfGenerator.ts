import jsPDF from 'jspdf';
import type { RepairOrder, AvrItem, Organization } from '../types';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 12;
const CONTENT_W = PAGE_W - MARGIN * 2;

function checkPageBreak(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - MARGIN) {
    doc.addPage();
    return MARGIN;
  }
  return y;
}

function sectionHeader(doc: jsPDF, y: number, title: string): number {
  doc.setFillColor(40, 40, 40);
  doc.rect(MARGIN, y, CONTENT_W, 6.5, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), MARGIN + 2, y + 4.5);
  doc.setTextColor(0, 0, 0);
  return y + 6.5;
}

function drawLabelValue(doc: jsPDF, x: number, y: number, w: number, h: number, label: string, value: string) {
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(200, 200, 200);
  doc.rect(x, y, w, h, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(label, x + 1.5, y + 3.5);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  const lines = doc.splitTextToSize(value || '—', w - 3);
  doc.text(lines[0] || '—', x + 1.5, y + 7);
  doc.setTextColor(0, 0, 0);
}

function infoRow(doc: jsPDF, y: number, items: { label: string; value: string }[], cellH = 12): number {
  const cellW = CONTENT_W / items.length;
  items.forEach((item, i) => {
    drawLabelValue(doc, MARGIN + i * cellW, y, cellW, cellH, item.label, item.value);
  });
  return y + cellH;
}

function twoCol(doc: jsPDF, y: number, left: { label: string; value: string }, right: { label: string; value: string }, h = 11): number {
  const half = CONTENT_W / 2;
  drawLabelValue(doc, MARGIN, y, half, h, left.label, left.value);
  drawLabelValue(doc, MARGIN + half, y, half, h, right.label, right.value);
  return y + h;
}

function yesNo(val: boolean | undefined) {
  return val ? 'Да' : 'Нет';
}

function sym(currency?: string) {
  return currency === 'RUB' ? '₽' : '₸';
}

export function generateDiagnosticsPDF(order: RepairOrder): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('helvetica');
  doc.setDrawColor(200, 200, 200);

  let y = MARGIN;

  const org: Organization | undefined = order.organization;

  if (org) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(org.name || org.short_name, MARGIN, y + 5);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const orgMeta: string[] = [];
    if (org.bin_inn) orgMeta.push(`БИН/ИНН: ${org.bin_inn}`);
    if (org.address) orgMeta.push(org.address);
    if (org.phone) orgMeta.push(org.phone);
    if (orgMeta.length) {
      doc.text(orgMeta.join('   |   '), MARGIN, y + 10);
    }
    doc.setTextColor(0, 0, 0);
    y += 14;

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
    doc.setLineWidth(0.2);
    y += 4;
  }

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('АКТ ДИАГНОСТИКИ И ДЕФЕКТОВКИ', PAGE_W / 2, y + 5, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Электрогитары / Бас-гитары', PAGE_W / 2, y + 10, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 14;

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  doc.setLineWidth(0.2);
  y += 4;

  const dateFormatted = order.order_date ? new Date(order.order_date).toLocaleDateString('ru-RU') : '—';
  y = infoRow(doc, y, [
    { label: 'Заказ №', value: order.job_number || '—' },
    { label: 'Дата приёма', value: dateFormatted },
    { label: 'Филиал', value: order.branch || '—' },
    { label: 'Приёмщик', value: order.technician_name || '—' },
  ], 13);

  y += 2;
  y = sectionHeader(doc, y, 'Инструмент и клиент');
  y = twoCol(doc, y, { label: 'Модель гитары', value: order.guitar_model || '—' }, { label: 'Серийный номер', value: order.serial_number || '—' });
  y = twoCol(doc, y, { label: 'ФИО Заказчика', value: order.client_name || '—' }, { label: 'Телефон', value: order.client_phone || '—' });
  y = twoCol(doc, y, { label: 'Email', value: order.client_email || '—' }, { label: 'Отстройка', value: order.setup_status || '—' });

  y += 2;
  y = sectionHeader(doc, y, 'Гриф и лады');
  y = twoCol(doc, y, { label: 'Состояние ладов', value: order.frets_condition || '—' }, { label: 'Решение по ладам', value: order.frets_action || '—' });
  y = twoCol(doc, y, { label: 'Прогиб 1 струна (мм)', value: order.neck_relief_1 || '—' }, { label: 'Прогиб 6/7/8 струна (мм)', value: order.neck_relief_6 || '—' });
  y = twoCol(doc, y, { label: 'Решение по прогибу', value: order.neck_relief_action || '—' }, { label: 'Направление винта грифа', value: order.truss_screw_direction || '—' });
  if (order.neck_condition_degree) {
    y = infoRow(doc, y, [{ label: 'Степень проблемы', value: order.neck_condition_degree }]);
  }
  const defects = [
    order.neck_hump ? `Горб (лад № ${order.neck_hump_fret || '?'})` : '',
    order.neck_heel_issue ? `Завал/подъем пятки: ${order.neck_heel_direction || ''}` : '',
    order.neck_start_issue ? `Завал/подъем начала: ${order.neck_start_direction || ''}` : '',
  ].filter(Boolean).join('; ');
  if (defects) {
    y = infoRow(doc, y, [{ label: 'Дефекты грифа', value: defects }]);
  }
  const trussNotes = [
    `Срыв шлица: ${yesNo(order.truss_slot_damage)}`,
    `Крышка: ${yesNo(order.truss_cover_present)}`,
    `Запас 0.5 об.: ${yesNo(order.truss_reserve)}`,
  ].join('  |  ');
  y = infoRow(doc, y, [{ label: 'Анкер', value: trussNotes }]);
  if (order.truss_other_notes) {
    y = infoRow(doc, y, [{ label: 'Иное (анкер)', value: order.truss_other_notes }]);
  }

  y += 2;
  y = sectionHeader(doc, y, 'Замена ладов');
  y = infoRow(doc, y, [
    { label: 'Износ (%)', value: String(order.fret_wear_percent || 0) },
    { label: 'Решение', value: order.fret_action || '—' },
    { label: 'Профиль', value: order.fret_profile || '—' },
    { label: 'Сплав', value: order.fret_alloy || '—' },
  ]);
  const extras = [
    order.neck_binding ? 'Окантовка' : '',
    order.neck_glued ? 'Вклеенный гриф' : '',
    order.neck_lacquered_fretboard ? 'Лак. накладка' : '',
    order.neck_ebony ? 'Черное дерево' : '',
  ].filter(Boolean).join(', ');
  if (extras) {
    y = infoRow(doc, y, [{ label: 'Особенности грифа', value: extras }]);
  }

  y += 2;
  y = checkPageBreak(doc, y, 6.5 + 11 + 11 + 2);
  y = sectionHeader(doc, y, 'Электроника');
  y = twoCol(doc, y,
    { label: 'Потенциометр', value: `${yesNo(order.pot_issue)} | Кол-во: ${order.pot_quantity || 0} | ${order.pot_position || '—'}` },
    { label: 'Решение (пот.)', value: order.pot_action || '—' }
  );
  y = twoCol(doc, y,
    { label: 'Свитч/Джек', value: `${yesNo(order.switch_jack_issue)} | ${order.switch_jack_notes || '—'}` },
    { label: 'Решение (свитч/джек)', value: order.switch_jack_action || '—' }
  );

  y += 2;
  y = checkPageBreak(doc, y, 6.5 + 11 + 11 + 2);
  y = sectionHeader(doc, y, 'Верхний и нижний порог');
  y = twoCol(doc, y,
    { label: 'Верхний порог — состояние', value: order.top_nut_condition || '—' },
    { label: 'Решение | Материал', value: `${order.top_nut_action || '—'}${order.top_nut_material ? ' | ' + order.top_nut_material : ''}` }
  );
  y = twoCol(doc, y,
    { label: 'Нижний порог — состояние', value: order.bottom_nut_condition || '—' },
    { label: 'Решение | Материал', value: `${order.bottom_nut_action || '—'}${order.bottom_nut_material ? ' | ' + order.bottom_nut_material : ''}` }
  );

  y += 2;
  y = checkPageBreak(doc, y, 6.5 + 11 + 11 + 11 + 2);
  y = sectionHeader(doc, y, 'Тремоло');
  y = twoCol(doc, y,
    { label: 'Срыв винтов', value: order.tremolo_screws_damage || '—' },
    { label: 'Решение (винты)', value: order.tremolo_screws_action || '—' }
  );
  y = twoCol(doc, y,
    { label: 'Пружины растянуты', value: `${yesNo(order.tremolo_springs_stretched)}${order.tremolo_springs_add_qty ? ' | +' + order.tremolo_springs_add_qty + ' шт.' : ''}` },
    { label: 'Решение (пружины)', value: order.tremolo_springs_action || '—' }
  );
  const loose = [
    order.tremolo_loose_saddles ? 'Гребенка' : '',
    order.tremolo_loose_locknut ? 'Топлок' : '',
    order.tremolo_loose_posts ? 'Стойки' : '',
  ].filter(Boolean).join(', ');
  y = twoCol(doc, y,
    { label: 'Люфты', value: loose || 'Нет' },
    { label: 'Решение (люфты)', value: order.tremolo_loose_action || '—' }
  );

  y += 2;
  y = checkPageBreak(doc, y, 6.5 + 11 + 2);
  y = sectionHeader(doc, y, 'Бридж и колки');
  y = twoCol(doc, y,
    { label: 'Бридж TOM — прогиб', value: `${yesNo(order.bridge_bend)} | ${order.bridge_action || '—'}` },
    { label: 'Колки — люфт/проскальзывание', value: `${order.tuner_slipping || '—'} / ${order.tuner_play || '—'} | ${order.tuner_action || '—'}` }
  );

  let additionalSectionH = 6.5;
  if (order.missing_parts) additionalSectionH += 12;
  additionalSectionH += 11;
  additionalSectionH += 11;
  if (order.notes) additionalSectionH += 14;
  additionalSectionH += 4;

  y += 2;
  y = checkPageBreak(doc, y, additionalSectionH);
  y = sectionHeader(doc, y, 'Дополнительно');
  if (order.missing_parts) {
    y = infoRow(doc, y, [{ label: 'Отсутствующие детали', value: order.missing_parts }]);
  }
  y = twoCol(doc, y,
    { label: 'Мин. срок ремонта', value: order.repair_deadline || '—' },
    { label: 'Струны', value: order.strings_source || '—' }
  );
  y = twoCol(doc, y,
    { label: 'Запчасти клиента', value: order.client_parts || '—' },
    { label: 'Запчасти мастерской', value: order.workshop_parts || '—' }
  );
  if (order.notes) {
    y = infoRow(doc, y, [{ label: 'Примечания', value: order.notes }], 14);
  }

  y += 2;
  y = checkPageBreak(doc, y, 6.5 + 13 + 2);
  y = sectionHeader(doc, y, 'Стоимость');
  const s = sym(order.currency);
  y = infoRow(doc, y, [
    { label: `Сумма услуг (${s})`, value: (order.service_cost || 0).toLocaleString('ru-RU') + ` ${s}` },
    { label: `Сумма запчастей (${s})`, value: (order.parts_cost || 0).toLocaleString('ru-RU') + ` ${s}` },
    { label: `Предоплата (${s})`, value: (order.prepayment || 0).toLocaleString('ru-RU') + ` ${s}` },
    { label: `Итого (${s})`, value: ((order.service_cost || 0) + (order.parts_cost || 0)).toLocaleString('ru-RU') + ` ${s}` },
  ]);

  y += 2;
  y = checkPageBreak(doc, y, 6.5 + 28 + 8 + 28);
  y = sectionHeader(doc, y, 'Согласие заказчика');
  const agreementText1 = 'Клиент согласен с наличием перечисленных дефектов и стоимостью ремонта, осведомлен о минимальных сроках. Стоимость ремонта может изменяться по обоснованному согласованию с заказчиком.';
  const agreementText2 = 'Заказчик ознакомлен, что платное хранение в размере 1% от суммы ремонта за каждый день хранения начинается спустя 10 дней после звонка и/или сообщения о готовности инструмента, если иное не согласовано при приемке.';
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  const lines1 = doc.splitTextToSize(agreementText1, CONTENT_W - 4);
  const lines2 = doc.splitTextToSize(agreementText2, CONTENT_W - 4);
  const totalAgrLines = lines1.length + lines2.length;
  const agrH = totalAgrLines * 3.4 + 6;
  doc.setFillColor(255, 252, 235);
  doc.setDrawColor(210, 190, 100);
  doc.rect(MARGIN, y, CONTENT_W, agrH, 'FD');
  doc.setTextColor(80, 60, 0);
  doc.text(lines1, MARGIN + 2, y + 4);
  doc.text(lines2, MARGIN + 2, y + 4 + lines1.length * 3.4);
  doc.setTextColor(0, 0, 0);
  y += agrH + 3;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Заказчик (ФИО): ${order.client_name || '____________________________'}`, MARGIN, y + 4);
  y += 8;

  const sigW = CONTENT_W / 2 - 4;
  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(200, 200, 200);
  doc.rect(MARGIN, y, sigW, 24, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Подпись заказчика', MARGIN + 2, y + 4);
  doc.setTextColor(0, 0, 0);
  if (order.client_signature) {
    try { doc.addImage(order.client_signature, 'PNG', MARGIN + 2, y + 6, sigW - 4, 16); } catch { }
  }

  doc.setFillColor(248, 248, 248);
  doc.rect(MARGIN + sigW + 8, y, sigW, 24, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Подпись приёмщика', MARGIN + sigW + 10, y + 4);
  doc.setTextColor(0, 0, 0);
  if (order.technician_signature) {
    try { doc.addImage(order.technician_signature, 'PNG', MARGIN + sigW + 10, y + 6, sigW - 4, 16); } catch { }
  }
  y += 28;

  doc.addPage();
  y = MARGIN;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('КОСМЕТИЧЕСКОЕ СОСТОЯНИЕ', PAGE_W / 2, y + 5, { align: 'center' });
  y += 10;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text('Обозначения: С – скол, П – потертость, Г – грязь, Т – трещина', MARGIN, y);
  doc.setTextColor(0, 0, 0);
  y += 5;

  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(180, 180, 180);
  doc.rect(MARGIN, y, CONTENT_W, 90, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text('[схема гитары]', PAGE_W / 2, y + 45, { align: 'center' });
  doc.setTextColor(0, 0, 0);

  const cosDefects = order.cosmetic_defects || [];
  const defectColors: Record<string, [number, number, number]> = {
    'С': [220, 38, 38],
    'П': [234, 88, 12],
    'Г': [202, 138, 4],
    'Т': [136, 19, 55],
  };
  cosDefects.forEach(d => {
    const px = MARGIN + (d.x / 100) * CONTENT_W;
    const py = y + (d.y / 100) * 90;
    const [r, g, b] = defectColors[d.type] || [0, 0, 0];
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r, g, b);
    doc.text(d.type, px - 1.5, py + 1.5);
  });
  doc.setTextColor(0, 0, 0);
  y += 94;

  const photos = order.cosmetic_photos || [];
  if (photos.length > 0) {
    y = checkPageBreak(doc, y, 10);
    y = sectionHeader(doc, y, `Фото дефектов (${photos.length})`);
    const cols = 3;
    const photoW = (CONTENT_W - (cols - 1) * 3) / cols;
    const photoH = photoW * 0.75;
    let col = 0;
    let rowY = y;
    photos.forEach((photo, i) => {
      if (col === 0) rowY = checkPageBreak(doc, rowY, photoH + 4);
      const px = MARGIN + col * (photoW + 3);
      try {
        const extRaw = photo.split(';')[0].split('/')[1]?.toUpperCase() || 'JPEG';
        const ext = extRaw === 'PNG' ? 'PNG' : 'JPEG';
        doc.addImage(photo, ext, px, rowY, photoW, photoH);
      } catch {
        doc.setFillColor(220, 220, 220);
        doc.rect(px, rowY, photoW, photoH, 'F');
      }
      doc.setDrawColor(180, 180, 180);
      doc.rect(px, rowY, photoW, photoH);
      doc.setFontSize(6.5);
      doc.setTextColor(100, 100, 100);
      doc.text(`Фото ${i + 1}`, px + 1, rowY + photoH - 1.5);
      doc.setTextColor(0, 0, 0);
      col++;
      if (col >= cols) {
        col = 0;
        rowY += photoH + 4;
      }
    });
    y = rowY + (col > 0 ? photoH + 4 : 0);
  }

  const sigW2 = CONTENT_W / 2 - 4;
  y = checkPageBreak(doc, y, 30);
  y += 4;
  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(200, 200, 200);
  doc.rect(MARGIN, y, sigW2, 20, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Подпись заказчика', MARGIN + 2, y + 4);
  doc.setTextColor(0, 0, 0);
  if (order.client_signature) {
    try { doc.addImage(order.client_signature, 'PNG', MARGIN + 2, y + 5, sigW2 - 4, 13); } catch { }
  }
  doc.setFillColor(248, 248, 248);
  doc.rect(MARGIN + sigW2 + 8, y, sigW2, 20, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Подпись приёмщика', MARGIN + sigW2 + 10, y + 4);
  doc.setTextColor(0, 0, 0);
  if (order.technician_signature) {
    try { doc.addImage(order.technician_signature, 'PNG', MARGIN + sigW2 + 10, y + 5, sigW2 - 4, 13); } catch { }
  }

  return doc;
}

export function generateAvrPDF(order: RepairOrder, items: AvrItem[], avrDate: string): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('helvetica');
  doc.setDrawColor(200, 200, 200);

  let y = MARGIN;

  const org: Organization | undefined = order.organization;

  if (org) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(20, 20, 20);
    doc.text(org.name || org.short_name, MARGIN, y + 5);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    const orgMeta: string[] = [];
    if (org.bin_inn) orgMeta.push(`БИН/ИНН: ${org.bin_inn}`);
    if (org.address) orgMeta.push(org.address);
    if (org.phone) orgMeta.push(org.phone);
    if (orgMeta.length) {
      doc.text(orgMeta.join('   |   '), MARGIN, y + 10);
    }
    doc.setTextColor(0, 0, 0);
    y += 14;

    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
    doc.setLineWidth(0.2);
    y += 4;
  }

  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(20, 20, 20);
  doc.text('АКТ ВЫПОЛНЕННЫХ РАБОТ', PAGE_W / 2, y + 5, { align: 'center' });
  y += 12;

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.4);
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y);
  doc.setLineWidth(0.2);
  y += 5;

  const dateFormatted = avrDate ? new Date(avrDate).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU');
  y = infoRow(doc, y, [
    { label: 'Заказ №', value: order.job_number || '—' },
    { label: 'Дата составления', value: dateFormatted },
    { label: 'Филиал', value: order.branch || '—' },
  ], 13);

  y += 2;
  y = sectionHeader(doc, y, 'Исполнитель и заказчик');
  y = twoCol(doc, y, { label: 'Исполнитель', value: order.technician_name || '—' }, { label: 'Заказчик', value: order.client_name || '—' });
  y = twoCol(doc, y, { label: 'Наименование инструмента', value: order.guitar_model || '—' }, { label: 'Серийный номер', value: order.serial_number || '—' });

  y += 3;
  y = sectionHeader(doc, y, 'Выполненные работы и услуги');

  const colNum = 10;
  const colDesc = CONTENT_W - colNum - 35;
  const colPrice = 35;
  const headerH = 7;

  doc.setFillColor(230, 230, 230);
  doc.setDrawColor(180, 180, 180);
  doc.rect(MARGIN, y, colNum, headerH, 'FD');
  doc.rect(MARGIN + colNum, y, colDesc, headerH, 'FD');
  doc.rect(MARGIN + colNum + colDesc, y, colPrice, headerH, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('№', MARGIN + colNum / 2, y + 4.5, { align: 'center' });
  doc.text('Наименование работы / услуги / расходника', MARGIN + colNum + 2, y + 4.5);
  doc.text('Стоимость', MARGIN + colNum + colDesc + 2, y + 4.5);
  y += headerH;

  const s = sym(order.currency);
  let total = 0;
  items.forEach((item, i) => {
    const rowH = 8;
    doc.setDrawColor(200, 200, 200);
    doc.rect(MARGIN, y, colNum, rowH);
    doc.rect(MARGIN + colNum, y, colDesc, rowH);
    doc.rect(MARGIN + colNum + colDesc, y, colPrice, rowH);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(String(i + 1), MARGIN + colNum / 2, y + 5, { align: 'center' });
    const descLines = doc.splitTextToSize(item.description || '', colDesc - 3);
    doc.text(descLines[0] || '', MARGIN + colNum + 2, y + 5);
    doc.text(`${(item.price || 0).toLocaleString('ru-RU')} ${s}`, MARGIN + colNum + colDesc + 2, y + 5);
    total += item.price || 0;
    y += rowH;
  });

  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(180, 180, 180);
  doc.rect(MARGIN, y, CONTENT_W, 8, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('ИТОГО:', MARGIN + colNum + 2, y + 5.5);
  doc.text(`${total.toLocaleString('ru-RU')} ${s}`, MARGIN + colNum + colDesc + 2, y + 5.5);
  y += 12;

  y = checkPageBreak(doc, y, 20);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const conclusionText = 'Вышеперечисленные работы (услуги) выполнены полностью. Заказчик претензий по объему и качеству оказания услуг не имеет.';
  const conclusionLines = doc.splitTextToSize(conclusionText, CONTENT_W - 4);
  const conclusionH = conclusionLines.length * 4 + 6;
  doc.setFillColor(240, 252, 240);
  doc.setDrawColor(150, 200, 150);
  doc.rect(MARGIN, y, CONTENT_W, conclusionH, 'FD');
  doc.setTextColor(20, 80, 20);
  doc.text(conclusionLines, MARGIN + 2, y + 4.5);
  doc.setTextColor(0, 0, 0);
  y += conclusionH + 6;

  y = checkPageBreak(doc, y, 35);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Дата: ${dateFormatted}`, MARGIN, y);
  y += 8;

  const sigW = CONTENT_W / 2 - 4;
  doc.setFillColor(248, 248, 248);
  doc.setDrawColor(200, 200, 200);
  doc.rect(MARGIN, y, sigW, 28, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Исполнитель:', MARGIN + 2, y + 5);
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Подпись', MARGIN + 2, y + 10);
  doc.setTextColor(0, 0, 0);
  if (order.avr_technician_signature) {
    try { doc.addImage(order.avr_technician_signature, 'PNG', MARGIN + 2, y + 11, sigW - 4, 12); } catch { }
  }
  doc.setFontSize(7.5);
  doc.text(order.technician_name || '___________________', MARGIN + 2, y + 26);

  doc.setFillColor(248, 248, 248);
  doc.rect(MARGIN + sigW + 8, y, sigW, 28, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Заказчик:', MARGIN + sigW + 10, y + 5);
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Подпись', MARGIN + sigW + 10, y + 10);
  doc.setTextColor(0, 0, 0);
  if (order.avr_client_signature) {
    try { doc.addImage(order.avr_client_signature, 'PNG', MARGIN + sigW + 10, y + 11, sigW - 4, 12); } catch { }
  }
  doc.setFontSize(7.5);
  doc.text(order.client_name || '___________________', MARGIN + sigW + 10, y + 26);

  return doc;
}
