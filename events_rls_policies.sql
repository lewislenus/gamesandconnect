-- ============================================
-- Row Level Security (RLS) Policies for Events Table
-- Run this in your Supabase SQL Editor
-- ============================================

-- Enable RLS on the events table (if not already enabled)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts (if any)
DROP POLICY IF EXISTS "Events are publicly viewable" ON public.events;
DROP POLICY IF EXISTS "Admins can manage all events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;

-- ============================================
-- PUBLIC ACCESS POLICIES
-- ============================================

-- 1. Allow everyone (including anonymous users) to read events
-- This is for your public website where visitors can see events
CREATE POLICY "Public can view all events"
ON public.events
FOR SELECT
USING (true);

-- ============================================
-- ADMIN ACCESS POLICIES
-- ============================================

-- 2. Allow admins to perform all operations (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Admins have full access to events"
ON public.events
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- ============================================
-- AUTHENTICATED USER POLICIES (Optional)
-- ============================================

-- 3. Allow authenticated users to view events (redundant with policy 1, but useful if you want to restrict later)
CREATE POLICY "Authenticated users can view events"
ON public.events
FOR SELECT
USING (auth.role() = 'authenticated');

-- ============================================
-- EVENT REGISTRATION POLICIES (if you have event_registrations table)
-- ============================================

-- Enable RLS on event_registrations table (if it exists)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'event_registrations') THEN
        ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies
        DROP POLICY IF EXISTS "Users can view their own registrations" ON public.event_registrations;
        DROP POLICY IF EXISTS "Users can create their own registrations" ON public.event_registrations;
        DROP POLICY IF EXISTS "Users can update their own registrations" ON public.event_registrations;
        DROP POLICY IF EXISTS "Admins can view all registrations" ON public.event_registrations;
        DROP POLICY IF EXISTS "Admins can manage all registrations" ON public.event_registrations;
        
        -- Allow users to view their own registrations
        CREATE POLICY "Users can view their own registrations"
        ON public.event_registrations
        FOR SELECT
        USING (auth.uid() = user_id);
        
        -- Allow users to create their own registrations
        CREATE POLICY "Users can create their own registrations"
        ON public.event_registrations
        FOR INSERT
        WITH CHECK (auth.uid() = user_id);
        
        -- Allow users to update their own registrations (for cancellations, etc.)
        CREATE POLICY "Users can update their own registrations"
        ON public.event_registrations
        FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
        
        -- Allow admins to view all registrations
        CREATE POLICY "Admins can view all registrations"
        ON public.event_registrations
        FOR SELECT
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
          )
        );
        
        -- Allow admins to manage all registrations
        CREATE POLICY "Admins can manage all registrations"
        ON public.event_registrations
        FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
          )
        )
        WITH CHECK (
          EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'admin'
          )
        );
    END IF;
END $$;

-- ============================================
-- UTILITY FUNCTIONS FOR ADMIN CHECK
-- ============================================

-- Create a helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================
-- STORAGE POLICIES (for event images/flyers)
-- ============================================

-- If you're using Supabase Storage for event images, add these policies:
-- Note: Run these in the Storage settings, not in SQL editor

/*
-- For the 'events' bucket (create this bucket first in Storage)

-- Allow public access to view event images
CREATE POLICY "Public can view event images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'events');

-- Allow admins to upload event images
CREATE POLICY "Admins can upload event images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'events' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to update event images
CREATE POLICY "Admins can update event images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'events' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow admins to delete event images
CREATE POLICY "Admins can delete event images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'events' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Test these queries after applying the policies:

-- 1. Check if RLS is enabled
-- SELECT schemaname, tablename, rowsecurity 
-- FROM pg_tables 
-- WHERE tablename IN ('events', 'event_registrations', 'profiles');

-- 2. View all policies
-- SELECT schemaname, tablename, policyname, cmd, qual 
-- FROM pg_policies 
-- WHERE tablename IN ('events', 'event_registrations', 'profiles');

-- 3. Test admin function
-- SELECT public.is_admin();

-- ============================================
-- NOTES
-- ============================================

/*
POLICY BREAKDOWN:

1. PUBLIC ACCESS:
   - Anyone (even non-logged in users) can view events
   - This allows your website homepage and events page to work for all visitors

2. ADMIN ACCESS:
   - Only users with role = 'admin' in the profiles table can:
     * Create new events
     * Update existing events
     * Delete events
     * View all event registrations
     * Manage user registrations

3. USER ACCESS:
   - Authenticated users can view events (same as public)
   - Authenticated users can only manage their own registrations

4. SECURITY:
   - All policies check authentication where needed
   - Admin status is verified through the profiles table
   - Functions use SECURITY DEFINER for safe privilege escalation

TO CREATE AN ADMIN USER:
1. Sign up normally through your app
2. Run: UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

TO TEST:
1. Try accessing events without login (should work)
2. Try creating events without admin role (should fail)
3. Login as admin and try creating events (should work)
*/
