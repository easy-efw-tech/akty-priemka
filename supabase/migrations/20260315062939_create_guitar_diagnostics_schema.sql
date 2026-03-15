/*
  # Guitar Workshop Diagnostics Schema

  ## Overview
  Creates the complete database schema for the guitar repair workshop diagnostics system.

  ## Tables

  ### repair_orders
  Main table storing all repair order data including:
  - General info: guitar model, serial, date, technician
  - Setup status
  - Neck diagnostics: frets, relief, issues, truss rod, wear
  - Electronics: pots, switches
  - Nut: top and bottom condition/actions
  - Tremolo: screws, springs, loose parts
  - Bridge TOM: bend info
  - Tuners: issues
  - Other: missing parts, deadline, strings, notes
  - Costs: service, parts, prepayment
  - Customer: name, email, signatures (base64)
  - Cosmetic defects: JSON array of {x, y, type, label}
  - Status tracking: new/in_progress/completed/delivered

  ## Security
  - RLS enabled on all tables
  - Public read/write access for workshop use (single tenant system)
    authenticated staff can manage all records
*/

CREATE TABLE IF NOT EXISTS repair_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- General
  guitar_model text DEFAULT '',
  serial_number text DEFAULT '',
  order_date date DEFAULT CURRENT_DATE,
  technician_name text DEFAULT '',

  -- Setup
  setup_status text DEFAULT 'не отстроен',

  -- Neck - Frets
  frets_condition text DEFAULT '',
  frets_action text DEFAULT 'нет',

  -- Neck relief
  neck_relief_1 text DEFAULT '',
  neck_relief_6 text DEFAULT '',
  neck_relief_action text DEFAULT '',

  -- Truss rod screw direction
  truss_screw_direction text DEFAULT '',

  -- Neck issues
  neck_hump boolean DEFAULT false,
  neck_hump_fret text DEFAULT '',
  neck_heel_issue boolean DEFAULT false,
  neck_heel_direction text DEFAULT '',
  neck_start_issue boolean DEFAULT false,
  neck_start_direction text DEFAULT '',

  -- Truss rod
  truss_slot_damage boolean DEFAULT false,
  truss_cover_present boolean DEFAULT false,
  truss_reserve boolean DEFAULT false,
  truss_other_notes text DEFAULT '',

  -- Fret wear/replacement
  fret_wear_percent integer DEFAULT 0,
  fret_action text DEFAULT 'не менять',
  fret_profile text DEFAULT '',
  fret_alloy text DEFAULT 'нейзильбер',

  -- Neck extra attributes
  neck_binding boolean DEFAULT false,
  neck_glued boolean DEFAULT false,
  neck_lacquered_fretboard boolean DEFAULT false,
  neck_ebony boolean DEFAULT false,

  -- Electronics
  pot_issue boolean DEFAULT false,
  pot_quantity integer DEFAULT 0,
  pot_position text DEFAULT '',
  pot_action text DEFAULT 'не менять',
  switch_jack_issue boolean DEFAULT false,
  switch_jack_notes text DEFAULT '',
  switch_jack_action text DEFAULT 'не менять',

  -- Nut - Top
  top_nut_condition text DEFAULT '',
  top_nut_action text DEFAULT 'нет ремонта',
  top_nut_material text DEFAULT '',

  -- Nut - Bottom
  bottom_nut_condition text DEFAULT '',
  bottom_nut_action text DEFAULT 'нет ремонта',
  bottom_nut_material text DEFAULT '',

  -- Tremolo
  tremolo_screws_damage text DEFAULT '',
  tremolo_screws_action text DEFAULT '',
  tremolo_springs_stretched boolean DEFAULT false,
  tremolo_springs_action text DEFAULT '',
  tremolo_springs_add_qty integer DEFAULT 0,
  tremolo_loose_saddles boolean DEFAULT false,
  tremolo_loose_locknut boolean DEFAULT false,
  tremolo_loose_posts boolean DEFAULT false,
  tremolo_loose_action text DEFAULT '',

  -- Bridge TOM
  bridge_bend boolean DEFAULT false,
  bridge_action text DEFAULT '',

  -- Tuners
  tuner_slipping text DEFAULT '',
  tuner_play text DEFAULT '',
  tuner_action text DEFAULT 'не менять',

  -- Other
  missing_parts text DEFAULT '',
  repair_deadline text DEFAULT '',
  strings_source text DEFAULT 'мастерская',
  client_parts text DEFAULT '',
  workshop_parts text DEFAULT '',
  notes text DEFAULT '',

  -- Costs
  service_cost numeric DEFAULT 0,
  parts_cost numeric DEFAULT 0,
  prepayment numeric DEFAULT 0,

  -- Customer
  client_name text DEFAULT '',
  client_email text DEFAULT '',
  client_signature text DEFAULT '',
  technician_signature text DEFAULT '',

  -- Cosmetic defects JSON: [{x: number, y: number, type: 'С'|'П'|'Г', id: string}]
  cosmetic_defects jsonb DEFAULT '[]'::jsonb,

  -- Status
  status text DEFAULT 'новый',

  -- PDF URL if stored
  pdf_url text DEFAULT ''
);

CREATE INDEX IF NOT EXISTS repair_orders_job_number_idx ON repair_orders(job_number);
CREATE INDEX IF NOT EXISTS repair_orders_client_name_idx ON repair_orders(client_name);
CREATE INDEX IF NOT EXISTS repair_orders_serial_number_idx ON repair_orders(serial_number);
CREATE INDEX IF NOT EXISTS repair_orders_status_idx ON repair_orders(status);
CREATE INDEX IF NOT EXISTS repair_orders_created_at_idx ON repair_orders(created_at DESC);

ALTER TABLE repair_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on repair_orders"
  ON repair_orders
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow insert on repair_orders"
  ON repair_orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow update on repair_orders"
  ON repair_orders
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete on repair_orders"
  ON repair_orders
  FOR DELETE
  TO anon
  USING (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER repair_orders_updated_at
  BEFORE UPDATE ON repair_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE SEQUENCE IF NOT EXISTS job_number_seq START 1000;
