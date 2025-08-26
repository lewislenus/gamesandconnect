import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Info
} from 'lucide-react';
import { fetchEventsFromSupabase, EventData, FetchEventsResult } from '@/lib/events-fetcher';
import { useToast } from '@/hooks/use-toast';

export default function EventsList() {
  const [result, setResult] = useState<FetchEventsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
  }, []);

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

  const getAvailabilityBadge = (availabilityStatus: string) => {
    switch (availabilityStatus) {
      case 'available':
        return <Badge className="bg-green-500 text-white">Available</Badge>;
      case 'limited':
        return <Badge className="bg-yellow-500 text-white">Limited Spots</Badge>;
      case 'full':
        return <Badge className="bg-red-500 text-white">Fully Booked</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      'sports': 'bg-blue-500',
      'social': 'bg-purple-500',
      'community': 'bg-green-500',
      'education': 'bg-amber-500',
      'entertainment': 'bg-pink-500',
      'other': 'bg-gray-500'
    };

    const bgColor = categoryColors[category?.toLowerCase()] || 'bg-gray-500';
    return <Badge className={`${bgColor} text-white`}>{category || 'Other'}</Badge>;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Loading Events...</h2>
          <Skeleton className="h-10 w-24" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Skeleton className="h-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (!result?.success) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Events</AlertTitle>
        <AlertDescription>
          {result?.error || 'An unexpected error occurred while loading events.'}
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={loadEvents} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (result.isEmpty) {
    return (
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>No Events Found</AlertTitle>
        <AlertDescription>
          There are currently no events in the database.
        </AlertDescription>
      </Alert>
    );
  }

  // Success state with data
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Upcoming Events</h2>
        <Badge variant="outline" className="px-3 py-1">
          {result.data.length} Events
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.data.map((event) => (
          <Card key={event.id} className="overflow-hidden flex flex-col h-full">
            <div className="relative">
              {event.image ? (
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <span className="text-muted-foreground">No image available</span>
                </div>
              )}
              <div className="absolute top-2 right-2 flex flex-col gap-2">
                {getCategoryBadge(event.category || 'Other')}
                {getAvailabilityBadge(event.availability_status)}
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription>{event.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{event.formatted_date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{event.formatted_time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {event.registration_count} registered 
                    {event.spots > 0 && ` • ${event.spots} spots left`}
                  </span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0">
              <Link to={`/events/${event.id}`} className="w-full">
                <Button variant="default" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {result.data.length > 0 && (
        <div className="flex justify-center mt-8">
          <Button variant="outline" onClick={loadEvents} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Events
          </Button>
        </div>
      )}
    </div>
  );
}