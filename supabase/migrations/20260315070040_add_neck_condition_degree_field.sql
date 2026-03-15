/*
  # Add neck_condition_degree field to repair_orders

  1. Changes
    - `repair_orders` table:
      - `neck_condition_degree` (text) — degree of neck problem (поправимо ладами / нужна замена ладов)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'neck_condition_degree'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN neck_condition_degree TEXT DEFAULT '';
  END IF;
END $$;
