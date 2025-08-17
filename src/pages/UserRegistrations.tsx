import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, MapPin, Clock, ExternalLink, Star, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getUserRegistrations, submitEventFeedback } from '@/lib/api';

export default function UserRegistrations() {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<string | null>(null);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    feedbackText: '',
    isAnonymous: false
  });

  useEffect(() => {
    async function loadRegistrations() {
      setLoading(true);
      try {
        const data = await getUserRegistrations();
        setRegistrations(data);
      } catch (error) {
        console.error('Failed to load registrations:', error);
        toast({
          title: "Error Loading Registrations",
          description: "There was a problem loading your registrations.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadRegistrations();
  }, [toast]);

  const handleOpenFeedback = (registrationId: string) => {
    setSelectedRegistration(registrationId);
    setFeedbackData({
      rating: 5,
      feedbackText: '',
      isAnonymous: false
    });
    setShowFeedbackDialog(true);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRegistration) return;
    
    setFeedbackLoading(true);
    
    try {
      const result = await submitEventFeedback(selectedRegistration, {
        rating: feedbackData.rating,
        feedbackText: feedbackData.feedbackText,
        isAnonymous: feedbackData.isAnonymous
      });
      
      if (result.success) {
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
        
        // Update local state to show feedback has been submitted
        setRegistrations(prev => 
          prev.map(reg => 
            reg.id === selectedRegistration 
              ? { ...reg, has_feedback: true } 
              : reg
          )
        );
        
        setShowFeedbackDialog(false);
      } else {
        toast({
          title: "Error Submitting Feedback",
          description: result.error || "There was a problem submitting your feedback.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while submitting feedback.",
        variant: "destructive",
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="container py-8">
        <h2 className="text-3xl font-bold mb-8">My Registrations</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-7 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                  <Skeleton className="h-12" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h2 className="text-3xl font-bold mb-8">My Registrations</h2>
      
      {registrations.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Registrations Found</CardTitle>
            <CardDescription>
              You haven't registered for any events yet.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Browse our upcoming events and register to see them here.
            </p>
            <Button asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {registrations.map((registration) => (
            <Card key={registration.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{registration.events.title}</CardTitle>
                    <CardDescription>
                      Registration ID: {registration.id.substring(0, 8)}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={registration.status === 'confirmed' ? 'default' : 'secondary'}
                  >
                    {registration.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>{registration.events.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{registration.events.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{registration.events.location}</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Registration Details</h4>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Name</TableCell>
                        <TableCell>{registration.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Email</TableCell>
                        <TableCell>{registration.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Phone</TableCell>
                        <TableCell>{registration.phone}</TableCell>
                      </TableRow>
                      {registration.emergency_contact && (
                        <TableRow>
                          <TableCell className="font-medium">Emergency Contact</TableCell>
                          <TableCell>{registration.emergency_contact}</TableCell>
                        </TableRow>
                      )}
                      {registration.registration_date && (
                        <TableRow>
                          <TableCell className="font-medium">Registration Date</TableCell>
                          <TableCell>{formatDate(registration.created_at)}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              
              <CardFooter className="flex gap-2 justify-between">
                <div>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/events/${registration.events.id}`}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Event
                    </Link>
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  {registration.status === 'confirmed' && !registration.has_feedback && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleOpenFeedback(registration.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Leave Feedback
                    </Button>
                  )}
                  
                  {registration.ticket_url && (
                    <Button size="sm">
                      Download Ticket
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Event Feedback</DialogTitle>
            <DialogDescription>
              Share your experience and help us improve future events.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">How would you rate this event?</Label>
              <div className="flex gap-2 items-center">
                <RadioGroup 
                  value={feedbackData.rating.toString()} 
                  onValueChange={(value) => setFeedbackData(prev => ({ ...prev, rating: parseInt(value) }))}
                  className="flex gap-2"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex items-center space-x-1">
                      <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} disabled={feedbackLoading} />
                      <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                        {rating}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="ml-2 flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      size={16}
                      className={`${
                        star <= feedbackData.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback (Optional)</Label>
              <Textarea
                id="feedback"
                value={feedbackData.feedbackText}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, feedbackText: e.target.value }))}
                placeholder="Share your thoughts about the event..."
                rows={4}
                disabled={feedbackLoading}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={feedbackData.isAnonymous}
                onChange={(e) => setFeedbackData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                className="rounded border-gray-300"
                disabled={feedbackLoading}
              />
              <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                Submit feedback anonymously
              </Label>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowFeedbackDialog(false)} disabled={feedbackLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={feedbackLoading}>
                {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
