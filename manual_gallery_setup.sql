-- Run this SQL in your Supabase SQL editor to create the required tables

-- 1. Create gallery_items table
CREATE TABLE IF NOT EXISTS gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  thumbnail TEXT,
  title TEXT NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create event_feedback table
CREATE TABLE IF NOT EXISTS event_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id INTEGER NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow read access to gallery items" ON gallery_items;
DROP POLICY IF EXISTS "Allow insert for authenticated users" ON gallery_items;
DROP POLICY IF EXISTS "Allow update for authenticated users" ON gallery_items;
DROP POLICY IF EXISTS "Allow read access to event feedback" ON event_feedback;
DROP POLICY IF EXISTS "Allow insert for authenticated users feedback" ON event_feedback;
DROP POLICY IF EXISTS "Allow update for own feedback" ON event_feedback;

-- Create policies for gallery_items
CREATE POLICY "Allow read access to gallery items" ON gallery_items
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow insert for authenticated users" ON gallery_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON gallery_items
  FOR UPDATE USING (true);

-- Create policies for event_feedback
CREATE POLICY "Allow read access to event feedback" ON event_feedback
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users feedback" ON event_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for own feedback" ON event_feedback
  FOR UPDATE USING (true);

-- Create indexes for gallery_items
CREATE INDEX IF NOT EXISTS idx_gallery_items_type ON gallery_items(type);
CREATE INDEX IF NOT EXISTS idx_gallery_items_uploaded_at ON gallery_items(uploaded_at);
CREATE INDEX IF NOT EXISTS idx_gallery_items_is_active ON gallery_items(is_active);

-- Create indexes for event_feedback
CREATE INDEX IF NOT EXISTS idx_event_feedback_event_id ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_event_feedback_user_email ON event_feedback(user_email);
CREATE INDEX IF NOT EXISTS idx_event_feedback_rating ON event_feedback(rating);

-- Add trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_gallery_items_updated_at ON gallery_items;
CREATE TRIGGER update_gallery_items_updated_at 
  BEFORE UPDATE ON gallery_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_feedback_updated_at ON event_feedback;
CREATE TRIGGER update_event_feedback_updated_at 
  BEFORE UPDATE ON event_feedback 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for gallery_items
INSERT INTO gallery_items (type, url, title, description, uploaded_by) VALUES
('image', 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg', 'Community Event Highlights', 'Amazing moments from our community gathering', 'admin'),
('image', 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1679_ovnanp.jpg', 'Group Activities', 'Fun group activities and team bonding', 'admin'),
('image', 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1684_pv0ohb.jpg', 'Team Building Session', 'Building stronger connections through teamwork', 'admin'),
('image', 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2393_cv5xbp.jpg', 'Team Red Champions', 'Team Red celebrating their victory', 'admin'),
('image', 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915398/_MG_2403_hknyss.jpg', 'Team Green Adventure', 'Team Green on their outdoor adventure', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data for event_feedback
INSERT INTO event_feedback (event_id, user_email, rating, feedback) VALUES
(1, 'user1@example.com', 5, 'Amazing event! Really enjoyed the activities.'),
(1, 'user2@example.com', 4, 'Great organization and fun activities.'),
(2, 'user3@example.com', 5, 'Best trivia night ever!'),
(2, 'user4@example.com', 4, 'Good questions and great atmosphere.'),
(3, 'user5@example.com', 5, 'Perfect beach cleanup initiative.'),
(4, 'user6@example.com', 4, 'Excellent tournament setup.'),
(26, 'user7@example.com', 5, 'Outstanding event planning.')
ON CONFLICT (id) DO NOTHING;
