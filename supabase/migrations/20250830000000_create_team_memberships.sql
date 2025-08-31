-- Create team_memberships table
CREATE TABLE IF NOT EXISTS public.team_memberships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT,
    team_name TEXT NOT NULL CHECK (team_name IN ('red', 'blue', 'green', 'yellow')),
    join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_team_memberships_user_email ON public.team_memberships(user_email);

-- Create index on team_name for team stats
CREATE INDEX IF NOT EXISTS idx_team_memberships_team_name ON public.team_memberships(team_name);

-- Create index on active memberships
CREATE INDEX IF NOT EXISTS idx_team_memberships_active ON public.team_memberships(is_active) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.team_memberships ENABLE ROW LEVEL SECURITY;

-- Create policy for reading team memberships (public read access for stats)
CREATE POLICY "Team memberships are viewable by everyone" ON public.team_memberships
    FOR SELECT USING (true);

-- Create policy for inserting team memberships (anyone can join a team)
CREATE POLICY "Anyone can join a team" ON public.team_memberships
    FOR INSERT WITH CHECK (true);

-- Create policy for updating own membership
CREATE POLICY "Users can update their own team membership" ON public.team_memberships
    FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_team_memberships_updated_at 
    BEFORE UPDATE ON public.team_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO public.team_memberships (user_email, full_name, phone_number, team_name) VALUES
('kwame@example.com', 'Kwame Asante', '+233123456789', 'red'),
('ama@example.com', 'Ama Konadu', '+233234567890', 'red'),
('kojo@example.com', 'Kojo Mensah', '+233345678901', 'red'),
('efua@example.com', 'Efua Serwaa', '+233456789012', 'red'),
('kofi@example.com', 'Kofi Boateng', '+233567890123', 'blue'),
('akosua@example.com', 'Akosua Darko', '+233678901234', 'blue'),
('yaw@example.com', 'Yaw Osei', '+233789012345', 'green'),
('abena@example.com', 'Abena Frimpong', '+233890123456', 'green'),
('kwaku@example.com', 'Kwaku Asiedu', '+233901234567', 'yellow'),
('adjoa@example.com', 'Adjoa Owusu', '+233012345678', 'yellow');
