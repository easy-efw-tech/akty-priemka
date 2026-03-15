/*
  # Create organizations table

  1. New Tables
    - `organizations`
      - `id` (uuid, primary key)
      - `name` (text) - Full legal name of the organization
      - `short_name` (text) - Short name for display
      - `bin_inn` (text) - BIN (Kazakhstan) or INN (Russia) tax number
      - `address` (text) - Legal address
      - `phone` (text) - Contact phone
      - `email` (text) - Contact email
      - `bank_details` (text) - Bank account details for invoices
      - `director` (text) - Director full name
      - `logo_url` (text) - Optional logo URL
      - `is_active` (boolean) - Whether this org is active
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `organizations` table
    - Add policy for authenticated users to read organizations
    - Add policy for authenticated users to insert/update/delete organizations
*/

CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  short_name text NOT NULL DEFAULT '',
  bin_inn text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  bank_details text NOT NULL DEFAULT '',
  director text NOT NULL DEFAULT '',
  logo_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read organizations"
  ON organizations FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update organizations"
  ON organizations FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete organizations"
  ON organizations FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
