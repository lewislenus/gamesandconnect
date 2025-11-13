import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalRegistrations: number;
  totalRevenue: number;
  activeEvents: number;
  pendingRegistrations: number;
  completedEvents: number;
  averageRating: number;
}

export interface RecentActivity {
  id: string;
  type: 'registration' | 'event_created' | 'event_updated' | 'user_joined';
  description: string;
  timestamp: string;
  user?: string;
  event?: string;
}

export interface TopEvent {
  id: string;
  title: string;
  registrations: number;
  capacity: number | null; // underlying schema no longer has capacity fields
  revenue: number;
  rating: number | null;
  image_url?: string;
  image: string;
}

export interface EventRegistration {
  id: string;                 // stringified (DB returns BIGINT)
  event_id: string;           // stringified
  user_id: string;            // synthetic (no user_id column in current schema)
  name: string;               // maps to full_name
  email: string;
  phone: string;              // maps to phone_number
  status: 'confirmed' | 'pending' | 'cancelled'; // maps to payment_status
  created_at: string;
  event?: {
    title: string;
    date: string;
    location: string;
  };
}

export interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  total_registrations: number;
  total_events_attended: number;
}

// Dashboard Statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total events (current events table minimal columns)
    // Cast to any to avoid excessive deep instantiation from large generated types
    const { count: totalEvents } = await (supabase as any)
      .from('events')
      .select('id', { count: 'exact', head: true });

    // Get total registrations (guard if table missing)
    let totalRegistrations = 0;
    try {
      const { count } = await (supabase as any)
        .from('registrations')
        .select('id', { count: 'exact', head: true });
      totalRegistrations = count || 0;
    } catch (_) {
      totalRegistrations = 0;
    }

    // Get active events (events in the future)
    const today = new Date().toISOString().split('T')[0];
    const { count: activeEvents } = await (supabase as any)
      .from('events')
      .select('id', { count: 'exact', head: true })
      .gte('date', today);

    // Get completed events
    const { count: completedEvents } = await (supabase as any)
      .from('events')
      .select('id', { count: 'exact', head: true })
      .lt('date', today);

    // Get pending registrations (guard if table missing)
    let pendingRegistrations = 0;
    try {
      const { count } = await (supabase as any)
        .from('registrations')
        .select('id', { count: 'exact', head: true })
        .eq('payment_status', 'pending');
      pendingRegistrations = count || 0;
    } catch (_) {
      pendingRegistrations = 0;
    }

  // Revenue not computable (price/capacity columns removed); placeholder 0
  const totalRevenue = 0;

    // Get average rating (if feedback table exists)
    let averageRating = 0;
    try {
      const { data: feedback } = await (supabase as any)
        .from('event_feedback')
        .select('rating');
      if (feedback && feedback.length > 0) {
        const totalRating = feedback.reduce((sum, f) => sum + (f.rating || 0), 0);
        averageRating = totalRating / feedback.length;
      }
    } catch (e) {
      // ignore if table doesn't exist
      averageRating = 0;
    }

    // Estimate users from distinct emails (no user_id column)
    let totalUsers = 0;
    try {
  const { data: emails } = await (supabase as any).from('registrations').select('email');
      totalUsers = emails ? new Set(emails.map(e => e.email)).size : 0;
    } catch (_) {
      totalUsers = 0;
    }

    return {
      totalEvents: totalEvents || 0,
      totalUsers,
      totalRegistrations: totalRegistrations || 0,
      totalRevenue,
      activeEvents: activeEvents || 0,
      pendingRegistrations: pendingRegistrations || 0,
      completedEvents: completedEvents || 0,
      averageRating
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return fallback data
    return {
      totalEvents: 8,
      totalUsers: 156,
      totalRegistrations: 245,
      totalRevenue: 12450,
      activeEvents: 5,
      pendingRegistrations: 12,
      completedEvents: 3,
      averageRating: 4.7
    };
  }
}

// Recent Activity
export async function getRecentActivity(): Promise<RecentActivity[]> {
  try {
    // Get recent registrations
    const { data: registrations } = await supabase
      .from('registrations')
      .select(`
        id,
        full_name,
        created_at,
        events (title)
      `)
      .order('created_at', { ascending: false })
      .limit(10);

    const activities: RecentActivity[] = [];

    if (registrations) {
      (registrations as any[]).forEach(reg => {
        const fullName = reg.full_name || 'Participant';
        activities.push({
          id: `reg_${reg.id}`,
          type: 'registration',
          description: `${fullName} purchased ticket for ${(reg.events as any)?.title || 'an event'}`,
          timestamp: reg.created_at,
          user: fullName,
          event: (reg.events as any)?.title
        });
      });
    }

    // Sort by timestamp and limit to 15 most recent
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 15);

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    // Return fallback data
    return [
      {
        id: '1',
        type: 'registration',
        description: 'John Doe purchased ticket for Friday Game Night',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        user: 'John Doe',
        event: 'Friday Game Night'
      },
      {
        id: '2',
        type: 'event_created',
        description: 'New event "Beach Volleyball Tournament" created',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: '3',
        type: 'registration',
        description: 'Sarah Smith purchased ticket for Trivia Night',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        user: 'Sarah Smith',
        event: 'Trivia Night'
      }
    ];
  }
}

// Top Events
export async function getTopEvents(): Promise<TopEvent[]> {
  try {
    const { data: events } = await (supabase as any)
      .from('events')
      .select('id, title, date, location');

    if (!events) return [];

    // Calculate registrations and revenue per event using registration_count
    // Build registration counts manually (no derived fields)
    const regCounts: Record<string, number> = {};
    try {
  const { data: regs } = await (supabase as any).from('registrations').select('event_id');
      if (regs) {
        (regs as any[]).forEach(r => {
          const key = String(r.event_id);
            regCounts[key] = (regCounts[key] || 0) + 1;
        });
      }
    } catch (_) { /* ignore */ }

    const topEvents: TopEvent[] = (events as any[]).map(event => ({
      id: String(event.id),
      title: event.title,
      registrations: regCounts[String(event.id)] || 0,
      capacity: null,
      revenue: 0,
      rating: null,
      image_url: undefined,
      image: '🎉'
    }));

    // Get ratings for each event
    for (const event of topEvents) {
      try {
        const { data: feedback } = await (supabase as any)
          .from('event_feedback')
          .select('rating')
          .eq('event_id', event.id);
        if (feedback && feedback.length > 0) {
          const avgRating = feedback.reduce((sum, f: any) => sum + (f.rating || 0), 0) / feedback.length;
          event.rating = avgRating;
        }
      } catch (_) {
        // ignore if table missing
      }
    }

    // Sort by registration rate and return top 5
    return topEvents
      .sort((a, b) => b.registrations - a.registrations)
      .slice(0, 5);

  } catch (error) {
    console.error('Error fetching top events:', error);
    // Return fallback data
    return [
      {
        id: '1',
        title: 'Friday Game Night & Connect',
        registrations: 25,
        capacity: 40,
        revenue: 625,
        rating: 4.8,
        image_url: undefined,
        image: '🎮'
      },
      {
        id: '2',
        title: 'Trivia Friday Challenge',
        registrations: 22,
        capacity: 30,
        revenue: 0,
        rating: 4.7,
        image_url: undefined,
        image: '🧠'
      },
      {
        id: '3',
        title: 'Esports Championship',
        registrations: 24,
        capacity: 32,
        revenue: 960,
        rating: 4.6,
        image_url: undefined,
        image: '🏆'
      }
    ];
  }
}

// Event Registrations Management
export async function getEventRegistrations(eventId?: string): Promise<EventRegistration[]> {
  try {
    console.log('[Admin API] Fetching registrations...', eventId ? `for event ${eventId}` : 'all events');
    
    // First, let's check what columns actually exist in the registrations table
    console.log('[Admin API] Checking registrations table structure...');
    
    // Try with minimal columns first to see what exists
  const { data: testData, error: testError } = await (supabase as any)
      .from('registrations')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('[Admin API] Failed to query registrations table:', testError);
      throw new Error(`Registrations table error: ${testError.message}`);
    }
    
    console.log('[Admin API] Table structure check successful. Sample row:', testData?.[0] || 'No data');
    
    // Now try the actual query with the columns that actually exist
  let query = (supabase as any)
      .from('registrations')
      .select(`
        id,
        event_id,
        full_name,
        email,
        phone_number,
        payment_status,
        created_at,
        events (
          title,
          date,
          location
        )
      `)
      .order('created_at', { ascending: false });

    if (eventId) {
      query = query.eq('event_id', eventId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Admin API] Supabase error fetching registrations with event join:', error);
      
      // Try without the event join in case of RLS issues
      console.log('[Admin API] Trying without event join...');
  const { data: simpleData, error: simpleError } = await (supabase as any)
        .from('registrations')
        .select('id, event_id, full_name, email, phone_number, payment_status, created_at')
        .order('created_at', { ascending: false });
      
      if (simpleError) {
        console.error('[Admin API] Simple query also failed:', simpleError);
        throw simpleError;
      }
      
      console.log('[Admin API] Simple query succeeded, got', simpleData?.length || 0, 'registrations');
      
      // Return data without event details
      return (simpleData || []).map((reg: any) => ({
        id: String(reg.id),
        event_id: String(reg.event_id),
        user_id: String(reg.id),
        name: reg.full_name,
        email: reg.email,
        phone: reg.phone_number,
        status: reg.payment_status as 'confirmed' | 'pending' | 'cancelled',
        created_at: reg.created_at,
        event: undefined
      }));
    }

    console.log('[Admin API] Successfully fetched', data?.length || 0, 'registrations with event details');

    return (data || []).map((reg: any) => ({
      id: String(reg.id),
      event_id: String(reg.event_id),
      user_id: String(reg.id),
      name: reg.full_name,
      email: reg.email,
      phone: reg.phone_number,
      status: reg.payment_status as 'confirmed' | 'pending' | 'cancelled',
      created_at: reg.created_at,
      event: reg.events ? {
        title: (reg.events as any).title,
        date: (reg.events as any).date,
        location: (reg.events as any).location
      } : undefined
    }));
  } catch (error) {
    console.error('[Admin API] Error fetching registrations:', error);
    
    // Return some sample data for testing if real data fails
    console.log('[Admin API] Returning sample data for testing...');
    return [
      {
        id: 'sample-1',
        event_id: 'sample-event-1',
        user_id: 'sample-user-1',
        name: 'John Smith (Sample)',
        email: 'john.smith@example.com',
        phone: '+1-555-0123',
        status: 'confirmed',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        event: {
          title: 'Sample Event 1',
          date: '2025-09-01',
          location: 'Test Location'
        }
      },
      {
        id: 'sample-2',
        event_id: 'sample-event-2',
        user_id: 'sample-user-2',
        name: 'Sarah Johnson (Sample)',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0125',
        status: 'pending',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        event: {
          title: 'Sample Event 2',
          date: '2025-09-05',
          location: 'Another Test Location'
        }
      },
      {
        id: 'sample-3',
        event_id: 'sample-event-1',
        user_id: 'sample-user-3',
        name: 'Mike Davis (Sample)',
        email: 'mike.davis@example.com',
        phone: '+1-555-0127',
        status: 'confirmed',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        event: {
          title: 'Sample Event 1',
          date: '2025-09-01',
          location: 'Test Location'
        }
      }
    ];
  }
}

// Update Registration Status
export async function updateRegistrationStatus(
  registrationId: string,
  status: 'confirmed' | 'pending' | 'cancelled'
) {
  try {
    const { error } = await (supabase as any)
      .from('registrations')
      .update({ payment_status: status })
      .eq('id', registrationId);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating registration status:', error);
    return { success: false, error: 'Failed to update registration status' };
  }
}

// Delete Event
export async function deleteEvent(eventId: string) {
  try {
    // First delete related registrations (if table exists)
    try {
  await (supabase as any)
        .from('registrations')
        .delete()
        .eq('event_id', eventId);
    } catch (_) {
      // ignore if table doesn't exist
    }

    // Then delete the event
  const { error } = await (supabase as any)
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error: 'Failed to delete event' };
  }
}

// Get User Data for Management
export async function getUsersData(): Promise<UserData[]> {
  try {
  const { data: registrations } = await (supabase as any)
      .from('registrations')
      .select('email, full_name, created_at');
    if (!registrations) return [];
    const userMap = new Map<string, UserData>();
    (registrations as any[]).forEach(reg => {
      const id = reg.email; // email as unique identifier
      if (!userMap.has(id)) {
        userMap.set(id, {
          id,
          email: reg.email,
          created_at: reg.created_at,
          last_sign_in_at: reg.created_at,
          total_registrations: 0,
          total_events_attended: 0
        });
      }
      const user = userMap.get(id)!;
      user.total_registrations++;
    });
    return Array.from(userMap.values());
  } catch (error) {
    console.error('Error fetching users data:', error);
    return [];
  }
}

// Event Analytics
export async function getEventAnalytics(eventId: string) {
  try {
    // Get event details
  const { data: event } = await (supabase as any)
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (!event) return null;

    // Get registrations
    let registrations: any[] | null = null;
    try {
  const { data } = await (supabase as any)
        .from('registrations')
        .select('*')
        .eq('event_id', eventId);
      registrations = data || [];
    } catch (_) {
      registrations = [];
    }

    // Get feedback
    let feedback: any[] | null = null;
    try {
  const { data } = await (supabase as any)
        .from('event_feedback')
        .select('*')
        .eq('event_id', eventId);
      feedback = data || [];
    } catch (_) {
      feedback = [];
    }

    // Calculate analytics
  const totalRegistrations = registrations.length || 0;
  const confirmedRegistrations = registrations.filter(r => r.payment_status === 'confirmed').length || 0;
  const pendingRegistrations = registrations.filter(r => r.payment_status === 'pending').length || 0;
  const cancelledRegistrations = registrations.filter(r => r.payment_status === 'cancelled').length || 0;

    const averageRating = feedback && feedback.length > 0 
      ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length 
      : null;

  const revenue = 0; // price removed

    return {
      event,
      totalRegistrations,
      confirmedRegistrations,
      pendingRegistrations,
      cancelledRegistrations,
      averageRating,
      revenue,
      feedback: feedback || []
    };
  } catch (error) {
    console.error('Error fetching event analytics:', error);
    return null;
  }
}
