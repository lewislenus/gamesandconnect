import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Enhanced Event type with better typing
export interface EventData extends Tables<'events'> {
  image_url?: string; // Add image_url field
  agenda: Array<{ time: string; activity: string }> | null; // Match the database schema
  formatted_date: string;
  formatted_time: string;
  registration_count: number;
  availability_status: 'available' | 'limited' | 'full';
}

export interface FetchEventsResult {
  success: boolean;
  data: EventData[];
  error?: string;
  isEmpty: boolean;
  totalCount: number;
}

/**
 * Formats a date string into a readable format
 */
export function formatEventDate(dateString: string): string {
  try {
    // Handle various date formats
    let date: Date;
    
    // Check if it's already a formatted date like "December 15, 2024"
    if (dateString.includes(',')) {
      date = new Date(dateString);
    } else if (dateString.includes('-')) {
      // Handle ISO format or other dash-separated formats
      date = new Date(dateString);
    } else {
      // Fallback for other formats
      date = new Date(dateString);
    }

    // Validate the date
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date format: ${dateString}`);
      return dateString; // Return original if parsing fails
    }

    // Format to readable string
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Determines availability status based on spots remaining
 */
export function getAvailabilityStatus(spots: number, totalSpots: number): 'available' | 'limited' | 'full' {
  if (spots <= 0) return 'full';
  if (spots <= totalSpots * 0.2) return 'limited'; // Less than 20% available
  return 'available';
}

/**
 * Fetches all events from Supabase with comprehensive error handling
 */
export async function fetchEventsFromSupabase(): Promise<FetchEventsResult> {
  console.log('🔄 Starting to fetch events from Supabase...');
  
  try {
    // Test connection first
    const { data: connectionTest, error: connectionError } = await supabase
      .from('events')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.error('❌ Connection test failed:', connectionError);
      return {
        success: false,
        data: [],
        error: `Database connection failed: ${connectionError.message}`,
        isEmpty: true,
        totalCount: 0
      };
    }

    console.log(`✅ Connection successful. Total events in database: ${connectionTest || 0}`);

    // Fetch all events with comprehensive data
    const { data, error, count } = await supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        long_description,
        date,
        time,
        location,
        category,
        spots,
        total_spots,
        price,
        image,
        status,
        organizer,
        requirements,
        includes,
        agenda,
        flyer,
        rating,
        created_at,
        updated_at
      `, { count: 'exact' })
      .order('date', { ascending: true });

    if (error) {
      console.error('❌ Error fetching events:', error);
      return {
        success: false,
        data: [],
        error: `Failed to fetch events: ${error.message}`,
        isEmpty: true,
        totalCount: 0
      };
    }

    if (!data) {
      console.warn('⚠️ Query returned null data');
      return {
        success: true,
        data: [],
        error: 'No data returned from database',
        isEmpty: true,
        totalCount: 0
      };
    }

    if (data.length === 0) {
      console.log('📭 No events found in database');
      return {
        success: true,
        data: [],
        isEmpty: true,
        totalCount: 0
      };
    }

    console.log(`✅ Successfully fetched ${data.length} events`);

    // Transform and enhance the data
    const enhancedEvents: EventData[] = data.map((event) => {
      const registrationCount = (event.total_spots || 0) - (event.spots || 0);
      
      return {
        ...event,
        formatted_date: formatEventDate(event.date),
        formatted_time: event.time || 'Time TBA',
        registration_count: registrationCount,
        availability_status: getAvailabilityStatus(event.spots || 0, event.total_spots || 0),
        // Ensure arrays are properly parsed
        requirements: Array.isArray(event.requirements) 
          ? event.requirements as string[]
          : (typeof event.requirements === 'string' 
              ? JSON.parse(event.requirements) 
              : []),
        includes: Array.isArray(event.includes)
          ? event.includes as string[]
          : (typeof event.includes === 'string'
              ? JSON.parse(event.includes)
              : []),
        agenda: Array.isArray(event.agenda)
          ? event.agenda as Array<{ time: string; activity: string }>
          : (typeof event.agenda === 'string'
              ? JSON.parse(event.agenda)
              : [])
      };
    });

    return {
      success: true,
      data: enhancedEvents,
      isEmpty: false,
      totalCount: count || enhancedEvents.length
    };

  } catch (error) {
    console.error('💥 Unexpected error during fetch:', error);
    return {
      success: false,
      data: [],
      error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      isEmpty: true,
      totalCount: 0
    };
  }
}

/**
 * Fetches a single event by ID with error handling
 */
export async function fetchEventById(eventId: string): Promise<EventData | null> {
  console.log(`🔄 Fetching event with ID: ${eventId}`);
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle(); // Prevents 406 error when no rows found

    if (error) {
      console.error('❌ Error fetching event:', error);
      return null;
    }

    if (!data) {
      console.log('📭 No event found with that ID');
      return null;
    }

    console.log('✅ Successfully fetched event:', data.title);

    // Transform the data
    const registrationCount = (data.total_spots || 0) - (data.spots || 0);
    
    return {
      ...data,
      formatted_date: formatEventDate(data.date),
      formatted_time: data.time || 'Time TBA',
      registration_count: registrationCount,
      availability_status: getAvailabilityStatus(data.spots || 0, data.total_spots || 0),
      requirements: Array.isArray(data.requirements) 
        ? data.requirements as string[]
        : (typeof data.requirements === 'string' 
            ? JSON.parse(data.requirements) 
            : []),
      includes: Array.isArray(data.includes)
        ? data.includes as string[]
        : (typeof data.includes === 'string'
            ? JSON.parse(data.includes)
            : []),
      agenda: Array.isArray(data.agenda)
        ? data.agenda as Array<{ time: string; activity: string }>
        : (typeof data.agenda === 'string'
            ? JSON.parse(data.agenda)
            : [])
    };

  } catch (error) {
    console.error('💥 Unexpected error fetching event:', error);
    return null;
  }
}

/**
 * Gets database connection status
 */
export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .limit(1);

    if (error) {
      return { connected: false, error: error.message };
    }

    return { connected: true };
  } catch (error) {
    return { 
      connected: false, 
      error: error instanceof Error ? error.message : 'Unknown connection error' 
    };
  }
}