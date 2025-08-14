-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('trivia', 'gaming', 'travel', 'social')),
  spots INTEGER NOT NULL,
  total_spots INTEGER NOT NULL,
  price TEXT NOT NULL,
  image TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'filling-fast', 'almost-full', 'full')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read events (public events)
CREATE POLICY "Events are publicly viewable" 
ON public.events 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample events
INSERT INTO public.events (title, description, date, time, location, category, spots, total_spots, price, image, status) VALUES
('Trivia Friday', 'Weekly trivia night with prizes and fun challenges', 'December 15, 2024', '7:00 PM', 'Online via Zoom', 'trivia', 20, 30, 'Free', '🧠', 'open'),
('Accra Beach Cleanup & Fun Day', 'Help clean Laboma Beach followed by games and BBQ', 'December 22, 2024', '10:00 AM - 4:00 PM', 'Laboma Beach, Accra', 'travel', 5, 25, '₵50', '🏖️', 'filling-fast'),
('FIFA Tournament', 'FIFA 24 tournament with cash prizes for winners', 'December 28, 2024', '2:00 PM - 8:00 PM', 'East Legon Game Center', 'gaming', 12, 16, '₵30', '🎮', 'open'),
('New Year Kumasi Trip', '3-day adventure exploring the cultural heart of Ghana', 'December 30, 2024 - January 1, 2025', 'All Day', 'Kumasi', 'travel', 2, 20, '₵800', '🚌', 'almost-full'),
('Board Game Night', 'Monopoly, Scrabble, and local games with snacks', 'January 5, 2025', '6:00 PM - 10:00 PM', 'Osu Community Center', 'social', 15, 20, '₵25', '🎲', 'open'),
('Cooking Challenge', 'Learn to cook traditional Ghanaian dishes together', 'January 12, 2025', '3:00 PM - 7:00 PM', 'Tema Community Kitchen', 'social', 8, 12, '₵40', '👨‍🍳', 'open');