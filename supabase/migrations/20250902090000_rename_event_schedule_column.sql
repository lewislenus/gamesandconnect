-- Migration: Rename spaced column "event schedule" to snake_case event_schedule if needed
-- Date: 2025-09-02
-- Safe conditional rename to avoid errors if already renamed
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'event schedule'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'event_schedule'
  ) THEN
    EXECUTE 'ALTER TABLE public.events RENAME COLUMN "event schedule" TO event_schedule';
  END IF;
END$$;

-- Optional: document new column type. If text already fine, no change.
-- COMMENT ON COLUMN public.events.event_schedule IS 'Event schedule lines (text) or JSONB in future.';
