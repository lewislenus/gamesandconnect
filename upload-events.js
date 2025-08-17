import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://fxqzihpsasuerpfjzwfr.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cXppaHBzYXN1ZXJwZmp6d2ZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTE1MzU5NSwiZXhwIjoyMDcwNzI5NTk1fQ.bJP-Zv2qTOOZWxGYR0jk7dQ7wQq_KBfx7RFID_7Hxzk"; // You'll need the service role key

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Event data to insert (basic version first)
const events = [
  {
    title: 'Friday Game Night & Connect',
    description: 'Weekly game night mixing digital and board games with networking',
    date: 'December 15, 2024',
    time: '7:00 PM - 11:00 PM',
    location: 'East Legon Community Center',
    category: 'social',
    spots: 20,
    total_spots: 40,
    price: '₵25',
    image: '🎮',
    status: 'open'
  },
  {
    title: 'Kakum Forest Adventure & Cultural Discovery',
    description: 'Canopy walk adventure with local cultural immersion and team building',
    date: 'December 22-23, 2024',
    time: '6:00 AM - 6:00 PM (Day 1) | 8:00 AM - 5:00 PM (Day 2)',
    location: 'Kakum National Park, Central Region',
    category: 'travel',
    spots: 8,
    total_spots: 20,
    price: '₵280',
    image: '🌳',
    status: 'filling-fast'
  },
  {
    title: 'Esports Championship & Tech Talk',
    description: 'FIFA & Mobile Legends tournament with tech industry networking',
    date: 'December 28, 2024',
    time: '1:00 PM - 8:00 PM',
    location: 'Impact Hub Accra',
    category: 'gaming',
    spots: 15,
    total_spots: 32,
    price: '₵40',
    image: '🏆',
    status: 'open'
  },
  {
    title: 'Kumasi Heritage Trail & Connect',
    description: 'Explore Ashanti culture, visit historic sites, and build connections',
    date: 'January 5-6, 2025',
    time: '7:00 AM - 7:00 PM (Day 1) | 9:00 AM - 4:00 PM (Day 2)',
    location: 'Kumasi, Ashanti Region',
    category: 'travel',
    spots: 12,
    total_spots: 18,
    price: '₵320',
    image: '👑',
    status: 'open'
  },
  {
    title: 'Young Professionals Mixer & Board Game Night',
    description: 'Network with young professionals while enjoying strategic board games',
    date: 'January 12, 2025',
    time: '6:00 PM - 10:00 PM',
    location: 'Silverbird Lifestyle Centre, Accra',
    category: 'social',
    spots: 25,
    total_spots: 35,
    price: '₵35',
    image: '🤝',
    status: 'open'
  },
  {
    title: 'Trivia Friday Challenge',
    description: 'Weekly trivia night with prizes and community building',
    date: 'Every Friday',
    time: '7:00 PM - 9:30 PM',
    location: 'Online via Zoom',
    category: 'trivia',
    spots: 15,
    total_spots: 30,
    price: 'Free',
    image: '🧠',
    status: 'open'
  },
  {
    title: 'Beach Volleyball & Community Cleanup',
    description: 'Sports, environmental action, and beachside networking',
    date: 'January 19, 2025',
    time: '9:00 AM - 5:00 PM',
    location: 'Laboma Beach, Accra',
    category: 'social',
    spots: 18,
    total_spots: 25,
    price: '₵50',
    image: '🏐',
    status: 'open'
  },
  {
    title: 'International Gaming Championship',
    description: 'Multi-platform gaming tournament with international livestream',
    date: 'February 1-2, 2025',
    time: '10:00 AM - 10:00 PM (Day 1) | 12:00 PM - 8:00 PM (Day 2)',
    location: 'Accra International Conference Centre',
    category: 'gaming',
    spots: 20,
    total_spots: 50,
    price: '₵75',
    image: '🎯',
    status: 'open'
  }
];

async function uploadEvents() {
  try {
    console.log('Starting event upload...');
    
    // First, clear any existing events
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except non-existent ID
    
    if (deleteError) {
      console.log('Note: Could not clear existing events:', deleteError.message);
    }
    
    // Insert new events
    const { data, error } = await supabase
      .from('events')
      .insert(events);
    
    if (error) {
      console.error('Error inserting events:', error);
      return;
    }
    
    console.log('Successfully uploaded', events.length, 'events to Supabase!');
    
    // Now add some sample registrations to make events look active
    const { data: insertedEvents } = await supabase
      .from('events')
      .select('id, title, total_spots');
    
    if (insertedEvents && insertedEvents.length > 0) {
      console.log('Adding sample registrations...');
      
      const sampleRegistrations = [];
      const sampleUsers = [
        { name: 'John Doe', email: 'john@example.com', phone: '+233241234567' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '+233241234568' },
        { name: 'Kwame Asante', email: 'kwame@example.com', phone: '+233241234569' },
        { name: 'Akosua Osei', email: 'akosua@example.com', phone: '+233241234570' },
        { name: 'Kofi Mensah', email: 'kofi@example.com', phone: '+233241234571' },
        { name: 'Ama Boateng', email: 'ama@example.com', phone: '+233241234572' }
      ];
      
      insertedEvents.forEach(event => {
        // Add 1-3 random registrations per event
        const numRegistrations = Math.floor(Math.random() * 3) + 1;
        const shuffledUsers = [...sampleUsers].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < numRegistrations; i++) {
          const user = shuffledUsers[i];
          sampleRegistrations.push({
            event_id: event.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            status: Math.random() < 0.8 ? 'confirmed' : 'pending'
          });
        }
      });
      
      const { error: regError } = await supabase
        .from('registrations')
        .insert(sampleRegistrations);
      
      if (regError) {
        console.log('Note: Could not add sample registrations:', regError.message);
      } else {
        console.log('Added', sampleRegistrations.length, 'sample registrations');
      }
    }
    
    console.log('Event upload completed successfully!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

uploadEvents();
