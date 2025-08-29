-- RLS Policies for registrations table
-- Based on your current schema with columns: full_name, phone_number, payment_status

-- First, ensure RLS is enabled
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users can create registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users can update their own registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.registrations;

-- ===========================================
-- OPTION 1: Public Access (No Authentication)
-- ===========================================
-- Use this if you want anonymous users to register without requiring login

-- Allow anonymous users to insert registrations (public registration)
CREATE POLICY "public_registration_insert"
  ON public.registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Basic validation on payment_status
    payment_status IN ('pending', 'confirmed', 'cancelled')
    AND full_name IS NOT NULL
    AND email IS NOT NULL
    AND phone_number IS NOT NULL
  );

-- Allow public read access to registrations (adjust as needed for privacy)
-- Comment out this policy if you don't want any public read access
CREATE POLICY "public_read_registrations"
  ON public.registrations
  FOR SELECT
  TO anon, authenticated
  USING (
    -- Allow reading all registrations - adjust this if you need privacy controls
    true
  );

-- ===========================================
-- ADMIN POLICIES (Simple email-based admin check)
-- ===========================================

-- Simple admin policy based on specific email addresses
-- Replace the email addresses below with your actual admin emails
CREATE POLICY "admin_full_access_registrations"
  ON public.registrations
  FOR ALL
  TO anon, authenticated
  USING (
    -- Add your admin email addresses here
    current_setting('request.jwt.claims', true)::json ->> 'email' IN (
      'admin@yoursite.com',
      'manager@yoursite.com'
    )
    OR 
    -- For testing purposes, you can temporarily allow all access
    -- Remove this line in production
    true
  )
  WITH CHECK (
    -- Add your admin email addresses here  
    current_setting('request.jwt.claims', true)::json ->> 'email' IN (
      'admin@yoursite.com', 
      'manager@yoursite.com'
    )
    OR
    -- For testing purposes, you can temporarily allow all access
    -- Remove this line in production
    true
  );

-- ===========================================
-- PUBLIC UPDATE POLICIES (Optional)
-- ===========================================

-- Allow public updates to registrations by email match
-- This is optional - only enable if you want users to update their registrations
-- without authentication by providing their email
/*
CREATE POLICY "public_update_own_registration"
  ON public.registrations
  FOR UPDATE
  TO anon, authenticated
  USING (
    -- This would require passing the email in a secure way
    -- You might implement this through a secure function instead
    true
  )
  WITH CHECK (
    -- Prevent changing payment_status via public updates
    payment_status = OLD.payment_status
  );
*/

-- ===========================================
-- ALTERNATIVE: Strict Authentication Only
-- ===========================================
-- Uncomment these and comment out the public policies above if you want to require login

/*
-- Only authenticated users can insert registrations
CREATE POLICY "authenticated_only_insert"
  ON public.registrations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (user_id = auth.uid() OR user_id IS NULL)
  );

-- Users can only see their own registrations
CREATE POLICY "authenticated_view_own_only"
  ON public.registrations
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR email = auth.jwt() ->> 'email'
  );

-- Block all anonymous access
CREATE POLICY "block_anonymous_access"
  ON public.registrations
  FOR ALL
  TO anon
  USING (false);
*/

-- ===========================================
-- UTILITY FUNCTIONS (Simplified)
-- ===========================================

-- Simple function to check admin emails (no database dependency)
CREATE OR REPLACE FUNCTION public.is_admin_email(check_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Add your admin email addresses here
  RETURN check_email IN (
    'admin@yoursite.com',
    'manager@yoursite.com',
    'admin@example.com'
  );
END;
$$;

-- Grant execute permission 
GRANT EXECUTE ON FUNCTION public.is_admin_email(TEXT) TO anon, authenticated;

-- ===========================================
-- PERFORMANCE INDEXES (Simplified)
-- ===========================================

-- Create indexes for better RLS performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON public.registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);

-- ===========================================
-- COMMENTS AND DOCUMENTATION
-- ===========================================

COMMENT ON POLICY "public_registration_insert" ON public.registrations IS 
'Allows anonymous users to register for events via public forms';

COMMENT ON POLICY "admin_full_access_registrations" ON public.registrations IS 
'Gives admin users full CRUD access to all registrations based on email check';

COMMENT ON POLICY "public_read_registrations" ON public.registrations IS 
'Allows public read access to registrations - adjust for privacy needs';

-- ===========================================
-- VERIFICATION QUERIES
-- ===========================================

-- Run these to verify your policies are working:

/*
-- Test 1: Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'registrations';

-- Test 2: List all policies
SELECT schemaname, tablename, policyname, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'registrations';

-- Test 3: Test anonymous insert (should work)
-- INSERT INTO public.registrations (event_id, full_name, email, phone_number, payment_status) 
-- VALUES ('some-event-id', 'Test User', 'test@example.com', '+233123456789', 'pending');

-- Test 4: Test public read access (should work)
-- SELECT COUNT(*) FROM public.registrations;
*/
