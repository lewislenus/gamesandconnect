// Test script to add sample registration data to Supabase
import { supabase } from './src/integrations/supabase/client.js';

async function addSampleRegistrations() {
  console.log('Adding sample registration data...');
  
  try {
    // First, get some existing events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, title')
      .limit(5);
    
    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return;
    }
    
    if (!events || events.length === 0) {
      console.log('No events found. Please add some events first.');
      return;
    }
    
    console.log('Found events:', events.map(e => e.title));
    
    // Sample registration data
    const sampleRegistrations = [
      {
        event_id: events[0].id,
        user_id: crypto.randomUUID(),
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        status: 'confirmed',
        emergency_contact: 'Jane Smith +1-555-0124',
        dietary_requirements: 'No dietary restrictions'
      },
      {
        event_id: events[0].id,
        user_id: crypto.randomUUID(),
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0125',
        status: 'pending',
        emergency_contact: 'Mike Johnson +1-555-0126',
        dietary_requirements: 'Vegetarian'
      },
      {
        event_id: events.length > 1 ? events[1].id : events[0].id,
        user_id: crypto.randomUUID(),
        name: 'Mike Davis',
        email: 'mike.davis@email.com',
        phone: '+1-555-0127',
        status: 'confirmed',
        emergency_contact: 'Lisa Davis +1-555-0128',
        dietary_requirements: 'Gluten-free'
      },
      {
        event_id: events.length > 1 ? events[1].id : events[0].id,
        user_id: crypto.randomUUID(),
        name: 'Emily Wilson',
        email: 'emily.wilson@email.com',
        phone: '+1-555-0129',
        status: 'confirmed',
        emergency_contact: 'Tom Wilson +1-555-0130',
        dietary_requirements: 'None'
      },
      {
        event_id: events.length > 2 ? events[2].id : events[0].id,
        user_id: crypto.randomUUID(),
        name: 'David Brown',
        email: 'david.brown@email.com',
        phone: '+1-555-0131',
        status: 'pending',
        emergency_contact: 'Mary Brown +1-555-0132',
        dietary_requirements: 'Vegan'
      },
      {
        event_id: events.length > 2 ? events[2].id : events[0].id,
        user_id: crypto.randomUUID(),
        name: 'Lisa Anderson',
        email: 'lisa.anderson@email.com',
        phone: '+1-555-0133',
        status: 'cancelled',
        emergency_contact: 'John Anderson +1-555-0134',
        dietary_requirements: 'Lactose intolerant'
      },
      {
        event_id: events[0].id,
        user_id: crypto.randomUUID(),
        name: 'James Miller',
        email: 'james.miller@email.com',
        phone: '+1-555-0135',
        status: 'confirmed',
        emergency_contact: 'Susan Miller +1-555-0136',
        dietary_requirements: 'No restrictions'
      },
      {
        event_id: events.length > 3 ? events[3].id : events[0].id,
        user_id: crypto.randomUUID(),
        name: 'Maria Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1-555-0137',
        status: 'pending',
        emergency_contact: 'Carlos Garcia +1-555-0138',
        dietary_requirements: 'Pescatarian'
      }
    ];
    
    // Insert the registrations
    const { data, error } = await supabase
      .from('registrations')
      .insert(sampleRegistrations)
      .select();
    
    if (error) {
      console.error('Error inserting registrations:', error);
      return;
    }
    
    console.log('Successfully added', data.length, 'registrations:');
    data.forEach(reg => {
      console.log(`- ${reg.name} (${reg.status}) for event ${reg.event_id}`);
    });
    
    // Test fetching the registrations with event details
    console.log('\nTesting registration fetch with event details...');
    const { data: testData, error: testError } = await supabase
      .from('registrations')
      .select(`
        id,
        event_id,
        user_id,
        name,
        email,
        phone,
        status,
        created_at,
        events (
          title,
          date,
          location
        )
      `)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (testError) {
      console.error('Error fetching test data:', testError);
      return;
    }
    
    console.log('Test fetch successful. Sample registrations:');
    testData.forEach(reg => {
      console.log(`- ${reg.name}: ${reg.events?.title || 'Unknown Event'} (${reg.status})`);
    });
    
  } catch (error) {
    console.error('Script error:', error);
  }
}

// Run the script
addSampleRegistrations();
