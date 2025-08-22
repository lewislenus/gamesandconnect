import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Database,
  Wifi,
  WifiOff
} from 'lucide-react';
import { fetchEventsFromSupabase, checkDatabaseConnection, EventData, FetchEventsResult } from '@/lib/events-fetcher';
import { useToast } from '@/hooks/use-toast';

export default function EventsDisplay() {
  const [result, setResult] = useState<FetchEventsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; error?: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const status = await checkDatabaseConnection();
    setConnectionStatus(status);
  };

  const loadEvents = async () => {
    setLoading(true);
    try {
      const fetchResult = await fetchEventsFromSupabase();
      setResult(fetchResult);
      
      if (!fetchResult.success) {
        toast({
          title: "Database Error",
          description: fetchResult.error,
          variant: "destructive",
        });
      } else if (fetchResult.isEmpty) {
        toast({
          title: "No Events Found",
          description: "The events table appears to be empty.",
        });
      } else {
        toast({
          title: "Events Loaded",
          description: `Successfully loaded ${fetchResult.data.length} events.`,
        });
      }
    } catch (error) {
      console.error('Error in loadEvents:', error);
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while loading events.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'open': { variant: 'default' as const, label: 'Open' },
      'filling-fast': { variant: 'secondary' as const, label: 'Filling Fast' },
      'almost-full': { variant: 'destructive' as const, label: 'Almost Full' },
      'full': { variant: 'destructive' as const, label: 'Full' },
      'completed': { variant: 'outline' as const, label: 'Completed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getAvailabilityBadge = (availabilityStatus: string) => {
    switch (availabilityStatus) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-100 text-yellow-800">Limited Spots</Badge>;
      case 'full':
        return <Badge className="bg-red-100 text-red-800">Fully Booked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      'trivia': { className: 'bg-blue-100 text-blue-800', emoji: '🧠' },
      'gaming': { className: 'bg-purple-100 text-purple-800', emoji: '🎮' },
      'travel': { className: 'bg-green-100 text-green-800', emoji: '✈️' },
      'social': { className: 'bg-orange-100 text-orange-800', emoji: '🤝' },
      'outdoor': { className: 'bg-teal-100 text-teal-800', emoji: '🏞️' }
    };

    const config = categoryConfig[category as keyof typeof categoryConfig] || 
                  { className: 'bg-gray-100 text-gray-800', emoji: '📅' };
    
    return (
      <Badge className={config.className}>
        {config.emoji} {category.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Connection Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events Database</h1>
            <p className="text-muted-foreground">
              Live data from Supabase events table
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {connectionStatus?.connected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-600">Disconnected</span>
                </>
              )}
            </div>
            
            {/* Refresh Button */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadEvents}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Results Summary */}
        {result && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4" />
              <span>Total: {result.totalCount} events</span>
            </div>
            {result.success && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Fetch successful</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {result && !result.success && (
        <Alert variant="destructive" className="mb-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Database Error:</strong> {result.error}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadEvents}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Empty State */}
      {result && result.success && result.isEmpty && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">📅</div>
            <CardTitle className="text-2xl mb-2">No Events Available</CardTitle>
            <CardDescription className="text-lg mb-6">
              The events table is currently empty. Events will appear here once they are added to the database.
            </CardDescription>
            <div className="flex justify-center gap-4">
              <Button onClick={loadEvents}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
              <Button variant="outline">
                <Database className="h-4 w-4 mr-2" />
                View Database Schema
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Events Grid */}
      {result && result.success && !result.isEmpty && (
        <div className="space-y-8">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{result.data.length}</div>
                <div className="text-sm text-muted-foreground">Total Events</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {result.data.filter(e => e.availability_status === 'available').length}
                </div>
                <div className="text-sm text-muted-foreground">Available</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {result.data.filter(e => e.availability_status === 'limited').length}
                </div>
                <div className="text-sm text-muted-foreground">Limited Spots</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {result.data.filter(e => e.availability_status === 'full').length}
                </div>
                <div className="text-sm text-muted-foreground">Fully Booked</div>
              </CardContent>
            </Card>
          </div>

          {/* Events List */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{event.image}</div>
                      <div>
                        <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          ID: {event.id.substring(0, 8)}...
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getCategoryBadge(event.category)}
                    {getStatusBadge(event.status)}
                    {getAvailabilityBadge(event.availability_status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Event Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{event.formatted_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{event.formatted_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{event.registration_count}/{event.total_spots} registered</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {event.description}
                  </p>

                  {/* Price */}
                  <div className="text-xl font-bold text-primary">
                    {event.price}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Registration Progress</span>
                      <span>{Math.round((event.registration_count / (event.total_spots || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((event.registration_count / (event.total_spots || 1)) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Organizer */}
                  {event.organizer && (
                    <div className="text-xs text-muted-foreground">
                      <strong>Organizer:</strong> {event.organizer}
                    </div>
                  )}

                  {/* Requirements Preview */}
                  {event.requirements && event.requirements.length > 0 && (
                    <div className="text-xs">
                      <strong className="text-muted-foreground">Requirements:</strong>
                      <div className="mt-1">
                        {event.requirements.slice(0, 2).map((req, index) => (
                          <div key={index} className="flex items-start gap-1">
                            <span className="text-primary">•</span>
                            <span className="text-muted-foreground">{req}</span>
                          </div>
                        ))}
                        {event.requirements.length > 2 && (
                          <div className="text-muted-foreground">
                            +{event.requirements.length - 2} more...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>

                <div className="px-6 pb-6">
                  <Button className="w-full" variant="outline">
                    View Full Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Debug Information (Development Only) */}
          {process.env.NODE_ENV === 'development' && (
            <Card className="mt-8 border-dashed">
              <CardHeader>
                <CardTitle className="text-sm">Debug Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-2 font-mono">
                  <div><strong>Connection Status:</strong> {connectionStatus?.connected ? '✅ Connected' : '❌ Disconnected'}</div>
                  <div><strong>Fetch Success:</strong> {result?.success ? '✅ Yes' : '❌ No'}</div>
                  <div><strong>Total Count:</strong> {result?.totalCount || 0}</div>
                  <div><strong>Data Length:</strong> {result?.data.length || 0}</div>
                  <div><strong>Is Empty:</strong> {result?.isEmpty ? 'Yes' : 'No'}</div>
                  {result?.error && (
                    <div><strong>Error:</strong> <span className="text-red-600">{result.error}</span></div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}