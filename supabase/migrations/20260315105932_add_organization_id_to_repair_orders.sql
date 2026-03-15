/*
  # Add organization_id to repair_orders

  1. Changes
    - Add `organization_id` column (uuid, nullable FK to organizations)
    - This allows each repair order to be associated with a specific legal entity

  2. Notes
    - Nullable so existing orders are not broken
    - Foreign key with SET NULL on delete to preserve orders if org is deleted
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'repair_orders' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE repair_orders ADD COLUMN organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL;
  END IF;
END $$;
