ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS agenda jsonb,
ADD COLUMN IF NOT EXISTS requirements jsonb,
ADD COLUMN IF NOT EXISTS includes jsonb;
