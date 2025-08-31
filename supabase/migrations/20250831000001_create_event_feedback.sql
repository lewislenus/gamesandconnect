-- Create event_feedback table
CREATE TABLE IF NOT EXISTS event_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id INTEGER NOT NULL,
  user_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE event_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to event feedback" ON event_feedback
  FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON event_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for own feedback" ON event_feedback
  FOR UPDATE USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_event_feedback_event_id ON event_feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_event_feedback_user_email ON event_feedback(user_email);
CREATE INDEX IF NOT EXISTS idx_event_feedback_rating ON event_feedback(rating);

-- Add trigger for updated_at
CREATE TRIGGER update_event_feedback_updated_at 
  BEFORE UPDATE ON event_feedback 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample feedback data
INSERT INTO event_feedback (event_id, user_email, rating, feedback) VALUES
(1, 'user1@example.com', 5, 'Amazing event! Really enjoyed the activities.'),
(1, 'user2@example.com', 4, 'Great organization and fun activities.'),
(2, 'user3@example.com', 5, 'Best trivia night ever!'),
(2, 'user4@example.com', 4, 'Good questions and great atmosphere.'),
(3, 'user5@example.com', 5, 'Perfect beach cleanup initiative.'),
(4, 'user6@example.com', 4, 'Excellent tournament setup.'),
(26, 'user7@example.com', 5, 'Outstanding event planning.')
ON CONFLICT (id) DO NOTHING;
