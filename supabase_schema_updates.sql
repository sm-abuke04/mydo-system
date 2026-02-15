-- UPGRADE SCRIPT FOR SK & MYDO SYSTEM
-- Run this in your Supabase SQL Editor to update the database schema

-- 1. UPDATES FOR 'profiles' TABLE (KK Profiles)
-- Add missing columns for the enhanced Profile Form
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS educational_background text,
ADD COLUMN IF NOT EXISTS youth_age_group text,
ADD COLUMN IF NOT EXISTS is_national_voter boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS purok_zone text;

-- Change youth_classification to accept arrays safely
-- If column is text, split it. If already text[], do nothing (or cast).
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'youth_classification'
        AND data_type = 'text'
    ) THEN
        ALTER TABLE profiles
        ALTER COLUMN youth_classification TYPE text[]
        USING string_to_array(youth_classification, ',');
    END IF;
END $$;


-- 2. UPDATES FOR 'sk_officials' TABLE (SK Profiles)
-- Add missing columns for the SK Officials management feature
ALTER TABLE sk_officials
ADD COLUMN IF NOT EXISTS skmt_no text,
ADD COLUMN IF NOT EXISTS birthdate date,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'Active';


-- 3. UPDATES FOR 'barangays' TABLE
-- Ensure lat/lng are present for the Map
ALTER TABLE barangays
ADD COLUMN IF NOT EXISTS lat float8,
ADD COLUMN IF NOT EXISTS lng float8;


-- 4. SK REPORTS TABLE (New Table for Tracking Submissions)
CREATE TABLE IF NOT EXISTS sk_reports (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL, -- 'Annual Requirements', 'Quarterly Requirements', 'Monthly Requirements'
    status text DEFAULT 'Pending', -- 'Pending', 'Submitted', 'In Progress'
    submitted_at timestamptz,
    file_path text,
    barangay text, -- Links report to a specific barangay
    user_id uuid REFERENCES auth.users(id), -- Tracks who submitted it
    created_at timestamptz DEFAULT now()
);

-- 5. STORAGE BUCKET CONFIGURATION (Simulated SQL for Supabase Storage)
-- Note: Buckets are usually created via API or Dashboard, but policies can be SQL.
-- Assume bucket 'sk_documents' exists.

-- 6. ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sk_officials ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sk_reports ENABLE ROW LEVEL SECURITY;

-- Policy: SK Officials can VIEW their own barangay's reports
CREATE POLICY "View own barangay reports" ON sk_reports
FOR SELECT USING (
    auth.uid() IN (
        SELECT id FROM users WHERE barangay = sk_reports.barangay
    )
);

-- Policy: SK Officials can INSERT/UPDATE reports for their barangay
CREATE POLICY "Manage own barangay reports" ON sk_reports
FOR ALL USING (
    auth.uid() IN (
        SELECT id FROM users WHERE barangay = sk_reports.barangay
    )
);

-- Policy: MYDO Admin can VIEW ALL reports
CREATE POLICY "Admin view all reports" ON sk_reports
FOR SELECT USING (
    auth.uid() IN (
        SELECT id FROM users WHERE role = 'MYDO_ADMIN'
    )
);

-- STORAGE POLICIES (Assuming bucket 'sk_documents')
-- Make sure to create the bucket 'sk_documents' in Supabase Storage manually if not via SQL extension.
-- CREATE POLICY "Give authenticated users access to upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'sk_documents');
-- CREATE POLICY "Give authenticated users access to read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'sk_documents');
