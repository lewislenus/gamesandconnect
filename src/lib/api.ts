import { supabase } from '../integrations/supabase/client';

export interface Event {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  date: string;
  time: string;
  location: string;
  category: string;
  spots: number;
  total_spots: number;
  price: string;
  image: string;
  status: string;
  created_at: string;
  updated_at: string;
  organizer: string;
  requirements: string[];
  includes: string[];
  agenda: Array<{ time: string; activity: string }>;
  flyer?: {
    url?: string;
    downloadUrl?: string;
    alt?: string;
  };
  rating?: number | null;
  gallery?: string[];
}

export const sampleEvents: Event[] = [
  {
    id: "1",
    title: "Akosombo Games Day - Action Packed Day Trip",
    description: "Full day trip to Akosombo with games, sightseeing, and community fun",
    long_description: "Join us for an unforgettable day trip to Akosombo! Experience the beautiful scenery of Lake Volta while engaging in exciting outdoor games and activities. This trip combines adventure, relaxation, and community building in one of Ghana's most scenic locations. Perfect for those looking to escape the city and connect with nature and new friends.",
    date: "June 15, 2025",
    time: "6:00 AM - 8:00 PM",
    location: "Akosombo, Eastern Region",
    category: "travel",
    spots: 3,
    total_spots: 20,
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
    location: "Labadi Beach, Accra",
    category: "outdoor",
    spots: 8,
    total_spots: 25,
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
    location: "Aburi Botanical Gardens, Eastern Region",
    category: "outdoor",
    spots: 5,
    total_spots: 15,
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
    location: "Cape Coast, Central Region", 
    category: "travel",
    spots: 2,
    total_spots: 12,
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
export const getEvents = async (): Promise<Event[]> => {
  try {
    console.log('Fetching events from Supabase...');
    // NOTE: Explicit column list to avoid RLS / hidden column surprises.
    const { data, error, status } = await supabase
      .from('events')
      .select('id,title,description,long_description,date,time,category,location,spots,total_spots,price,image,status,created_at,updated_at,organizer,requirements,includes,agenda,flyer')
      .order('date', { ascending: true });

    console.log('Full events query response:', { status, error, rawLength: data?.length });

    if (error) {
      console.error('Error fetching events:', error);
      console.log('Falling back to sample events due to database error');
      return sampleEvents;
    }

    if (!data) {
      console.log('Events query returned null data object');
      return sampleEvents;
    }
    if (Array.isArray(data) && data.length === 0) {
      console.log('[Diagnostics] Zero rows. Possible causes: wrong project URL, RLS blocking anon role, migration not run in this project, or using different schema. Falling back.');
      return sampleEvents;
    }

    console.log(`Found ${data.length} events in database`);

    // Transform database data to match Event interface
    const transformedData = data.map((event: any) => ({
      ...event,
      id: event.id.toString(), // Ensure ID is string
      requirements: Array.isArray(event.requirements) ? event.requirements as string[] : [],
      includes: Array.isArray(event.includes) ? event.includes as string[] : [],
      agenda: Array.isArray(event.agenda) ? event.agenda as Array<{ time: string; activity: string }> : [],
      flyer: event.flyer ? event.flyer as { url?: string; downloadUrl?: string; alt?: string } : undefined,
      gallery: Array.isArray(event.gallery) ? event.gallery as string[] : [],
      // Map time_range to time if time field doesn't exist or use existing time
      time: event.time || event.time_range || 'Time TBA',
      // Ensure all required fields have defaults
      long_description: event.long_description || event.description,
      created_at: event.created_at || new Date().toISOString(),
      updated_at: event.updated_at || event.created_at || new Date().toISOString(),
      organizer: event.organizer || 'Games & Connect Team'
    }));

    console.log('Transformed events:', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Error in getEvents:', error);
    console.log('Exception occurred, falling back to sample events');
    return sampleEvents;
  }
};

export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    console.log(`Fetching event ${id} from Supabase...`);
    const { data, error, status } = await supabase
      .from('events')
      .select('id,title,description,long_description,date,time,category,location,spots,total_spots,price,image,status,created_at,updated_at,organizer,requirements,includes,agenda,flyer')
      .eq('id', id)
      .maybeSingle(); // prevents 406 / PGRST116 when zero rows

    console.log('getEventById raw response:', { id, status, error, found: !!data });

    if (error) {
      if ((error as any).code === 'PGRST116') {
        console.warn('No rows for that id (PGRST116). Returning null fallback.');
      } else {
        console.error('Error fetching event:', error);
      }
      return sampleEvents.find(event => event.id === id) || null;
    }

    if (!data) {
      console.log(`No event found with id ${id} (null data)`);
      return sampleEvents.find(event => event.id === id) || null;
    }

    console.log(`Found event in database:`, data);

    // Transform database data to match Event interface
    const transformedEvent = {
      ...data,
      id: data.id.toString(),
      requirements: Array.isArray(data.requirements) ? data.requirements as string[] : [],
      includes: Array.isArray(data.includes) ? data.includes as string[] : [],
      agenda: Array.isArray(data.agenda) ? data.agenda as Array<{ time: string; activity: string }> : [],
      flyer: data.flyer ? data.flyer as { url?: string; downloadUrl?: string; alt?: string } : undefined,
      gallery: Array.isArray((data as any).gallery) ? (data as any).gallery as string[] : [],
      time: data.time || (data as any).time_range || 'Time TBA',
      long_description: data.long_description || data.description,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.updated_at || data.created_at || new Date().toISOString(),
      organizer: data.organizer || 'Games & Connect Team'
    };

    console.log('Transformed event:', transformedEvent);
    return transformedEvent;
  } catch (error) {
    console.error('Error in getEventById:', error);
    return sampleEvents.find(event => event.id === id) || null;
  }
};

export const registerForEvent = async (eventId: string, userData: any) => {
  try {
    // First, check if the event has available spots
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('spots, total_spots')
      .eq('id', eventId)
      .single();

    if (eventError) {
      return { success: false, error: 'Event not found', isWaitlist: false };
    }

    const isWaitlist = eventData.spots <= 0;

    const { data, error } = await supabase
      .from('registrations')
      .insert([{
        event_id: eventId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        emergency_contact: userData.emergencyContact || null,
        dietary_requirements: userData.dietaryRequirements || null,
        additional_info: userData.additionalInfo || null,
        status: isWaitlist ? 'waitlist' : 'confirmed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]);

    if (error) {
      return { success: false, error: error.message, isWaitlist: false };
    }

    // If not waitlist, update the event spots count
    if (!isWaitlist) {
      const { error: updateError } = await supabase
        .from('events')
        .update({ 
          spots: eventData.spots - 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId);

      if (updateError) {
        console.error('Error updating event spots:', updateError);
      }
    }

    return { success: true, data, isWaitlist };
  } catch (error) {
    console.error('Error registering for event:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      isWaitlist: false 
    };
  }
};

export const getUserRegistrations = async () => {
  try {
    // For now, return sample data since we don't have authentication context
    // In a real app, this would get the current user's email from auth context
    const userEmail = "user@example.com"; // This should come from authentication
    
    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (*)
      `)
      .eq('email', userEmail)
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
