-- Fix RLS policies for gallery_items to allow proper admin operations

-- Drop existing policies
DROP POLICY IF EXISTS "Allow read access to gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON gallery_items;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON gallery_items;

-- Create more permissive policies for development
CREATE POLICY "Allow all read access to gallery items" ON gallery_items
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert access" ON gallery_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update access" ON gallery_items
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete access" ON gallery_items
  FOR DELETE USING (true);

-- Also check if we need to fix event_feedback policies
DROP POLICY IF EXISTS "Allow read access to event feedback" ON event_feedback;
DROP POLICY IF EXISTS "Allow insert for authenticated users feedback" ON event_feedback;
DROP POLICY IF EXISTS "Allow update for own feedback" ON event_feedback;

CREATE POLICY "Allow all read access to event feedback" ON event_feedback
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert access to event feedback" ON event_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update access to event feedback" ON event_feedback
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete access to event feedback" ON event_feedback
  FOR DELETE USING (true);

-- Fix RLS policies for events table
DROP POLICY IF EXISTS "events_select_policy" ON public.events;
DROP POLICY IF EXISTS "events_insert_policy" ON public.events;
DROP POLICY IF EXISTS "events_update_policy" ON public.events;
DROP POLICY IF EXISTS "events_delete_policy" ON public.events;

-- Create permissive policies for events table
CREATE POLICY "Allow all read access to events" ON public.events
  FOR SELECT USING (true);

CREATE POLICY "Allow all insert access to events" ON public.events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update access to events" ON public.events
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete access to events" ON public.events
  FOR DELETE USING (true);

-- Ensure RLS is enabled and permissions are granted
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.events TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
