-- Rename agenda column to event_schedule
ALTER TABLE public.events RENAME COLUMN agenda TO event_schedule;
