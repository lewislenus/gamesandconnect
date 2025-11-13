-- Create game_day_gallery table for storing Game Day images
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

-- Policy: Public can view active images
CREATE POLICY "Anyone can view active Game Day images" ON public.game_day_gallery
  FOR SELECT USING (is_active = true);

-- Policy: Admins can view all images
CREATE POLICY "Admins can view all Game Day images" ON public.game_day_gallery
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users WHERE is_active = true
    )
  );

-- Policy: Admins can insert images
CREATE POLICY "Admins can insert Game Day images" ON public.game_day_gallery
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users WHERE is_active = true
    )
  );

-- Policy: Admins can update images
CREATE POLICY "Admins can update Game Day images" ON public.game_day_gallery
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users WHERE is_active = true
    )
  );

-- Policy: Admins can delete images
CREATE POLICY "Admins can delete Game Day images" ON public.game_day_gallery
  FOR DELETE USING (
    auth.uid() IN (
      SELECT user_id FROM public.admin_users WHERE is_active = true
    )
  );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_game_day_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_game_day_gallery_updated_at
    BEFORE UPDATE ON public.game_day_gallery
    FOR EACH ROW
    EXECUTE FUNCTION update_game_day_gallery_updated_at();

-- Add comment to table
COMMENT ON TABLE public.game_day_gallery IS 'Stores images for the Game Day @ Nexus 9 gallery page';

