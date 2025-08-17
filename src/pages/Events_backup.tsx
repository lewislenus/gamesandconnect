import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getEvents, sampleEvents, Event } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function Events() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const data = await getEvents();
        if (data && data.length > 0) {
          setEvents(data);
        } else {
          // Fallback to sample data if the API returns empty
          setEvents(sampleEvents);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
        setEvents(sampleEvents);
      } finally {
        setLoading(false);
      }
    }
    
    loadEvents();
  }, []);

  // Filter events by search term only and sort by date
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const now = new Date();
      
      // Separate upcoming and past events
      const aIsUpcoming = dateA >= now;
      const bIsUpcoming = dateB >= now;
      
      // Show upcoming events first, then past events
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;
      
      // Within each group, sort upcoming events by date (earliest first)
      // and past events by date (most recent first)
      if (aIsUpcoming) {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'almost-full': return 'bg-destructive/10 text-destructive';
      case 'filling-fast': return 'bg-secondary/10 text-secondary';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'almost-full': return 'Almost Full';
      case 'filling-fast': return 'Filling Fast';
      default: return 'Open';
    }
  };

  // Separate events into upcoming and past
  const now = new Date();
  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= now);
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < now);

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            className="text-4xl lg:text-5xl font-bold text-white mb-4"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Your Next Adventure Awaits
          </motion.h1>
          <motion.p 
            className="text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover exciting adventures, connect with amazing people, and create unforgettable memories. 
            From brain-teasing trivia nights to epic gaming tournaments and breathtaking travel experiences.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search adventures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
          </div>

          <div className="text-center text-muted-foreground">
            {!loading && (
              <>Showing {filteredEvents.length} adventures</>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-4 w-[100px]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-[80%]" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Upcoming Events Section */}
            {upcomingEvents.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Upcoming Adventures</h2>
                    <p className="text-muted-foreground">Join us for these exciting upcoming events</p>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Link to={`/events/${event.id}`} className="block">
                        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden cursor-pointer">
                          <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-3xl">{event.image}</div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="outline" className={getStatusColor(event.status)}>
                                      {getStatusText(event.status)}
                                    </Badge>
                                  </div>
                                  <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
                                  <CardDescription className="text-sm">
                                    {event.description}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">{event.price}</div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Spots Available</span>
                                <span>{event.total_spots - event.spots}/{event.total_spots}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${((event.total_spots - event.spots) / event.total_spots) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button 
                                className="flex-1"
                                disabled={event.spots === 0}
                                variant="default"
                              >
                                {event.spots === 0 ? 'Fully Booked' : 'View Details'}
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(window.location.origin + `/events/${event.id}`).then(() => {
                                    toast({
                                      title: "Link Copied!",
                                      description: "Event link has been copied to clipboard.",
                                    });
                                  });
                                }}
                              >
                                Share
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Events Section */}
            {pastEvents.length > 0 && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-muted p-3 rounded-full">
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Past Adventures</h2>
                    <p className="text-muted-foreground">Check out our previous amazing events</p>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-8 opacity-75">
                  {pastEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        scale: 1.02,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Link to={`/events/${event.id}`} className="block">
                        <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden cursor-pointer">
                          <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="text-3xl">{event.image}</div>
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="bg-muted text-muted-foreground">
                                      Past Event
                                    </Badge>
                                  </div>
                                  <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
                                  <CardDescription className="text-sm">
                                    {event.description}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-muted-foreground">{event.price}</div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{event.time}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Attendees</span>
                                <span>{event.total_spots - event.spots}/{event.total_spots}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-muted-foreground h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${((event.total_spots - event.spots) / event.total_spots) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button 
                                className="flex-1"
                                variant="secondary"
                                disabled
                              >
                                Event Completed
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(window.location.origin + `/events/${event.id}`).then(() => {
                                    toast({
                                      title: "Link Copied!",
                                      description: "Event link has been copied to clipboard.",
                                    });
                                  });
                                }}
                              >
                                Share
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!loading && filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-muted-foreground mb-2">No adventures found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready for Your Next Adventure?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community and suggest adventures you'd like to experience. Every great journey starts with an idea!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/community">
              <Button 
                variant="default" 
                size="lg"
              >
                Join Our Community
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Suggest an Adventure
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
