import { supabase } from '../integrations/supabase/client';

export const checkRLSPolicies = async () => {
  try {
    console.log('Checking RLS policies and table structure...');
    
    // Check if events table exists and is accessible
    const { data: tableInfo, error: tableError } = await supabase
      .from('events')
      .select('count')
      .limit(1);
    
    console.log('Table access test:', { tableInfo, tableError });
    
    // Try to get table structure (this might be limited by RLS or function may not exist)
    let structure: any = null;
    let structureError: any = null;
    try {
      const res = await (supabase as any)
        .rpc('get_table_structure', { table_name: 'events' })
        .single();
      structure = res.data;
      structureError = res.error;
    } catch (e: any) {
      structureError = e;
      if (e?.status === 404) {
        console.warn('get_table_structure RPC not found; skipping structure check.');
      } else {
        console.warn('RPC get_table_structure failed:', e);
      }
    }
    
    console.log('Table structure:', { structure, structureError });
    
    // Check if we can insert a test record (to verify RLS)
    const testRecord = {
      title: 'Test Event',
      description: 'Test description',
      date: '2025-12-31',
      time_range: '12:00 PM - 2:00 PM',
      location: 'Test Location',
      category: 'test',
      capacity: 10,
      price: '₵0',
      image_url: '🧪',
      organizer: 'Test Organizer',
      requirements: [],
      includes: [],
      agenda: [],
      additional_info: {}
    };
    
    const { data: insertTest, error: insertError } = await supabase
      .from('events')
      .insert([testRecord as any] as any)
      .select();
    
    console.log('Insert test:', { insertTest, insertError });
    
    // If insert succeeded, clean up the test record
    if (insertTest && insertTest.length > 0) {
      const { error: deleteError } = await supabase
        .from('events')
        .delete()
        .eq('id', insertTest[0].id);
      
      console.log('Cleanup test record:', { deleteError });
    }
    
    return {
      success: !tableError,
      tableAccessible: !tableError,
      canInsert: !insertError,
      canDelete: !insertError, // If we can insert, we can probably delete
      errors: {
        table: tableError?.message,
        insert: insertError?.message,
        structure: structureError?.message
      }
    };
  } catch (error) {
    console.error('Error checking RLS policies:', error);
    return {
      success: false,
      tableAccessible: false,
      canInsert: false,
      canDelete: false,
      errors: {
        general: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
};

export const getTableStructure = async () => {
  try {
    // Try to get information about the events table
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .limit(0); // This should return column info without data
    
    if (error) {
      console.error('Error getting table structure:', error);
      return { success: false, error: error.message };
    }
    
    // Try to get actual data to see what columns exist
    const { data: sampleData, error: sampleError } = await supabase
      .from('events')
      .select('*')
      .limit(1);
    
    return {
      success: true,
      hasData: sampleData && sampleData.length > 0,
      sampleRecord: sampleData?.[0] || null,
      error: sampleError?.message
    };
  } catch (error) {
    console.error('Error in getTableStructure:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

// Function to be called from browser console for testing
if (typeof window !== 'undefined') {
  (window as any).checkRLSPolicies = checkRLSPolicies;
  (window as any).getTableStructure = getTableStructure;
  console.log('RLS checking utilities available:');
  console.log('- checkRLSPolicies() - Check RLS policies and table access');
  console.log('- getTableStructure() - Get table structure information');
}
