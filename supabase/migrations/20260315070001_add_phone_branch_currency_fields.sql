/*
  # Add client_phone, branch, and currency fields to repair_orders

  1. Changes
    - `repair_orders` table:
      - `client_phone` (text) — client's phone number
      - `branch` (text) — workshop branch (Алматы / Москва), defaults to 'Алматы'
      - `currency` (text) — currency for cost fields (KZT / RUB), defaults to 'KZT'

  2. Notes
    - All columns use safe IF NOT EXISTS checks
    - Existing rows get sensible defaults
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'client_phone'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN client_phone TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'branch'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN branch TEXT DEFAULT 'Алматы';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'currency'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN currency TEXT DEFAULT 'KZT';
  END IF;
END $$;
