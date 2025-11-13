import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, XCircle, ArrowLeft, Ticket } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import EmailService from '@/lib/emailjs';

interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface NetworkProvider {
  id: string;
  name: string;
  apiValue: string;
  placeholder: string;
}

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export default function Checkout() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Prefill data from navigation state if available
  const prefill = (location.state as Record<string, any>) || {};

  // Form state
  const [form, setForm] = useState({
    name: prefill.name || '',
    phone: prefill.phone || '',
    email: prefill.email || '',
    network: 'mtn',
    ticketType: prefill.ticketType || 'regular',
    amount: prefill.amount || '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);

  // Ticket types - can be customised per event
  const ticketTypes: TicketType[] = useMemo(() => ([
    { id: 'regular', name: 'Regular Ticket', price: 50, description: 'Standard event access' },
    { id: 'vip', name: 'VIP Ticket', price: 100, description: 'Premium access with perks' },
    { id: 'group', name: 'Group Ticket (4 people)', price: 180, description: 'Save GHS 20!' },
  ]), []);

  const networkProviders: NetworkProvider[] = [
    { id: 'mtn', name: 'MTN Mobile Money', apiValue: 'mtn', placeholder: 'e.g. 0244 123 456' },
    { id: 'airteltigo', name: 'AirtelTigo Money', apiValue: 'airteltigo', placeholder: 'e.g. 0266 123 456' },
    { id: 'telecel', name: 'Telecel Cash', apiValue: 'telecel', placeholder: 'e.g. 0200 123 456' },
  ];

  const selectedTicket = useMemo(
    () => ticketTypes.find((ticket) => ticket.id === form.ticketType) || ticketTypes[0],
    [ticketTypes, form.ticketType]
  );

  const selectedNetwork = useMemo(
    () => networkProviders.find((network) => network.id === form.network) || networkProviders[0],
    [networkProviders, form.network]
  );

  // Load event details
  useEffect(() => {
    async function loadEventDetails() {
      if (!eventId) return;

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (!error && data) {
        setEventDetails(data);
      }
    }

    loadEventDetails();
  }, [eventId]);

  // Handle ticket type change (update amount automatically)
  useEffect(() => {
    if (!selectedTicket) return;
    // No need to store amount separately; derived from selected ticket
  }, [selectedTicket]);

  const formatPhoneForDb = (value: string): string => {
    let formatted = value.replace(/\s+/g, '');

    if (formatted.startsWith('+')) {
      return formatted;
    }

    if (formatted.startsWith('0')) {
      formatted = '233' + formatted.substring(1);
    }

    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted;
    }

    return formatted;
  };

  const accountNumberForApi = (value: string): string => {
    let cleaned = value.replace(/\s+/g, '');
    if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.startsWith('0')) {
      cleaned = '233' + cleaned.substring(1);
    }
    return cleaned;
  };

  const getStringValue = (value: unknown): string | null =>
    typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;

  const extractGatewayFailure = (payload: any): string | null => {
    if (!payload || typeof payload !== 'object') return null;

    const direct =
      getStringValue((payload as Record<string, unknown>)['message']) ??
      getStringValue((payload as Record<string, unknown>)['description']) ??
      getStringValue((payload as Record<string, unknown>)['error']);

    if (direct) return direct;

    const messageObj =
      typeof (payload as Record<string, unknown>)['message'] === 'object' && (payload as Record<string, unknown>)['message']
        ? (payload as Record<string, unknown>)['message'] as Record<string, unknown>
        : null;

    if (messageObj) {
      const fromMessage =
        getStringValue(messageObj['description']) ??
        getStringValue(messageObj['status']);
      if (fromMessage) return fromMessage;
    }

    const dataObj =
      typeof (payload as Record<string, unknown>)['data'] === 'object' && (payload as Record<string, unknown>)['data']
        ? (payload as Record<string, unknown>)['data'] as Record<string, unknown>
        : null;

    if (dataObj) {
      const collection =
        typeof dataObj['collection'] === 'object' && dataObj['collection']
          ? dataObj['collection'] as Record<string, unknown>
          : null;

      if (collection) {
        const collectionMessage =
          typeof collection['message'] === 'object' && collection['message']
            ? collection['message'] as Record<string, unknown>
            : null;
        const collectionData =
          typeof collection['data'] === 'object' && collection['data']
            ? collection['data'] as Record<string, unknown>
            : null;

        const fromCollectionMessage =
          collectionMessage &&
          (getStringValue(collectionMessage['description']) ?? getStringValue(collectionMessage['status']));
        if (fromCollectionMessage) return fromCollectionMessage;

        const fromCollectionData =
          collectionData &&
          (getStringValue(collectionData['description']) ??
            getStringValue(collectionData['status']) ??
            getStringValue(collectionData['actioncode']));
        if (fromCollectionData) return fromCollectionData;
      }

      const nameEnquiry =
        typeof dataObj['nameEnquiry'] === 'object' && dataObj['nameEnquiry']
          ? dataObj['nameEnquiry'] as Record<string, unknown>
          : null;

      if (nameEnquiry) {
        const nameEnquiryMessage =
          typeof nameEnquiry['message'] === 'object' && nameEnquiry['message']
            ? nameEnquiry['message'] as Record<string, unknown>
            : null;
        const nameEnquiryData =
          typeof nameEnquiry['data'] === 'object' && nameEnquiry['data']
            ? nameEnquiry['data'] as Record<string, unknown>
            : null;

        const fromNameEnquiryMessage =
          nameEnquiryMessage &&
          (getStringValue(nameEnquiryMessage['description']) ?? getStringValue(nameEnquiryMessage['status']));
        if (fromNameEnquiryMessage) return fromNameEnquiryMessage;

        const fromNameEnquiryData =
          nameEnquiryData &&
          (getStringValue(nameEnquiryData['description']) ??
            getStringValue(nameEnquiryData['status']) ??
            getStringValue(nameEnquiryData['actcode']) ??
            getStringValue(nameEnquiryData['actioncode']));
        if (fromNameEnquiryData) return fromNameEnquiryData;
      }
    }

    return null;
  };

  const extractFailureReason = (result: any): string | null => {
    if (!result || typeof result !== 'object') return null;

    const directCandidates = [
      (result as Record<string, unknown>)['failure_reason'],
      (result as Record<string, unknown>)['failureReason'],
      (result as Record<string, unknown>)['message'],
      (result as Record<string, unknown>)['error'],
      (result as Record<string, unknown>)['error_message'],
      (result as Record<string, unknown>)['errorDescription'],
    ];

    for (const candidate of directCandidates) {
      const value = getStringValue(candidate);
      if (value) return value;
    }

    const payload = (result as Record<string, unknown>);
    const gateway = payload['gateway_response'] ?? payload['response'];
    const fromGateway = extractGatewayFailure(gateway);
    if (fromGateway) return fromGateway;

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eventId) {
      toast({
        title: 'Missing event information',
        description: 'We could not determine which event you are registering for.',
        variant: 'destructive',
      });
      return;
    }

    if (!form.name || !form.phone) {
      toast({
        title: 'Missing information',
        description: 'Please provide your name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    // Validate name length (database constraint: minimum 3 characters)
    if (form.name.trim().length < 3) {
      toast({
        title: 'Invalid name',
        description: 'Name must be at least 3 characters long.',
        variant: 'destructive',
      });
      return;
    }

    // Validate phone number format (basic check)
    const phoneDigits = form.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      toast({
        title: 'Invalid phone number',
        description: 'Please enter a valid phone number with at least 9 digits.',
        variant: 'destructive',
      });
      return;
    }

    // Validate amount field is filled
    if (form.amount === '' || form.amount === null || form.amount === undefined) {
      toast({
        title: 'Missing amount',
        description: 'Please enter the ticket amount (enter 0 for free tickets).',
        variant: 'destructive',
      });
      return;
    }

    // Get amount from form input - treat empty/invalid as 0
    const amount = parseFloat(form.amount);
    
    if (isNaN(amount) || amount < 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount (0 or greater).',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setPaymentStatus('processing');
    setTransactionId(null);
    setFailureReason(null);

    try {
      const phoneForDb = formatPhoneForDb(form.phone);
      const accountNumber = accountNumberForApi(form.phone);

      console.log('Processing registration with amount:', amount, 'Is free:', amount === 0);

      // Step 1: Create registration using actual table columns
      const { data: registration, error: regError } = await supabase
        .from('registrations')
        .insert({
          event_id: eventId,
          full_name: form.name,
          email: form.email || 'noemail@example.com',
          phone_number: phoneForDb,
          number_of_participants: 1,
          location: 'Not specified',
          special_requests: null,
          extra_info: {},
          payment_status: amount === 0 ? 'confirmed' : 'pending',
        })
        .select()
        .single();

      if (regError) {
        throw new Error(`Failed to create registration: ${regError.message}`);
      }

      console.log('Registration created:', registration.id, 'Amount:', amount);

      // If free ticket, skip payment and confirm immediately
      if (amount === 0) {
        console.log('Free ticket detected - skipping payment');
        setPaymentStatus('success');
        setLoading(false);

        // Send confirmation email for free ticket
        await sendConfirmationEmail(registration, eventDetails, 'confirmed');

        toast({
          title: 'Registration Successful!',
          description: 'Your free ticket has been confirmed. Check your email for details!',
        });

        setTimeout(() => {
          navigate('/my-registrations');
        }, 2000);
        return;
      }

      console.log('Paid ticket - initiating payment');

      // Step 2: Initiate payment via Edge Function for paid tickets
      setVerifying(true);
      const narration = `${eventDetails?.title || 'Event'} - ${selectedTicket?.name || 'Ticket'}`;

      console.log('=== PAYMENT REQUEST ===');
      console.log('Event ID:', eventId);
      console.log('Registration ID:', registration.id);
      console.log('Account Number:', accountNumber);
      console.log('Account Name:', form.name);
      console.log('Amount:', amount);
      console.log('Network:', selectedNetwork.apiValue);
      console.log('Narration:', narration);

      const { data: paymentResult, error: paymentError } = await supabase.functions.invoke('pay', {
        body: {
          event_id: eventId,
          registration_id: registration.id,
          account_number: accountNumber,
          account_name: form.name,
          amount,
          narration,
          network: selectedNetwork.apiValue,
        },
      });

      console.log('=== PAYMENT RESPONSE ===');
      console.log('Error:', paymentError);
      console.log('Result:', JSON.stringify(paymentResult, null, 2));

      if (paymentError) {
        console.error('=== PAYMENT ERROR DETAILS ===');
        console.error('Error Message:', paymentError.message);
        console.error('Error Details:', JSON.stringify(paymentError, null, 2));
        
        // Try to get more details from the response
        if (paymentResult) {
          console.error('=== ERROR RESPONSE DATA ===');
          console.error('Response:', JSON.stringify(paymentResult, null, 2));
          
          // If the Edge Function returned error details, show them
          if (paymentResult.error) {
            throw new Error(`Payment API Error: ${paymentResult.error}`);
          }
          if (paymentResult.error_details) {
            throw new Error(`Payment Error: ${JSON.stringify(paymentResult.error_details)}`);
          }
        }
        
        throw new Error(paymentError.message || 'Edge Function error - check console for details');
      }

      if (!paymentResult?.success) {
        console.error('=== PAYMENT FAILED ===');
        console.error('Result:', JSON.stringify(paymentResult, null, 2));
        const errorMessage = paymentResult?.error || 'Payment was not successful. Please try again.';
        const failureMessage =
          extractFailureReason(paymentResult) ??
          getStringValue(errorMessage) ??
          'Payment was not successful. Please try again.';
        setPaymentStatus('failed');
        setVerifying(false);
        setFailureReason(failureMessage);
        toast({
          title: 'Payment Failed',
          description: failureMessage,
          variant: 'destructive',
        });
        return;
      }

      console.log('=== PAYMENT SUCCESS ===');
      console.log('Transaction Reference:', paymentResult.transaction_reference);
      console.log('Full Response:', JSON.stringify(paymentResult.response, null, 2));

      const referencesFromApi = Array.isArray(paymentResult.references)
        ? (paymentResult.references as string[]).filter((ref) => typeof ref === 'string' && ref.trim().length > 0)
        : [];

      const primaryReference =
        (paymentResult.collection_transaction_id as string) ||
        (paymentResult.transaction_reference as string) ||
        (paymentResult.transaction_id as string) ||
        referencesFromApi[0] ||
        registration.id;

      const altReferences = referencesFromApi.filter((ref) => ref !== primaryReference);

      console.log('=== PAYMENT REFERENCES ===');
      console.log('Primary Reference:', primaryReference);
      console.log('Alternate References:', altReferences);

      const responseStatus = getStringValue(paymentResult?.response?.status);
      const responseDescription = getStringValue(paymentResult?.response?.description);
      const collectionMessageStatus = getStringValue(paymentResult?.response?.data?.collection?.message?.status);
      const collectionMessageDescription = getStringValue(paymentResult?.response?.data?.collection?.message?.description);
      const collectionDataStatus = getStringValue(paymentResult?.response?.data?.collection?.data?.status);
      const collectionDataDescription = getStringValue(paymentResult?.response?.data?.collection?.data?.description);

      const failureIndicators = [
        responseStatus,
        responseDescription,
        collectionMessageStatus,
        collectionMessageDescription,
        collectionDataStatus,
        collectionDataDescription,
      ];

      const hasFailureIndicator = failureIndicators.some(
        (value) =>
          value &&
          (value.toLowerCase().includes('fail') ||
            value.toLowerCase().includes('decline') ||
            value.toLowerCase().includes('could not process') ||
            value.toLowerCase().includes('error') ||
            value === '-200')
      );

      if (hasFailureIndicator) {
        const failureMessage =
          extractFailureReason(paymentResult) ??
          extractFailureReason(paymentResult?.response) ??
          'Payment could not be processed. Please try again.';
        setPaymentStatus('failed');
        setVerifying(false);
        setFailureReason(failureMessage);
        toast({
          title: 'Payment Failed',
          description: failureMessage,
          variant: 'destructive',
        });
        return;
      }

      setTransactionId(primaryReference);
      setPaymentStatus('processing');
      setFailureReason(null);

      toast({
        title: 'Payment Initiated!',
        description: 'Approve the prompt on your phone. We will confirm the payment shortly.',
      });

      // Start polling for payment confirmation
      pollPaymentStatus(registration.id, primaryReference, altReferences);
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setVerifying(false);
      const failureMessage =
        extractFailureReason(error) ??
        getStringValue(error?.message) ??
        'Unable to initiate payment. Please try again.';
      setFailureReason(failureMessage);
      toast({
        title: 'Payment Failed',
        description: failureMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (
    registrationId: string,
    reference?: string,
    altReferences: string[] = [],
    attempt = 0,
    maxAttempts = 30
  ) => {
    if (attempt >= maxAttempts) {
      setPaymentStatus('failed');
      setVerifying(false);
      const failureMessage = 'Payment confirmation took too long. Please contact support with your reference.';
      setFailureReason(failureMessage);
      toast({
        title: 'Verification Timeout',
        description: failureMessage,
        variant: 'destructive',
      });
      return;
    }

    try {
      // Wait before checking to give gateway time to process
      await new Promise((resolve) => setTimeout(resolve, attempt === 0 ? 8000 : 5000));

      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: {
          registration_id: registrationId,
          reference,
          alt_references: altReferences,
        },
      });

      if (error) {
        throw error;
      }

      console.log('=== VERIFICATION RESPONSE ===');
      console.log('Attempt:', attempt + 1, 'of', maxAttempts);
      console.log('Reference used:', reference);
      console.log('Alt references:', altReferences);
      console.log('Verification data:', JSON.stringify(data, null, 2));

      if (data?.is_confirmed) {
        setPaymentStatus('success');
        setVerifying(false);
        setFailureReason(null);

        // Send confirmation email for paid ticket
        const { data: confirmedRegistration } = await supabase
          .from('registrations')
          .select('*')
          .eq('id', registrationId)
          .single();

        if (confirmedRegistration) {
          await sendConfirmationEmail(confirmedRegistration, eventDetails, 'confirmed');
        }

        toast({
          title: 'Payment Confirmed!',
          description: 'Your ticket has been confirmed. Check your email for details!',
        });

        setTimeout(() => {
          navigate('/my-registrations');
        }, 3000);
        return;
      }

      if (data?.status === 'failed') {
        setPaymentStatus('failed');
        setVerifying(false);
        const failureMessage = extractFailureReason(data) ?? 'Payment could not be confirmed. Please try again.';
        setFailureReason(failureMessage);
        toast({
          title: 'Payment Failed',
          description: failureMessage,
          variant: 'destructive',
        });
        return;
      }

      // Continue polling if still processing
      pollPaymentStatus(registrationId, reference, altReferences, attempt + 1, maxAttempts);
    } catch (pollError) {
      console.error('Verification error:', pollError);
      // Continue polling despite transient errors
      pollPaymentStatus(registrationId, reference, altReferences, attempt + 1, maxAttempts);
    }
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setTransactionId(null);
    setVerifying(false);
    setFailureReason(null);
  };

  const formatCurrency = (value: number) => `GHS ${value.toFixed(2)}`;

  // Helper function to send confirmation email
  const sendConfirmationEmail = async (registration: any, event: any, paymentStatus: string) => {
    try {
      // Skip if no valid email
      if (!form.email || form.email === 'noemail@example.com' || !EmailService.isValidEmail(form.email)) {
        console.log('Skipping email - no valid email address provided');
        return;
      }

      const confirmationNumber = EmailService.generateConfirmationNumber();
      const registrationDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      const eventDate = event?.date 
        ? new Date(event.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'TBA';

      const eventTime = event?.time || 'TBA';

      console.log('Sending confirmation email to:', form.email);

      // Send confirmation email to participant
      const emailSent = await EmailService.sendRegistrationConfirmation({
        to_name: form.name,
        to_email: form.email,
        event_title: event?.title || 'Event',
        event_date: eventDate,
        event_time: eventTime,
        event_location: event?.location || 'TBA',
        event_price: form.amount ? `GHS ${parseFloat(form.amount).toFixed(2)}` : 'Free',
        registration_date: registrationDate,
        confirmation_number: confirmationNumber,
        event_description: event?.description || '',
      });

      if (emailSent) {
        console.log('✅ Confirmation email sent successfully');
      } else {
        console.log('⚠️ Email notification skipped (EmailJS not configured - registration was successful)');
      }

      // Send admin notification
      const adminEmail = import.meta.env.VITE_ORGANIZER_EMAIL || 'admin@gamesandconnect.com';
      const adminNotificationSent = await EmailService.sendAdminNotification({
        admin_email: adminEmail,
        event_title: event?.title || 'Event',
        event_date: eventDate,
        event_time: eventTime,
        event_location: event?.location || 'TBA',
        event_id: eventId || '',
        participant_name: form.name,
        participant_email: form.email,
        participant_phone: form.phone,
        participant_location: 'Not specified',
        number_of_participants: 1,
        special_requests: '',
        confirmation_number: confirmationNumber,
        registration_date: registrationDate,
        status: paymentStatus,
      });

      if (adminNotificationSent) {
        console.log('✅ Admin notification sent successfully');
      } else {
        console.log('⚠️ Admin notification skipped (EmailJS not configured)');
      }
    } catch (error) {
      console.error('Error sending email notifications:', error);
      // Don't throw - email failure shouldn't block registration
    }
  };

  return (
    <>
      <SEO
        title={`Checkout - ${eventDetails?.title || 'Event'}`}
        description="Complete your ticket purchase securely with Mobile Money"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {/* Hero Image Section */}
        <div className="relative h-[400px] md:h-[500px] overflow-hidden">
          <motion.img
            src={eventDetails?.image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop'}
            alt={eventDetails?.title || 'Event'}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6 }}
            onError={(e) => {
              // Fallback to party image if event image fails to load
              e.currentTarget.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=800&fit=crop';
            }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Back button */}
          <div className="absolute top-6 left-6 z-10">
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="bg-white/90 hover:bg-white backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Event title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{eventDetails?.title || 'Event Registration'}</h1>
              <p className="text-lg text-white/90">Complete your ticket purchase</p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-6xl px-4 py-12 -mt-20 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid gap-8 lg:grid-cols-[1.5fr,1fr]"
          >
            {/* Payment Form Card */}
            <Card className="shadow-2xl border-0">
              <CardHeader className="space-y-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg p-6">
                <CardTitle className="text-2xl font-semibold">Payment Details</CardTitle>
                <CardDescription className="text-blue-100">
                  Securely pay for your ticket using Mobile Money
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                  {paymentStatus === 'idle' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="John Doe"
                            minLength={3}
                            maxLength={100}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">At least 3 characters</p>
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder={selectedNetwork.placeholder}
                            minLength={9}
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Format: 0244123456 or +233244123456</p>
                        </div>

                        <div>
                          <Label htmlFor="email">Email (Optional)</Label>
                          <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="amount">Ticket Amount (GHS)</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="0"
                            step="0.01"
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            placeholder="Enter amount (0 for free)"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter 0 for free tickets</p>
                        </div>

                        {parseFloat(form.amount) > 0 && (
                          <>
                            <div>
                              <Label>Network Provider</Label>
                              <Select
                                value={form.network}
                                onValueChange={(value) => setForm({ ...form, network: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Network" />
                                </SelectTrigger>
                                <SelectContent>
                                  {networkProviders.map((provider) => (
                                    <SelectItem key={provider.id} value={provider.id}>
                                      {provider.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label>Ticket Type</Label>
                              <Select
                                value={form.ticketType}
                                onValueChange={(value) => setForm({ ...form, ticketType: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Ticket" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ticketTypes.map((ticket) => (
                                    <SelectItem key={ticket.id} value={ticket.id}>
                                      {ticket.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg font-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : parseFloat(form.amount) === 0 ? (
                          'Get Free Ticket'
                        ) : (
                          'Pay with Mobile Money'
                        )}
                      </Button>
                    </form>
                  )}

                  {paymentStatus === 'processing' && (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {verifying ? 'Verifying Payment...' : 'Processing Payment...'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {verifying
                          ? 'Please hold on while we confirm your payment. This may take up to a minute.'
                          : 'Please approve the prompt on your mobile device to complete payment.'}
                      </p>
                      {transactionId && (
                        <p className="text-sm text-gray-500">
                          Reference: {transactionId}
                        </p>
                      )}
                    </div>
                  )}

                  {paymentStatus === 'success' && (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Payment Initiated Successfully!</h3>
                      <p className="text-gray-600 mb-4">
                        Please complete the payment on your phone. Your registration will appear shortly.
                      </p>
                      {transactionId && (
                        <p className="text-sm text-gray-500">
                          Reference: {transactionId}
                        </p>
                      )}
                    </div>
                  )}

                  {paymentStatus === 'failed' && (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-red-600">Payment Failed</h3>
                      <p className="text-gray-600 mb-6">
                        We could not initiate the payment. Please verify your details and try again.
                      </p>
                      {failureReason && (
                        <p className="text-sm text-red-500 mb-6">
                          {failureReason}
                        </p>
                      )}
                      <Button onClick={resetPayment} variant="outline">
                        Try Again
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary Sidebar */}
              <div className="space-y-6">
                <Card className="shadow-2xl border-0 sticky top-6">
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 border-b">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Ticket className="h-6 w-6 text-blue-600" />
                      Order Summary
                    </CardTitle>
                    <CardDescription>
                      Review your ticket details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-5">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Event</span>
                        <span className="font-semibold text-gray-900 text-right max-w-[60%]">{eventDetails?.title || 'Loading...'}</span>
                      </div>

                      {parseFloat(form.amount) > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Ticket</span>
                            <span className="font-semibold text-gray-900">{selectedTicket?.name}</span>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Network</span>
                            <span className="font-semibold text-gray-900">{selectedNetwork?.name}</span>
                          </div>
                        </>
                      )}

                      <div className="border-t pt-4 flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {form.amount ? formatCurrency(parseFloat(form.amount)) : 'GHS 0.00'}
                        </span>
                      </div>
                      
                      {parseFloat(form.amount) === 0 && (
                        <div className="text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            Free Ticket
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Security badge */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Secure payment via Mobile Money</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
    </>
  );
}
