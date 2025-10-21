import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

// Helper functions for time formatting
function formatSingleTime(timeStr: string): string {
  return timeStr.replace(/([ap])m/i, ' $1M').replace(/\s+/g, ' ').trim().toUpperCase();
}

function formatTimeRange(rangeStr: string): string {
  const parts = rangeStr.split(/\s*[-–—]\s*/);
  if (parts.length === 2) {
    let startTime = parts[0].trim();
    let endTime = parts[1].trim();
    
    startTime = formatSingleTime(startTime);
    endTime = formatSingleTime(endTime);
    
    if (!/[ap]m/i.test(endTime) && /[ap]m/i.test(startTime)) {
      const ampm = startTime.match(/([ap]m)/i)?.[1] || 'AM';
      endTime = endTime + ' ' + ampm.toUpperCase();
    }
    
    return `${startTime} - ${endTime}`;
  }
  
  return formatSingleTime(rangeStr);
}

// Enhanced Event type with better typing
export interface EventData {
  // Base properties from Supabase events table
  id: number;
  title: string;
  description: string;
  date: string;
  time_range: string;
  location: string;
  category: string | null;
  capacity: number;
  price: string | null;
  image_url: string | null;
  additional_info: any | null;
  gallery: any | null;
  "event schedule": string | null;
  requirements: any | null;
  includes: any | null;
  organizer: string | null;
  created_at: string | null;
  
  // Enhanced/computed properties for UI
  agenda: Array<{ time: string; activity: string }> | null;
  event_schedule?: Array<{ time: string; activity: string }> | null;
  formatted_date: string;
  formatted_time: string;
  registration_count: number;
  availability_status: 'available' | 'limited' | 'full';
  
  // Additional properties used in the component (for backward compatibility)
  image?: string; // For emoji/icon fallback
  long_description?: string; // From additional_info
  status?: string; // From additional_info
  time?: string; // Alias for time_range
  spots?: number; // Computed from capacity - registrations
  total_spots?: number; // Alias for capacity
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
        date,
        time_range,
        location,
        category,
        capacity,
        price,
        image_url,
        additional_info,
        gallery,
        "event schedule",
        requirements,
        includes,
        organizer,
        created_at
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
      // Note: We don't have spots/total_spots in the schema
      // You'll need to query registrations table to get accurate count
      // For now, assume 0 registrations (capacity is full available)
      const registrationCount = 0; // TODO: Query registrations table for actual count

      // Parse additional_info JSON to extract extra fields
      let additionalData: any = {};
      try {
        if (event.additional_info && typeof event.additional_info === 'object') {
          additionalData = event.additional_info;
        } else if (typeof event.additional_info === 'string') {
          additionalData = JSON.parse(event.additional_info);
        }
      } catch (e) {
        console.warn('Failed to parse additional_info for event id', event.id, e);
      }

      // Parse schedule from "event schedule" column (primary) or additional_info (fallback)
      let parsedSchedule: Array<{ time: string; activity: string }> = [];
      try {
        // First try the "event schedule" column from database (column name has a space!)
        let rawSchedule: any = event["event schedule"];
        
        // Fallback to additional_info if "event schedule" is not present
        if (!rawSchedule) {
          rawSchedule = (
            additionalData.event_schedule || 
            additionalData.agenda || 
            additionalData['event schedule'] || 
            null
          );
        }
        
        if (Array.isArray(rawSchedule)) {
          parsedSchedule = rawSchedule as Array<{ time: string; activity: string }>;
        } else if (typeof rawSchedule === 'string' && rawSchedule.trim() !== '') {
          const lines = rawSchedule.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          parsedSchedule = lines.map((line) => {
            // Enhanced pattern matching for various time formats
            const rangeMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*[-–—]\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)(?:\s*[-–—:]\s*|\s+)(.+)$/i);
            if (rangeMatch) {
              return {
                time: formatTimeRange(rangeMatch[1]),
                activity: rangeMatch[2].trim()
              };
            }
            
            const singleMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)(?:\s*[-–—:]\s*|\s+)(.+)$/i);
            if (singleMatch) {
              return {
                time: formatSingleTime(singleMatch[1]),
                activity: singleMatch[2].trim()
              };
            }
            
            return { time: '', activity: line };
          }).filter(item => item.activity);
        }
      } catch (e) {
        console.warn('Failed to parse schedule for event id', event.id, e);
      }

      // Parse requirements from database column or additional_info
      let requirementsArray: string[] = [];
      try {
        const reqData = event.requirements || additionalData.requirements;
        if (Array.isArray(reqData)) {
          requirementsArray = reqData as string[];
        } else if (typeof reqData === 'string' && reqData.trim() !== '') {
          requirementsArray = JSON.parse(reqData);
        }
      } catch (e) {
        console.warn('Failed to parse requirements for event id', event.id);
      }

      // Parse includes from database column or additional_info
      let includesArray: string[] = [];
      try {
        const incData = event.includes || additionalData.includes;
        if (Array.isArray(incData)) {
          includesArray = incData as string[];
        } else if (typeof incData === 'string' && incData.trim() !== '') {
          includesArray = JSON.parse(incData);
        }
      } catch (e) {
        console.warn('Failed to parse includes for event id', event.id);
      }

      return {
        ...event,
        formatted_date: formatEventDate(event.date),
        formatted_time: event.time_range || 'Time TBA',
        registration_count: registrationCount,
        availability_status: getAvailabilityStatus(event.capacity - registrationCount, event.capacity),
        // Extract additional fields from database columns or additional_info
        image: additionalData.image || '🎮',
        organizer: event.organizer || additionalData.organizer || 'Event Organizer',
        requirements: requirementsArray,
        includes: includesArray,
        agenda: parsedSchedule,
        event_schedule: parsedSchedule,
        // Backward compatibility fields
        time: event.time_range,
        long_description: additionalData.long_description || event.description,
        status: additionalData.status || 'open',
        spots: event.capacity - registrationCount,
        total_spots: event.capacity
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

    // Parse additional_info JSON to extract extra fields
    let additionalData: any = {};
    try {
      if (data.additional_info && typeof data.additional_info === 'object') {
        additionalData = data.additional_info;
      } else if (typeof data.additional_info === 'string') {
        additionalData = JSON.parse(data.additional_info);
      }
    } catch (e) {
      console.warn('Failed to parse additional_info for event id', data.id, e);
    }

    // Parse schedule from "event schedule" column
    let parsedSchedule: Array<{ time: string; activity: string }> = [];
    try {
      let rawSchedule: any = data["event schedule"];
      if (!rawSchedule) {
        rawSchedule = additionalData.event_schedule || additionalData.agenda || additionalData['event schedule'] || null;
      }
      
      if (Array.isArray(rawSchedule)) {
        parsedSchedule = rawSchedule as Array<{ time: string; activity: string }>;
      } else if (typeof rawSchedule === 'string' && rawSchedule.trim() !== '') {
        const lines = rawSchedule.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        parsedSchedule = lines.map((line) => {
          const rangeMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*[-–—]\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)(?:\s*[-–—:]\s*|\s+)(.+)$/i);
          if (rangeMatch) {
            return { time: formatTimeRange(rangeMatch[1]), activity: rangeMatch[2].trim() };
          }
          const singleMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)(?:\s*[-–—:]\s*|\s+)(.+)$/i);
          if (singleMatch) {
            return { time: formatSingleTime(singleMatch[1]), activity: singleMatch[2].trim() };
          }
          return { time: '', activity: line };
        }).filter(item => item.activity);
      }
    } catch (e) {
      console.warn('Failed to parse schedule for event id', data.id);
    }

    // Parse requirements
    let requirementsArray: string[] = [];
    try {
      const reqData = data.requirements || additionalData.requirements;
      if (Array.isArray(reqData)) {
        requirementsArray = reqData as string[];
      } else if (typeof reqData === 'string' && reqData.trim() !== '') {
        requirementsArray = JSON.parse(reqData);
      }
    } catch (e) {
      console.warn('Failed to parse requirements for event id', data.id);
    }

    // Parse includes
    let includesArray: string[] = [];
    try {
      const incData = data.includes || additionalData.includes;
      if (Array.isArray(incData)) {
        includesArray = incData as string[];
      } else if (typeof incData === 'string' && incData.trim() !== '') {
        includesArray = JSON.parse(incData);
      }
    } catch (e) {
      console.warn('Failed to parse includes for event id', data.id);
    }
    
    // Transform the data
    const registrationCount = 0; // TODO: Query registrations table for actual count
    
    return {
      ...data,
      formatted_date: formatEventDate(data.date),
      formatted_time: data.time_range || 'Time TBA',
      registration_count: registrationCount,
      availability_status: getAvailabilityStatus(data.capacity - registrationCount, data.capacity),
      // Extract additional fields from database columns or additional_info
      image: additionalData.image || '🎮',
      organizer: data.organizer || additionalData.organizer || 'Event Organizer',
      requirements: requirementsArray,
      includes: includesArray,
      agenda: parsedSchedule,
      event_schedule: parsedSchedule,
      // Backward compatibility fields
      time: data.time_range,
      long_description: additionalData.long_description || data.description,
      status: additionalData.status || 'open',
      spots: data.capacity - registrationCount,
      total_spots: data.capacity
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