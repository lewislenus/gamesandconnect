// Cleanup script for gallery items
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fxqzihpsasuerpfjzwfr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cXppaHBzYXN1ZXJwZmp6d2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTM1OTUsImV4cCI6MjA3MDcyOTU5NX0.SZdqJCwWNW-M4YCq0zpYSvv8bY3sMyHjjjo_AR80VJA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupGalleryItems() {
  console.log('Starting gallery cleanup...');
  
  try {
    // 1. Remove items with blob URLs (these don't persist)
    const { data: blobItems, error: blobError } = await supabase
      .from('gallery_items')
      .select('id, url, title')
      .like('url', 'blob:%');
    
    if (blobItems && blobItems.length > 0) {
      console.log('Found blob URL items to remove:', blobItems);
      
      const { error: deleteBlobError } = await supabase
        .from('gallery_items')
        .delete()
        .like('url', 'blob:%');
        
      if (deleteBlobError) {
        console.error('Error removing blob items:', deleteBlobError);
      } else {
        console.log(`Removed ${blobItems.length} blob URL items`);
      }
    }

    // 2. Update video URLs to working ones
    const workingVideoUrls = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    ];

    const { data: videoItems, error: videoError } = await supabase
      .from('gallery_items')
      .select('id, url, title')
      .eq('type', 'video');
    
    if (videoItems && videoItems.length > 0) {
      console.log('Found video items:', videoItems);
      
      for (let i = 0; i < videoItems.length; i++) {
        const item = videoItems[i];
        const newUrl = workingVideoUrls[i % workingVideoUrls.length];
        
        const { error: updateError } = await supabase
          .from('gallery_items')
          .update({ 
            url: newUrl,
            thumbnail: 'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg'
          })
          .eq('id', item.id);
          
        if (updateError) {
          console.error(`Error updating video ${item.id}:`, updateError);
        } else {
          console.log(`Updated video ${item.title} with working URL`);
        }
      }
    }

    // 3. Add some fresh sample images with working URLs
    const sampleImages = [
      {
        type: 'image',
        url: 'https://picsum.photos/800/600?random=1',
        title: 'Random Sample Image 1',
        description: 'Beautiful sample image from Picsum',
        uploaded_by: 'admin',
        is_active: true
      },
      {
        type: 'image', 
        url: 'https://picsum.photos/800/600?random=2',
        title: 'Random Sample Image 2',
        description: 'Another beautiful sample image',
        uploaded_by: 'admin',
        is_active: true
      }
    ];

    const { data: newImages, error: insertError } = await supabase
      .from('gallery_items')
      .insert(sampleImages)
      .select();

    if (insertError) {
      console.error('Error inserting sample images:', insertError);
    } else {
      console.log('Added sample images:', newImages);
    }

    // 4. Get final count
    const { data: finalItems, error: countError } = await supabase
      .from('gallery_items')
      .select('id, type, title, url')
      .eq('is_active', true)
      .order('uploaded_at', { ascending: false });

    if (countError) {
      console.error('Error getting final count:', countError);
    } else {
      console.log(`\nFinal gallery items (${finalItems?.length || 0}):`);
      finalItems?.forEach(item => {
        console.log(`- ${item.type}: ${item.title} (${item.url.substring(0, 50)}...)`);
      });
    }

  } catch (error) {
    console.error('Cleanup error:', error);
  }
}

// Run cleanup
cleanupGalleryItems();
