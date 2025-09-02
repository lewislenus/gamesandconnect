// Script to add YouTube videos to the gallery
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://fxqzihpsasuerpfjzwfr.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cXppaHBzYXN1ZXJwZmp6d2ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTM1OTUsImV4cCI6MjA3MDcyOTU5NX0.SZdqJCwWNW-M4YCq0zpYSvv8bY3sMyHjjjo_AR80VJA";

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to extract YouTube video ID from URL
function getYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Function to get YouTube thumbnail URL
function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// YouTube videos to add
const youtubeVideos = [
  {
    url: 'https://www.youtube.com/watch?v=dvjYm18Bldw',
    title: 'Games & Connect Video 1',
    description: 'Community highlights and gaming moments'
  },
  {
    url: 'https://www.youtube.com/watch?v=bOs8CBprB6g',
    title: 'Games & Connect Video 2', 
    description: 'Adventure activities and team building'
  }
];

async function addYouTubeVideos() {
  console.log('Adding YouTube videos to gallery...');
  
  for (const video of youtubeVideos) {
    const videoId = getYouTubeVideoId(video.url);
    if (!videoId) {
      console.error(`Invalid YouTube URL: ${video.url}`);
      continue;
    }

    const thumbnailUrl = getYouTubeThumbnail(videoId);
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    const galleryItem = {
      type: 'video',
      url: embedUrl, // Use embed URL for the video
      thumbnail: thumbnailUrl,
      title: `[YouTube] ${video.title}`, // Add YouTube prefix to identify it
      description: `${video.description} (YouTube Video)`,
      uploaded_at: new Date().toISOString(),
      uploaded_by: 'admin',
      is_active: true
    };

    try {
      const { data, error } = await supabase
        .from('gallery_items')
        .insert([galleryItem])
        .select();

      if (error) {
        console.error(`Error adding ${video.title}:`, error);
      } else {
        console.log(`Successfully added: ${video.title}`);
        console.log('Gallery item:', data);
      }
    } catch (err) {
      console.error(`Exception adding ${video.title}:`, err);
    }
  }
}

// Run the script
addYouTubeVideos().then(() => {
  console.log('YouTube videos addition completed!');
}).catch(error => {
  console.error('Error running script:', error);
});
