import { supabase } from '@/integrations/supabase/client';

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  uploaded_at: string;
  uploaded_by: string;
  is_active: boolean;
  is_youtube?: boolean;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  attemptedPresets?: Array<{ preset: string; status?: number; error?: string }>;
  lastErrorRaw?: string;
}

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(file: File): Promise<UploadResult> {
  console.log('[GalleryUpload] Starting upload:', { name: file.name, size: file.size, type: file.type });

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  // Allow a gallery-specific preset to override the general one
  const galleryPreset = (import.meta.env.VITE_CLOUDINARY_GALLERY_UPLOAD_PRESET as string | undefined);
  const generalPreset = (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined);
  const configuredPreset = galleryPreset || generalPreset;
  const defaultFolder = (import.meta.env.VITE_CLOUDINARY_FOLDER as string) || 'flyers';
  // Allow overriding gallery folder; if not set fall back to default folder to avoid unsigned preset folder mismatch
  const galleryFolder = (import.meta.env as any).VITE_CLOUDINARY_GALLERY_FOLDER || defaultFolder;

  if (!cloudName) {
    console.error('[GalleryUpload] Missing VITE_CLOUDINARY_CLOUD_NAME');
    return { success: false, error: 'Cloudinary not configured (cloud name missing)' };
  }

  const resourceType = file.type.startsWith('video') ? 'video' : 'image';

  // Build candidate presets list (avoid duplicates)
  const candidatePresets = Array.from(new Set([
    configuredPreset,
    'website-upload',
    'gallery-upload',
    'ml_default',
    'unsigned_preset',
    'unsigned'
  ].filter(Boolean))) as string[];

  // Try different folder configurations for the working preset
  const folderCandidates = [
    galleryFolder, // gallery
    defaultFolder, // flyers
    '', // no folder (root)
    undefined // omit folder param entirely
  ];

  let lastError: string | undefined;
  let lastErrorRaw: string | undefined;
  const attempts: UploadResult['attemptedPresets'] = [];
  
  // Try each preset with different folder configurations
  for (const preset of candidatePresets) {
    for (const folder of folderCandidates) {
      try {
        console.log('[GalleryUpload] Trying preset:', preset, 'resourceType:', resourceType, 'folder:', folder);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', preset);
        if (folder !== undefined && folder !== '') {
          formData.append('folder', folder);
        }

        const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
        const response = await fetch(endpoint, { method: 'POST', body: formData });

        if (!response.ok) {
          const txt = await response.text();
          const clipped = txt.slice(0, 500);
          console.warn('[GalleryUpload] Preset+folder failed:', preset, folder, response.status, clipped);
          lastError = `Preset ${preset} with folder '${folder || 'none'}' failed (${response.status})`;
          lastErrorRaw = clipped;
          attempts.push({ preset: `${preset}+${folder || 'none'}`, status: response.status, error: clipped });
          continue;
        }

        const data = await response.json();
        if (!data?.secure_url) {
          console.warn('[GalleryUpload] Missing secure_url in response for preset+folder', preset, folder, data);
          lastError = 'No secure_url returned';
          attempts.push({ preset: `${preset}+${folder || 'none'}`, status: response.status, error: 'No secure_url in response' });
          continue;
        }
        console.log('[GalleryUpload] Success with preset+folder:', preset, folder, data.secure_url);
        attempts.push({ preset: `${preset}+${folder || 'none'}`, status: 200 });
        return { success: true, url: data.secure_url, attemptedPresets: attempts };
      } catch (err: any) {
        console.warn('[GalleryUpload] Exception with preset+folder', preset, folder, err?.message || err);
        lastError = err?.message || 'Unknown error';
        lastErrorRaw = err?.stack || err?.message;
        attempts.push({ preset: `${preset}+${folder || 'none'}`, error: lastError });
      }
    }
  }

  // Exhausted presets
  console.error('[GalleryUpload] All presets failed. Last error:', lastError, 'Raw:', lastErrorRaw, 'Attempts:', attempts);
  return { success: false, error: lastError || 'All presets failed', attemptedPresets: attempts, lastErrorRaw };
}

/**
 * Save gallery item to database
 */
export async function saveGalleryItem(item: Omit<GalleryItem, 'id' | 'uploaded_at'>): Promise<{ success: boolean; error?: string }> {
  try {
    // Note: You'll need to create a gallery_items table in Supabase
    // For now, we'll use any type casting as done in team-api.ts
    const { error } = await (supabase as any)
      .from('gallery_items')
      .insert([{
        ...item,
        uploaded_at: new Date().toISOString(),
      }]);

    if (error) {
      console.error('Database save error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Save gallery item error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to save gallery item' 
    };
  }
}

/**
 * Get all gallery items
 */
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const { data, error } = await (supabase as any)
      .from('gallery_items')
      .select('*')
      .eq('is_active', true)
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Get gallery items error:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Get gallery items error:', error);
    return [];
  }
}

/**
 * Delete gallery item
 */
export async function deleteGalleryItem(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Attempting to delete gallery item:', id);
    
    // First try soft delete (set is_active to false)
    const { data, error } = await (supabase as any)
      .from('gallery_items')
      .update({ is_active: false })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Soft delete failed, trying hard delete:', error);
      
      // If soft delete fails due to RLS, try hard delete
      const { error: deleteError } = await (supabase as any)
        .from('gallery_items')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        console.error('Hard delete also failed:', deleteError);
        return { success: false, error: deleteError.message };
      }
      
      console.log('Hard delete successful');
      return { success: true };
    }

    console.log('Soft delete successful:', data);
    return { success: true };
  } catch (error) {
    console.error('Delete gallery item error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete gallery item' 
    };
  }
}

/**
 * Update gallery item
 */
export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase as any)
      .from('gallery_items')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Update gallery item error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Update gallery item error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update gallery item' 
    };
  }
}
