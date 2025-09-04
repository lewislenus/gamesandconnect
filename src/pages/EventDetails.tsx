import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Share2, Heart, Phone, Mail, User, Download, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { getEventBySlug, sampleEvents, Event } from '@/lib/api';
import { generateEventSlug } from '@/lib/utils';
import { motion } from 'framer-motion';
import EventRegistrationForm from '@/components/EventRegistrationForm';
import SEO from '@/components/SEO';

export default function EventDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvent() {
      if (!slug) {
        navigate('/events');
        return;
      }

      setLoading(true);
      try {
        const data = await getEventBySlug(slug);
        if (data) {
          setEvent(data);
        } else {
          // Try to find in sample data by slug
          const sample = sampleEvents.find(e => generateEventSlug(e.title) === slug);
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
        // Try to find in sample data by slug
        const sample = sampleEvents.find(e => generateEventSlug(e.title) === slug);
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
  }, [slug, navigate, toast]);

  const handleRegistrationSuccess = () => {
    // Reload event data to get updated information
    if (slug) {
      getEventBySlug(slug).then((data) => {
        if (data) setEvent(data);
      });
    }
  };

  const handleDownloadFlyer = () => {
    if (event?.flyer?.downloadUrl) {
      // Download actual flyer PDF
      toast({
        title: "Download Started",
        description: "Event flyer is being downloaded...",
      });
      const link = document.createElement('a');
      link.href = event.flyer.downloadUrl;
      link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}-flyer.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (event?.image_url) {
      // Download poster image if no PDF available
      toast({
        title: "Download Started",
        description: "Event poster is being downloaded...",
      });
      const link = document.createElement('a');
      link.href = event.image_url;
      link.download = `${event.title.replace(/\s+/g, '-').toLowerCase()}-poster.jpg`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast({
        title: "Download Unavailable",
        description: "No poster file available for download.",
        variant: "destructive",
      });
    }
  };

  const handleShareFlyer = async () => {
    const shareData = {
      title: `${event?.title} - Games & Connect Event`,
      text: `Join us for ${event?.title}! 🎮\n\nDate: ${event?.date}\nLocation: ${event?.location}\nPrice: ${event?.price}\n\nRegister now!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "Shared Successfully",
          description: "Event has been shared!",
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        if ((error as Error).name !== 'AbortError') {
          copyFlyerLink();
        }
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
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive",
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
    <>
      <SEO 
        title={event.title}
        description={event.long_description || event.description}
        keywords={`${event.title}, ${event.category}, gaming event Ghana, ${event.location}, event registration`}
        image={event.image_url || event.flyer?.url}
        url={`https://gamesandconnect.netlify.app/events/${generateEventSlug(event.title)}`}
        type="article"
        article={{
          publishedTime: event.created_at,
          author: event.organizer || 'Games & Connect',
          tags: [event.category || 'gaming', 'events', 'Ghana']
        }}
      />
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
                          onClick={() => {
                            const shareText = encodeURIComponent(`🎮 Join us for ${event.title}!\n\nDate: ${event.date}\nLocation: ${event.location}\nPrice: ${event.price}\n\nRegister now:`);
                            const shareUrl = encodeURIComponent(window.location.href);
                            window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank');
                          }}
                          size="sm"
                          variant="outline"
                          className="text-black hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          X (Twitter)
                        </Button>
                        <Button 
                          onClick={() => {
                            const shareUrl = encodeURIComponent(window.location.href);
                            window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
                          }}
                          size="sm"
                          variant="outline"
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          Facebook
                        </Button>
                        <Button 
                          onClick={() => {
                            const shareText = encodeURIComponent(`🎮 Join us for ${event.title}!\n\nDate: ${event.date}\nLocation: ${event.location}\nPrice: ${event.price}\n\nRegister now: ${window.location.href}`);
                            window.open(`https://wa.me/?text=${shareText}`, '_blank');
                          }}
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:bg-green-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                          </svg>
                          WhatsApp
                        </Button>
                        <Button 
                          onClick={() => {
                            const shareUrl = encodeURIComponent(window.location.href);
                            const shareTitle = encodeURIComponent(`${event.title} - Games & Connect Event`);
                            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}`, '_blank');
                          }}
                          size="sm"
                          variant="outline"
                          className="text-blue-700 hover:bg-blue-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
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
    </>
  );
}
