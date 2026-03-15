/*
  # Fix security issues

  1. Add index on repair_orders.organization_id (unindexed FK)
  2. Fix RLS policies on organizations to use (select auth.uid()) for performance
  3. Fix RLS policies on repair_orders to restrict to authenticated users only
  4. Fix update_updated_at function search_path
*/

-- 1. Add index for the FK on organization_id
CREATE INDEX IF NOT EXISTS repair_orders_organization_id_idx
  ON repair_orders (organization_id);

-- 2. Drop and recreate organizations RLS policies with optimized auth calls
DROP POLICY IF EXISTS "Authenticated users can read organizations" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can insert organizations" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can update organizations" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can delete organizations" ON organizations;

CREATE POLICY "Authenticated users can read organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can insert organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete organizations"
  ON organizations FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

-- 3. Fix repair_orders RLS policies - restrict to authenticated users
DROP POLICY IF EXISTS "Allow delete on repair_orders" ON repair_orders;
DROP POLICY IF EXISTS "Allow insert on repair_orders" ON repair_orders;
DROP POLICY IF EXISTS "Allow update on repair_orders" ON repair_orders;

CREATE POLICY "Allow delete on repair_orders"
  ON repair_orders FOR DELETE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Allow insert on repair_orders"
  ON repair_orders FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Allow update on repair_orders"
  ON repair_orders FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);

-- 4. Fix update_updated_at function search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
