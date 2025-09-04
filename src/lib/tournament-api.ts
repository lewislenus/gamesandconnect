import { supabase } from '@/integrations/supabase/client';

export interface TournamentResult {
  id?: string;
  event_id?: string;
  tournament_name: string;
  game_type: string;
  winning_team: 'red' | 'blue' | 'green' | 'yellow';
  runner_up_team?: 'red' | 'blue' | 'green' | 'yellow';
  tournament_date: string;
  participants_count?: number;
  description?: string;
  highlight_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TeamWinStats {
  team_name: 'red' | 'blue' | 'green' | 'yellow';
  total_wins: number;
  recent_win_date: string;
}

/**
 * Get recent tournament winners
 */
export async function getRecentWinners(limit: number = 5): Promise<TournamentResult[]> {
  try {
    const { data, error } = await supabase.rpc('get_recent_winners', { 
      limit_count: limit 
    });

    if (error) {
      console.error('Error fetching recent winners:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch recent winners:', error);
    return [];
  }
}

/**
 * Get team winning statistics
 */
export async function getTeamWinStats(): Promise<TeamWinStats[]> {
  try {
    const { data, error } = await supabase.rpc('get_team_wins_stats');

    if (error) {
      console.error('Error fetching team win stats:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch team win stats:', error);
    return [];
  }
}

/**
 * Get all tournament results with optional filtering
 */
export async function getTournamentResults(
  gameType?: string,
  winningTeam?: string,
  limit?: number
): Promise<TournamentResult[]> {
  try {
    let query = supabase
      .from('tournament_results')
      .select('*')
      .order('tournament_date', { ascending: false });

    if (gameType) {
      query = query.eq('game_type', gameType);
    }

    if (winningTeam) {
      query = query.eq('winning_team', winningTeam);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tournament results:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch tournament results:', error);
    return [];
  }
}

/**
 * Add a new tournament result
 */
export async function addTournamentResult(result: Omit<TournamentResult, 'id' | 'created_at' | 'updated_at'>): Promise<TournamentResult | null> {
  try {
    const { data, error } = await supabase
      .from('tournament_results')
      .insert([result])
      .select()
      .single();

    if (error) {
      console.error('Error adding tournament result:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to add tournament result:', error);
    return null;
  }
}

/**
 * Get team colors and display information
 */
export function getTeamDisplayInfo(teamName: 'red' | 'blue' | 'green' | 'yellow') {
  const teamInfo = {
    red: {
      name: 'Team Red',
      emoji: '🔥',
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-red-600',
      motto: 'Fire & Passion'
    },
    blue: {
      name: 'Team Blue',
      emoji: '🌊',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-blue-600',
      motto: 'Ocean Deep'
    },
    green: {
      name: 'Team Green',
      emoji: '🌿',
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      gradientFrom: 'from-green-500',
      gradientTo: 'to-green-600',
      motto: 'Nature\'s Force'
    },
    yellow: {
      name: 'Team Yellow',
      emoji: '⚡',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500',
      gradientFrom: 'from-yellow-500',
      gradientTo: 'to-yellow-600',
      motto: 'Lightning Speed'
    }
  };

  return teamInfo[teamName];
}

/**
 * Format tournament date for display
 */
export function formatTournamentDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
