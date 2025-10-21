import { supabase } from '../integrations/supabase/client';
import { generateEventSlug } from './utils';

// Helper functions for time formatting
function formatSingleTime(timeStr: string): string {
  // Convert "6:00 AM" or "6:00am" to "6:00 AM"
  return timeStr.replace(/([ap])m/i, ' $1M').replace(/\s+/g, ' ').trim().toUpperCase();
}

function formatTimeRange(rangeStr: string): string {
  // Convert "6:00 AM - 6:30 AM" or "6:00-6:30" to "6:00 AM - 6:30 AM"
  const parts = rangeStr.split(/\s*[-–—]\s*/);
  if (parts.length === 2) {
    let startTime = parts[0].trim();
    let endTime = parts[1].trim();
    
    // Format individual times
    startTime = formatSingleTime(startTime);
    endTime = formatSingleTime(endTime);
    
    // If end time doesn't have AM/PM, inherit from start time
    if (!/[ap]m/i.test(endTime) && /[ap]m/i.test(startTime)) {
      const ampm = startTime.match(/([ap]m)/i)?.[1] || 'AM';
      endTime = endTime + ' ' + ampm.toUpperCase();
    }
    
    return `${startTime} - ${endTime}`;
  }
  
  return formatSingleTime(rangeStr);
}

export interface Event {
  id: string; // bigint in DB, but we'll convert to string for consistency
  title: string;
  date: string;
  time_range?: string;
  location: string;
  description: string;
  image_url?: string;
  price?: string;
  capacity?: number | null;
  created_at?: string;
  updated_at?: string;
  additional_info?: {
    long_description?: string;
    organizer?: string;
    status?: string;
    [key: string]: any;
  };
  gallery?: string[];
  agenda?: Array<{ time: string; activity: string }>;
  event_schedule?: Array<{ time: string; activity: string }>;
  requirements?: string[];
  includes?: string[];
  category?: string;
  organizer?: string;
  // Computed fields for UI compatibility
  time?: string;
  image?: string;
  status?: string;
  long_description?: string;
  flyer?: {
    url?: string;
    downloadUrl?: string;
    alt?: string;
  };
  rating?: number | null;
}

export const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Akosombo Games Day - Action Packed Day Trip",
    description: "Full day trip to Akosombo with games, sightseeing, and community fun",
    long_description: "Join us for an unforgettable day trip to Akosombo! Experience the beautiful scenery of Lake Volta while engaging in exciting outdoor games and activities. This trip combines adventure, relaxation, and community building in one of Ghana's most scenic locations. Perfect for those looking to escape the city and connect with nature and new friends.",
    date: "June 15, 2025",
    time: "6:00 AM - 8:00 PM",
    time_range: "6:00 AM - 8:00 PM",
    location: "Akosombo, Eastern Region",
    category: "travel",
    price: "₵180",
    image: "🏞️",
    status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organizer: "G&C Adventure Team",
    requirements: ["Comfortable walking shoes", "Swimming gear (optional)", "Valid ID for travel", "Positive attitude"],
    includes: ["Round-trip transportation", "Lunch and refreshments", "Guided tour", "Games equipment", "Photography"],
    agenda: [
      { time: "6:00 AM", activity: "Departure from Accra" },
      { time: "8:30 AM", activity: "Arrival and orientation" },
      { time: "9:00 AM", activity: "Akosombo Dam tour" },
      { time: "11:00 AM", activity: "Outdoor games session" },
      { time: "1:00 PM", activity: "Lunch by the lake" },
      { time: "2:30 PM", activity: "Boat cruise (optional)" },
      { time: "4:00 PM", activity: "Team building activities" },
      { time: "6:00 PM", activity: "Return journey to Accra" }
    ],
    gallery: [
      "https://khwlznxnqlhxvyktsymy.supabase.co/storage/v1/object/sign/event-images/Akosombo%20Games%20Day%20(5).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWtvc29tYm8gR2FtZXMgRGF5ICg1KS5qcGciLCJpYXQiOjE3NDc4MjEzOTAsImV4cCI6MTgzNDIyMTM5MH0.9Dg6FqJcPIo2vRgDrX_k1nSNZGaRzjQDf2BHR9c_IpY",
      "https://khwlznxnqlhxvyktsymy.supabase.co/storage/v1/object/sign/event-images/Akosombo%20Games%20Day%20(4).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWtvc29tYm8gR2FtZXMgRGF5ICg0KS5qcGciLCJpYXQiOjE3NDc4MjEzOTAsImV4cCI6MTgzNDIyMTM5MH0.nYH8VmEoKAP4qKUJpLj2CZA7GJDf_QM8uXzNWaEqTTc"
    ],
    flyer: {
      url: "https://khwlznxnqlhxvyktsymy.supabase.co/storage/v1/object/sign/event-images/Akosombo%20Games%20Day%20(5).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWtvc29tYm8gR2FtZXMgRGF5ICg1KS5qcGciLCJpYXQiOjE3NDc4MjEzOTAsImV4cCI6MTgzNDIyMTM5MH0.9Dg6FqJcPIo2vRgDrX_k1nSNZGaRzjQDf2BHR9c_IpY",
      downloadUrl: "/downloads/akosombo-games-day-flyer.pdf",
      alt: "Akosombo Games Day Event Flyer"
    },
    rating: 4.9
  },
  {
    id: "2", 
    title: "Beach Day & Games",
    description: "Sun, sand, games, and great vibes at the beach",
    long_description: "Escape to the beautiful beaches of Ghana for a day of sun, sand, and exciting beach games! Join fellow adventure seekers for volleyball, frisbee, beach soccer, and water activities. This event combines the relaxation of beach time with the excitement of friendly competition and community building. All skill levels welcome!",
    date: "July 8, 2025",
    time: "8:00 AM - 6:00 PM", 
    time_range: "8:00 AM - 6:00 PM",
    location: "Labadi Beach, Accra",
    category: "outdoor",
    price: "₵120",
    image: "🏖️",
    status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organizer: "G&C Beach Squad",
    requirements: ["Swimming skills (optional)", "Sunscreen", "Beach attire", "Towel"],
    includes: ["Beach entry fees", "Games equipment", "Lunch and drinks", "First aid support", "Group photos"],
    agenda: [
      { time: "8:00 AM", activity: "Meet-up and travel to beach" },
      { time: "9:00 AM", activity: "Beach setup and warm-up games" },
      { time: "10:30 AM", activity: "Beach volleyball tournament" },
      { time: "12:00 PM", activity: "Swimming and water activities" },
      { time: "1:00 PM", activity: "Beach picnic lunch" },
      { time: "2:30 PM", activity: "Beach soccer and frisbee" },
      { time: "4:00 PM", activity: "Relaxation and socializing" },
      { time: "5:30 PM", activity: "Cleanup and departure" }
    ],
    gallery: [
      "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Beach%20day%20%26%20games%20(2).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQmVhY2ggZGF5ICUyNiBnYW1lcyAoMikuanBnIiwiaWF0IjoxNzQ3ODIxNTIzLCJleHAiOjE4MzQyMjE1MjN9.VYX8oS-yJ1MprAhJ9Ht0CXn7ePfWOCWe3x9-j5CKHGY",
      "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Beach%20day%20%26%20games%20(3).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQmVhY2ggZGF5ICUyNiBnYW1lcyAoMykuanBnIiwiaWF0IjoxNzQ3ODIxNTIzLCJleHAiOjE4MzQyMjE1MjN9.nP2tGxQj8mN_rKL4sE9JcVzThBfA0dRqCaJxM2FQLUY"
    ],
    flyer: {
      url: "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Beach%20day%20%26%20games%20(2).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQmVhY2ggZGF5ICUyNiBnYW1lcyAoMikuanBnIiwiaWF0IjoxNzQ3ODIxNTIzLCJleHAiOjE4MzQyMjE1MjN9.VYX8oS-yJ1MprAhJ9Ht0CXn7ePfWOCWe3x9-j5CKHGY",
      downloadUrl: "/downloads/beach-day-games-flyer.pdf",
      alt: "Beach Day & Games Event Flyer"
    },
    rating: 4.7
  },
  {
    id: "3",
    title: "Aburi Gardens Hike & Connect",
    description: "Nature hike through beautiful botanical gardens with networking",
    long_description: "Immerse yourself in the natural beauty of Aburi Botanical Gardens while connecting with like-minded nature enthusiasts. This guided hike combines physical activity, environmental education, and community building. Explore diverse plant species, enjoy fresh mountain air, and build lasting friendships in one of Ghana's most beautiful natural settings.",
    date: "July 22, 2025", 
    time: "7:00 AM - 4:00 PM",
    time_range: "7:00 AM - 4:00 PM",
    location: "Aburi Botanical Gardens, Eastern Region",
    category: "outdoor",
    price: "₵150",
    image: "🌿",
    status: "completed",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organizer: "G&C Nature Lovers",
    requirements: ["Hiking shoes", "Water bottle", "Hat/cap", "Insect repellent"],
    includes: ["Transportation", "Garden entry fees", "Professional guide", "Lunch", "First aid kit"],
    agenda: [
      { time: "7:00 AM", activity: "Departure from Accra" },
      { time: "8:30 AM", activity: "Arrival and registration" },
      { time: "9:00 AM", activity: "Guided tour introduction" },
      { time: "10:00 AM", activity: "Main hiking trail" },
      { time: "12:00 PM", activity: "Lunch break with garden views" },
      { time: "1:00 PM", activity: "Exploration of rare plant sections" },
      { time: "2:30 PM", activity: "Group activities and networking" },
      { time: "3:30 PM", activity: "Return journey to Accra" }
    ],
    gallery: [
      "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Aburi%20Gardens%20Hike%20%26%20Connect%20(2).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWJ1cmkgR2FyZGVucyBIaWtlICUyNiBDb25uZWN0ICgyKS5qcGciLCJpYXQiOjE3NDc4MjE2MzYsImV4cCI6MTgzNDIyMTYzNn0.3ZJHgBVNkQp7sI8xU2dHKjWmA9tE4vRyLnPcFsGxOz8",
      "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Aburi%20Gardens%20Hike%20%26%20Connect%20(4).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWJ1cmkgR2FyZGVucyBIaWtlICUyNiBDb25uZWN0ICg0KS5qcGciLCJpYXQiOjE3NDc4MjE2MzYsImV4cCI6MTgzNDIyMTYzNn0.8fWxN2QdA5rKo1JmX_vBuE7HnLs0YtGpCcRzP4IaMjY"
    ],
    flyer: {
      url: "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Aburi%20Gardens%20Hike%20%26%20Connect%20(2).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWJ1cmkgR2FyZGVucyBIaWtlICUyNiBDb25uZWN0ICgyKS5qcGciLCJpYXQiOjE3NDc4MjE2MzYsImV4cCI6MTgzNDIyMTYzNn0.3ZJHgBVNkQp7sI8xU2dHKjWmA9tE4vRyLnPcFsGxOz8",
      downloadUrl: "/downloads/aburi-gardens-hike-flyer.pdf",
      alt: "Aburi Gardens Hike & Connect Event Flyer"
    },
    rating: 4.6
  },
  {
    id: "4",
    title: "Two Days in Cape Coast",
    description: "Historical exploration and beach relaxation weekend getaway",
    long_description: "Discover Ghana's rich history and beautiful coastline in this comprehensive two-day Cape Coast experience. Visit historic castles, learn about Ghana's heritage, enjoy pristine beaches, and connect with fellow history enthusiasts. This weekend getaway combines education, relaxation, and cultural immersion for an unforgettable experience.",
    date: "September 14-15, 2025",
    time: "6:00 AM (Day 1) - 8:00 PM (Day 2)",
    time_range: "6:00 AM (Day 1) - 8:00 PM (Day 2)",
    location: "Cape Coast, Central Region", 
    category: "travel",
    price: "₵450",
    image: "🏰",
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    organizer: "G&C Heritage Explorers",
    requirements: ["Valid ID", "Comfortable walking shoes", "Respectful attitude towards historical sites", "Overnight bag"],
    includes: ["Round-trip transportation", "Accommodation (1 night)", "All meals", "Castle entry fees", "Professional guide", "Beach activities"],
    agenda: [
      { time: "6:00 AM", activity: "Departure from Accra" },
      { time: "9:00 AM", activity: "Cape Coast Castle tour" },
      { time: "12:00 PM", activity: "Traditional lunch" },
      { time: "2:00 PM", activity: "Elmina Castle visit" },
      { time: "5:00 PM", activity: "Check-in and rest" },
      { time: "7:00 PM", activity: "Beachside dinner" },
      { time: "8:00 AM", activity: "Beach walk and games" },
      { time: "10:00 AM", activity: "Kakum National Park canopy walk" },
      { time: "1:00 PM", activity: "Farewell lunch" },
      { time: "3:00 PM", activity: "Return journey to Accra" }
    ],
    gallery: [
      "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Two%20days%20in%20cape%20coast%20(1).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvVHdvIGRheXMgaW4gY2FwZSBjb2FzdCAoMSkuanBnIiwiaWF0IjoxNzQ3ODIxNzQ5LCJleHAiOjE4MzQyMjE3NDl9.aDvE73YfPdbBQ5bwmSmwWK-S0AOnFLDNbi-cxblEwrU",
      "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Two%20days%20in%20cape%20coast%20(4).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvVHdvIGRheXMgaW4gY2FwZSBjb2FzdCAoNCkuanBnIiwiaWF0IjoxNzQ3ODIxNzQ5LCJleHAiOjE4MzQyMjE3NDl9.hGJKL2mN8oEd1qR7_tXaP9FcA5bYjH0vI3kWuSzN4e6"
    ],
    flyer: {
      url: "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Two%20days%20in%20cape%20coast%20(1).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvVHdvIGRheXMgaW4gY2FwZSBjb2FzdCAoMSkuanBnIiwiaWF0IjoxNzQ3ODIxNzQ5LCJleHAiOjE4MzQyMjE3NDl9.aDvE73YfPdbBQ5bwmSmwWK-S0AOnFLDNbi-cxblEwrU",
      downloadUrl: "/downloads/cape-coast-two-days-flyer.pdf",
      alt: "Two Days in Cape Coast Event Flyer"
    },
    rating: 4.8
  }
];

export interface TriviaQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  category: string;
  difficulty: string;
}

export const mockTrivia: TriviaQuestion[] = [
  {
    id: "1",
    question: "What is the capital of Ghana?",
    options: ["Accra", "Kumasi", "Tamale", "Cape Coast"],
    correct: 0,
    category: "geography",
    difficulty: "easy"
  }
];

export const apiConfig = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://kgfpdduocqqcbfzzmbbw.supabase.co'
    : 'http://localhost:3000',
};

// Event API functions
// Global flag to track if we're using sample events (for debugging)
let isUsingSampleEvents = false;

export const getEvents = async (): Promise<Event[]> => {
  try {
    const { data, error, status } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      isUsingSampleEvents = true;
      return sampleEvents;
    }

    if (!data) {
      isUsingSampleEvents = true;
      return sampleEvents;
    }
    
    if (Array.isArray(data) && data.length === 0) {
      isUsingSampleEvents = true;
      return sampleEvents;
    }

    // Transform database data to match Event interface using provided schema
    const transformedData = data.map((row: any) => {
      const info = (row.additional_info || {}) as { long_description?: string; organizer?: string; status?: string };
      
      // Parse event_schedule (column name is "event schedule" with a space)
      let parsedSchedule: Array<{ time: string; activity: string }> = [];
      try {
        const rawSchedule: any = row["event schedule"] !== undefined ? row["event schedule"] : row.event_schedule !== undefined ? row.event_schedule : row.agenda;
        
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
        console.warn('Failed to parse event schedule for event id', row.id, e);
      }
      
      return {
        ...row,
        id: row.id?.toString?.() ?? String(row.id),
        // Map DB columns to UI fields
        time: row.time_range || 'Time TBA',
        image: row.image_url || '🎮',
        // Additional info JSON
        long_description: info.long_description || row.description,
        organizer: row.organizer || info.organizer || 'Games & Connect Team',
        status: info.status || 'open',
        // Map capacity to spots/total_spots for backward compatibility
        spots: row.capacity || 0,
        total_spots: row.capacity || 0,
        // Ensure arrays
        requirements: Array.isArray(row.requirements) ? (row.requirements as string[]) : [],
        includes: Array.isArray(row.includes) ? (row.includes as string[]) : [],
        agenda: parsedSchedule,
        event_schedule: parsedSchedule,
        flyer: undefined, // Not in DB schema
        gallery: Array.isArray(row.gallery) ? (row.gallery as string[]) : [],
        // Timestamps
        created_at: row.created_at || new Date().toISOString(),
        updated_at: row.created_at || new Date().toISOString(), // Use created_at as fallback
      } as Event;
    });

    console.log('Transformed events:', transformedData);
    console.log('Using database events, not sample events');
    isUsingSampleEvents = false;
    return transformedData;
  } catch (error) {
    console.error('Error in getEvents:', error);
    console.log('Exception occurred, falling back to sample events');
    isUsingSampleEvents = true;
    return sampleEvents;
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const { data, error, status } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .maybeSingle(); // prevents 406 / PGRST116 when zero rows

    if (error) {
      if ((error as any).code === 'PGRST116') {
        // No rows found - this is normal
      } else {
        console.error('Error fetching event:', error);
      }
      return sampleEvents.find(event => event.id === id) || null;
    }

    if (!data) {
      return sampleEvents.find(event => event.id === id) || null;
    }

    const row: any = data;
    const info = (row.additional_info || {}) as { long_description?: string; organizer?: string; status?: string };

    // Normalize/parse event schedule which in DB may exist as:
    //  - Text column named "event schedule" (with space) - THIS IS THE ACTUAL COLUMN
    //  - JSONB array column "agenda" (legacy/fallback)
    //  - JSONB or text column "event_schedule" (fallback)
    let parsedSchedule: Array<{ time: string; activity: string }> = [];
    try {
      const rawSchedule: any = (
        row['event schedule'] !== undefined ? row['event schedule'] :
        row.event_schedule !== undefined ? row.event_schedule :
        row.agenda !== undefined ? row.agenda :
        undefined
      );

      if (Array.isArray(rawSchedule)) {
        parsedSchedule = rawSchedule as Array<{ time: string; activity: string }>;
      } else if (typeof rawSchedule === 'string' && rawSchedule.trim() !== '') {
        const lines = rawSchedule.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        parsedSchedule = lines.map((line, idx) => {
          // Enhanced pattern matching for various time formats
          // Pattern 1: Range format "6:00 AM - 6:30 AM Activity" or "6:00-6:30 Activity"
          const rangeMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?\s*[-–—]\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)(?:\s*[-–—:]\s*|\s+)(.+)$/i);
          if (rangeMatch) {
            return {
              time: formatTimeRange(rangeMatch[1]),
              activity: rangeMatch[2].trim()
            };
          }
          
          // Pattern 2: Single time "6:00 AM - Activity" or "6:00 AM Activity"
          const singleMatch = line.match(/^(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)(?:\s*[-–—:]\s*|\s+)(.+)$/i);
          if (singleMatch) {
            return {
              time: formatSingleTime(singleMatch[1]),
              activity: singleMatch[2].trim()
            };
          }
          
          // Pattern 3: Activity only (no time found)
          return { time: '', activity: line };
        }).filter(item => item.activity); // Remove empty activities
      }
    } catch (e) {
      console.warn('Failed to parse event schedule text:', e);
      parsedSchedule = [];
    }

    // Transform database data to match Event interface
    const transformedEvent = {
      ...row,
      id: row.id?.toString?.() ?? String(row.id),
      time: row.time_range || 'Time TBA',
      image: row.image_url || '🎮',
      long_description: info.long_description || row.description,
      organizer: row.organizer || info.organizer || 'Games & Connect Team',
      status: info.status || 'open',
      // Map capacity to spots/total_spots for backward compatibility
      spots: row.capacity || 0,
      total_spots: row.capacity || 0,
      requirements: Array.isArray(row.requirements) ? (row.requirements as string[]) : [],
      includes: Array.isArray(row.includes) ? (row.includes as string[]) : [],
      agenda: parsedSchedule,
      event_schedule: parsedSchedule,
      flyer: undefined, // Not in DB schema
      gallery: Array.isArray((row as any).gallery) ? ((row as any).gallery as string[]) : [],
      created_at: row.created_at || new Date().toISOString(),
      updated_at: row.created_at || new Date().toISOString(),
    };

    return transformedEvent;
  } catch (error) {
    console.error('Error in getEventById:', error);
    return sampleEvents.find(event => event.id === id) || null;
  }
};

/**
 * Get event by slug (generated from title)
 */
export const getEventBySlug = async (slug: string): Promise<Event | null> => {
  try {
    // First, try to get all events and find by generated slug
    const events = await getEvents();
    
    // Find event where the generated slug matches
    const event = events.find(event => generateEventSlug(event.title) === slug);
    
    if (event) {
      return event;
    }
    
    // If not found in live events, check sample events
    const sampleEvent = sampleEvents.find(event => generateEventSlug(event.title) === slug);
    if (sampleEvent) {
      console.log(`Found sample event by slug: ${sampleEvent.title}`);
      return sampleEvent;
    }
    
    return null;
  } catch (error) {
    console.error('Error in getEventBySlug:', error);
    
    // Fallback to sample events
    const sampleEvent = sampleEvents.find(event => generateEventSlug(event.title) === slug);
    return sampleEvent || null;
  }
};

// Helper function to register with sample event data when database event is not found
const registerWithSampleEvent = async (eventId: string, userData: any, sampleEvent: Event) => {
  
  // Since this is sample data, we'll simulate a successful registration
  // In a real scenario, you might want to store this in localStorage or handle differently
  const registrationData = {
    id: Date.now().toString(), // Generate a temporary ID
    event_id: eventId,
    full_name: userData.name,
    email: userData.email,
    phone_number: userData.phone || '+233000000000',
    number_of_participants: userData.numberOfParticipants || 1,
    location: userData.location || 'Not specified',
    special_requests: userData.specialRequests || null,
    extra_info: {
      emergency_contact: userData.emergencyContact || null,
      dietary_requirements: userData.dietaryRequirements || null,
      additional_notes: userData.additionalInfo || null,
      registration_source: 'website_sample'
    },
    payment_status: 'pending',
    created_at: new Date().toISOString()
  };

  // For sample events, return success immediately
  return {
    success: true,
    data: [registrationData],
    isWaitlist: false,
    message: 'Registration confirmed (using sample event data)'
  };
};

export const registerForEvent = async (eventId: string, userData: any) => {
  try {
    console.log('Registration attempt for event:', eventId, 'with data:', userData);
    
    // Check if we're currently using sample events
    console.log('Sample events mode:', isUsingSampleEvents);
    
    // If we know we're using sample events, skip database check
    if (isUsingSampleEvents) {
      const sampleEvent = sampleEvents.find(event => event.id === eventId);
      if (sampleEvent) {
        console.log('Using sample event directly (sample mode active):', sampleEvent);
        return await registerWithSampleEvent(eventId, userData, sampleEvent);
      }
      return { success: false, error: `Sample event not found. Event ID: ${eventId}`, isWaitlist: false };
    }
    
    // First, let's check if we're using sample events vs database events
    console.log('Checking event existence for ID:', eventId);
    
    // Debug: Check what events are available
    const { data: allEvents } = await supabase.from('events').select('id, title');
    console.log('Available events in database:', allEvents);
    console.log('Sample event IDs:', sampleEvents.map(e => e.id));
    
    // Check if event exists in database
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('id', eventId)
      .single();

    console.log('Event lookup result:', { eventData, eventError });

    if (eventError || !eventData) {
      console.error('Event lookup error:', eventError);
      
      // If database event not found, check sample events as fallback
      const sampleEvent = sampleEvents.find(event => event.id === eventId);
      if (sampleEvent) {
        console.log('Found event in sample data:', sampleEvent);
        // Use sample event data for registration
        return await registerWithSampleEvent(eventId, userData, sampleEvent);
      }
      
      return { success: false, error: `Event not found. Event ID: ${eventId}`, isWaitlist: false };
    }

    // Extract participant info from the direct form data
    const numberOfParticipants = userData.numberOfParticipants || 1;
    const location = userData.location || 'Not specified';
    const specialRequests = userData.specialRequests || null;
    
    // Extract and format phone number with comprehensive auto-formatting
    let phoneNumber = userData.phone || '';
    if (phoneNumber) {
      // Remove all non-numeric characters except +
      let cleaned = phoneNumber.replace(/[^\d+]/g, '');
      
      // Handle different input formats for Ghana numbers
      if (!cleaned.startsWith('+233')) {
        // Remove any existing + that's not at the start
        if (cleaned.includes('+') && !cleaned.startsWith('+')) {
          cleaned = cleaned.replace(/\+/g, '');
        }
        
        // Case 1: Starts with 0 (Ghana local format) - replace 0 with +233
        if (cleaned.startsWith('0') && cleaned.length >= 10) {
          phoneNumber = '+233' + cleaned.substring(1);
        }
        // Case 2: Starts with 233 - add +
        else if (cleaned.startsWith('233') && cleaned.length === 12) {
          phoneNumber = '+' + cleaned;
        }
        // Case 3: 9 digits without country code - add +233
        else if (cleaned.length === 9 && /^\d{9}$/.test(cleaned)) {
          phoneNumber = '+233' + cleaned;
        }
        // Case 4: 10 digits (likely with extra leading digit) - add +233 and remove first digit
        else if (cleaned.length === 10 && /^\d{10}$/.test(cleaned) && !cleaned.startsWith('233')) {
          phoneNumber = '+233' + cleaned.substring(1);
        }
        else {
          // Invalid format, use default
          phoneNumber = '+233000000000';
        }
      } else {
        phoneNumber = cleaned;
      }
      
      // Final validation - ensure it matches the expected format
      if (!phoneNumber.match(/^\+233[0-9]{9}$/)) {
        phoneNumber = '+233000000000'; // Fallback for required field
      }
    } else {
      phoneNumber = '+233000000000'; // Required field default
    }

    // Prepare registration data for the actual table schema
    const registrationData = {
      event_id: eventId, // Keep as string/bigint, don't convert to integer
      full_name: userData.name,
      email: userData.email,
      phone_number: phoneNumber,
      number_of_participants: numberOfParticipants,
      location: location,
      special_requests: specialRequests,
      extra_info: {
        emergency_contact: userData.emergencyContact || null,
        dietary_requirements: userData.dietaryRequirements || null,
        additional_notes: userData.additionalInfo || null,
        registration_source: 'website'
      },
      payment_status: 'pending'
    };

    // Use the SQL insert with proper field names
    const { data, error } = await supabase
      .from('registrations')
      .insert([registrationData as any]) // Type assertion to bypass TS issues
      .select();

    if (error) {
      console.error('Registration insert error:', error);
      console.error('Registration data:', registrationData);
      return { success: false, error: `Registration failed: ${error.message}`, isWaitlist: false };
    }

    // The trigger will automatically update event capacity
    console.log('Registration successful:', data);

    return { 
      success: true, 
      data, 
      isWaitlist: false,
      message: 'Registration confirmed'
    };
  } catch (error) {
    console.error('Error registering for event:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      isWaitlist: false 
    };
  }
};

export const getUserRegistrations = async (userEmail?: string) => {
  try {
    // For now, return sample data since we don't have authentication context
    // In a real app, this would get the current user's email from auth context
    const email = userEmail || "user@example.com"; // This should come from authentication
    
    const { data, error } = await (supabase as any)
      .from('registrations')
      .select(`
        id,
        event_id,
        full_name,
        email,
        phone_number,
        number_of_participants,
        location,
        special_requests,
        extra_info,
        payment_status,
        created_at,
        events (
          id,
          title,
          date,
          location,
          description
        )
      `)
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user registrations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return [];
  }
};

export const submitEventFeedback = async (registrationId: string, feedbackData: {
  rating: number;
  feedbackText?: string;
  isAnonymous?: boolean;
}) => {
  try {
    // First, get the registration to find the event_id
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('event_id')
      .eq('id', registrationId)
      .single();

    if (regError || !registration) {
      throw new Error('Registration not found');
    }

    const { data, error } = await supabase
      .from('event_feedback')
      .insert([{
        event_id: registration.event_id,
        registration_id: registrationId,
        rating: feedbackData.rating,
        feedback_text: feedbackData.feedbackText || null,
        is_anonymous: feedbackData.isAnonymous || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error submitting event feedback:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
