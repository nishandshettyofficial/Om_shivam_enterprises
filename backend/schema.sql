-- =============================================================
-- OM SHIVAM ENTERPRISES — Supabase Database Schema Migration
-- =============================================================

-- 1. Users & Store Accounts
CREATE TABLE IF NOT EXISTS public.users (
  phone VARCHAR(20) PRIMARY KEY,
  email TEXT,
  handle TEXT UNIQUE,
  name TEXT,
  pin TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default store manager accounts
INSERT INTO public.users (phone, email, handle, name, pin, role)
VALUES 
  ('8147228162', 'admin@omshivam.com', '@om_shivam_admin', 'Store Manager', '1234', 'shopkeeper'),
  ('918147228162', 'admin@omshivam.com', '@om_shivam_admin_alt', 'Store Manager', '1234', 'shopkeeper'),
  ('9876543210', 'rahul@gmail.com', '@rahul_01', 'Rahul Sharma', '1234', 'customer')
ON CONFLICT (phone) DO UPDATE 
SET 
  role = EXCLUDED.role,
  handle = EXCLUDED.handle,
  name = EXCLUDED.name,
  pin = EXCLUDED.pin;

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  token VARCHAR(20) PRIMARY KEY,
  customer_name TEXT,
  customer_phone VARCHAR(20),
  customer_handle TEXT,
  pickup_time TEXT,
  extra_notes TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'RECEIVED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Print & Xerox Queue
CREATE TABLE IF NOT EXISTS public.print_jobs (
  id VARCHAR(20) PRIMARY KEY,
  customer_name TEXT,
  customer_phone VARCHAR(20),
  customer_handle TEXT,
  file_name TEXT,
  print_type TEXT,
  copies INT DEFAULT 1,
  binding TEXT,
  remarks TEXT,
  status VARCHAR(20) DEFAULT 'QUEUED',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Travel Inquiries Table
CREATE TABLE IF NOT EXISTS public.travel_requests (
  id VARCHAR(20) PRIMARY KEY,
  customer_name TEXT,
  customer_phone VARCHAR(20),
  travel_type TEXT,
  from_city TEXT,
  to_city TEXT,
  travel_date TEXT,
  passengers INT DEFAULT 1,
  notes TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for simple backend / anon API direct usage
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_jobs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_requests DISABLE ROW LEVEL SECURITY;

-- Grant access to anon and authenticated roles
GRANT ALL ON TABLE public.users TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.orders TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.print_jobs TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.travel_requests TO anon, authenticated, service_role;
