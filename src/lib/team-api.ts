import { supabase } from '@/integrations/supabase/client';

export interface TeamMembership {
  id: string;
  user_email: string;
  full_name: string;
  phone_number?: string;
  team_name: 'red' | 'blue' | 'green' | 'yellow';
  join_date: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JoinTeamData {
  user_email: string;
  full_name: string;
  phone_number?: string;
  team_name: 'red' | 'blue' | 'green' | 'yellow';
}

export interface TeamStats {
  team_name: string;
  member_count: number;
  recent_members: Array<{
    full_name: string;
    join_date: string;
  }>;
}

/**
 * Join a team - creates a new team membership
 */
export async function joinTeam(data: JoinTeamData): Promise<{ success: boolean; data?: TeamMembership; error?: string }> {
  try {
    // First check if user is already in this team
    const { data: existingMembership } = await (supabase as any)
      .from('team_memberships')
      .select('*')
      .eq('user_email', data.user_email)
      .eq('team_name', data.team_name)
      .eq('is_active', true)
      .single();

    if (existingMembership) {
      return {
        success: false,
        error: `You are already a member of Team ${data.team_name.charAt(0).toUpperCase() + data.team_name.slice(1)}!`
      };
    }

    // Deactivate any existing team memberships for this user
    await (supabase as any)
      .from('team_memberships')
      .update({ is_active: false })
      .eq('user_email', data.user_email)
      .eq('is_active', true);

    // Insert new team membership
    const { data: newMembership, error } = await (supabase as any)
      .from('team_memberships')
      .insert({
        user_email: data.user_email,
        full_name: data.full_name,
        phone_number: data.phone_number,
        team_name: data.team_name,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error joining team:', error);
      return {
        success: false,
        error: `Failed to join team: ${error.message}`
      };
    }

    return {
      success: true,
      data: newMembership as TeamMembership
    };
  } catch (error) {
    console.error('Error in joinTeam:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get team statistics for all teams
 */
export async function getTeamStats(): Promise<{ success: boolean; data?: TeamStats[]; error?: string }> {
  try {
    const { data: memberships, error } = await (supabase as any)
      .from('team_memberships')
      .select('team_name, full_name, join_date')
      .eq('is_active', true)
      .order('join_date', { ascending: false });

    if (error) {
      console.error('Error fetching team stats:', error);
      return {
        success: false,
        error: `Failed to fetch team statistics: ${error.message}`
      };
    }

    // Group by team and calculate stats
    const teamStats: Record<string, TeamStats> = {};
    
    (memberships || []).forEach((membership: any) => {
      if (!teamStats[membership.team_name]) {
        teamStats[membership.team_name] = {
          team_name: membership.team_name,
          member_count: 0,
          recent_members: []
        };
      }
      
      teamStats[membership.team_name].member_count++;
      
      // Add to recent members (limit to 5)
      if (teamStats[membership.team_name].recent_members.length < 5) {
        teamStats[membership.team_name].recent_members.push({
          full_name: membership.full_name,
          join_date: membership.join_date
        });
      }
    });

    return {
      success: true,
      data: Object.values(teamStats)
    };
  } catch (error) {
    console.error('Error in getTeamStats:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get team members for a specific team
 */
export async function getTeamMembers(teamName: string): Promise<{ success: boolean; data?: TeamMembership[]; error?: string }> {
  try {
    const { data: members, error } = await (supabase as any)
      .from('team_memberships')
      .select('*')
      .eq('team_name', teamName)
      .eq('is_active', true)
      .order('join_date', { ascending: false });

    if (error) {
      console.error('Error fetching team members:', error);
      return {
        success: false,
        error: `Failed to fetch team members: ${error.message}`
      };
    }

    return {
      success: true,
      data: (members || []) as TeamMembership[]
    };
  } catch (error) {
    console.error('Error in getTeamMembers:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Get user's current team membership
 */
export async function getUserTeamMembership(userEmail: string): Promise<{ success: boolean; data?: TeamMembership; error?: string }> {
  try {
    const { data: membership, error } = await (supabase as any)
      .from('team_memberships')
      .select('*')
      .eq('user_email', userEmail)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user team membership:', error);
      return {
        success: false,
        error: `Failed to fetch team membership: ${error.message}`
      };
    }

    return {
      success: true,
      data: membership ? (membership as TeamMembership) : undefined
    };
  } catch (error) {
    console.error('Error in getUserTeamMembership:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Switch teams - deactivates current membership and creates new one
 */
export async function switchTeam(userEmail: string, newTeamData: Omit<JoinTeamData, 'user_email'>): Promise<{ success: boolean; data?: TeamMembership; error?: string }> {
  return joinTeam({
    user_email: userEmail,
    ...newTeamData
  });
}

/**
 * Leave current team
 */
export async function leaveTeam(userEmail: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('team_memberships')
      .update({ is_active: false })
      .eq('user_email', userEmail)
      .eq('is_active', true);

    if (error) {
      console.error('Error leaving team:', error);
      return {
        success: false,
        error: `Failed to leave team: ${error.message}`
      };
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error in leaveTeam:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}
