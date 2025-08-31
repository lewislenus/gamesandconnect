// Test script to insert gallery items directly to Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxqzihpsasuerpfjzwfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cXppaHBzYXN1ZXJwZmp6d2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTM1OTUsImV4cCI6MjA3MDcyOTU5NX0.SZdqJCwWNW-M4YCq0zpYSvv8bY3sMyHjjjo_AR80VJA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSampleGalleryItems() {
  console.log('Inserting sample gallery items...');
  
  const sampleItems = [
    {
      type: 'image',
      url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg',
      title: 'Community Event Highlights',
      description: 'Amazing moments from our community gathering',
      uploaded_by: 'admin',
      is_active: true
    },
    {
      type: 'image',
      url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1679_ovnanp.jpg',
      title: 'Group Activities',
      description: 'Fun group activities and team bonding',
      uploaded_by: 'admin',
      is_active: true
    },
    {
      type: 'image',
      url: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2393_cv5xbp.jpg',
      title: 'Team Red Champions',
      description: 'Team Red celebrating their victory',
      uploaded_by: 'admin',
      is_active: true
    },
    {
      type: 'video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      thumbnail: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg',
      title: 'Community Event Recap',
      description: 'Watch highlights from our amazing community event',
      uploaded_by: 'admin',
      is_active: true
    }
  ];

  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .insert(sampleItems)
      .select();

    if (error) {
      console.error('Error inserting gallery items:', error);
      return;
    }

    console.log('Successfully inserted gallery items:', data);
    
    // Test fetching them back
    const { data: fetchedItems, error: fetchError } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('uploaded_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching gallery items:', fetchError);
      return;
    }

    console.log('Fetched gallery items:', fetchedItems);
    console.log(`Found ${fetchedItems?.length || 0} gallery items`);
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the function
insertSampleGalleryItems();
