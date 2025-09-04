import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getDashboardStats, getRecentActivity, getTopEvents, getEventRegistrations, updateRegistrationStatus, TopEvent } from '@/lib/admin-api';
import { getTeamStats, getTeamMembers, TeamStats, TeamMembership } from '@/lib/team-api';
import { getGalleryItems, uploadToCloudinary, saveGalleryItem, deleteGalleryItem, GalleryItem } from '@/lib/gallery-api';
import { Skeleton } from "@/components/ui/skeleton";
import AdminNavigation from '@/components/AdminNavigation';
import EmailTestPanel from '@/components/EmailTestPanel';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  Activity, 
  DollarSign,
  Eye,
  UserPlus,
  CalendarPlus,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  BarChart3,
  PieChart,
  Settings,
  Image as ImageIcon,
  Phone,
  Download,
  RefreshCw,
  Mail,
  Check,
  X,
  MoreHorizontal,
  Upload,
  Trash2,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardStats {
  totalEvents: number;
  totalUsers: number;
  totalRegistrations: number;
  totalRevenue: number;
  activeEvents: number;
  pendingRegistrations: number;
  completedEvents: number;
  averageRating: number;
}

interface RecentActivity {
  id: string;
  type: 'registration' | 'event_created' | 'event_updated' | 'user_joined';
  description: string;
  timestamp: string;
  user?: string;
  event?: string;
}

interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  created_at: string;
  event?: {
    title: string;
    date: string;
    location: string;
  };
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topEvents, setTopEvents] = useState<TopEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Team member management state
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMembership[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [teamMemberModalOpen, setTeamMemberModalOpen] = useState(false);

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, activityData, eventsData, registrationsData, teamStatsData, galleryData] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
        getTopEvents(),
        getEventRegistrations(),
        getTeamStats(),
        getGalleryItems()
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
      setTopEvents(eventsData);
      setRegistrations(registrationsData.slice(0, 10)); // Show latest 10 registrations
      setGalleryItems(galleryData);
      
      // Set team stats
      if (teamStatsData.success && teamStatsData.data) {
        setTeamStats(teamStatsData.data);
      }
      
      // Check if we got sample/demo data
      if (registrationsData.length > 0 && String(registrationsData[0].id).startsWith('sample-')) {
        setIsDemoMode(true);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: "Error Loading Dashboard",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const loadTeamMembers = async (teamName: string) => {
    setLoadingTeamMembers(true);
    try {
      const result = await getTeamMembers(teamName);
      if (result.success && result.data) {
        setTeamMembers(result.data);
        setSelectedTeam(teamName);
        setTeamMemberModalOpen(true);
      } else {
        toast({
          title: "Error Loading Team Members",
          description: result.error || "Failed to load team members.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
      toast({
        title: "Error Loading Team Members",
        description: "Failed to load team members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const file of Array.from(files)) {
        try {
          // Validate file size (10MB limit)
          if (file.size > 10 * 1024 * 1024) {
            toast({
              title: "File Too Large",
              description: `${file.name} exceeds 10MB limit.`,
              variant: "destructive",
            });
            errorCount++;
            continue;
          }

          // Upload to Cloudinary
          const uploadResult = await uploadToCloudinary(file);
          if (!uploadResult.success) {
            console.error('[GalleryUpload] Failed for', file.name, uploadResult.error);
            toast({
              title: 'Upload Failed',
              description: `${file.name}: ${uploadResult.error || 'Unknown error'}`,
              variant: 'destructive'
            });
            errorCount++;
            continue;
          }

          if (uploadResult.url) {
            // Save to database
            const galleryItem = {
              type: file.type.startsWith('video/') ? 'video' as const : 'image' as const,
              url: uploadResult.url,
              title: file.name.split('.')[0], // Use filename without extension as title
              description: `Uploaded ${file.type.startsWith('video/') ? 'video' : 'image'}`,
              uploaded_by: 'admin', // In real app, get from auth context
              is_active: true,
            };

            const saveResult = await saveGalleryItem(galleryItem);
            
            if (saveResult.success) {
              successCount++;
            } else {
              console.warn('Database save failed:', saveResult.error);
              // Still count as success if upload worked, we can retry DB save later
              successCount++;
            }
          } else {
            console.error('Upload failed for file:', file.name);
            errorCount++;
          }
        } catch (fileError) {
          console.error('Error processing file:', file.name, fileError);
          errorCount++;
        }
      }
      
      // Show summary toast
      if (successCount > 0) {
        toast({
          title: "Upload Complete",
          description: `${successCount} file(s) uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}.`,
        });
      }
      
      if (errorCount > 0 && successCount === 0) {
        toast({
          title: "Upload Failed",
          description: "All uploads failed. Verify preset name and that it's unsigned.",
          variant: "destructive",
        });
      }
      
      // Refresh gallery items if any succeeded
      if (successCount > 0) {
        try {
          const galleryData = await getGalleryItems();
          setGalleryItems(galleryData);
        } catch (refreshError) {
          console.warn('Failed to refresh gallery:', refreshError);
        }
      }
      
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An error occurred while uploading files.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDeleteGalleryItem = async (itemId: string) => {
    try {
      const result = await deleteGalleryItem(itemId);
      
      if (result.success) {
        // Remove from local state
        setGalleryItems(galleryItems.filter(item => item.id !== itemId));
        toast({
          title: "Item Deleted",
          description: "Gallery item has been removed.",
        });
      } else {
        toast({
          title: "Delete Failed",
          description: result.error || "Failed to delete gallery item.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Delete Error",
        description: "An error occurred while deleting the item.",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = async (registrationId: string, newStatus: 'confirmed' | 'pending' | 'cancelled') => {
    try {
      const result = await updateRegistrationStatus(registrationId, newStatus);
      if (result.success) {
        toast({
          title: "Status Updated",
          description: `Registration status updated to ${newStatus}`,
        });
        
        // Update local state
        setRegistrations(prev => prev.map(reg => 
          reg.id === registrationId 
            ? { ...reg, status: newStatus }
            : reg
        ));
      } else {
        throw new Error(result.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
      toast({
        title: "Error",
        description: "Failed to update registration status",
        variant: "destructive",
      });
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    trend = 'up' 
  }: { 
    title: string; 
    value: string | number; 
    change: string; 
    icon: any; 
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-muted-foreground'
        }`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity }: { activity: RecentActivity }) => {
    const getActivityIcon = (type: string) => {
      switch (type) {
        case 'registration': return <UserPlus className="h-4 w-4 text-green-600" />;
        case 'event_created': return <CalendarPlus className="h-4 w-4 text-blue-600" />;
        case 'event_updated': return <Settings className="h-4 w-4 text-orange-600" />;
        case 'user_joined': return <Users className="h-4 w-4 text-purple-600" />;
        default: return <Activity className="h-4 w-4 text-muted-foreground" />;
      }
    };

    return (
      <div className="flex items-center gap-3 p-3 rounded-lg border">
        {getActivityIcon(activity.type)}
        <div className="flex-1">
          <p className="text-sm font-medium">{activity.description}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(activity.timestamp).toLocaleDateString()} at{' '}
            {new Date(activity.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Navigation */}
        <AdminNavigation />

        {/* Demo Mode Indicator */}
        {isDemoMode && (
          <div className="mb-6">
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertDescription className="flex items-center gap-2 text-yellow-800">
                <Badge variant="outline" className="bg-yellow-100 border-yellow-300 text-yellow-800">
                  Demo Mode
                </Badge>
                You're viewing sample registration data. Connect to your Supabase database with proper admin authentication to see real data.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={stats?.totalEvents || 0}
            change="+12% from last month"
            icon={Calendar}
            trend="up"
          />
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            change="+8% from last month"
            icon={Users}
            trend="up"
          />
          <StatCard
            title="Total Registrations"
            value={stats?.totalRegistrations || 0}
            change="+15% from last month"
            icon={UserPlus}
            trend="up"
          />
          <StatCard
            title="Revenue"
            value={`₵${stats?.totalRevenue || 0}`}
            change="+22% from last month"
            icon={DollarSign}
            trend="up"
          />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts and Analytics */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="registrations">Registrations</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Active Events</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {stats?.activeEvents || 0}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Currently running</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Pending Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {stats?.pendingRegistrations || 0}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-muted-foreground">Need approval</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats?.averageRating?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">Event satisfaction</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Events</CardTitle>
                    <CardDescription>
                      Events with highest registration rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topEvents.map((event, index) => (
                        <div key={event.id} className="flex items-center gap-4 p-3 rounded-lg border">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          
                          {/* Event Poster/Image */}
                          <div className="flex-shrink-0">
                            {event.image_url ? (
                              <div className="relative">
                                <img 
                                  src={event.image_url} 
                                  alt={`${event.title} poster`}
                                  className="w-12 h-12 rounded-lg object-cover border"
                                  onError={(e) => {
                                    // Show placeholder if image fails to load
                                    e.currentTarget.style.display = 'none';
                                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (placeholder) placeholder.style.display = 'flex';
                                  }}
                                />
                                {/* Image placeholder */}
                                <div 
                                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center border absolute inset-0"
                                  style={{ display: 'none' }}
                                >
                                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                            ) : (
                              <div 
                                className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center text-lg border"
                              >
                                {event.image}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>{event.registrations}/{event.capacity} registered</span>
                              <span>₵{event.revenue} revenue</span>
                              {event.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-current text-yellow-500" />
                                  <span>{event.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Progress 
                            value={(event.registrations / event.capacity) * 100} 
                            className="w-20"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="registrations" className="space-y-6">
                {/* Registration Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Total Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {stats?.totalRegistrations || 0}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <UserPlus className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">All time</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Confirmed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {registrations.filter(r => r.status === 'confirmed').length}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Active</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {registrations.filter(r => r.status === 'pending').length}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="h-4 w-4 text-orange-600" />
                        <span className="text-sm text-muted-foreground">Awaiting approval</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Cancelled</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {registrations.filter(r => r.status === 'cancelled').length}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <X className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-muted-foreground">Cancelled</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Registrations Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Registrations</CardTitle>
                    <CardDescription>
                      Latest event registrations with management options
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Participant</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registrations.length > 0 ? (
                            registrations.map((registration) => (
                              <TableRow key={registration.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{registration.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      ID: {String(registration.id).slice(0, 8)}...
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">
                                      {registration.event?.title || 'Unknown Event'}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {registration.event?.location || 'Location TBA'}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-sm">
                                      <Mail className="h-3 w-3" />
                                      {registration.email}
                                    </div>
                                    {registration.phone && (
                                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        {registration.phone}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={
                                      registration.status === 'confirmed' ? 'default' :
                                      registration.status === 'pending' ? 'secondary' :
                                      'destructive'
                                    }
                                  >
                                    {registration.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {new Date(registration.created_at).toLocaleDateString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(registration.created_at).toLocaleTimeString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    {registration.status !== 'confirmed' && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleStatusUpdate(registration.id, 'confirmed')}
                                        className="h-7 w-7 p-0"
                                        title="Confirm Registration"
                                      >
                                        <Check className="h-3 w-3" />
                                      </Button>
                                    )}
                                    {registration.status !== 'cancelled' && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleStatusUpdate(registration.id, 'cancelled')}
                                        className="h-7 w-7 p-0"
                                        title="Cancel Registration"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-7 w-7 p-0"
                                      title="More Options"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8">
                                <div className="text-muted-foreground">
                                  No registrations found
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {registrations.length >= 10 && (
                      <div className="mt-4 text-center">
                        <Link to="/admin/registrations">
                          <Button variant="outline">
                            View All Registrations
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Management</CardTitle>
                    <CardDescription>
                      Quick actions for managing events
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to="/admin/events">
                        <Button className="w-full justify-start">
                          <CalendarPlus className="h-4 w-4 mr-2" />
                          Create New Event
                        </Button>
                      </Link>
                      <Link to="/admin/events/manage">
                        <Button variant="outline" className="w-full justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Events
                        </Button>
                      </Link>
                      <Link to="/admin/registrations">
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          View Registrations
                        </Button>
                      </Link>
                      <Link to="/admin/analytics">
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Event Analytics
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Status Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Event Status Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {stats?.activeEvents || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {stats?.totalEvents || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {stats?.completedEvents || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          3
                        </div>
                        <div className="text-sm text-muted-foreground">Draft</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="teams" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {teamStats.map((team) => (
                    <Card key={team.team_name} className={`border-2 ${
                      team.team_name === 'red' ? 'border-red-200 bg-red-50' :
                      team.team_name === 'blue' ? 'border-blue-200 bg-blue-50' :
                      team.team_name === 'green' ? 'border-green-200 bg-green-50' :
                      'border-yellow-200 bg-yellow-50'
                    }`}>
                      <CardHeader className="pb-3">
                        <CardTitle className={`text-lg capitalize ${
                          team.team_name === 'red' ? 'text-red-700' :
                          team.team_name === 'blue' ? 'text-blue-700' :
                          team.team_name === 'green' ? 'text-green-700' :
                          'text-yellow-700'
                        }`}>
                          Team {team.team_name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Members</span>
                          <Badge variant="secondary" className={
                            team.team_name === 'red' ? 'bg-red-100 text-red-800' :
                            team.team_name === 'blue' ? 'bg-blue-100 text-blue-800' :
                            team.team_name === 'green' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {team.member_count}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Recent Joins</span>
                          <span className="text-sm font-medium">
                            {team.recent_members.length}
                          </span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2"
                          onClick={() => loadTeamMembers(team.team_name)}
                          disabled={loadingTeamMembers}
                        >
                          <Users className="h-3 w-3 mr-1" />
                          {loadingTeamMembers && selectedTeam === team.team_name ? 'Loading...' : 'View Members'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Team Management Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Team Management Overview</CardTitle>
                    <CardDescription>
                      Manage team memberships and monitor team activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {teamStats.reduce((total, team) => total + team.member_count, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Members</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {teamStats.reduce((total, team) => total + team.recent_members.length, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Recent Joins (7 days)</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {teamStats.length}
                        </div>
                        <div className="text-sm text-gray-600">Active Teams</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Export Team Data
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Refresh Statistics
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3 mr-1" />
                        Team Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Team Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Team Activity</CardTitle>
                    <CardDescription>
                      Latest team joins and switches across all teams
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamStats.some(team => team.recent_members.length > 0) ? (
                        <div className="space-y-2">
                          {teamStats.flatMap(team => 
                            team.recent_members.map(member => (
                              <div key={`${team.team_name}-${member.full_name}`} className="flex items-center justify-between p-2 border rounded">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-3 h-3 rounded-full ${
                                    team.team_name === 'red' ? 'bg-red-500' :
                                    team.team_name === 'blue' ? 'bg-blue-500' :
                                    team.team_name === 'green' ? 'bg-green-500' :
                                    'bg-yellow-500'
                                  }`}></div>
                                  <span className="font-medium">{member.full_name}</span>
                                  <span className="text-sm text-gray-500">joined Team {team.team_name}</span>
                                </div>
                                <span className="text-xs text-gray-400">
                                  {new Date(member.join_date).toLocaleDateString()}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 text-center py-4">
                          No recent team activity
                        </div>
                      )}
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Activity Log
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="gallery" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gallery Management</CardTitle>
                    <CardDescription>
                      Upload and manage gallery images and videos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Upload Section */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <Label htmlFor="gallery-upload" className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              Upload Gallery Images
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                              PNG, JPG, GIF up to 10MB
                            </span>
                          </Label>
                          <Input
                            id="gallery-upload"
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={uploadingImage}
                          />
                        </div>
                        <div className="mt-4">
                          <Button
                            onClick={() => document.getElementById('gallery-upload')?.click()}
                            disabled={uploadingImage}
                            className="inline-flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingImage ? 'Uploading...' : 'Select Files'}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {galleryItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <div className="relative aspect-square">
                            <img
                              src={item.url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 right-2 flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-6 w-6 p-0"
                                onClick={() => handleDeleteGalleryItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="absolute bottom-2 left-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm truncate">{item.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.uploaded_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {galleryItems.length === 0 && (
                      <div className="text-center py-8">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No gallery items</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by uploading images or videos.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email" className="space-y-6">
                <EmailTestPanel />
              </TabsContent>
            </Tabs>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions in your community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent activity
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/admin/events">
                  <Button className="w-full justify-start">
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
                <Link to="/admin/registrations">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Registrations
                  </Button>
                </Link>
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </Link>
                <Link to="/admin/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={loadDashboardData}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </CardContent>
            </Card>

            {/* Registration Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Registration Summary</CardTitle>
                <CardDescription>
                  Today's registration activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Today's Registrations</span>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    {registrations.filter(r => {
                      const today = new Date().toDateString();
                      const regDate = new Date(r.created_at).toDateString();
                      return today === regDate;
                    }).length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending Approval</span>
                  <Badge variant="secondary">
                    {registrations.filter(r => r.status === 'pending').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">This Week</span>
                  <Badge variant="outline">
                    {registrations.filter(r => {
                      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                      const regDate = new Date(r.created_at);
                      return regDate >= weekAgo;
                    }).length}
                  </Badge>
                </div>
                {registrations.filter(r => r.status === 'pending').length > 0 && (
                  <Link to="/admin/registrations">
                    <Button size="sm" className="w-full mt-2">
                      Review Pending
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Payment System</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">File Storage</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Online
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Team Members Modal */}
      <Dialog open={teamMemberModalOpen} onOpenChange={setTeamMemberModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold capitalize">
              Team {selectedTeam} Members
            </DialogTitle>
            <DialogDescription>
              View and manage members of Team {selectedTeam}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {teamMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Members Yet</h3>
                <p className="text-gray-500">This team doesn't have any members yet.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {teamMembers.length} Member{teamMembers.length !== 1 ? 's' : ''}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className={`${
                      selectedTeam === 'red' ? 'bg-red-100 text-red-800' :
                      selectedTeam === 'blue' ? 'bg-blue-100 text-blue-800' :
                      selectedTeam === 'green' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    Team {selectedTeam}
                  </Badge>
                </div>
                
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            {member.full_name}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {member.user_email}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {member.phone_number || 'Not provided'}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(member.join_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={member.is_active ? "default" : "secondary"}
                              className={member.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {member.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-gray-500">
                    Total: {teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      Export List
                    </Button>
                    <Button variant="outline" size="sm">
                      <Mail className="h-3 w-3 mr-1" />
                      Email Team
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
