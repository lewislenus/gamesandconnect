import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { uploadToCloudinary } from '@/lib/gallery-api';
import {
  Upload,
  Trash2,
  Loader2,
  Image as ImageIcon,
  Trophy,
  Users,
  Calendar,
  Eye,
  EyeOff,
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GameDayImage {
  id: string;
  url: string;
  title: string;
  description: string;
  uploaded_at: string;
  is_active: boolean;
}

export default function AdminGameDay() {
  const { toast } = useToast();
  const [images, setImages] = useState<GameDayImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    title: '',
    description: '',
  });

  // Stats
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    teamRed: 0,
    teamYellow: 0,
    teamBlue: 0,
    teamGreen: 0,
  });

  // Load images on mount
  useEffect(() => {
    loadImages();
    loadStats();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('game_day_gallery')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) throw error;

      setImages(data || []);
    } catch (error: any) {
      console.error('Error loading images:', error);
      toast({
        title: 'Error loading images',
        description: error.message || 'Failed to load Game Day images',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Get all Game Day registrations (where extra_info contains registration_type: 'game_day')
      const { data, error } = await supabase
        .from('registrations')
        .select('extra_info')
        .not('extra_info', 'is', null);

      if (error) throw error;

      const gameDayRegs = data?.filter(
        (reg: any) => reg.extra_info?.registration_type === 'game_day'
      ) || [];

      const teamCounts = {
        teamRed: 0,
        teamYellow: 0,
        teamBlue: 0,
        teamGreen: 0,
      };

      gameDayRegs.forEach((reg: any) => {
        const team = reg.extra_info?.preferred_team;
        if (team === 'Team Red') teamCounts.teamRed++;
        else if (team === 'Team Yellow') teamCounts.teamYellow++;
        else if (team === 'Team Blue') teamCounts.teamBlue++;
        else if (team === 'Team Green') teamCounts.teamGreen++;
      });

      setStats({
        totalRegistrations: gameDayRegs.length,
        ...teamCounts,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Please select an image under 10MB',
          variant: 'destructive',
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select an image file',
          variant: 'destructive',
        });
        return;
      }

      setUploadForm({ ...uploadForm, file });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title) {
      toast({
        title: 'Missing information',
        description: 'Please select a file and provide a title',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    setUploadProgress('Uploading to Cloudinary...');

    try {
      console.log('Starting upload process...', {
        fileName: uploadForm.file.name,
        fileSize: uploadForm.file.size,
        fileType: uploadForm.file.type,
      });

      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(uploadForm.file);

      console.log('Cloudinary upload result:', uploadResult);

      if (!uploadResult.success || !uploadResult.url) {
        console.error('Cloudinary upload failed:', {
          success: uploadResult.success,
          error: uploadResult.error,
          attemptedPresets: uploadResult.attemptedPresets,
          lastErrorRaw: uploadResult.lastErrorRaw,
        });
        
        // Provide more detailed error message
        let errorMessage = uploadResult.error || 'Upload failed';
        if (uploadResult.attemptedPresets && uploadResult.attemptedPresets.length > 0) {
          errorMessage += ` (Tried ${uploadResult.attemptedPresets.length} preset(s))`;
        }
        
        throw new Error(errorMessage);
      }

      console.log('Upload successful, URL:', uploadResult.url);
      setUploadProgress('Saving to database...');

      // Save to database
      const insertData = {
        url: uploadResult.url,
        title: uploadForm.title,
        description: uploadForm.description || null,
        is_active: true,
      };

      console.log('Inserting into database:', insertData);

      const { data, error } = await supabase
        .from('game_day_gallery')
        .insert([insertData])
        .select();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database error: ${error.message} (Code: ${error.code})`);
      }

      console.log('Database insert successful:', data);

      toast({
        title: 'Upload successful! 🎉',
        description: 'Image has been added to Game Day gallery',
      });

      // Reset form and reload images
      setUploadForm({ file: null, title: '', description: '' });
      
      // Clear file input
      const fileInput = document.getElementById('file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      loadImages();
    } catch (error: any) {
      console.error('Upload error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        fullError: error,
      });
      
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const { error } = await supabase
        .from('game_day_gallery')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Image deleted',
        description: 'The image has been removed from the gallery',
      });

      loadImages();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete image',
        variant: 'destructive',
      });
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('game_day_gallery')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: currentStatus ? 'Image hidden' : 'Image visible',
        description: currentStatus
          ? 'Image is now hidden from the gallery'
          : 'Image is now visible in the gallery',
      });

      loadImages();
    } catch (error: any) {
      console.error('Toggle visibility error:', error);
      toast({
        title: 'Update failed',
        description: error.message || 'Failed to update image visibility',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Trophy className="h-10 w-10 text-yellow-500" />
              Game Day Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage Game Day gallery images and view registration stats
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total Registrations</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalRegistrations}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">Team Red</p>
                  <p className="text-3xl font-bold text-red-900">{stats.teamRed}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Team Yellow</p>
                  <p className="text-3xl font-bold text-yellow-900">{stats.teamYellow}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Team Blue</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.teamBlue}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Team Green</p>
                  <p className="text-3xl font-bold text-green-900">{stats.teamGreen}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Image
            </CardTitle>
            <CardDescription>Add images to the Game Day gallery page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Image File *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                  />
                  {uploadForm.file && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {uploadForm.file.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Game Day Finals - January 2025"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    disabled={uploading}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    placeholder="Brief description of the image"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    disabled={uploading}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-4">
                {uploadForm.file ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(uploadForm.file)}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-muted-foreground mt-2">Preview</p>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p>Select an image to see preview</p>
                  </div>
                )}
              </div>
            </div>

            {uploadProgress && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {uploadProgress}
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={uploading || !uploadForm.file || !uploadForm.title}
              className="w-full md:w-auto"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Gallery Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Game Day Gallery ({images.length} images)
            </CardTitle>
            <CardDescription>Manage images displayed on the Game Day page</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">No images yet</p>
                <p className="text-sm text-muted-foreground">Upload your first Game Day image above</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`relative group ${!image.is_active ? 'opacity-50' : ''}`}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={image.url}
                          alt={image.title}
                          className="w-full h-full object-cover"
                        />
                        {!image.is_active && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <EyeOff className="h-8 w-8 text-white" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{image.title}</h3>
                        {image.description && (
                          <p className="text-sm text-muted-foreground truncate">
                            {image.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(image.uploaded_at).toLocaleDateString()}
                        </p>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleVisibility(image.id, image.is_active)}
                            className="flex-1"
                          >
                            {image.is_active ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                Show
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(image.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

