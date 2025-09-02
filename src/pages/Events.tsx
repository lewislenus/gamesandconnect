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
import SEO from '@/components/SEO';

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
        console.log('Loaded events:', data);
        
        if (data && data.length > 0) {
          setEvents(data);
          console.log(`Successfully loaded ${data.length} events`);
        } else {
          console.log('No events found, using sample data');
          setEvents(sampleEvents);
        }
      } catch (error) {
        console.error('Failed to load events:', error);
        console.log('Error occurred, falling back to sample data');
        setEvents(sampleEvents);
      } finally {
        setLoading(false);
      }
    }
    
    loadEvents();
  }, [toast]);

  // Filter events by search term only and sort by date
  // Helper: robustly parse various date formats (ISO, 'June 15, 2025', 'September 14-15, 2025')
  const parseEventDate = (raw: string): Date | null => {
    if (!raw) return null;
    const trimmed = raw.trim();
    // ISO yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const d = new Date(trimmed + 'T00:00:00');
      return isNaN(d.getTime()) ? null : d;
    }
    // Range like 'September 14-15, 2025' or 'Sept 14-15, 2025'
    const rangeMatch = /^(January|February|March|April|May|June|July|August|September|Sept|October|November|December)\s+(\d{1,2})-(\d{1,2}),\s*(\d{4})$/i.exec(trimmed);
    if (rangeMatch) {
      const [, month, startDay, _endDay, year] = rangeMatch;
      const normalized = `${month} ${startDay}, ${year}`.replace('Sept ', 'Sep ');
      const d = new Date(normalized);
      return isNaN(d.getTime()) ? null : d;
    }
    // Fallback: if string contains a hyphen that breaks Date parsing, take text before first hyphen
    if (trimmed.includes('-')) {
      const firstPart = trimmed.split('-')[0].trim().replace(/,$/, '');
      const possibleYear = trimmed.match(/(\d{4})$/)?.[1];
      if (possibleYear && !/\d{4}$/.test(firstPart)) {
        const attempt = `${firstPart}, ${possibleYear}`;
        const d = new Date(attempt);
        if (!isNaN(d.getTime())) return d;
      }
    }
    const direct = new Date(trimmed);
    return isNaN(direct.getTime()) ? null : direct;
  };

  const getComparableDate = (e: Event): Date => {
    const parsed = parseEventDate(e.date);
    if (!parsed) {
      console.warn('Unparsable event date, treating as past:', e.date, e.id);
      return new Date(0); // Epoch => very old
    }
    return parsed;
  };

  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = getComparableDate(a);
      const dateB = getComparableDate(b);
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
      case 'almost-full': return 'bg-red-100 text-red-600';
      case 'filling-fast': return 'bg-orange-100 text-orange-600';
      default: return 'bg-blue-100 text-blue-600';
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
  const upcomingEvents = filteredEvents.filter(event => getComparableDate(event) >= now);
  const pastEvents = filteredEvents.filter(event => getComparableDate(event) < now);

  return (
    <>
      <SEO 
        title="Gaming Events"
        description="Discover exciting gaming events in Ghana! Join FIFA tournaments, trivia nights, community adventures, and more. Register now for upcoming events in Accra and beyond."
        keywords="gaming events Ghana, FIFA tournament Accra, trivia night, gaming meetups, esports events, gaming tournaments, video game events, community gaming Ghana"
        url="https://gamesandconnect.netlify.app/events"
      />
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
            From epic gaming tournaments to breathtaking travel experiences and community connections.
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
              <>
                Showing {filteredEvents.length} adventures
              </>
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
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-orange-500" />
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
                          {/* Event Image/Poster */}
                          {event.image_url ? (
                            <div className="relative h-48 overflow-hidden">
                              <img 
                                src={event.image_url} 
                                alt={`${event.title} poster`}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                onError={(e) => {
                                  // Show placeholder if image fails to load
                                  const target = e.currentTarget;
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="bg-gradient-to-br from-muted/50 to-muted/80 h-48 flex items-center justify-center">
                                        <div class="text-center text-muted-foreground">
                                          <div class="w-12 h-12 mx-auto mb-2 rounded-lg bg-background/20 flex items-center justify-center">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                          </div>
                                          <p class="text-xs font-medium">Image unavailable</p>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl font-bold text-white drop-shadow-lg mb-2">{event.title}</h3>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="bg-white/90 text-black border-white/40 text-xs">
                                    {getStatusText(event.status)}
                                  </Badge>
                                  <div className="text-lg font-bold text-white bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                                    {event.price}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
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
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">{event.price}</div>
                                </div>
                              </div>
                            </CardHeader>
                          )}

                          <CardHeader className={event.image_url ? "pb-2" : "pt-0 pb-2"}>
                            <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {event.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{(() => { const d = getComparableDate(event); return isNaN(d.getTime()) ? event.date : d.toLocaleDateString(); })()}</span>
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

                            {/* Event Schedule/Agenda */}
                            {(event.event_schedule || event.agenda) && (event.event_schedule || event.agenda).length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Event Schedule
                                </h4>
                                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                  {(event.event_schedule || event.agenda).slice(0, 4).map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 text-xs">
                                      <div className="font-mono text-primary min-w-12 flex-shrink-0 bg-primary/5 px-1.5 py-0.5 rounded">
                                        {item.time}
                                      </div>
                                      <div className="text-muted-foreground leading-relaxed">
                                        {item.activity}
                                      </div>
                                    </div>
                                  ))}
                                  {(event.event_schedule || event.agenda).length > 4 && (
                                    <div className="text-xs text-muted-foreground italic pl-14">
                                      +{(event.event_schedule || event.agenda).length - 4} more activities...
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Event Capacity</span>
                                <span>{event.capacity ? `${event.capacity} spots` : 'Unlimited'}</span>
                              </div>
                              {event.capacity && (
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full transition-all duration-300"
                                    style={{ width: '60%' }}
                                  ></div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <Button 
                                className="flex-1"
                                variant="default"
                              >
                                View Details
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
                          {/* Event Image/Poster for Past Events */}
                          {event.image_url ? (
                            <div className="relative h-48 overflow-hidden">
                              <img 
                                src={event.image_url} 
                                alt={`${event.title} poster`}
                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 grayscale-[50%]"
                                onError={(e) => {
                                  // Show placeholder if image fails to load
                                  const target = e.currentTarget;
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `
                                      <div class="bg-gradient-to-br from-muted/50 to-muted/80 h-48 flex items-center justify-center">
                                        <div class="text-center text-muted-foreground">
                                          <div class="w-12 h-12 mx-auto mb-2 rounded-lg bg-background/20 flex items-center justify-center">
                                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                          </div>
                                          <p class="text-xs font-medium opacity-75">Image unavailable</p>
                                        </div>
                                      </div>
                                    `;
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl font-bold text-white drop-shadow-lg mb-2 opacity-90">{event.title}</h3>
                                <div className="flex items-center justify-between">
                                  <Badge variant="secondary" className="bg-white/90 text-muted-foreground border-white/40 text-xs">
                                    Past Event
                                  </Badge>
                                  <div className="text-lg font-bold text-white bg-black/30 px-2 py-1 rounded backdrop-blur-sm opacity-75">
                                    {event.price}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
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
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-muted-foreground">{event.price}</div>
                                </div>
                              </div>
                            </CardHeader>
                          )}

                          <CardHeader className={event.image_url ? "pb-2" : "pt-0 pb-2"}>
                            <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
                            <CardDescription className="text-sm">
                              {event.description}
                            </CardDescription>
                          </CardHeader>

                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{(() => { const d = getComparableDate(event); return isNaN(d.getTime()) ? event.date : d.toLocaleDateString(); })()}</span>
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

                            {/* Event Schedule/Agenda for Past Events */}
                            {(event.event_schedule || event.agenda) && (event.event_schedule || event.agenda).length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  Event Schedule
                                </h4>
                                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                  {(event.event_schedule || event.agenda).slice(0, 4).map((item, index) => (
                                    <div key={index} className="flex items-start gap-2 text-xs">
                                      <div className="font-mono text-muted-foreground min-w-12 flex-shrink-0 bg-muted/30 px-1.5 py-0.5 rounded">
                                        {item.time}
                                      </div>
                                      <div className="text-muted-foreground leading-relaxed opacity-75">
                                        {item.activity}
                                      </div>
                                    </div>
                                  ))}
                                  {(event.event_schedule || event.agenda).length > 4 && (
                                    <div className="text-xs text-muted-foreground italic pl-14 opacity-75">
                                      +{(event.event_schedule || event.agenda).length - 4} more activities...
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Event Capacity</span>
                                <span>{event.capacity ? `${event.capacity} attendees` : 'Capacity not specified'}</span>
                              </div>
                              {event.capacity && (
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-muted-foreground h-2 rounded-full transition-all duration-300"
                                    style={{ width: '85%' }}
                                  ></div>
                                </div>
                              )}
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
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
            >
              Suggest an Adventure
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <img 
                    src="https://res.cloudinary.com/drkjnrvtu/image/upload/v1756502369/games_logo_1_gbimmw.svg"
                    alt="Games & Connect"
                    className="h-10 w-auto"
                  />
                </div>
                <p className="text-white/80 mb-6 max-w-md leading-relaxed">
                  Ghana's most vibrant community where adventure meets connection. Join us for gaming, travel experiences, and meaningful relationships that last a lifetime.
                </p>
                <div className="mb-6">
                  <h4 className="font-semibold text-orange-400 mb-3">Our Mission</h4>
                  <p className="text-white/70 text-sm leading-relaxed">
                    To create unforgettable experiences through play, travel, and genuine human connection while celebrating the rich culture of Ghana.
                  </p>
                </div>
                {/* Social Links */}
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-green-600 border-green-500 hover:bg-green-700 text-white"
                    onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                    title="WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 border-transparent hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => window.open('https://www.instagram.com/games_connect_gh/', '_blank')}
                    title="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-blue-600 border-blue-500 hover:bg-blue-700 text-white"
                    onClick={() => window.open('https://www.facebook.com/gamesandconnect', '_blank')}
                    title="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
                    onClick={() => window.open('https://x.com/GamesConnect_gh', '_blank')}
                  >
                    <span className="text-lg">�</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="bg-black border-gray-700 hover:bg-gray-900 text-white"
                    onClick={() => window.open('https://www.tiktok.com/@games_and_connect', '_blank')}
                    title="TikTok"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold text-orange-400 mb-4">Quick Links</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link to="/events" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Upcoming Events
                    </Link>
                  </li>
                  <li>
                    <Link to="/community" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link to="/team-red" className="text-white/80 hover:text-primary transition-colors duration-200">
                      Join a Team
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact & Info */}
              <div>
                <h4 className="font-semibold text-orange-400 mb-4">Get In Touch</h4>
                <ul className="space-y-3 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Accra, Ghana</span>
                  </li>
                  <li>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-white/80 hover:text-primary p-0 h-auto font-normal justify-start"
                      onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
                    >
                      Join WhatsApp Community
                    </Button>
                  </li>
                </ul>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h5 className="font-medium text-white mb-3">Community Stats</h5>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">200+</div>
                      <div className="text-white/60">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">48+</div>
                      <div className="text-white/60">Events</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-white/10 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-white/60">
                © 2025 Games & Connect. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm text-white/60">
                <button 
                  onClick={() => alert('Privacy policy coming soon!')}
                  className="hover:text-primary transition-colors duration-200"
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => alert('Terms of service coming soon!')}
                  className="hover:text-primary transition-colors duration-200"
                >
                  Terms of Service
                </button>
                <span>•</span>
                <span>Play. Travel. Connect.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
    </>
  );
}
