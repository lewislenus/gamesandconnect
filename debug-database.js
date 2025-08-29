import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxqzihpsasuerpfjzwfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cXppaHBzYXN1ZXJwZmp6d2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTM1OTUsImV4cCI6MjA3MDcyOTU5NX0.SZdqJCwWNW-M4YCq0zpYSvv8bY3sMyHjjjo_AR80VJA';

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Testing database connection...');

// Test basic connection
async function testConnection() {
  try {
    // Test events table
    console.log('\n=== Testing events table ===');
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    if (eventsError) {
      console.error('Events error:', eventsError);
    } else {
      console.log('Events found:', events?.length || 0);
      if (events?.length > 0) {
        console.log('Sample event:', events[0]);
        console.log('Available event columns:', Object.keys(events[0]));
      }
    }

    // Test registrations table structure
    console.log('\n=== Testing registrations table structure ===');
    const { data: regStructure, error: regStructureError } = await supabase
      .from('registrations')
      .select('*')
      .limit(1);
    
    if (regStructureError) {
      console.error('Registrations structure error:', regStructureError);
    } else {
      console.log('Registrations structure test passed, sample:', regStructure?.[0] || 'No data');
      if (regStructure?.[0]) {
        console.log('Available columns:', Object.keys(regStructure[0]));
      }
    }

    // Test with specific columns
    console.log('\n=== Testing registrations with specific columns ===');
    const { data: regData, error: regError } = await supabase
      .from('registrations')
      .select('id, event_id, name, email, phone, status, created_at')
      .limit(5);
    
    if (regError) {
      console.error('Registrations query error:', regError);
    } else {
      console.log('Registrations found:', regData?.length || 0);
      if (regData?.length > 0) {
        console.log('Sample registration:', regData[0]);
      }
    }

    // Test admin_users table
    console.log('\n=== Testing admin_users table ===');
    const { data: adminUsers, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(5);
    
    if (adminError) {
      console.error('Admin users error:', adminError);
    } else {
      console.log('Admin users found:', adminUsers?.length || 0);
      adminUsers?.forEach(admin => {
        console.log('Admin user:', admin);
      });
    }

    // Test current user
    console.log('\n=== Testing current user ===');
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('User error:', userError);
    } else {
      console.log('Current user:', user?.user?.id || 'No user logged in');
    }

    // Test with service role (if available)
    console.log('\n=== Testing with bypassed RLS ===');
    const { data: allRegs, error: allRegsError } = await supabase
      .rpc('get_all_registrations_admin');
    
    if (allRegsError) {
      console.error('RPC call error:', allRegsError);
      
      // Try direct query as fallback
      console.log('Trying direct query with RLS bypass...');
      const { data: directRegs, error: directError } = await supabase
        .from('registrations')
        .select(`
          id,
          event_id,
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
        .limit(10);
      
      if (directError) {
        console.error('Direct query also failed:', directError);
      } else {
        console.log('Direct query successful, registrations:', directRegs?.length || 0);
      }
    } else {
      console.log('RPC call successful, registrations:', allRegs?.length || 0);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testConnection();
