-- ========================================
-- Game Day Gallery Table - Complete Setup
-- ========================================

-- First, ensure admin_users table exists (if not already created)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id)
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'admin_users'
          AND policyname = 'Admins manage admin users'
    ) THEN
        DROP POLICY "Admins manage admin users" ON public.admin_users;
    END IF;
END $$;

CREATE POLICY "Admins manage admin users"
ON public.admin_users
FOR ALL
USING (public.is_admin_user(auth.jwt()->>'email'))
WITH CHECK (public.is_admin_user(auth.jwt()->>'email'));

-- Now create the game_day_gallery table
CREATE TABLE IF NOT EXISTS public.game_day_gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_game_day_gallery_is_active ON public.game_day_gallery(is_active);
CREATE INDEX IF NOT EXISTS idx_game_day_gallery_uploaded_at ON public.game_day_gallery(uploaded_at DESC);

-- Enable RLS
ALTER TABLE public.game_day_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can view active Game Day images" ON public.game_day_gallery;
    DROP POLICY IF EXISTS "Admins can view all Game Day images" ON public.game_day_gallery;
    DROP POLICY IF EXISTS "Admins can insert Game Day images" ON public.game_day_gallery;
    DROP POLICY IF EXISTS "Admins can update Game Day images" ON public.game_day_gallery;
    DROP POLICY IF EXISTS "Admins can delete Game Day images" ON public.game_day_gallery;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Policy: Public can view active images
CREATE POLICY "Anyone can view active Game Day images" ON public.game_day_gallery
  FOR SELECT USING (is_active = true);

-- Policy: Admins can view all images
CREATE POLICY "Admins can view all Game Day images" ON public.game_day_gallery
  FOR SELECT USING (public.is_admin_user(auth.jwt()->>'email'));

-- Policy: Authenticated users can submit images
CREATE POLICY "Authenticated users can submit Game Day images" ON public.game_day_gallery
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Admins can update images
CREATE POLICY "Admins can update Game Day images" ON public.game_day_gallery
  FOR UPDATE USING (public.is_admin_user(auth.jwt()->>'email'));

-- Policy: Admins can delete images
CREATE POLICY "Admins can delete Game Day images" ON public.game_day_gallery
  FOR DELETE USING (public.is_admin_user(auth.jwt()->>'email'));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_game_day_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS trigger_update_game_day_gallery_updated_at ON public.game_day_gallery;

-- Create trigger
CREATE TRIGGER trigger_update_game_day_gallery_updated_at
    BEFORE UPDATE ON public.game_day_gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_game_day_gallery_updated_at();

-- Add comment to table
COMMENT ON TABLE public.game_day_gallery IS 'Stores images for the Game Day @ Nexus 9 gallery page';

-- Success message
DO $$ 
BEGIN
    RAISE NOTICE 'Game Day Gallery table created successfully!';
END $$;

