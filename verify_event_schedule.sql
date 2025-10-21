-- Verify Event Schedule Data in Supabase
-- Run this in Supabase SQL Editor to check your event schedule data
-- IMPORTANT: Column name is "event schedule" with a SPACE, not event_schedule with underscore

-- 1. Check if "event schedule" column exists and has data
SELECT 
    id,
    title,
    "event schedule" IS NOT NULL as has_schedule,
    length("event schedule") as schedule_text_length,
    organizer,
    requirements IS NOT NULL as has_requirements,
    includes IS NOT NULL as has_includes,
    capacity
FROM events
ORDER BY created_at DESC
LIMIT 10;

-- 2. View actual schedule data for events that have it
SELECT 
    id,
    title,
    "event schedule",
    organizer,
    capacity
FROM events
WHERE "event schedule" IS NOT NULL
ORDER BY created_at DESC;

-- 3. Check the data type and format of "event schedule" column
SELECT 
    id,
    title,
    pg_typeof("event schedule") as schedule_type,
    "event schedule"
FROM events
WHERE "event schedule" IS NOT NULL
LIMIT 5;

-- 4. If you need to add sample schedule data to an event:
-- Uncomment and modify this example:
-- NOTE: The column "event schedule" is TEXT type, not JSONB

/*
-- Option 1: Newline-separated text format (simpler)
UPDATE events
SET "event schedule" = '6:00 PM - Registration and Welcome
6:30 PM - Main Event Starts
8:00 PM - Break and Refreshments
8:30 PM - Final Session
9:00 PM - Closing and Networking',
organizer = 'Your Organization Name',
requirements = '["Requirement 1", "Requirement 2", "Requirement 3"]'::jsonb,
includes = '["What is included 1", "What is included 2", "What is included 3"]'::jsonb
WHERE title = 'Your Event Title Here';

-- Option 2: JSON string format (also works)
UPDATE events
SET "event schedule" = '[
  {"time": "6:00 PM", "activity": "Registration and Welcome"},
  {"time": "6:30 PM", "activity": "Main Event Starts"},
  {"time": "8:00 PM", "activity": "Break and Refreshments"},
  {"time": "8:30 PM", "activity": "Final Session"},
  {"time": "9:00 PM", "activity": "Closing and Networking"}
]',
organizer = 'Your Organization Name',
requirements = '["Requirement 1", "Requirement 2", "Requirement 3"]'::jsonb,
includes = '["What is included 1", "What is included 2", "What is included 3"]'::jsonb
WHERE title = 'Your Event Title Here';
*/

-- 5. Count events with and without schedules
SELECT 
    COUNT(*) FILTER (WHERE "event schedule" IS NOT NULL AND "event schedule" != '') as events_with_schedule,
    COUNT(*) FILTER (WHERE "event schedule" IS NULL OR "event schedule" = '') as events_without_schedule,
    COUNT(*) as total_events
FROM events;

-- 6. Check overall table structure to verify column names
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'events'
ORDER BY ordinal_position;

