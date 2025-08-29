import { supabase } from '../integrations/supabase/client';
import { sampleEventsForDB } from './sample-events-db-schema';

// Sample events data that matches the database schema
const sampleEventsData = sampleEventsForDB;

export const uploadSampleEvents = async () => {
  try {
    console.log('Uploading sample events to Supabase...');
    
    const { data, error } = await supabase
      .from('events')
      .insert(sampleEventsData)
      .select();

    if (error) {
      console.error('Error uploading sample events:', error);
      return { success: false, error: error.message };
    }

    console.log('Successfully uploaded sample events:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Exception during upload:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const clearAllEvents = async () => {
  try {
    console.log('Clearing all events from database...');
    
    const { error } = await supabase
      .from('events')
      .delete()
      .neq('id', '0'); // Delete all events

    if (error) {
      console.error('Error clearing events:', error);
      return { success: false, error: error.message };
    }

    console.log('Successfully cleared all events');
    return { success: true };
  } catch (error) {
    console.error('Exception during clear:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Function to be called from browser console for testing
if (typeof window !== 'undefined') {
  (window as any).uploadSampleEvents = uploadSampleEvents;
  (window as any).clearAllEvents = clearAllEvents;
  console.log('Sample events utilities available:');
  console.log('- uploadSampleEvents() - Upload sample events to database');
  console.log('- clearAllEvents() - Clear all events from database');
}
