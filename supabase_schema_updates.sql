-- UPGRADE SCRIPT FOR SK & MYDO SYSTEM
-- Run this in your Supabase SQL Editor to update the database schema

-- 1. UPDATES FOR 'profiles' TABLE
-- Add missing columns for the enhanced Profile Form
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS educational_background text,
ADD COLUMN IF NOT EXISTS youth_age_group text,
ADD COLUMN IF NOT EXISTS is_national_voter boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS purok_zone text; -- Ensuring snake_case match for 'purokZone'

-- Change youth_classification to accept arrays (since it's a multi-select)
-- Note: This might require casting if data exists.
-- If the column is currently 'text', we convert it to 'text[]'.
ALTER TABLE profiles
ALTER COLUMN youth_classification TYPE text[] USING string_to_array(youth_classification, ',');


-- 2. UPDATES FOR 'sk_officials' TABLE
-- Add missing columns for the SK Officials management feature
ALTER TABLE sk_officials
ADD COLUMN IF NOT EXISTS skmt_no text,
ADD COLUMN IF NOT EXISTS birthdate date,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active';


-- 3. UPDATES FOR 'barangays' TABLE
-- Ensure lat/lng are present for the Map
ALTER TABLE barangays
ADD COLUMN IF NOT EXISTS lat float8,
ADD COLUMN IF NOT EXISTS lng float8;


-- 4. OPTIONAL: ENABLE ROW LEVEL SECURITY (RLS)
-- It's good practice to enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sk_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. POLICIES (Example - Adjust as needed)
-- Allow authenticated users to view profiles
CREATE POLICY "Enable read access for authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Enable insert for authenticated users" ON profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for owners" ON profiles FOR UPDATE TO authenticated USING (true);
