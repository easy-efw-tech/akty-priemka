/*
  # Add cosmetic_photos and AVR work items to repair_orders

  1. Changes
    - `repair_orders` table:
      - `cosmetic_photos` (jsonb) — array of base64 photo strings of cosmetic defects
      - `avr_items` (jsonb) — array of work/service line items for the completion act (AVR)
      - `avr_date` (text) — date signed for the AVR
      - `avr_technician_signature` (text) — base64 signature for AVR technician
      - `avr_client_signature` (text) — base64 signature for AVR client
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'cosmetic_photos'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN cosmetic_photos JSONB DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'avr_items'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN avr_items JSONB DEFAULT '[]';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'avr_date'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN avr_date TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'avr_technician_signature'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN avr_technician_signature TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'avr_client_signature'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN avr_client_signature TEXT DEFAULT '';
  END IF;
END $$;
