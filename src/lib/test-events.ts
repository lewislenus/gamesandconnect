import { supabase } from '../integrations/supabase/client';

export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('events')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection successful');
    
    // Test events table
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(5);
    
    if (eventsError) {
      console.error('Events table error:', eventsError);
      return { success: false, error: eventsError.message };
    }
    
    console.log('Events table accessible, found', events?.length || 0, 'events');
    
    return { 
      success: true, 
      eventsCount: events?.length || 0,
      sampleEvent: events?.[0] || null
    };
  } catch (error) {
    console.error('Test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
