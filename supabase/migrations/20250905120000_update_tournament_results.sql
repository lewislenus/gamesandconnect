-- Remove prize money from tournament results and correct team assignments
-- Team Green won Games day at Akosombo

-- Update tournament results to remove prize money and fix team assignments
UPDATE public.tournament_results SET 
    prize_amount = NULL
WHERE prize_amount IS NOT NULL;

-- Correct the Akosombo Games Day winner to Team Green
UPDATE public.tournament_results SET 
    winning_team = 'green',
    runner_up_team = 'blue'
WHERE tournament_name = 'Akosombo Games Day - Action Packed Day Trip';

-- Update the get_team_wins_stats function to remove prize money references
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

-- Update the get_recent_winners function to exclude prize money
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
