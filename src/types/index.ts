export type DefectType = 'С' | 'П' | 'Г' | 'Т';

export interface Organization {
  id?: string;
  name: string;
  short_name: string;
  bin_inn: string;
  address: string;
  phone: string;
  email: string;
  bank_details: string;
  director: string;
  logo_url: string;
  is_active: boolean;
  created_at?: string;
}

export interface AvrItem {
  id: string;
  description: string;
  price: number;
}

export interface CosmeticDefect {
  id: string;
  x: number;
  y: number;
  type: DefectType;
}

export interface RepairOrder {
  id?: string;
  job_number?: string;
  created_at?: string;
  updated_at?: string;

  guitar_model: string;
  serial_number: string;
  order_date: string;
  technician_name: string;

  setup_status: string;

  frets_condition: string;
  frets_action: string;

  neck_relief_1: string;
  neck_relief_6: string;
  neck_relief_action: string;

  truss_screw_direction: string;
  neck_condition_degree: string;

  neck_hump: boolean;
  neck_hump_fret: string;
  neck_heel_issue: boolean;
  neck_heel_direction: string;
  neck_start_issue: boolean;
  neck_start_direction: string;

  truss_slot_damage: boolean;
  truss_cover_present: boolean;
  truss_reserve: boolean;
  truss_other_notes: string;

  fret_wear_percent: number;
  fret_action: string;
  fret_profile: string;
  fret_alloy: string;

  neck_binding: boolean;
  neck_glued: boolean;
  neck_lacquered_fretboard: boolean;
  neck_ebony: boolean;

  pot_issue: boolean;
  pot_quantity: number;
  pot_position: string;
  pot_action: string;
  switch_jack_issue: boolean;
  switch_jack_notes: string;
  switch_jack_action: string;

  top_nut_condition: string;
  top_nut_action: string;
  top_nut_material: string;

  bottom_nut_condition: string;
  bottom_nut_action: string;
  bottom_nut_material: string;

  tremolo_screws_damage: string;
  tremolo_screws_action: string;
  tremolo_springs_stretched: boolean;
  tremolo_springs_action: string;
  tremolo_springs_add_qty: number;
  tremolo_loose_saddles: boolean;
  tremolo_loose_locknut: boolean;
  tremolo_loose_posts: boolean;
  tremolo_loose_action: string;

  bridge_bend: boolean;
  bridge_action: string;

  tuner_slipping: string;
  tuner_play: string;
  tuner_action: string;

  missing_parts: string;
  repair_deadline: string;
  strings_source: string;
  client_parts: string;
  workshop_parts: string;
  notes: string;

  service_cost: number;
  parts_cost: number;
  prepayment: number;

  client_name: string;
  client_email: string;
  client_phone: string;
  client_signature: string;
  technician_signature: string;

  cosmetic_defects: CosmeticDefect[];
  cosmetic_photos: string[];

  avr_items: AvrItem[];
  avr_date: string;
  avr_technician_signature: string;
  avr_client_signature: string;

  currency: 'KZT' | 'RUB';
  branch: string;
  status: string;
  pdf_url: string;
  organization_id?: string;
  organization?: Organization;
}

export const defaultOrder: RepairOrder = {
  guitar_model: '',
  serial_number: '',
  order_date: new Date().toISOString().split('T')[0],
  technician_name: '',
  setup_status: 'не отстроен',
  frets_condition: '',
  frets_action: 'нет',
  neck_relief_1: '',
  neck_relief_6: '',
  neck_relief_action: '',
  truss_screw_direction: '',
  neck_condition_degree: '',
  neck_hump: false,
  neck_hump_fret: '',
  neck_heel_issue: false,
  neck_heel_direction: '',
  neck_start_issue: false,
  neck_start_direction: '',
  truss_slot_damage: false,
  truss_cover_present: false,
  truss_reserve: false,
  truss_other_notes: '',
  fret_wear_percent: 0,
  fret_action: 'не менять',
  fret_profile: '',
  fret_alloy: 'нейзильбер',
  neck_binding: false,
  neck_glued: false,
  neck_lacquered_fretboard: false,
  neck_ebony: false,
  pot_issue: false,
  pot_quantity: 0,
  pot_position: '',
  pot_action: 'не менять',
  switch_jack_issue: false,
  switch_jack_notes: '',
  switch_jack_action: 'не менять',
  top_nut_condition: '',
  top_nut_action: 'нет ремонта',
  top_nut_material: '',
  bottom_nut_condition: '',
  bottom_nut_action: 'нет ремонта',
  bottom_nut_material: '',
  tremolo_screws_damage: '',
  tremolo_screws_action: '',
  tremolo_springs_stretched: false,
  tremolo_springs_action: '',
  tremolo_springs_add_qty: 0,
  tremolo_loose_saddles: false,
  tremolo_loose_locknut: false,
  tremolo_loose_posts: false,
  tremolo_loose_action: '',
  bridge_bend: false,
  bridge_action: '',
  tuner_slipping: '',
  tuner_play: '',
  tuner_action: 'не менять',
  missing_parts: '',
  repair_deadline: '',
  strings_source: 'мастерская',
  client_parts: '',
  workshop_parts: '',
  notes: '',
  service_cost: 0,
  parts_cost: 0,
  prepayment: 0,
  client_name: '',
  client_email: '',
  client_phone: '',
  client_signature: '',
  technician_signature: '',
  cosmetic_defects: [],
  cosmetic_photos: [],
  avr_items: [],
  avr_date: '',
  avr_technician_signature: '',
  avr_client_signature: '',
  currency: 'KZT',
  branch: 'Алматы',
  status: 'новый',
  pdf_url: '',
};
