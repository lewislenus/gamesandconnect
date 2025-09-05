-- Create tournament results table to track winning teams
CREATE TABLE IF NOT EXISTS public.tournament_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
    tournament_name TEXT NOT NULL,
    game_type TEXT NOT NULL, -- 'FIFA', 'Call of Duty', 'Mobile Legends', 'Board Games', etc.
    winning_team TEXT NOT NULL, -- 'red', 'blue', 'green', 'yellow'
    runner_up_team TEXT, -- optional runner-up team
    tournament_date DATE NOT NULL,
    prize_amount DECIMAL(10,2),
    participants_count INTEGER DEFAULT 0,
    description TEXT,
    highlight_image TEXT, -- URL to tournament highlight image
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on tournament_date for efficient querying of recent results
CREATE INDEX idx_tournament_results_date ON public.tournament_results(tournament_date DESC);

-- Create an index on winning_team for efficient team filtering
CREATE INDEX idx_tournament_results_winning_team ON public.tournament_results(winning_team);

-- Enable RLS (Row Level Security)
ALTER TABLE public.tournament_results ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Tournament results are viewable by everyone" ON public.tournament_results
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert
CREATE POLICY "Authenticated users can insert tournament results" ON public.tournament_results
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update their own results
CREATE POLICY "Authenticated users can update tournament results" ON public.tournament_results
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert some sample tournament results based on actual events
INSERT INTO public.tournament_results (
    tournament_name,
    game_type,
    winning_team,
    runner_up_team,
    tournament_date,
    participants_count,
    description,
    highlight_image
) VALUES 
(
    'Akosombo Games Day - Action Packed Day Trip',
    'Outdoor Games',
    'green',
    'blue',
    '2025-06-15',
    28,
    'Team Green dominated the outdoor games session at beautiful Lake Volta, showing exceptional teamwork during the boat activities and team building challenges.',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918906/_MG_2027_oblrvo.jpg'
),
(
    'Beach Day & Games Tournament',
    'Beach Sports',
    'red',
    'yellow',
    '2025-07-08',
    24,
    'Team Red brought the fire to Labadi Beach with incredible beach volleyball skills and unmatched energy during water activities.',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2393_cv5xbp.jpg'
),
(
    'Aburi Gardens Adventure Challenge',
    'Nature Activities',
    'green',
    'blue',
    '2025-08-22',
    20,
    'Team Green proved their nature mastery during the botanical gardens exploration, excelling in hiking challenges and environmental activities.',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915398/_MG_2403_hknyss.jpg'
),
(
    'Cape Coast Historical Quiz & Games',
    'Educational Games',
    'yellow',
    'red',
    '2025-08-14',
    32,
    'Team Yellow showcased their knowledge and strategic thinking during our historical castle tour games and cultural challenges at Cape Coast.',
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915401/_MG_2185_rqpdrv.jpg'
);

-- Create a function to get recent winners
CREATE OR REPLACE FUNCTION get_recent_winners(limit_count INTEGER DEFAULT 5)
RETURNS TABLE (
    tournament_name TEXT,
    game_type TEXT,
    winning_team TEXT,
    runner_up_team TEXT,
    tournament_date DATE,
    participants_count INTEGER,
    description TEXT,
    highlight_image TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tr.tournament_name,
        tr.game_type,
        tr.winning_team,
        tr.runner_up_team,
        tr.tournament_date,
        tr.participants_count,
        tr.description,
        tr.highlight_image
    FROM public.tournament_results tr
    ORDER BY tr.tournament_date DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get team winning statistics
CREATE OR REPLACE FUNCTION get_team_wins_stats()
RETURNS TABLE (
    team_name TEXT,
    total_wins BIGINT,
    recent_win_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tr.winning_team as team_name,
        COUNT(*) as total_wins,
        MAX(tr.tournament_date) as recent_win_date
    FROM public.tournament_results tr
    GROUP BY tr.winning_team
    ORDER BY total_wins DESC, recent_win_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION get_recent_winners(INTEGER) TO PUBLIC;
GRANT EXECUTE ON FUNCTION get_team_wins_stats() TO PUBLIC;
