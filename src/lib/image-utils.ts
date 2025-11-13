/**
 * Image URL utilities for handling Supabase storage URLs
 */

const CURRENT_SUPABASE_PROJECT = 'fxqzihpsasuerpfjzwfr';
const OLD_SUPABASE_PROJECT = 'kgfpdduocqqcbfzzmbbw';

/**
 * Checks if a URL is from an old/invalid Supabase project
 */
export function isInvalidSupabaseUrl(url: string): boolean {
  if (!url) return true;
  
  // Check if it's from the old project
  if (url.includes(OLD_SUPABASE_PROJECT)) {
    return true;
  }
  
  // Check if signed URL token is in the URL (these expire)
  if (url.includes('token=') && url.includes(OLD_SUPABASE_PROJECT)) {
    return true;
  }
  
  return false;
}

/**
 * Extracts filename from a Supabase storage URL
 */
export function extractFilenameFromUrl(url: string): string | null {
  if (!url) return null;
  
  try {
    // Handle signed URLs with token
    const urlWithoutToken = url.split('?')[0];
    
    // Extract the path after /storage/v1/object/
    const match = urlWithoutToken.match(/\/storage\/v1\/object\/(?:sign\/)?([^?]+)/);
    if (match && match[1]) {
      // Decode URI component and get just the filename
      const decodedPath = decodeURIComponent(match[1]);
      const parts = decodedPath.split('/');
      return parts[parts.length - 1];
    }
    
    // Fallback: try to get last part of URL path
    const lastPart = url.split('/').pop();
    if (lastPart) {
      return decodeURIComponent(lastPart.split('?')[0]);
    }
  } catch (error) {
    console.error('Error extracting filename:', error);
  }
  
  return null;
}

/**
 * Converts old/invalid Supabase URLs to use Cloudinary or fallback images
 */
export function sanitizeImageUrl(url: string | null | undefined): string {
  if (!url) {
    return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop';
  }
  
  // If it's already a valid external URL (Cloudinary, Unsplash, etc.), return as is
  if (url.startsWith('https://res.cloudinary.com') || 
      url.startsWith('https://images.unsplash.com') ||
      url.startsWith('http://') && !url.includes('supabase')) {
    return url;
  }
  
  // If it's from the old Supabase project or has expired tokens
  if (isInvalidSupabaseUrl(url)) {
    const filename = extractFilenameFromUrl(url);
    
    // Map known filenames to fallback images
    const fallbackMap: Record<string, string> = {
      'Two days in cape coast (1).jpg': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=800&fit=crop',
      'Two days in cape coast (4).jpg': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      'Akosombo.jpg': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
      'Wli waterfalls.jpg': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=1200&h=800&fit=crop',
    };
    
    if (filename && fallbackMap[filename]) {
      return fallbackMap[filename];
    }
    
    // Generic fallback
    return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop';
  }
  
  // If it's from the current project, return as is
  if (url.includes(CURRENT_SUPABASE_PROJECT)) {
    return url;
  }
  
  // Default fallback
  return url;
}

/**
 * Sanitizes an array of image URLs (for galleries)
 */
export function sanitizeImageArray(urls: string[] | null | undefined): string[] {
  if (!urls || !Array.isArray(urls)) {
    return [];
  }
  
  return urls
    .map(url => sanitizeImageUrl(url))
    .filter(url => url !== null) as string[];
}

/**
 * Gets a fallback image based on event category
 */
export function getCategoryFallbackImage(category?: string | null): string {
  const fallbacks: Record<string, string> = {
    'adventure': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop',
    'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop',
    'hiking': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&h=800&fit=crop',
    'cultural': 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&h=800&fit=crop',
    'gaming': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=800&fit=crop',
    'social': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop',
  };
  
  const key = category?.toLowerCase() || 'social';
  return fallbacks[key] || fallbacks['social'];
}

