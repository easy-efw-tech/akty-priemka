/*
  # Allow anon users to insert and update repair_orders

  ## Problem
  The app uses anon key without user authentication, but INSERT and UPDATE
  policies were restricted to authenticated role only. This caused 406 errors
  when saving repair orders.

  ## Changes
  - Add INSERT policy for anon role on repair_orders
  - Add UPDATE policy for anon role on repair_orders
  - Add DELETE policy for anon role on repair_orders
*/

CREATE POLICY "Allow anon insert on repair_orders"
  ON repair_orders FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update on repair_orders"
  ON repair_orders FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anon delete on repair_orders"
  ON repair_orders FOR DELETE
  TO anon
  USING (true);
