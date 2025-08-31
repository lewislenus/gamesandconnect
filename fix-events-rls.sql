-- Fix RLS policies for events table to allow admin operations
-- This should be run in your Supabase SQL editor

-- First, let's see current policies (optional - for debugging)
-- SELECT * FROM pg_policies WHERE tablename = 'events';

-- Drop existing restrictive policies if they exist
DROP POLICY IF EXISTS "events_select_policy" ON public.events;
DROP POLICY IF EXISTS "events_insert_policy" ON public.events;
DROP POLICY IF EXISTS "events_update_policy" ON public.events;
DROP POLICY IF EXISTS "events_delete_policy" ON public.events;

-- Create permissive policies for authenticated users (admins)
-- SELECT policy - allow all authenticated users to read events
CREATE POLICY "events_select_policy" ON public.events
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT policy - allow authenticated users to create events
CREATE POLICY "events_insert_policy" ON public.events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE policy - allow authenticated users to update events
CREATE POLICY "events_update_policy" ON public.events
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE policy - allow authenticated users to delete events
CREATE POLICY "events_delete_policy" ON public.events
  FOR DELETE
  TO authenticated
  USING (true);

-- Ensure RLS is enabled on the events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated role
GRANT ALL ON public.events TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
