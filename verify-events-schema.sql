-- Verify the events table structure matches the AdminEvents.tsx form
-- This should match the table definition you provided

-- Required fields that form validates:
-- title (text) ✓
-- description (text) ✓  
-- date (date) ✓
-- time_range (text) ✓
-- location (text) ✓
-- capacity (integer) ✓

-- Optional fields the form handles:
-- image_url (text) ✓
-- price (text) ✓
-- category (text) ✓
-- organizer (text) ✓ - now direct field instead of nested in additional_info
-- requirements (jsonb) ✓ - stored as array
-- includes (jsonb) ✓ - stored as array  
-- event_schedule (text) ✓ - agenda converted to newline-separated string
-- additional_info (jsonb) ✓ - now only contains long_description
-- gallery (jsonb) ✓ - set to null, can be extended later

-- Auto-generated fields:
-- id (bigint) - auto identity
-- created_at (timestamp) - defaults to now()

-- Test query to verify data structure:
SELECT 
  id,
  title,
  description, 
  date,
  time_range,
  location,
  category,
  price,
  capacity,
  organizer,
  image_url,
  requirements,
  includes,
  event_schedule,
  additional_info,
  gallery,
  created_at
FROM public.events 
ORDER BY created_at DESC 
LIMIT 1;
