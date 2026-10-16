-- =============================================================================
-- EcoPulse Municipal Waste Management & Recycling System
-- Complete PostgreSQL Backend Schema for Supabase
-- =============================================================================

-- Clean up all triggers/functions that synced accounts to Supabase Auth tab (auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE; -- Removes any legacy trigger that copied auth sign-ups to public tables
DROP FUNCTION IF EXISTS public.handle_new_auth_user() CASCADE; -- Drops the trigger handler function that synced auth.users with public.users

-- Clear out any existing accounts from Supabase Authentication tab (auth.users)
-- All accounts are now stored exclusively in the dedicated database table public.users
DELETE FROM auth.identities; -- Clears linked third-party / email identity records from Supabase internal auth schema
DELETE FROM auth.users; -- Clears internal Supabase Auth records so user logins rely solely on public.users table

-- This script is 100% idempotent:
-- 1. Creates all 9 tables if they do not exist.
-- 2. Uses ALTER TABLE ... ADD COLUMN IF NOT EXISTS to safely upgrade existing tables.
-- 3. Enables permissive Row-Level Security (RLS) policies for anonymous/web clients.
-- 4. Registers tables with the Supabase Realtime publication.
-- 5. Seeds default municipal segregation centers, crews, personnel, and sample data.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores citizen residents, administrators, zone managers, and crew leaders
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users ( -- Creates the users table if it does not already exist
  id TEXT PRIMARY KEY, -- Unique user identifier string (e.g., 'USR-101' or UUID)
  name TEXT NOT NULL, -- Full legal/display name of the user (cannot be null)
  email TEXT NOT NULL, -- Email address used for authentication and notifications
  phone TEXT, -- Contact telephone number for pickup notifications
  role TEXT DEFAULT 'Resident', -- System authorization role: 'Resident', 'Crew Leader', 'Manager', or 'Admin'
  account_type TEXT DEFAULT 'Residential Account', -- Classification label (e.g. 'Residential Account', 'Municipal Administrator')
  address TEXT DEFAULT 'Curbside', -- Physical home address or department office for curbside service
  zone TEXT DEFAULT 'Colombo Fort', -- Assigned municipal administrative zone (e.g. 'Colombo Fort', 'Kollupitiya')
  eco_points NUMERIC DEFAULT 0, -- Accumulated gamification reward points earned by recycling
  total_recycled_kg NUMERIC DEFAULT 0, -- Cumulative kilograms of recyclable waste submitted by user
  pickups_completed INTEGER DEFAULT 0, -- Total count of successfully completed collection pickups
  status TEXT DEFAULT 'Active', -- Account status indicator (e.g., 'Active', 'Suspended')
  registered_on DATE DEFAULT CURRENT_DATE, -- Date when user account was registered (defaults to today)
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Timestamp with timezone when row was created
); -- Closes table creation statement

-- Upgrade existing users table if columns are missing (backward compatibility)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT; -- Adds plaintext/hashed password column for direct table login
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT; -- Adds phone contact column if missing
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Resident'; -- Adds user permission role column with 'Resident' default
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'Residential Account'; -- Adds account type classification column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS address TEXT DEFAULT 'Curbside'; -- Adds physical address column for pickup service
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS zone TEXT DEFAULT 'Colombo Fort'; -- Adds municipal zone designation column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS eco_points NUMERIC DEFAULT 0; -- Adds balance column for eco reward points
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS total_recycled_kg NUMERIC DEFAULT 0; -- Adds counter column for total kilograms recycled
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS pickups_completed INTEGER DEFAULT 0; -- Adds counter column for completed pickups
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active'; -- Adds account status column ('Active', etc.)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS registered_on DATE DEFAULT CURRENT_DATE; -- Adds registration date column
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds row creation timestamp column

-- Seed default passwords for system demonstration accounts (sets password if currently blank or null)
UPDATE public.users SET password = 'Admin@1234' WHERE lower(email) = 'admin@ecopulse.org' AND (password IS NULL OR password = ''); -- Sets demo password for Municipal Administrator
UPDATE public.users SET password = 'Manager@1234' WHERE lower(email) = 'manager@ecopulse.org' AND (password IS NULL OR password = ''); -- Sets demo password for Facility Center Manager
UPDATE public.users SET password = 'Leader@1234' WHERE lower(email) = 'leader@ecopulse.org' AND (password IS NULL OR password = ''); -- Sets demo password for Collection Crew Leader
UPDATE public.users SET password = 'Resident@1234' WHERE lower(email) = 'resident@ecopulse.org' AND (password IS NULL OR password = ''); -- Sets demo password for Citizen Resident

-- Drop any legacy CHECK constraints on users (e.g. users_role_check) that restrict valid municipal roles
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check; -- Removes outdated check constraint limiting role values
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_status_check; -- Removes outdated check constraint limiting status values


-- -----------------------------------------------------------------------------
-- 2. CREWS TABLE
-- Manages municipal waste collection teams, assigned trucks, and live performance metrics
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crews ( -- Creates crews table if it does not already exist
  id TEXT PRIMARY KEY, -- Unique crew identifier code (e.g. 'CREW-1')
  name TEXT NOT NULL, -- Call sign or team name (e.g. 'Crew #1 (Alpha Hauler)')
  zone TEXT NOT NULL, -- Municipal zone the crew is currently assigned to patrol
  truck_id TEXT NOT NULL, -- License plate or fleet asset number of assigned collection truck
  truck_capacity_kg NUMERIC DEFAULT 3500, -- Maximum carrying capacity of the vehicle in kilograms
  driver TEXT, -- Full name of assigned primary vehicle driver
  leader TEXT, -- Full name of the crew leader supervising the field collection route
  center_manager TEXT, -- Name of the facility manager overseeing this crew's drop-offs
  members INTEGER DEFAULT 3, -- Total headcount of sanitation personnel in this unit
  status TEXT DEFAULT 'Active', -- Operational status (e.g. 'Active En Route', 'Idle', 'Maintenance')
  stops_assigned INTEGER DEFAULT 0, -- Total pickup stops scheduled for the crew today
  stops_completed INTEGER DEFAULT 0, -- Number of pickup stops completed so far today
  on_time_rate TEXT DEFAULT '100%', -- Percentage metric measuring schedule punctuality
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Record insertion timestamp in UTC
); -- Closes table creation statement

-- Upgrade existing crews table if columns are missing
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS zone TEXT DEFAULT 'Colombo Fort'; -- Adds default zone column if upgrading from earlier version
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS truck_id TEXT DEFAULT 'TRK-101'; -- Adds truck identifier column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS truck_capacity_kg NUMERIC DEFAULT 3500; -- Adds truck capacity limit column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS driver TEXT; -- Adds assigned driver name column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS leader TEXT; -- Adds assigned crew leader column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS center_manager TEXT; -- Adds reporting center manager column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS members INTEGER DEFAULT 3; -- Adds crew size headcount column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active'; -- Adds crew operational status column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS stops_assigned INTEGER DEFAULT 0; -- Adds daily assigned stops count column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS stops_completed INTEGER DEFAULT 0; -- Adds daily completed stops count column
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS on_time_rate TEXT DEFAULT '100%'; -- Adds punctuality rate percentage string
ALTER TABLE public.crews ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds record creation timestamp


-- -----------------------------------------------------------------------------
-- 3. OPERATIONS PERSONNEL TABLE
-- Roster of field personnel, drivers, crew leaders, and facility managers
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.operations_personnel ( -- Creates operations personnel table if it does not already exist
  id TEXT PRIMARY KEY, -- Unique personnel employee ID (e.g. 'PER-101')
  name TEXT NOT NULL, -- Full name of the municipal employee
  role TEXT NOT NULL, -- Job designation (e.g. 'Crew Leader', 'Driver', 'Recycling Center Manager')
  phone TEXT, -- Primary contact phone number
  email TEXT, -- Official municipal email address
  zone TEXT, -- Operational zone where the employee is based
  assignment TEXT, -- Specific truck, unit, or segregation center assigned
  status TEXT DEFAULT 'Active / On Duty', -- Work availability status (e.g. 'Active / On Duty', 'On Leave')
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Record creation timestamp in UTC
); -- Closes table creation statement

-- Upgrade existing operations_personnel table if columns are missing
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS phone TEXT; -- Adds contact phone column
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS email TEXT; -- Adds email contact column
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS zone TEXT; -- Adds assigned municipal zone column
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS assignment TEXT; -- Adds detailed assignment/unit column
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active / On Duty'; -- Adds duty status column
ALTER TABLE public.operations_personnel ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds record creation timestamp


-- -----------------------------------------------------------------------------
-- 4. RECYCLING FACILITIES (ZONE SEGREGATION CENTERS) TABLE
-- Materials Recovery Facilities (MRF) and sorting plants across municipal zones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recycling_facilities ( -- Creates recycling facilities table if it does not exist
  id TEXT PRIMARY KEY, -- Unique facility code (e.g., 'FAC-FORT', 'FAC-KOLL')
  name TEXT NOT NULL, -- Formal name of the segregation facility or MRF
  type TEXT NOT NULL, -- Facility classification (e.g., 'Primary Segregation MRF', 'Cardboard Baling Hub')
  location TEXT NOT NULL, -- Physical street address / logistics park location
  zone TEXT NOT NULL, -- Designated municipal zone served by this center
  capacity_tons NUMERIC DEFAULT 100, -- Maximum storage and processing capacity in metric tons
  current_load_tons NUMERIC DEFAULT 0, -- Current amount of unsegregated/processed waste on site (tons)
  accepted_materials TEXT[] DEFAULT '{}', -- PostgreSQL text array of recyclable streams accepted at this facility
  contact_phone TEXT, -- Direct telephone hotline for facility dispatch
  status TEXT DEFAULT 'Certified Active', -- Operational accreditation status (e.g. 'Certified Active')
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Record creation timestamp in UTC
); -- Closes table creation statement

-- Upgrade existing recycling_facilities table if columns are missing
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Primary Segregation MRF'; -- Adds facility type description column
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Colombo Logistics Yard'; -- Adds location address column
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS zone TEXT DEFAULT 'Colombo Fort'; -- Adds service zone column
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS capacity_tons NUMERIC DEFAULT 100; -- Adds total holding capacity in tons
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS current_load_tons NUMERIC DEFAULT 0; -- Adds current holding load in tons
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS accepted_materials TEXT[] DEFAULT '{}'; -- Adds array column for accepted waste types
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS contact_phone TEXT; -- Adds facility contact telephone number
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Certified Active'; -- Adds facility operational status
ALTER TABLE public.recycling_facilities ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds record creation timestamp


-- -----------------------------------------------------------------------------
-- 5. PICKUP REQUESTS TABLE
-- Citizen and commercial on-demand recyclable waste collection requests
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pickup_requests ( -- Creates pickup requests table if it does not exist
  id TEXT PRIMARY KEY, -- Unique pickup booking reference (e.g. 'REQ-4091')
  resident_id TEXT, -- ID of the citizen user who placed the request (references users.id)
  resident_name TEXT NOT NULL, -- Full name of the resident requesting collection
  address TEXT NOT NULL, -- Street address where waste bins/bags are set out
  zone TEXT NOT NULL, -- Municipal zone of the pickup location
  category TEXT NOT NULL, -- Waste category (e.g. 'Plastic Recyclable', 'Paper & Cardboard')
  estimated_kg NUMERIC DEFAULT 10, -- Resident's preliminary estimated weight in kilograms
  actual_kg NUMERIC, -- Certified weight recorded by crew scale upon pickup
  pickup_date DATE, -- Scheduled collection date (YYYY-MM-DD)
  time_slot TEXT, -- Preferred pickup shift (e.g. 'Morning Shift (8.00 a.m - 12.00 p.m)')
  status TEXT DEFAULT 'Submitted', -- Status workflow: 'Submitted' -> 'Assigned' -> 'In Progress' -> 'Completed'
  assigned_crew TEXT DEFAULT 'Unassigned', -- Name or ID of the fleet crew dispatched to this job
  notes TEXT, -- Resident notes regarding packaging, access instructions, or gate codes
  image_url TEXT, -- Public URL of uploaded photograph verifying segregated materials
  points_awarded INTEGER DEFAULT 0, -- Eco-reward points credited to resident upon completion
  missed_reason TEXT, -- Explanation if collection could not be completed (e.g. contaminated waste)
  facility_id TEXT, -- Target segregation facility ID where batch will be deposited
  facility_name TEXT, -- Target segregation facility name
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Record creation timestamp in UTC
); -- Closes table creation statement

-- Upgrade existing pickup_requests table if columns are missing
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS resident_id TEXT; -- Adds user reference foreign key column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS actual_kg NUMERIC; -- Adds verified weight measurement column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS time_slot TEXT; -- Adds preferred time shift window column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Submitted'; -- Adds request workflow status column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS assigned_crew TEXT DEFAULT 'Unassigned'; -- Adds dispatched crew identifier column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS notes TEXT; -- Adds special instructions/notes column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS image_url TEXT; -- Adds proof-of-waste photo link column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS points_awarded INTEGER DEFAULT 0; -- Adds reward points granted column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS missed_reason TEXT; -- Adds failure/skip reason diagnostic column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS facility_id TEXT; -- Adds drop-off facility ID column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS facility_name TEXT; -- Adds drop-off facility name column
ALTER TABLE public.pickup_requests ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds record creation timestamp


-- -----------------------------------------------------------------------------
-- 6. RECYCLABLE BATCHES TABLE
-- Aggregated bulk recyclable material lots routed to recycling centers for processing
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recyclable_batches ( -- Creates recyclable batches table if it does not exist
  id TEXT PRIMARY KEY, -- Unique batch manifest number (e.g. 'BAT-2026-01')
  stream TEXT NOT NULL, -- Material stream type (e.g., 'Plastic Recyclable', 'Glass Cullet')
  weight_kg NUMERIC NOT NULL, -- Total bulk gross weight of the batch in kilograms
  source_zone TEXT NOT NULL, -- Municipal zone where the materials were collected
  facility_id TEXT, -- ID of the destination segregation MRF facility
  facility_name TEXT, -- Full name of the destination segregation facility
  status TEXT DEFAULT 'Allocated', -- Batch progress status ('Allocated', 'In Transit', 'Processing', 'Recovered')
  date DATE DEFAULT CURRENT_DATE, -- Date when the batch manifest was created
  carrier_vehicle TEXT, -- License plate or code of heavy haul vehicle transporting the batch
  yield_kg NUMERIC, -- Net weight of recovered high-purity recycled raw materials
  recovery_rate TEXT, -- Efficiency percentage calculation string (e.g. '92%')
  co2_saved_kg NUMERIC DEFAULT 0, -- Estimated greenhouse gas reduction in kg CO2 equivalent
  request_id TEXT, -- Optional associated source pickup request ID
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Record creation timestamp in UTC
); -- Closes table creation statement

-- Upgrade existing recyclable_batches table if columns are missing
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS facility_id TEXT; -- Adds destination segregation facility ID column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS facility_name TEXT; -- Adds destination facility name column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Allocated'; -- Adds processing state status column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE; -- Adds batch manifest logging date column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS carrier_vehicle TEXT; -- Adds transport freight vehicle code column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS yield_kg NUMERIC; -- Adds net recovered usable yield weight column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS recovery_rate TEXT; -- Adds efficiency percentage rate column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS co2_saved_kg NUMERIC DEFAULT 0; -- Adds carbon offset estimation metric column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS request_id TEXT; -- Adds link to origin pickup request column
ALTER TABLE public.recyclable_batches ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds record creation timestamp


-- -----------------------------------------------------------------------------
-- 7. ROUTE SCHEDULES TABLE
-- Master weekly recurring municipal curbside collection timetable
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.route_schedules ( -- Creates route schedules table if it does not exist
  id TEXT PRIMARY KEY, -- Unique route schedule identifier (e.g. 'SCH-101')
  zone TEXT NOT NULL, -- Target municipal zone for the scheduled run
  stream TEXT NOT NULL, -- Specific waste type collected on this day (e.g. 'Plastic Recyclable')
  day TEXT NOT NULL, -- Day of the week for collection (e.g. 'Monday', 'Wednesday')
  time_slot TEXT NOT NULL, -- Operating time window (e.g. '07:30 - 12:00 PM')
  crew_name TEXT, -- Designated sanitation crew assigned to run this recurring route
  notes TEXT, -- Driver route instructions, high-density areas, or traffic notes
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Record creation timestamp in UTC
); -- Closes table creation statement

-- Upgrade existing route_schedules table if columns are missing
ALTER TABLE public.route_schedules ADD COLUMN IF NOT EXISTS crew_name TEXT; -- Adds assigned crew name column
ALTER TABLE public.route_schedules ADD COLUMN IF NOT EXISTS notes TEXT; -- Adds route guidance notes column
ALTER TABLE public.route_schedules ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds record creation timestamp


-- -----------------------------------------------------------------------------
-- 8. COMPLAINTS & GRIEVANCES TABLE
-- Public grievances, illegal dumping alerts, and missed collection ticket tracking
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints ( -- Creates complaints table if it does not exist
  id TEXT PRIMARY KEY, -- Unique grievance ticket reference (e.g. 'CMP-701')
  type TEXT NOT NULL, -- Category of grievance (e.g. 'Missed Pickup', 'Overflowing Bin', 'Illegal Dumping')
  location TEXT NOT NULL, -- Specific street address or landmark where issue occurred
  zone TEXT NOT NULL, -- Municipal zone jurisdiction responsible for resolution
  priority TEXT DEFAULT 'Medium', -- Urgency triage rating ('Low', 'Medium', 'High', 'Emergency')
  details TEXT NOT NULL, -- Detailed description submitted by citizen or officer
  date DATE DEFAULT CURRENT_DATE, -- Date when grievance was lodged
  status TEXT DEFAULT 'Open', -- Resolution lifecycle status ('Open', 'In Review', 'Resolved', 'Dismissed')
  resolution_notes TEXT, -- Action taken by supervisor or crew to rectify the problem
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Record creation timestamp in UTC
); -- Closes table creation statement

-- Upgrade existing complaints table if columns are missing
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'Medium'; -- Adds urgency priority ranking column
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS date DATE DEFAULT CURRENT_DATE; -- Adds complaint filing date column
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Open'; -- Adds complaint lifecycle status column
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS resolution_notes TEXT; -- Adds supervisor remediation comments column
ALTER TABLE public.complaints ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds record creation timestamp


-- -----------------------------------------------------------------------------
-- 9. ACTIVITY FEED TABLE
-- Real-time system activity stream, event timeline, and municipal audit log
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_feed ( -- Creates activity feed table if it does not exist
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, -- Auto-incrementing 64-bit integer primary key
  text TEXT NOT NULL, -- Descriptive activity message (e.g. 'New collection scheduled in Fort')
  time TEXT NOT NULL, -- Human-friendly timestamp string (e.g. 'Just now', '5m ago')
  dot TEXT DEFAULT 'emerald', -- Color indicator for status badge dot (e.g., 'emerald', 'sky', 'amber')
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL -- Timestamp when event was logged in UTC
); -- Closes table creation statement

-- Upgrade existing activity_feed table if columns are missing
ALTER TABLE public.activity_feed ADD COLUMN IF NOT EXISTS dot TEXT DEFAULT 'emerald'; -- Adds UI status dot color indicator column
ALTER TABLE public.activity_feed ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()); -- Adds record creation timestamp


-- =============================================================================
-- ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- Ensures each table has RLS enabled with permissive policies for seamless web app access
-- =============================================================================

DO $$ -- Begins an anonymous procedural PL/pgSQL code block
DECLARE
  tbl text; -- Declares a text variable to iterate through each table name
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[ -- Unnests array of table names into a loop query
    'users', -- App users and profiles table
    'crews', -- Waste collection crew fleet table
    'operations_personnel', -- Operations staff roster table
    'recycling_facilities', -- Segregation centers and MRFs table
    'pickup_requests', -- Citizen collection bookings table
    'recyclable_batches', -- Batch processing manifest table
    'route_schedules', -- Weekly route timetable table
    'complaints', -- Grievances and tickets table
    'activity_feed' -- Live system event feed table
  ])
  LOOP -- Executes loop body for each table name
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', tbl); -- Turns on Row Level Security for table
    EXECUTE format('DROP POLICY IF EXISTS "Public full access on %I" ON public.%I;', tbl, tbl); -- Removes any conflicting previous policy
    EXECUTE format('CREATE POLICY "Public full access on %I" ON public.%I FOR ALL USING (true) WITH CHECK (true);', tbl, tbl); -- Grants full SELECT, INSERT, UPDATE, DELETE permissions to all clients
  END LOOP; -- Ends iteration over the tables
END $$; -- Terminates the procedural PL/pgSQL block


-- =============================================================================
-- SUPABASE REALTIME REPLICATION
-- Adds all tables to the supabase_realtime publication to enable WebSocket event broadcasting
-- =============================================================================

DO $$ -- Begins an anonymous procedural PL/pgSQL code block
DECLARE
  tbl text; -- Declares a text variable to hold each table name in turn
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[ -- Loops through each of the 9 core tables
    'users', -- Live updates when user accounts or points change
    'crews', -- Live updates when crews update their route progress
    'operations_personnel', -- Live updates when personnel duty status changes
    'recycling_facilities', -- Live updates when facility loads are adjusted
    'pickup_requests', -- Instant notifications when new pickups are booked or completed
    'recyclable_batches', -- Instant updates when recycling batches are processed
    'route_schedules', -- Live updates when collection schedules change
    'complaints', -- Instant alerts when citizen grievances are lodged or resolved
    'activity_feed' -- Real-time push updates for live dashboard audit log
  ])
  LOOP -- Executes publication registration for each table
    BEGIN -- Starts an inner exception block to safely handle duplicate registration
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I;', tbl); -- Subscribes table to Supabase Realtime engine
    EXCEPTION WHEN duplicate_object THEN -- Catches error if table is already registered in publication
      -- Already in publication, skip safely without erroring
      NULL; -- No operation required
    WHEN OTHERS THEN -- Catches any other exceptions (e.g. running in standard PostgreSQL without Supabase extensions)
      -- Publication might not exist in local environments, continue gracefully
      NULL; -- Suppresses error
    END; -- Ends inner exception block
  END LOOP; -- Ends iteration over tables
END $$; -- Terminates the procedural PL/pgSQL block


-- =============================================================================
-- DROP LEGACY CHECK CONSTRAINTS (IF ANY EXIST FROM OLD RUNS)
-- Clears rigid string constraints that could reject valid application roles, statuses, or foreign keys
-- =============================================================================
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check; -- Removes hardcoded check on allowed user roles
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_status_check; -- Removes hardcoded check on user status strings
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_resident_id_fkey; -- Removes strict foreign key constraint to avoid cascade issues
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_resident_id_fk; -- Removes alternative named foreign key constraint
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_status_check; -- Removes check constraint on pickup request status
ALTER TABLE public.pickup_requests DROP CONSTRAINT IF EXISTS pickup_requests_category_check; -- Removes check constraint on waste category names
ALTER TABLE public.crews DROP CONSTRAINT IF EXISTS crews_status_check; -- Removes check constraint on crew operational status
ALTER TABLE public.recyclable_batches DROP CONSTRAINT IF EXISTS recyclable_batches_status_check; -- Removes check constraint on batch processing status
ALTER TABLE public.recycling_facilities DROP CONSTRAINT IF EXISTS recycling_facilities_status_check; -- Removes check constraint on facility status
ALTER TABLE public.complaints DROP CONSTRAINT IF EXISTS complaints_status_check; -- Removes check constraint on complaint ticket status
ALTER TABLE public.complaints DROP CONSTRAINT IF EXISTS complaints_priority_check; -- Removes check constraint on complaint priority ratings

DO $$ -- Begins dynamic cleanup block to drop any residual constraints matching pattern
DECLARE
  r RECORD; -- Declares record variable to store constraint name and table name
BEGIN
  FOR r IN ( -- Queries PostgreSQL catalog for any remaining check constraints with role/status/category/priority
    SELECT conname, relname -- Selects constraint name and target table name
    FROM pg_constraint c -- Joins PostgreSQL constraint table
    JOIN pg_class t ON c.conrelid = t.oid -- Joins relation (table) catalog
    JOIN pg_namespace n ON t.relnamespace = n.oid -- Joins schema namespace catalog
    WHERE n.nspname = 'public' -- Restricts search to the public schema
      AND c.contype = 'c' -- Filter for CHECK constraints only (contype = 'c')
      AND conname NOT LIKE '%_not_null' -- Preserves NOT NULL validation constraints
      AND (conname LIKE '%role%' OR conname LIKE '%status%' OR conname LIKE '%category%' OR conname LIKE '%priority%') -- Target constraints
  )
  LOOP -- Iterates over all matching legacy constraints
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I;', r.relname, r.conname); -- Dynamically drops the legacy constraint
  END LOOP; -- Completes dynamic constraint cleanup loop
END $$; -- Terminates the procedural block


-- =============================================================================
-- MUNICIPAL SEED DATA (SAFE UPSERT)
-- Inserts default operational data; updates existing rows on conflict so script is safe to re-run
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Dedicated Municipal Zone Segregation Centers (1 per Colombo Zone)
-- -----------------------------------------------------------------------------
INSERT INTO public.recycling_facilities ( -- Inserts 7 primary zone segregation facilities
  id, -- Unique facility code
  name, -- Facility name
  type, -- Facility type / classification
  location, -- Physical address
  zone, -- Municipal zone
  capacity_tons, -- Max holding capacity in metric tons
  current_load_tons, -- Current tonnage on site
  accepted_materials, -- Array of accepted recyclable waste streams
  contact_phone, -- Dispatch phone number
  status -- Operational status
)
VALUES -- Specifies row tuples to insert
  ('FAC-FORT', 'GreenPoly Central MRF & Segregation Center', 'Primary Segregation MRF & Polymer Recovery', 'Plot 42, Harbor Logistics Park, Colombo Fort', 'Colombo Fort', 180, 42, ARRAY['PET & HDPE Plastics', 'Cardboard & Paper', 'Glass Bottles', 'Metal Cans'], '+94 11 254 9988', 'Certified Active'), -- Colombo Fort Center
  ('FAC-KOLL', 'EcoFiber Pulp & Segregation Recovery Hub', 'Cardboard Baling, Pulp Recovery & Rigid Plastics', 'Yard 8, Marine Drive Logistics Zone, Kollupitiya', 'Kollupitiya', 200, 65, ARRAY['Corrugated Cardboard', 'Office Paper', 'Cartons', 'Clean Plastics'], '+94 11 432 1100', 'Certified Active'), -- Kollupitiya Hub
  ('FAC-BORE', 'Borella Municipal Resource Recovery & Segregation Center', 'Multi-Stream Sort Line & Organic Composting Hub', 'Baseline Road Municipal Complex, Borella', 'Borella', 220, 58, ARRAY['Organic Biomass', 'Plastics', 'Paper & Packaging', 'Scrap Metal'], '+94 11 267 8890', 'Certified Active'), -- Borella Center
  ('FAC-WELL', 'Wellawatte Coastal Segregation & Refinement Facility', 'Glass Cullet, High-Density Polymers & Metal Sorting', 'W.A. Silva Mawatha Processing Yard, Wellawatte', 'Wellawatte', 150, 38, ARRAY['Glass Bottles & Jars', 'Aluminum Cans', 'Scrap Steel', 'Rigid Plastics'], '+94 11 258 7766', 'Certified Active'), -- Wellawatte Facility
  ('FAC-DEHI', 'Dehiwala CleanStream Segregation Depot', 'Dry Recyclables & High-Density Polymers MRF', 'Station Road Municipal Depot, Dehiwala', 'Dehiwala', 160, 40, ARRAY['HDPE / PET Plastics', 'Cardboard Boxes', 'Tin Cans', 'Paper'], '+94 11 271 3344', 'Certified Active'), -- Dehiwala Depot
  ('FAC-KOTT', 'Sri Jayawardenepura Kotte EcoHub & Segregation Plant', 'Smart Sorting Facility, Biomass & E-Waste Processing', 'Parliament Road Green Logistics Corridor, Kotte', 'Kotte', 190, 52, ARRAY['E-Waste', 'Organic Compost', 'Packaging Films', 'Metals'], '+94 11 288 9911', 'Certified Active'), -- Kotte EcoHub
  ('FAC-NUGE', 'Nugegoda High-Capacity Materials Processing & Segregation Terminal', 'Comprehensive High-Volume Municipal Sorting & Baling MRF', 'High Level Road Environmental Center, Nugegoda', 'Nugegoda', 250, 75, ARRAY['PET / HDPE Rigid Plastics', 'Corrugated Cartons', 'Biomass', 'Scrap Aluminum'], '+94 11 282 4455', 'Certified Active') -- Nugegoda Terminal
ON CONFLICT (id) DO UPDATE SET -- If facility ID already exists, update its details to latest seed values
  name = EXCLUDED.name, -- Overwrites name with new value
  type = EXCLUDED.type, -- Overwrites type with new value
  location = EXCLUDED.location, -- Overwrites location address
  zone = EXCLUDED.zone, -- Overwrites municipal zone
  capacity_tons = EXCLUDED.capacity_tons, -- Overwrites max capacity
  accepted_materials = EXCLUDED.accepted_materials, -- Overwrites accepted materials list
  contact_phone = EXCLUDED.contact_phone, -- Overwrites phone hotline
  status = EXCLUDED.status; -- Overwrites operational status

-- -----------------------------------------------------------------------------
-- 2. Fleet Crews
-- -----------------------------------------------------------------------------
INSERT INTO public.crews ( -- Inserts initial sanitation collection crews
  id, -- Crew ID
  name, -- Crew team name
  zone, -- Assigned zone
  truck_id, -- Assigned truck ID and vehicle type
  truck_capacity_kg, -- Max truck load in kilograms
  driver, -- Assigned driver name
  leader, -- Assigned supervisor / crew leader
  center_manager, -- Destination facility manager
  members, -- Number of crew members
  status, -- Real-time transit status
  stops_assigned, -- Scheduled stops for today
  stops_completed, -- Completed stops so far
  on_time_rate -- Punctuality percentage
)
VALUES -- Row values for crews
  ('CREW-1', 'Crew #1 (Alpha Hauler)', 'Colombo Fort', 'TRK-101 (Compactor)', 8000, 'David Kowalski', 'Kasun Wickramasinghe', 'Sunil Perera (GreenPoly MRF)', 3, 'Active En Route', 22, 18, '96%'), -- Crew 1 in Colombo Fort
  ('CREW-2', 'Crew #2 (Echo Truck)', 'Kollupitiya', 'TRK-104 (Dry Recycler)', 5000, 'Maria Santos', 'Nimal Jayawardena', 'Dilani Samarasekera (EcoFiber Plant)', 2, 'Active En Route', 18, 14, '98%') -- Crew 2 in Kollupitiya
ON CONFLICT (id) DO UPDATE SET -- If crew ID already exists, update to seed values
  name = EXCLUDED.name, -- Updates crew name
  zone = EXCLUDED.zone, -- Updates operational zone
  truck_id = EXCLUDED.truck_id, -- Updates truck assignment
  truck_capacity_kg = EXCLUDED.truck_capacity_kg, -- Updates truck payload limit
  driver = EXCLUDED.driver, -- Updates assigned driver
  leader = EXCLUDED.leader, -- Updates assigned crew leader
  center_manager = EXCLUDED.center_manager, -- Updates center manager contact
  members = EXCLUDED.members, -- Updates crew team headcount
  status = EXCLUDED.status; -- Updates current status

-- -----------------------------------------------------------------------------
-- 3. Operations Personnel Roster
-- -----------------------------------------------------------------------------
INSERT INTO public.operations_personnel ( -- Inserts initial staff roster records
  id, -- Staff ID
  name, -- Employee full name
  role, -- Job title/role
  phone, -- Phone number
  email, -- Work email
  zone, -- Base zone
  assignment, -- Assigned vehicle or facility
  status -- Duty status
)
VALUES -- Staff records
  ('PER-101', 'Kasun Wickramasinghe', 'Crew Leader', '+94 77 123 4567', 'leader@ecopulse.org', 'Colombo Fort', 'Alpha Hauler Unit', 'Active / On Duty'), -- Crew Leader for Alpha Hauler
  ('PER-102', 'David Kowalski', 'Driver', '+94 71 882 1192', 'david.k@citypulse.org', 'Colombo Fort', 'Heavy Compactor (TRK-101)', 'Active / On Duty'), -- Compactor Driver
  ('PER-103', 'Sunil Perera', 'Recycling Center Manager', '+94 11 254 9988', 'manager@ecopulse.org', 'Colombo Fort', 'GreenPoly Circular Polymers MRF', 'Active / On Duty'), -- Manager at GreenPoly MRF
  ('PER-104', 'Nimal Jayawardena', 'Crew Leader', '+94 77 901 2345', 'nimal.j@citypulse.org', 'Kollupitiya', 'Echo Truck Unit', 'Active / On Duty'), -- Crew Leader for Echo Truck
  ('PER-105', 'Maria Santos', 'Driver', '+94 76 432 9011', 'maria.s@citypulse.org', 'Kollupitiya', 'Dry Recycler (TRK-104)', 'Active / On Duty'), -- Dry Recycler Driver
  ('PER-106', 'Dilani Samarasekera', 'Recycling Center Manager', '+94 11 432 1100', 'dilani.s@citypulse.org', 'Kollupitiya', 'EcoFiber Pulp & Paper Recovery Plant', 'Active / On Duty') -- Manager at EcoFiber Plant
ON CONFLICT (id) DO UPDATE SET -- If staff ID already exists, update information
  name = EXCLUDED.name, -- Updates staff name
  role = EXCLUDED.role, -- Updates staff role
  phone = EXCLUDED.phone, -- Updates contact phone
  email = EXCLUDED.email, -- Updates contact email
  zone = EXCLUDED.zone, -- Updates assigned zone
  assignment = EXCLUDED.assignment, -- Updates unit assignment
  status = EXCLUDED.status; -- Updates duty status

-- -----------------------------------------------------------------------------
-- 4. Default System Users
-- Stored in database public.users table - completely separate from Supabase Auth tab
-- -----------------------------------------------------------------------------
INSERT INTO public.users ( -- Inserts predefined role accounts for demonstration and access
  id, -- User unique ID
  name, -- Full name
  email, -- Login email address
  password, -- Direct authentication password
  phone, -- Telephone number
  role, -- System permission role
  account_type, -- Account classification label
  address, -- Physical address
  zone, -- Municipal zone
  eco_points, -- Current reward points
  total_recycled_kg, -- Kilograms recycled
  pickups_completed, -- Pickups completed count
  status -- Account status
)
VALUES -- User account credentials
  ('USR-401', 'Chief Elena Rostova', 'admin@ecopulse.org', 'Admin@1234', '+94 11 900 1000', 'Admin', 'Municipal Administrator', 'City Hall Operations Center', 'Colombo Fort', 0, 0, 0, 'Active'), -- Admin demo account
  ('USR-301', 'Sunil Perera', 'manager@ecopulse.org', 'Manager@1234', '+94 11 254 9988', 'Manager', 'Center Manager', 'GreenPoly Processing Hub, North', 'Colombo Fort', 0, 0, 0, 'Active'), -- Manager demo account
  ('USR-201', 'Kasun Wickramasinghe', 'leader@ecopulse.org', 'Leader@1234', '+94 77 123 4567', 'Crew Leader', 'Municipal Crew Leader', 'Station 4 Depot, Colombo Fort', 'Colombo Fort', 0, 0, 0, 'Active'), -- Crew Leader demo account
  ('USR-101', 'Alex Mercer', 'resident@ecopulse.org', 'Resident@1234', '+94 77 234 9811', 'Resident', 'Residential Account', '12 Galle Road, Colombo 03', 'Colombo Fort', 1240, 84.5, 14, 'Active') -- Citizen Resident demo account
ON CONFLICT (id) DO UPDATE SET -- If user ID already exists, sync updated fields
  name = EXCLUDED.name, -- Updates user name
  email = EXCLUDED.email, -- Updates email
  password = EXCLUDED.password, -- Updates login password
  phone = EXCLUDED.phone, -- Updates phone number
  role = EXCLUDED.role, -- Updates role permission
  account_type = EXCLUDED.account_type, -- Updates account classification
  address = EXCLUDED.address, -- Updates address
  zone = EXCLUDED.zone, -- Updates zone
  status = EXCLUDED.status; -- Updates account status

-- -----------------------------------------------------------------------------
-- 5. Route Schedules
-- -----------------------------------------------------------------------------
INSERT INTO public.route_schedules ( -- Inserts recurring weekly schedule row
  id, -- Schedule ID
  zone, -- Municipal zone
  stream, -- Recyclable material stream
  day, -- Day of the week
  time_slot, -- Collection time window
  crew_name, -- Assigned collection crew
  notes -- Operational notes
)
VALUES -- Route schedule details
  ('SCH-101', 'Colombo Fort', 'Plastic Recyclable', 'Monday', '07:30 - 12:00 PM', 'Crew #1 (Alpha Hauler)', 'Commercial corridor priority route') -- Monday morning plastic route
ON CONFLICT (id) DO UPDATE SET -- If schedule ID already exists, update route details
  zone = EXCLUDED.zone, -- Updates zone
  stream = EXCLUDED.stream, -- Updates material stream
  day = EXCLUDED.day, -- Updates collection day
  time_slot = EXCLUDED.time_slot, -- Updates time slot
  crew_name = EXCLUDED.crew_name, -- Updates crew assigned
  notes = EXCLUDED.notes; -- Updates route notes

-- -----------------------------------------------------------------------------
-- 6. Initial Pickup Requests
-- -----------------------------------------------------------------------------
INSERT INTO public.pickup_requests ( -- Inserts sample citizen pickup orders
  id, -- Request ID
  resident_id, -- Requesting user ID
  resident_name, -- Requesting resident name
  address, -- Curbside pickup address
  zone, -- Municipal zone
  category, -- Recyclable waste category
  estimated_kg, -- Estimated weight
  actual_kg, -- Actual measured weight (null if not yet collected)
  pickup_date, -- Scheduled date
  time_slot, -- Preferred time slot
  status, -- Order status
  assigned_crew, -- Dispatched collection crew
  notes, -- Resident packaging notes
  image_url, -- Pre-pickup photo confirmation
  points_awarded, -- Reward points granted
  facility_id, -- Drop-off segregation center ID
  facility_name -- Drop-off segregation center name
)
VALUES -- Sample pickup requests
  ('REQ-4091', 'USR-101', 'Alex Mercer', '12 Galle Road, Colombo 03', 'Colombo Fort', 'Plastic Recyclable', 14, NULL, '2026-10-15', 'Morning Shift (8.00 a.m - 12.00 p.m)', 'Assigned', 'Crew #1 (Alpha Hauler)', 'Clean rinsed HDPE and PET bottles tied in blue clear bags.', 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=300&auto=format&fit=crop&q=80', 0, 'FAC-FORT', 'GreenPoly Central MRF & Segregation Center'), -- Assigned plastic request in Fort
  ('REQ-4092', 'USR-101', 'Alex Mercer', '88 Duplication Road, Kollupitiya', 'Kollupitiya', 'Paper & Cardboard', 20, NULL, '2026-10-16', 'Afternoon Shift (12.00 p.m - 5.00 p.m)', 'In Progress', 'Crew #2 (Echo Truck)', 'Flat packed cardboard boxes from moving.', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&auto=format&fit=crop&q=80', 0, 'FAC-KOLL', 'EcoFiber Pulp & Segregation Recovery Hub') -- In-progress cardboard request in Kollupitiya
ON CONFLICT (id) DO NOTHING; -- If request ID exists, preserve current runtime state without overwriting

-- -----------------------------------------------------------------------------
-- 7. Initial Recyclable Batch
-- -----------------------------------------------------------------------------
INSERT INTO public.recyclable_batches ( -- Inserts sample MRF recycling processing batch
  id, -- Batch manifest ID
  stream, -- Recyclable material stream
  weight_kg, -- Total bulk gross weight in kg
  source_zone, -- Origin collection zone
  facility_id, -- Destination MRF facility ID
  facility_name, -- Destination MRF facility name
  status, -- Current batch processing state
  date, -- Batch logging date
  carrier_vehicle, -- Transport truck identifier
  yield_kg, -- Recovered clean material yield in kg
  recovery_rate, -- Percentage recovery rate
  co2_saved_kg, -- Carbon offset in kilograms of CO2
  request_id -- Associated collection booking reference
)
VALUES -- Sample batch data
  ('BAT-2026-01', 'Plastic Recyclable', 2450, 'Colombo Fort', 'FAC-FORT', 'GreenPoly Central MRF & Segregation Center', 'Allocated', '2026-09-04', 'Carrier Freight TR-904', NULL, NULL, 3675, 'REQ-4091') -- Initial plastic batch allocated to GreenPoly MRF
ON CONFLICT (id) DO NOTHING; -- If batch already exists, leave existing record untouched

-- -----------------------------------------------------------------------------
-- 8. Complaints
-- -----------------------------------------------------------------------------
INSERT INTO public.complaints ( -- Inserts sample citizen grievance ticket
  id, -- Complaint ticket ID
  type, -- Issue type category
  location, -- Incident street address
  zone, -- Municipal zone
  priority, -- Urgency triage priority
  details, -- Citizen report description
  date, -- Report filed date
  status, -- Ticket lifecycle status
  resolution_notes -- Supervisor investigation notes
)
VALUES -- Sample complaint ticket
  ('CMP-701', 'Missed Pickup', '14 Temple Trees Avenue, Colombo 03', 'Colombo Fort', 'High', 'Scheduled yellow bin plastic collection was not picked up during morning window.', '2026-10-12', 'In Review', 'Assigned supervisor to verify driver GPS log.') -- High-priority missed pickup ticket
ON CONFLICT (id) DO NOTHING; -- If complaint ID already exists, do not overwrite status

-- -----------------------------------------------------------------------------
-- 9. Initial Activity Feed
-- -----------------------------------------------------------------------------
INSERT INTO public.activity_feed ( -- Inserts initial event log entries for dashboard activity feed
  text, -- Activity description text
  time, -- Relative timestamp display
  dot -- Status indicator badge color
)
VALUES -- Initial audit events
  ('EcoPulse Municipal Cloud synchronization initialized.', 'Just now', 'emerald'), -- System startup announcement
  ('7 Zone Segregation Centers operational across Colombo municipality.', '5m ago', 'emerald') -- Infrastructure status announcement
ON CONFLICT DO NOTHING; -- If identical entries exist, do not duplicate


-- =============================================================================
-- 10. DATABASE INDEXES FOR DIRECT TABLE AUTHENTICATION
-- =============================================================================
-- All accounts are stored exclusively in public.users (no data is sent to auth.users).
-- Unique index on email ensures fast and safe lookups for direct table login.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON public.users (lower(email)); -- Creates a case-insensitive unique index on the email column in public.users for lightning-fast logins and duplicate prevention
