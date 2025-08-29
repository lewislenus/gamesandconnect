// Quick debug script to check agenda data
import { supabase } from './src/integrations/supabase/client.js';

async function debugAgenda() {
  try {
    console.log('Fetching events from database...');
    
    const { data, error } = await supabase
      .from('events')
      .select('id, title, agenda')
      .limit(5);

    if (error) {
      console.error('Error:', error);
      return;
    }

    console.log('Events found:', data?.length);
    
    data?.forEach((event, index) => {
      console.log(`\nEvent ${index + 1}:`);
      console.log('ID:', event.id);
      console.log('Title:', event.title);
      console.log('Agenda type:', typeof event.agenda);
      console.log('Agenda:', event.agenda);
      console.log('Is array:', Array.isArray(event.agenda));
      if (event.agenda && Array.isArray(event.agenda)) {
        console.log('Agenda length:', event.agenda.length);
        console.log('First item:', event.agenda[0]);
      }
    });

  } catch (err) {
    console.error('Exception:', err);
  }
}

debugAgenda();
