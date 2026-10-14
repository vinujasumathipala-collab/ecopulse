-- =============================================================================
-- EcoPulse Municipal Waste Management & Recycling System
-- Complete PostgreSQL Backend Schema for Supabase
-- =============================================================================
-- Clean up any broken legacy auth triggers that cause GoTrue 500 errors on sign-in
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE;

-- This script is 100% idempotent:
-- 1. Creates all 9 tables if they do not exist.
-- 2. Uses ALTER TABLE ... ADD COLUMN IF NOT EXISTS to safely upgrade existing tables.
-- 3. Enables permissive Row-Level Security (RLS) policies for anonymous/web clients.
-- 4. Registers tables with the Supabase Realtime publication.
-- 5. Seeds default municipal segregation centers, crews, personnel, and sample data.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'Resident',
  account_type TEXT DEFAULT 'Residential Account',
  address TEXT DEFAULT 'Curbside',
  zone TEXT DEFAULT 'Colombo Fort',
  eco_points NUMERIC DEFAULT 0,
  total_recycled_kg NUMERIC DEFAULT 0,
  pickups_completed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active',
  registered_on DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing users table if columns are missing
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Resident';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'Residential Account';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Curbside';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS zone TEXT DEFAULT 'Colombo Fort';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS eco_points NUMERIC DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_recycled_kg NUMERIC DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pickups_completed INTEGER DEFAULT 0;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS registered_on DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- Seed default passwords for system demonstration accounts
UPDATE public.users SET password = 'Admin@1234' WHERE lower(email) = 'admin@ecopulse.org' AND (password IS NULL OR password = '');
UPDATE public.users SET password = 'Manager@1234' WHERE lower(email) = 'manager@ecopulse.org' AND (password IS NULL OR password = '');
UPDATE public.users SET password = 'Leader@1234' WHERE lower(email) = 'leader@ecopulse.org' AND (password IS NULL OR password = '');
UPDATE public.users SET password = 'Resident@1234' WHERE lower(email) = 'resident@ecopulse.org' AND (password IS NULL OR password = '');

-- Drop any legacy CHECK constraints on users (e.g. users_role_check) that restrict valid municipal roles
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_status_check;

-- -----------------------------------------------------------------------------
-- 2. CREWS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  zone TEXT NOT NULL,
  truck_id TEXT NOT NULL,
  truck_capacity_kg NUMERIC DEFAULT 3500,
  driver TEXT,
  leader TEXT,
  center_manager TEXT,
  members INTEGER DEFAULT 3,
  status TEXT DEFAULT 'Active',
  stops_assigned INTEGER DEFAULT 0,
  stops_completed INTEGER DEFAULT 0,
  on_time_rate TEXT DEFAULT '100%',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing crews table if columns are missing
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS zone TEXT DEFAULT 'Colombo Fort';
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS truck_id TEXT DEFAULT 'TRK-101';
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS truck_capacity_kg NUMERIC DEFAULT 3500;
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS driver TEXT;
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS leader TEXT;
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS center_manager TEXT;
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS members INTEGER DEFAULT 3;
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS stops_assigned INTEGER DEFAULT 0;
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS stops_completed INTEGER DEFAULT 0;
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS on_time_rate TEXT DEFAULT '100%';
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 3. OPERATIONS PERSONNEL TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.operations_personnel (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  zone TEXT,
  assignment TEXT,
  status TEXT DEFAULT 'Active / On Duty',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing operations_personnel table if columns are missing
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS zone TEXT;
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS assignment TEXT;
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active / On Duty';
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 4. RECYCLING FACILITIES (ZONE SEGREGATION CENTERS) TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recycling_facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  zone TEXT NOT NULL,
  capacity_tons NUMERIC DEFAULT 100,
  current_load_tons NUMERIC DEFAULT 0,
  accepted_materials TEXT[] DEFAULT '{}',
  contact_phone TEXT,
  status TEXT DEFAULT 'Certified Active',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing recycling_facilities table if columns are missing
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Primary Segregation MRF';
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Colombo Logistics Yard';
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS zone TEXT DEFAULT 'Colombo Fort';
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS capacity_tons NUMERIC DEFAULT 100;
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS current_load_tons NUMERIC DEFAULT 0;
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS accepted_materials TEXT[] DEFAULT '{}';
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Certified Active';
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 5. PICKUP REQUESTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pickup_requests (
  id TEXT PRIMARY KEY,
  resident_id TEXT,
  resident_name TEXT NOT NULL,
  address TEXT NOT NULL,
  zone TEXT NOT NULL,
  category TEXT NOT NULL,
  estimated_kg NUMERIC DEFAULT 10,
  actual_kg NUMERIC,
  pickup_date DATE,
  time_slot TEXT,
  status TEXT DEFAULT 'Submitted',
  assigned_crew TEXT DEFAULT 'Unassigned',
  notes TEXT,
  image_url TEXT,
  points_awarded INTEGER DEFAULT 0,
  missed_reason TEXT,
  facility_id TEXT,
  facility_name TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing pickup_requests table if columns are missing
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS resident_id TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS actual_kg NUMERIC;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS time_slot TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Submitted';
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS assigned_crew TEXT DEFAULT 'Unassigned';
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS points_awarded INTEGER DEFAULT 0;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS missed_reason TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS facility_id TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS facility_name TEXT;
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 6. RECYCLABLE BATCHES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recyclable_batches (
  id TEXT PRIMARY KEY,
  stream TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  source_zone TEXT NOT NULL,
  facility_id TEXT,
  facility_name TEXT,
  status TEXT DEFAULT 'Allocated',
  date DATE DEFAULT CURRENT_DATE,
  carrier_vehicle TEXT,
  yield_kg NUMERIC,
  recovery_rate TEXT,
  co2_saved_kg NUMERIC DEFAULT 0,
  request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing recyclable_batches table if columns are missing
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS facility_id TEXT;
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS facility_name TEXT;
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Allocated';
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS carrier_vehicle TEXT;
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS yield_kg NUMERIC;
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS recovery_rate TEXT;
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS co2_saved_kg NUMERIC DEFAULT 0;
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS request_id TEXT;
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 7. ROUTE SCHEDULES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.route_schedules (
  id TEXT PRIMARY KEY,
  zone TEXT NOT NULL,
  stream TEXT NOT NULL,
  day TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  crew_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing route_schedules table if columns are missing
ALTER TABLE public.route_schedules ADD COLUMN IF NOT EXISTS crew_name TEXT;
ALTER TABLE public.route_schedules ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.route_schedules ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 8. COMPLAINTS & GRIEVANCES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  zone TEXT NOT NULL,
  priority TEXT DEFAULT 'Medium',
  details TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Open',
  resolution_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing complaints table if columns are missing
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium';
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Open';
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS resolution_notes TEXT;
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- -----------------------------------------------------------------------------
-- 9. ACTIVITY FEED TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_feed (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  text TEXT NOT NULL,
  time TEXT NOT NULL,
  dot TEXT DEFAULT 'emerald',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Upgrade existing activity_feed table if columns are missing
ALTER TABLE public.activity_feed ADD COLUMN IF NOT EXISTS dot TEXT DEFAULT 'emerald';
ALTER TABLE public.activity_feed ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now());

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- =============================================================================
-- Ensure RLS is enabled and allows full CRUD access for anonymous and authenticated clients.

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'users',
    'crews',
    'operations_personnel',
    'recycling_facilities',
    'pickup_requests',
    'recyclable_batches',
    'route_schedules',
    'complaints',
    'activity_feed'
  ])
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl);
    EXECUTE format('DROP POLICY IF EXISTS "Public full access on %I" ON public.%I;', tbl, tbl);
    EXECUTE format('CREATE POLICY "Public full access on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl);
  END LOOP;
END $$;

-- =============================================================================
-- SUPABASE REALTIME REPLICATION
-- =============================================================================
-- Safely add tables to the supabase_realtime publication for live socket updates.

DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'users',
    'crews',
    'operations_personnel',
    'recycling_facilities',
    'pickup_requests',
    'recyclable_batches',
    'route_schedules',
    'complaints',
    'activity_feed'
  ])
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', tbl);
    EXCEPTION WHEN duplicate_object THEN
      -- Already in publication, skip safely
      NULL;
    WHEN OTHERS THEN
      -- Publication might not exist in local environments
      NULL;
    END;
  END LOOP;
END $$;

-- =============================================================================
-- DROP LEGACY CHECK CONSTRAINTS (IF ANY EXIST FROM OLD RUNS)
-- =============================================================================
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_status_check;
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_resident_id_fkey;
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_resident_id_fk;
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_status_check;
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_category_check;
ALTER TABLE public.crews DROP CONSTRAINT IF EXISTS crews_status_check;
ALTER TABLE public.recyclable_batches DROP CONSTRAINT IF EXISTS recyclable_batches_status_check;
ALTER TABLE public.recycling_facilities DROP CONSTRAINT IF EXISTS recycling_facilities_status_check;
ALTER TABLE public.complaints DROP CONSTRAINT IF EXISTS complaints_status_check;
ALTER TABLE public.complaints DROP CONSTRAINT IF EXISTS complaints_priority_check;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT conname, relname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    JOIN pg_namespace n ON t.relnamespace = n.oid
    WHERE n.nspname = 'public' 
      AND c.contype = 'c'
      AND conname NOT LIKE '%_not_null'
      AND (conname LIKE '%role%' OR conname LIKE '%status%' OR conname LIKE '%category%' OR conname LIKE '%priority%')
  )
  LOOP
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I;', r.relname, r.conname);
  END LOOP;
END $$;


-- =============================================================================
-- MUNICIPAL SEED DATA (SAFE UPSERT)
-- =============================================================================

-- 1. Dedicated Municipal Zone Segregation Centers (1 per Colombo Zone)
INSERT INTO public.recycling_facilities (id, name, type, location, zone, capacity_tons, current_load_tons, accepted_materials, contact_phone, status)
VALUES
  ('FAC-FORT', 'GreenPoly Central MRF & Segregation Center', 'Primary Segregation MRF & Polymer Recovery', 'Plot 42, Harbor Logistics Park, Colombo Fort', 'Colombo Fort', 180, 42, ARRAY['PET & HDPE Plastics', 'Cardboard & Paper', 'Glass Bottles', 'Metal Cans'], '+94 11 254 9988', 'Certified Active'),
  ('FAC-KOLL', 'EcoFiber Pulp & Segregation Recovery Hub', 'Cardboard Baling, Pulp Recovery & Rigid Plastics', 'Yard 8, Marine Drive Logistics Zone, Kollupitiya', 'Kollupitiya', 200, 65, ARRAY['Corrugated Cardboard', 'Office Paper', 'Cartons', 'Clean Plastics'], '+94 11 432 1100', 'Certified Active'),
  ('FAC-BORE', 'Borella Municipal Resource Recovery & Segregation Center', 'Multi-Stream Sort Line & Organic Composting Hub', 'Baseline Road Municipal Complex, Borella', 'Borella', 220, 58, ARRAY['Organic Biomass', 'Plastics', 'Paper & Packaging', 'Scrap Metal'], '+94 11 267 8890', 'Certified Active'),
  ('FAC-WELL', 'Wellawatte Coastal Segregation & Refinement Facility', 'Glass Cullet, High-Density Polymers & Metal Sorting', 'W.A. Silva Mawatha Processing Yard, Wellawatte', 'Wellawatte', 150, 38, ARRAY['Glass Bottles & Jars', 'Aluminum Cans', 'Scrap Steel', 'Rigid Plastics'], '+94 11 258 7766', 'Certified Active'),
  ('FAC-DEHI', 'Dehiwala CleanStream Segregation Depot', 'Dry Recyclables & High-Density Polymers MRF', 'Station Road Municipal Depot, Dehiwala', 'Dehiwala', 160, 40, ARRAY['HDPE / PET Plastics', 'Cardboard Boxes', 'Tin Cans', 'Paper'], '+94 11 271 3344', 'Certified Active'),
  ('FAC-KOTT', 'Sri Jayawardenepura Kotte EcoHub & Segregation Plant', 'Smart Sorting Facility, Biomass & E-Waste Processing', 'Parliament Road Green Logistics Corridor, Kotte', 'Kotte', 190, 52, ARRAY['E-Waste', 'Organic Compost', 'Packaging Films', 'Metals'], '+94 11 288 9911', 'Certified Active'),
  ('FAC-NUGE', 'Nugegoda High-Capacity Materials Processing & Segregation Terminal', 'Comprehensive High-Volume Municipal Sorting & Baling MRF', 'High Level Road Environmental Center, Nugegoda', 'Nugegoda', 250, 75, ARRAY['PET / HDPE Rigid Plastics', 'Corrugated Cartons', 'Biomass', 'Scrap Aluminum'], '+94 11 282 4455', 'Certified Active')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  location = EXCLUDED.location,
  zone = EXCLUDED.zone,
  capacity_tons = EXCLUDED.capacity_tons,
  accepted_materials = EXCLUDED.accepted_materials,
  contact_phone = EXCLUDED.contact_phone,
  status = EXCLUDED.status;

-- 2. Fleet Crews
INSERT INTO public.crews (id, name, zone, truck_id, truck_capacity_kg, driver, leader, center_manager, members, status, stops_assigned, stops_completed, on_time_rate)
VALUES
  ('CREW-1', 'Crew #1 (Alpha Hauler)', 'Colombo Fort', 'TRK-101 (Compactor)', 8000, 'David Kowalski', 'Kasun Wickramasinghe', 'Sunil Perera (GreenPoly MRF)', 3, 'Active En Route', 22, 18, '96%'),
  ('CREW-2', 'Crew #2 (Echo Truck)', 'Kollupitiya', 'TRK-104 (Dry Recycler)', 5000, 'Maria Santos', 'Nimal Jayawardena', 'Dilani Samarasekera (EcoFiber Plant)', 2, 'Active En Route', 18, 14, '98%')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  zone = EXCLUDED.zone,
  truck_id = EXCLUDED.truck_id,
  truck_capacity_kg = EXCLUDED.truck_capacity_kg,
  driver = EXCLUDED.driver,
  leader = EXCLUDED.leader,
  center_manager = EXCLUDED.center_manager,
  members = EXCLUDED.members,
  status = EXCLUDED.status;

-- 3. Operations Personnel Roster
INSERT INTO public.operations_personnel (id, name, role, phone, email, zone, assignment, status)
VALUES
  ('PER-101', 'Kasun Wickramasinghe', 'Crew Leader', '+94 77 123 4567', 'leader@ecopulse.org', 'Colombo Fort', 'Alpha Hauler Unit', 'Active / On Duty'),
  ('PER-102', 'David Kowalski', 'Driver', '+94 71 882 1192', 'david.k@citypulse.org', 'Colombo Fort', 'Heavy Compactor (TRK-101)', 'Active / On Duty'),
  ('PER-103', 'Sunil Perera', 'Recycling Center Manager', '+94 11 254 9988', 'manager@ecopulse.org', 'Colombo Fort', 'GreenPoly Circular Polymers MRF', 'Active / On Duty'),
  ('PER-104', 'Nimal Jayawardena', 'Crew Leader', '+94 77 901 2345', 'nimal.j@citypulse.org', 'Kollupitiya', 'Echo Truck Unit', 'Active / On Duty'),
  ('PER-105', 'Maria Santos', 'Driver', '+94 76 432 9011', 'maria.s@citypulse.org', 'Kollupitiya', 'Dry Recycler (TRK-104)', 'Active / On Duty'),
  ('PER-106', 'Dilani Samarasekera', 'Recycling Center Manager', '+94 11 432 1100', 'dilani.s@citypulse.org', 'Kollupitiya', 'EcoFiber Pulp & Paper Recovery Plant', 'Active / On Duty')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  zone = EXCLUDED.zone,
  assignment = EXCLUDED.assignment,
  status = EXCLUDED.status;

-- 4. Default System Users
INSERT INTO public.users (id, name, email, phone, role, account_type, address, zone, eco_points, total_recycled_kg, pickups_completed, status)
VALUES
  ('USR-101', 'Alex Mercer', 'resident@ecopulse.org', '+94 77 234 9811', 'Resident', 'Residential Account', '12 Galle Road, Colombo 03', 'Colombo Fort', 1240, 84.5, 14, 'Active'),
  ('USR-201', 'Kasun Wickramasinghe', 'leader@ecopulse.org', '+94 77 123 4567', 'Crew Leader', 'Municipal Crew Leader', 'Station 4 Depot, Colombo Fort', 'Colombo Fort', 0, 0, 0, 'Active'),
  ('USR-301', 'Sunil Perera', 'manager@ecopulse.org', '+94 11 254 9988', 'Manager', 'Center Manager', 'GreenPoly Processing Hub, North', 'Colombo Fort', 0, 0, 0, 'Active'),
  ('USR-401', 'Chief Elena Rostova', 'admin@ecopulse.org', '+94 11 900 1000', 'Admin', 'Municipal Administrator', 'City Hall Operations Center', 'Colombo Fort', 0, 0, 0, 'Active')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  account_type = EXCLUDED.account_type,
  address = EXCLUDED.address,
  zone = EXCLUDED.zone,
  status = EXCLUDED.status;

-- 5. Route Schedules
INSERT INTO public.route_schedules (id, zone, stream, day, time_slot, crew_name, notes)
VALUES
  ('SCH-101', 'Colombo Fort', 'Plastic Recyclable', 'Monday', '07:30 - 12:00 PM', 'Crew #1 (Alpha Hauler)', 'Commercial corridor priority route')
ON CONFLICT (id) DO UPDATE SET
  zone = EXCLUDED.zone,
  stream = EXCLUDED.stream,
  day = EXCLUDED.day,
  time_slot = EXCLUDED.time_slot,
  crew_name = EXCLUDED.crew_name,
  notes = EXCLUDED.notes;

-- 6. Initial Pickup Requests
INSERT INTO public.pickup_requests (id, resident_id, resident_name, address, zone, category, estimated_kg, actual_kg, pickup_date, time_slot, status, assigned_crew, notes, image_url, points_awarded, facility_id, facility_name)
VALUES
  ('REQ-4091', 'USR-101', 'Alex Mercer', '12 Galle Road, Colombo 03', 'Colombo Fort', 'Plastic Recyclable', 14, NULL, '2026-10-15', 'Morning Shift (8.00 a.m - 12.00 p.m)', 'Assigned', 'Crew #1 (Alpha Hauler)', 'Clean rinsed HDPE and PET bottles tied in blue clear bags.', 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80', 0, 'FAC-FORT', 'GreenPoly Central MRF & Segregation Center'),
  ('REQ-4092', 'USR-101', 'Alex Mercer', '88 Duplication Road, Kollupitiya', 'Kollupitiya', 'Paper & Cardboard', 20, NULL, '2026-10-16', 'Afternoon Shift (12.00 p.m - 5.00 p.m)', 'In Progress', 'Crew #2 (Echo Truck)', 'Flat packed cardboard boxes from moving.', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80', 0, 'FAC-KOLL', 'EcoFiber Pulp & Segregation Recovery Hub')
ON CONFLICT (id) DO NOTHING;

-- 7. Initial Recyclable Batch
INSERT INTO public.recyclable_batches (id, stream, weight_kg, source_zone, facility_id, facility_name, status, date, carrier_vehicle, yield_kg, recovery_rate, co2_saved_kg, request_id)
VALUES
  ('BAT-2026-01', 'Plastic Recyclable', 2450, 'Colombo Fort', 'FAC-FORT', 'GreenPoly Central MRF & Segregation Center', 'Allocated', '2026-09-04', 'Carrier Freight TR-904', NULL, NULL, 3675, 'REQ-4091')
ON CONFLICT (id) DO NOTHING;

-- 8. Complaints
INSERT INTO public.complaints (id, type, location, zone, priority, details, date, status, resolution_notes)
VALUES
  ('CMP-701', 'Missed Pickup', '14 Temple Trees Avenue, Colombo 03', 'Colombo Fort', 'High', 'Scheduled yellow bin plastic collection was not picked up during morning window.', '2026-10-12', 'In Review', 'Assigned supervisor to verify driver GPS log.')
ON CONFLICT (id) DO NOTHING;

-- 9. Initial Activity Feed
INSERT INTO public.activity_feed (text, time, dot)
VALUES
  ('EcoPulse Municipal Cloud synchronization initialized.', 'Just now', 'emerald'),
  ('7 Zone Segregation Centers operational across Colombo municipality.', '5m ago', 'emerald')
ON CONFLICT DO NOTHING;

-- =============================================================================
-- 10. SUPABASE AUTHENTICATION INTEGRATION & SEED USERS (auth.users)
-- =============================================================================
-- Enables pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Trigger function to automatically create or update public.users whenever
-- a user is created in Supabase Auth (via Dashboard "Add user" or API signup)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role TEXT;
  v_name TEXT;
  v_account_type TEXT;
  v_zone TEXT;
  v_phone TEXT;
BEGIN
  -- 1. Determine role
  IF NEW.raw_user_meta_data->>'role' IS NOT NULL AND NEW.raw_user_meta_data->>'role' <> '' THEN
    v_role := NEW.raw_user_meta_data->>'role';
  ELSIF NEW.email ILIKE '%admin%' THEN
    v_role := 'Admin';
  ELSIF NEW.email ILIKE '%manager%' THEN
    v_role := 'Manager';
  ELSIF NEW.email ILIKE '%leader%' THEN
    v_role := 'Crew Leader';
  ELSE
    v_role := 'Resident';
  END IF;

  -- 2. Determine display name
  IF NEW.raw_user_meta_data->>'name' IS NOT NULL AND NEW.raw_user_meta_data->>'name' <> '' THEN
    v_name := NEW.raw_user_meta_data->>'name';
  ELSIF NEW.email = 'admin@ecopulse.org' THEN
    v_name := 'Chief Elena Rostova';
  ELSIF NEW.email = 'manager@ecopulse.org' THEN
    v_name := 'Sunil Perera';
  ELSIF NEW.email = 'leader@ecopulse.org' THEN
    v_name := 'Kasun Wickramasinghe';
  ELSIF NEW.email = 'resident@ecopulse.org' THEN
    v_name := 'Alex Mercer';
  ELSE
    v_name := initcap(split_part(NEW.email, '@', 1));
  END IF;

  -- 3. Determine zone
  v_zone := COALESCE(NEW.raw_user_meta_data->>'zone', 'Colombo Fort');

  -- 4. Determine phone
  IF NEW.raw_user_meta_data->>'phone' IS NOT NULL AND NEW.raw_user_meta_data->>'phone' <> '' THEN
    v_phone := NEW.raw_user_meta_data->>'phone';
  ELSIF NEW.email = 'admin@ecopulse.org' THEN
    v_phone := '+94 11 900 1000';
  ELSIF NEW.email = 'manager@ecopulse.org' THEN
    v_phone := '+94 11 254 9988';
  ELSIF NEW.email = 'leader@ecopulse.org' THEN
    v_phone := '+94 77 123 4567';
  ELSIF NEW.email = 'resident@ecopulse.org' THEN
    v_phone := '+94 77 234 9811';
  ELSE
    v_phone := '+94 77 123 4567';
  END IF;

  -- 5. Determine account type
  IF v_role = 'Admin' THEN
    v_account_type := 'Municipal Admin';
  ELSIF v_role = 'Manager' THEN
    v_account_type := 'Center Manager';
  ELSIF v_role = 'Crew Leader' THEN
    v_account_type := 'Municipal Crew Leader';
  ELSE
    v_account_type := 'Residential Account';
  END IF;

  -- 6. Upsert into public.users (check by email first to prevent foreign key & unique key conflicts)
  IF EXISTS (SELECT 1 FROM public.users WHERE lower(email) = lower(NEW.email)) THEN
    UPDATE public.users
    SET
      name = COALESCE(v_name, public.users.name),
      role = COALESCE(v_role, public.users.role),
      account_type = COALESCE(v_account_type, public.users.account_type),
      phone = COALESCE(v_phone, public.users.phone),
      zone = COALESCE(v_zone, public.users.zone)
    WHERE lower(email) = lower(NEW.email);
  ELSE
    INSERT INTO public.users (
      id,
      name,
      email,
      phone,
      role,
      account_type,
      address,
      zone,
      status,
      registered_on,
      created_at
    )
    VALUES (
      NEW.id::text,
      v_name,
      NEW.email,
      v_phone,
      v_role,
      v_account_type,
      COALESCE(NEW.raw_user_meta_data->>'address', 'Curbside'),
      v_zone,
      'Active',
      CURRENT_DATE,
      COALESCE(NEW.created_at, now())
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Seed Default Municipal Accounts directly into auth.users (Supabase Authentication)
DO $$
DECLARE
  v_uid uuid;
  u_record RECORD;
BEGIN
  -- Set search_path so crypt and gen_salt resolve in extensions or public
  PERFORM set_config('search_path', current_setting('search_path') || ', extensions', true);

  FOR u_record IN (
    SELECT * FROM (VALUES
      ('admin@ecopulse.org', 'Admin@1234', 'Chief Elena Rostova', 'Admin', '+94 11 900 1000', 'Colombo Fort', 'City Hall Operations Center', 'Municipal Admin'),
      ('manager@ecopulse.org', 'Manager@1234', 'Sunil Perera', 'Manager', '+94 11 254 9988', 'Colombo Fort', 'GreenPoly Processing Hub, North', 'Center Manager'),
      ('leader@ecopulse.org', 'Leader@1234', 'Kasun Wickramasinghe', 'Crew Leader', '+94 77 123 4567', 'Colombo Fort', 'Station 4 Depot, Colombo Fort', 'Municipal Crew Leader'),
      ('resident@ecopulse.org', 'Resident@1234', 'Alex Mercer', 'Resident', '+94 77 234 9811', 'Colombo Fort', '12 Galle Road, Colombo 03', 'Residential Account')
    ) AS t(email, raw_password, name, role, phone, zone, address, account_type)
  )
  LOOP
    SELECT id INTO v_uid FROM auth.users WHERE email = u_record.email;

    IF v_uid IS NULL THEN
      v_uid := gen_random_uuid();

      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token
      )
      VALUES (
        '00000000-0000-0000-0000-000000000000',
        v_uid,
        'authenticated',
        'authenticated',
        u_record.email,
        crypt(u_record.raw_password, gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        json_build_object('name', u_record.name, 'role', u_record.role, 'phone', u_record.phone, 'zone', u_record.zone, 'address', u_record.address)::jsonb,
        now(),
        now(),
        '',
        ''
      );

      BEGIN
        INSERT INTO auth.identities (
          id,
          user_id,
          identity_data,
          provider,
          last_sign_in_at,
          created_at,
          updated_at
        )
        VALUES (
          v_uid::text,
          v_uid,
          json_build_object('sub', v_uid::text, 'email', u_record.email)::jsonb,
          'email',
          now(),
          now(),
          now()
        );
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;

    ELSE
      -- Update password and metadata if existing
      UPDATE auth.users
      SET
        encrypted_password = crypt(u_record.raw_password, gen_salt('bf')),
        raw_user_meta_data = json_build_object('name', u_record.name, 'role', u_record.role, 'phone', u_record.phone, 'zone', u_record.zone, 'address', u_record.address)::jsonb,
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
      WHERE id = v_uid;
    END IF;

    -- Also ensure public.users has matching record without touching id
    IF EXISTS (SELECT 1 FROM public.users WHERE lower(email) = lower(u_record.email)) THEN
      UPDATE public.users
      SET
        name = u_record.name,
        role = u_record.role,
        account_type = u_record.account_type,
        phone = u_record.phone,
        address = u_record.address,
        zone = u_record.zone
      WHERE lower(email) = lower(u_record.email);
    ELSE
      INSERT INTO public.users (
        id,
        name,
        email,
        phone,
        role,
        account_type,
        address,
        zone,
        status,
        registered_on,
        created_at
      )
      VALUES (
        v_uid::text,
        u_record.name,
        u_record.email,
        u_record.phone,
        u_record.role,
        u_record.account_type,
        u_record.address,
        u_record.zone,
        'Active',
        CURRENT_DATE,
        now()
      );
    END IF;

  END LOOP;
END $$;

