// Quick test to check agenda data from database
console.log('Testing agenda data fetch...');

// Import the API function
import { getEvents } from './src/lib/api.js';

async function testAgenda() {
  try {
    console.log('Fetching events...');
    const events = await getEvents();
    
    console.log(`Found ${events.length} events`);
    
    events.forEach((event, index) => {
      console.log(`\n--- Event ${index + 1}: ${event.title} ---`);
      console.log('ID:', event.id);
      console.log('Has agenda:', !!event.agenda);
      console.log('Agenda type:', typeof event.agenda);
      console.log('Is agenda array:', Array.isArray(event.agenda));
      
      if (event.agenda && Array.isArray(event.agenda)) {
        console.log('Agenda items count:', event.agenda.length);
        console.log('First agenda item:', event.agenda[0]);
      } else {
        console.log('Agenda data:', event.agenda);
      }
      
      console.log('Has event_schedule:', !!event.event_schedule);
      console.log('Event_schedule type:', typeof event.event_schedule);
      
      if (event.event_schedule && Array.isArray(event.event_schedule)) {
        console.log('Event_schedule items count:', event.event_schedule.length);
        console.log('First event_schedule item:', event.event_schedule[0]);
      }
    });
  } catch (error) {
    console.error('Error testing agenda:', error);
  }
}

testAgenda();
