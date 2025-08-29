import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Phone, Mail, MapPin, MessageSquare, CreditCard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Event, registerForEvent } from '@/lib/api';
import { supabase } from '@/integrations/supabase/client';
import EmailService, { EmailNotificationData } from '@/lib/emailjs';

interface EventRegistrationFormProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegistrationSuccess?: () => void;
}

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  numberOfParticipants: number;
  location: string;
  specialRequests: string;
}

interface RegistrationResult {
  success: boolean;
  registration_id?: string;
  status?: string;
  message?: string;
  error?: string;
  isWaitlist?: boolean;
  payment_info?: {
    method: string;
    number: string;
    reference: string;
    event_price: string;
    total_amount: string;
  };
}

interface ApiRegistrationResult {
  success: boolean;
  data?: Array<{ id: string; [key: string]: unknown }>;
  isWaitlist: boolean;
  message?: string;
  error?: string;
}

// Simple email check function
const isEmailRegistered = async (eventId: string, email: string) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email)
      .limit(1);

    if (error) {
      console.error('Error checking email registration:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking email registration:', error);
    return false;
  }
};

// Send confirmation email function
const sendConfirmationEmail = async (
  formData: RegistrationData,
  event: Event,
  confirmationNumber: string,
  isWaitlist: boolean = false
): Promise<boolean> => {
  try {
    const emailData: EmailNotificationData = {
      to_name: formData.fullName,
      to_email: formData.email,
      event_title: event.title,
      event_date: event.date,
      event_time: event.time || 'Time TBA',
      event_location: event.location || 'Location TBA',
      event_price: event.price || '₵0',
      registration_date: new Date().toLocaleDateString('en-GB'),
      confirmation_number: confirmationNumber,
      event_description: event.description || '',
      event_requirements: event.requirements || [],
      event_includes: event.includes || [],
      organizer_email: 'events@gamesandconnect.com',
    };

    const emailSent = await EmailService.sendRegistrationConfirmation(emailData);
    
    if (emailSent) {
      console.log('Confirmation email sent successfully');
      return true;
    } else {
      console.warn('Failed to send confirmation email');
      return false;
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
};

export default function EventRegistrationForm({ 
  event, 
  open, 
  onOpenChange, 
  onRegistrationSuccess 
}: EventRegistrationFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);
  
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    phone: '',
    numberOfParticipants: 1,
    location: '',
    specialRequests: ''
  });

  const handleInputChange = (field: keyof RegistrationData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhoneChange = (value: string) => {
    // Remove all non-numeric characters except +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Handle different input formats
    if (cleaned.length > 0 && !cleaned.startsWith('+233')) {
      // Remove any existing + that's not at the start
      if (cleaned.includes('+') && !cleaned.startsWith('+')) {
        cleaned = cleaned.replace(/\+/g, '');
      }
      
      // Case 1: Starts with 0 (Ghana local format) - replace 0 with +233
      if (cleaned.startsWith('0') && cleaned.length >= 2) {
        cleaned = '+233' + cleaned.substring(1);
      }
      // Case 2: Starts with 233 - add +
      else if (cleaned.startsWith('233') && cleaned.length > 3) {
        cleaned = '+' + cleaned;
      }
      // Case 3: 9 digits without country code - add +233
      else if (cleaned.length === 9 && /^\d{9}$/.test(cleaned)) {
        cleaned = '+233' + cleaned;
      }
      // Case 4: 10 digits (likely with extra leading digit) - add +233 and remove first digit
      else if (cleaned.length === 10 && /^\d{10}$/.test(cleaned) && !cleaned.startsWith('233')) {
        cleaned = '+233' + cleaned.substring(1);
      }
      // Case 5: Already has +233 but user is still typing
      else if (cleaned.startsWith('+233')) {
        // Keep as is
      }
      // Case 6: Just + or partial +233
      else if (cleaned === '+' || cleaned === '+2' || cleaned === '+23') {
        cleaned = cleaned + (cleaned === '+' ? '233' : cleaned === '+2' ? '33' : '3');
      }
    }
    
    // Limit length to +233 + 9 digits = 13 characters
    if (cleaned.length > 13) {
      cleaned = cleaned.substring(0, 13);
    }
    
    setFormData(prev => ({
      ...prev,
      phone: cleaned
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.fullName.trim().length < 3) {
      toast({
        title: "Invalid Name",
        description: "Full name must be at least 3 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return false;
    }

    // Email validation matching the database constraint
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    // Phone number validation - now more lenient since we auto-format
    if (formData.phone.trim()) {
      const phoneRegex = /^\+233[0-9]{9}$/;
      if (!phoneRegex.test(formData.phone)) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid Ghana phone number. Auto-formatting should handle most formats.",
          variant: "destructive",
        });
        return false;
      }
    }

    if (!formData.location.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your current location.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.numberOfParticipants < 1) {
      toast({
        title: "Invalid Participants",
        description: "Number of participants must be at least 1.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Check if email is already registered
      const emailExists = await isEmailRegistered(event.id, formData.email);
      if (emailExists) {
        toast({
          title: "Already Registered",
          description: "This email address is already registered for this event.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Call the updated registerForEvent API function with proper data structure
      const result: ApiRegistrationResult = await registerForEvent(event.id, {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        numberOfParticipants: formData.numberOfParticipants,
        location: formData.location,
        specialRequests: formData.specialRequests,
        emergencyContact: '', // Not collected in current form
        dietaryRequirements: '', // Not collected in current form
        additionalInfo: formData.specialRequests || null
      });

      if (result.success) {
        // Generate confirmation number
        const confirmationNumber = EmailService.generateConfirmationNumber();
        
        const registrationResult: RegistrationResult = {
          success: true,
          registration_id: result.data?.[0]?.id || 'temp-' + Date.now(),
          status: result.isWaitlist ? 'waitlist' : 'confirmed',
          message: result.isWaitlist ? 'Added to waitlist - event is currently full' : 'Registration confirmed',
          isWaitlist: result.isWaitlist,
          payment_info: {
            method: 'MTN Mobile Money',
            number: '059 859 9616',
            reference: 'Mainstream House',
            event_price: event.price || '₵0',
            total_amount: event.price || '₵0'
          }
        };

        // Send confirmation email
        const emailSent = await sendConfirmationEmail(
          formData,
          event,
          confirmationNumber,
          result.isWaitlist
        );

        // Update registration result with confirmation number
        registrationResult.registration_id = confirmationNumber;

        setRegistrationResult(registrationResult);
        setShowSuccess(true);
        
        // Show toast with email status
        if (emailSent) {
          toast({
            title: result.isWaitlist ? "Added to Waitlist" : "Registration Successful!",
            description: `${registrationResult.message}. Confirmation email sent to ${formData.email}`,
          });
        } else {
          toast({
            title: result.isWaitlist ? "Added to Waitlist" : "Registration Successful!",
            description: `${registrationResult.message}. Note: Confirmation email could not be sent.`,
            variant: "default",
          });
        }

        // Call success callback if provided
        if (onRegistrationSuccess) {
          onRegistrationSuccess();
        }
      } else {
        toast({
          title: "Registration Failed",
          description: result.error || "There was a problem with your registration.",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : "There was a problem with your registration. Please try again.";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      numberOfParticipants: 1,
      location: '',
      specialRequests: ''
    });
    setShowSuccess(false);
    setRegistrationResult(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleContinue = () => {
    handleClose();
  };

  if (showSuccess && registrationResult) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <DialogTitle>Registration Confirmed!</DialogTitle>
            </div>
            <DialogDescription>
              You have been successfully registered for {event.title}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Registration Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={registrationResult.status === 'confirmed' ? 'default' : 'secondary'}>
                    {registrationResult.status === 'confirmed' ? 'Confirmed' : 'Waitlist'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confirmation #:</span>
                  <span className="font-mono">#{registrationResult.registration_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Participants:</span>
                  <span>{formData.numberOfParticipants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-xs">{formData.email}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <CardTitle className="text-sm text-green-700">Email Confirmation</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-green-700">
                  📧 A confirmation email has been sent to <strong>{formData.email}</strong>
                </p>
                <p className="text-xs text-green-600">
                  Please check your inbox (and spam folder) for detailed event information and payment instructions.
                </p>
              </CardContent>
            </Card>

            {registrationResult.payment_info && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <CardTitle className="text-sm">Payment Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Method:</span>
                    <span>{registrationResult.payment_info.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number:</span>
                    <span className="font-mono">{registrationResult.payment_info.number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reference:</span>
                    <span>{registrationResult.payment_info.reference}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Amount:</span>
                    <span>{registrationResult.payment_info.total_amount}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button onClick={handleContinue} className="w-full">
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {event.title}</DialogTitle>
          <DialogDescription>
            Fill in your details to register for this event. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name *
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Your full name"
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number (Ghana format)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+233 XX XXX XXXX or 0XX XXX XXXX"
                className={`pl-10 pr-10 ${/^\+233[0-9]{9}$/.test(formData.phone) ? 'border-green-500' : ''}`}
                disabled={loading}
              />
              {/^\+233[0-9]{9}$/.test(formData.phone) && (
                <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Examples: 0501234567 → +233501234567 | 501234567 → +233501234567
            </p>
          </div>

          {/* Number of Participants */}
          <div className="space-y-2">
            <Label htmlFor="participants" className="text-sm font-medium">
              Number of Participants *
            </Label>
            <Select
              value={formData.numberOfParticipants.toString()}
              onValueChange={(value) => handleInputChange('numberOfParticipants', parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of participants" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'person' : 'people'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Your Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Your Location *
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Your current location"
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Special Requests */}
          <div className="space-y-2">
            <Label htmlFor="specialRequests" className="text-sm font-medium">
              Special Requests
            </Label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                placeholder="Any special requirements or notes"
                className="pl-10 min-h-[80px] resize-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Payment Information Display */}
          <Card className="bg-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <CardTitle className="text-sm text-green-700">Payment Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">MTN Mobile Money:</span>
                <span className="font-mono">059 859 9616</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference:</span>
                <span>(Mainstream House)</span>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Payment details will be provided after registration.
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Processing...' : 'Register Now'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
