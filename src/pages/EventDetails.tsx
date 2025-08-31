import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Heart, Phone, Mail, User, Download, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getEventById, sampleEvents, Event } from '@/lib/api';
import { motion } from 'framer-motion';
import EventRegistrationForm from '@/components/EventRegistrationForm';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      if (!id) {
        navigate('/events');
        return;
      }

      setLoading(true);
      try {
        const data = await getEventById(id);
        if (data) {
          setEvent(data);
        } else {
          // Try to find in sample data
          const sample = sampleEvents.find(e => e.id === id);
          if (sample) {
            setEvent(sample);
          } else {
            // No event found, navigate back to events
            toast({
              title: "Event Not Found",
              description: "The event you're looking for could not be found.",
              variant: "destructive",
            });
            navigate('/events');
          }
        }
      } catch (error) {
        console.error('Failed to load event:', error);
        // Try to find in sample data
        const sample = sampleEvents.find(e => e.id === id);
        if (sample) {
          setEvent(sample);
        } else {
          toast({
            title: "Error Loading Event",
            description: "There was a problem loading the event details.",
            variant: "destructive",
          });
          navigate('/events');
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadEvent();
  }, [id, navigate, toast]);

  const handleRegistrationSuccess = () => {
    // Reload event data to get updated information
    if (id) {
      getEventById(id).then((data) => {
        if (data) setEvent(data);
      });
    }
  };

  const handleDownloadFlyer = () => {
    if (event?.flyer?.downloadUrl) {
      // In a real app, this would download the actual file
      toast({
        title: "Download Started",
        description: "Event flyer is being downloaded...",
      });
      // Simulate download
      const link = document.createElement('a');
      link.href = event.flyer.downloadUrl;
      link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}-flyer.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShareFlyer = async () => {
    if (navigator.share && event?.flyer?.url) {
      try {
        await navigator.share({
          title: `${event.title} - Event Flyer`,
          text: `Check out this amazing event: ${event.title}`,
          url: window.location.href
        });
      } catch (error) {
        // Fallback to copying link
        copyFlyerLink();
      }
    } else {
      copyFlyerLink();
    }
  };

  const copyFlyerLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to clipboard.",
      });
    });
  };

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trivia': return 'bg-blue-500 text-white';
      case 'gaming': return 'bg-purple-500 text-white';
      case 'travel': return 'bg-green-500 text-white';
      case 'social': return 'bg-orange-500 text-white';
      default: return 'bg-primary text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with Back Button */}
        <div className="bg-muted/30 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/events">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Event Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-24 h-6" />
                  </div>
                  <Skeleton className="w-72 h-10 mb-2" />
                  <Skeleton className="w-96 h-6" />
                </div>
              </div>
            </div>

            {/* Event Quick Info Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 rounded-lg" />
              ))}
            </div>

            {/* Progress Bar Skeleton */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <Skeleton className="w-40 h-4" />
                <Skeleton className="w-32 h-4" />
              </div>
              <Skeleton className="w-full h-3 rounded-full" />
            </div>

            {/* Registration Button Skeleton */}
            <Skeleton className="h-12 w-full max-w-md" />
          </div>

          {/* Content Skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="w-full h-64" />
              ))}
            </div>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-full h-40" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header with Back Button */}
      <motion.div 
        className="bg-muted/30 border-b"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/events">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div 
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {/* Event Header */}
        <div className="mb-8">
          {/* Event Poster Banner */}
          {event.image_url && (
            <div className="mb-6 relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <img 
                src={event.image_url} 
                alt={`${event.title} event poster`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Show placeholder if image fails to load
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              {/* Image placeholder */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <div className="text-center text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg bg-background/20 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">Image unavailable</p>
                  <p className="text-xs">Poster could not be loaded</p>
                </div>
              </div>
              {/* Overlay with event info */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">{event.title}</h1>
                </div>
              </div>
            </div>
          )}
          
          {/* Fallback header for events without image_url */}
          {!event.image_url && (
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{event.image}</div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category?.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(event.status || 'open')}>
                      {getStatusText(event.status || 'open')}
                    </Badge>
                  </div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">{event.title}</h1>
                  <p className="text-xl text-muted-foreground">{event.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Price and Actions Section */}
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-2">{event.price}</div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: event.title,
                        text: event.description,
                        url: window.location.href
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      // You could add a toast here
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Could implement favorite functionality here
                    console.log('Favorited event:', event.id);
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Event Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">{event.date}</div>
                <div className="text-sm text-muted-foreground">Date</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">{event.time}</div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted/20 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">{event.location}</div>
                <div className="text-sm text-muted-foreground">Location</div>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          <div className="flex gap-4">
            <Button 
              size="lg" 
              className="flex-1 max-w-md"
              onClick={() => setShowRegistrationForm(true)}
            >
              Register Now
            </Button>
          </div>
        </div>

        {/* Event Details Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Event */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {event.long_description}
                </p>
              </CardContent>
            </Card>

            {/* Event Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Event Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(event.event_schedule || event.agenda)?.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-muted/20 rounded-lg">
                      <div className="font-mono text-sm font-medium text-primary min-w-20">
                        {item.time}
                      </div>
                      <div className="font-medium">{item.activity}</div>
                    </div>
                  ))}
                  {!(event.event_schedule || event.agenda) || (event.event_schedule || event.agenda)?.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Schedule Coming Soon</p>
                      <p className="text-sm">The detailed event schedule will be available soon.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.includes?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.requirements?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium">{event.organizer}</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Experienced in organizing community events and gaming tournaments.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Contact Organizer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Poster Section - Full Width */}
        {(event.flyer || event.image_url) && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Event Poster
                </CardTitle>
                <CardDescription>
                  Download or share the official event poster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Poster Preview */}
                    <div className="space-y-4">
                      <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-4 border-2 border-dashed border-muted-foreground/20">
                        {event.image_url ? (
                          <div className="aspect-[3/4] rounded-lg overflow-hidden relative">
                            <img 
                              src={event.image_url} 
                              alt={`${event.title} poster`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Show placeholder if image fails to load
                                e.currentTarget.style.display = 'none';
                                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                if (placeholder) placeholder.style.display = 'flex';
                              }}
                            />
                            {/* Image placeholder */}
                            <div 
                              className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/80 flex items-center justify-center rounded-lg"
                              style={{ display: 'none' }}
                            >
                              <div className="text-center text-muted-foreground">
                                <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-background/20 flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                                <p className="text-xs font-medium">Poster unavailable</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-6xl mb-4">{event.image}</div>
                              <div className="text-lg font-bold text-foreground mb-2">{event.title}</div>
                              <div className="text-sm text-muted-foreground mb-2">{event.date}</div>
                              <div className="text-sm text-muted-foreground">{event.location}</div>
                              <div className="mt-4 text-2xl font-bold text-primary">{event.price}</div>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Official event poster - {event.flyer?.alt || `${event.title} Event Poster`}
                      </p>
                    </div>                  {/* Poster Actions */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Get the Poster</h4>
                      <div className="space-y-3">
                        <Button 
                          onClick={handleDownloadFlyer}
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Poster
                        </Button>
                        <Button 
                          onClick={handleShareFlyer}
                          className="w-full justify-start"
                          variant="outline"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Event
                        </Button>
                        {event.image_url && (
                          <Button 
                            onClick={() => window.open(event.image_url, '_blank')}
                            className="w-full justify-start"
                            variant="outline"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Full Size
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Share on Social Media</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check out this amazing event: ${event.title}&url=${window.location.href}`, '_blank')}
                          size="sm"
                          variant="outline"
                          className="text-blue-500 hover:bg-blue-50"
                        >
                          Twitter
                        </Button>
                        <Button 
                          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          Facebook
                        </Button>
                        <Button 
                          onClick={() => window.open(`https://wa.me/?text=Check out this event: ${event.title} ${window.location.href}`, '_blank')}
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:bg-green-50"
                        >
                          WhatsApp
                        </Button>
                        <Button 
                          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
                          size="sm"
                          variant="outline"
                          className="text-blue-700 hover:bg-blue-50"
                        >
                          LinkedIn
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted/20 rounded-lg p-4">
                      <h5 className="font-medium mb-2">Poster Guidelines</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Feel free to share this poster with friends</li>
                        <li>• Use it to promote the event on social media</li>
                        <li>• Print copies for physical distribution</li>
                        <li>• Do not modify the original design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>

      {/* Event Registration Form */}
      {event && (
        <EventRegistrationForm
          event={event}
          open={showRegistrationForm}
          onOpenChange={setShowRegistrationForm}
          onRegistrationSuccess={handleRegistrationSuccess}
        />
      )}
    </motion.div>
  );
}
