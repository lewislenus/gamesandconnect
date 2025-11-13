import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Settings, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmailService, { EmailNotificationData, AdminNotificationData } from '@/lib/emailjs';

export default function EmailTestPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [adminTestLoading, setAdminTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [adminTestResult, setAdminTestResult] = useState<string | null>(null);
  
  const [testData, setTestData] = useState({
    to_name: 'Test User',
    to_email: '',
    event_title: 'Sample Gaming Event',
    event_date: '2025-01-15',
    event_time: '2:00 PM',
    event_location: 'Games & Connect Community Center',
    event_price: '₵25',
  });

  const [adminTestData, setAdminTestData] = useState({
    admin_email: '',
    participant_name: 'John Doe',
    participant_email: 'john@example.com',
    participant_phone: '+233501234567',
    participant_location: 'Accra, Ghana',
  });

  const configStatus = EmailService.getConfigurationStatus();

  const handleInputChange = (field: string, value: string) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sendTestEmail = async () => {
    if (!testData.to_email.trim()) {
      toast({
        title: "Missing Email",
        description: "Please enter a test email address.",
        variant: "destructive",
      });
      return;
    }

    if (!EmailService.isValidEmail(testData.to_email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTestResult(null);
    
    try {
      const confirmationNumber = EmailService.generateConfirmationNumber();
      
      const emailData: EmailNotificationData = {
        to_name: testData.to_name,
        to_email: testData.to_email,
        event_title: testData.event_title,
        event_date: testData.event_date,
        event_time: testData.event_time,
        event_location: testData.event_location,
        event_price: testData.event_price,
        registration_date: new Date().toLocaleDateString('en-GB'),
        confirmation_number: confirmationNumber,
        event_description: 'This is a test email to verify the email notification system is working correctly.',
        event_requirements: ['Valid ID', 'Comfortable gaming attire'],
        event_includes: ['Refreshments', 'Gaming equipment', 'Prizes'],
        organizer_email: 'events@gamesandconnect.com',
      };

      const success = await EmailService.sendRegistrationConfirmation(emailData);
      
      if (success) {
        setTestResult('success');
        toast({
          title: "Test Email Sent!",
          description: `Confirmation email sent successfully to ${testData.to_email}`,
        });
      } else {
        setTestResult('failed');
        toast({
          title: "Email Failed",
          description: "Failed to send test email. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Test email error:', error);
      setTestResult('error');
      toast({
        title: "Email Error",
        description: "An error occurred while sending the test email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendAdminTestEmail = async () => {
    if (!adminTestData.admin_email.trim()) {
      toast({
        title: "Missing Admin Email",
        description: "Please enter an admin email address.",
        variant: "destructive",
      });
      return;
    }

    if (!EmailService.isValidEmail(adminTestData.admin_email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid admin email address.",
        variant: "destructive",
      });
      return;
    }

    setAdminTestLoading(true);
    setAdminTestResult(null);
    
    try {
      const confirmationNumber = EmailService.generateConfirmationNumber();
      
      const adminNotificationData: AdminNotificationData = {
        event_title: testData.event_title,
        event_date: testData.event_date,
        event_time: testData.event_time,
        event_location: testData.event_location,
        participant_name: adminTestData.participant_name,
        participant_email: adminTestData.participant_email,
        participant_phone: adminTestData.participant_phone,
        participant_location: adminTestData.participant_location,
        number_of_participants: 2,
        special_requests: 'Test notification - please ignore',
        confirmation_number: confirmationNumber,
        registration_date: new Date().toLocaleDateString('en-GB'),
        event_id: 'test-event-' + Date.now(),
        status: 'confirmed',
        admin_email: adminTestData.admin_email,
      };

      const success = await EmailService.sendAdminNotification(adminNotificationData);
      
      if (success) {
        setAdminTestResult('success');
        toast({
          title: "Admin Test Email Sent!",
          description: `Admin notification sent successfully to ${adminTestData.admin_email}`,
        });
      } else {
        setAdminTestResult('failed');
        toast({
          title: "Admin Email Failed",
          description: "Failed to send admin test email. Check console for details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin test email error:', error);
      setAdminTestResult('error');
      toast({
        title: "Admin Email Error",
        description: "An error occurred while sending the admin test email.",
        variant: "destructive",
      });
    } finally {
      setAdminTestLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Email Notification Test Panel</CardTitle>
          </div>
          <CardDescription>
            Test the email notification system for event registrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Configuration Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <Label className="text-sm font-medium">Configuration Status</Label>
            </div>
            
            <Alert className={configStatus.configured ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {configStatus.configured ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={configStatus.configured ? 'text-green-700' : 'text-red-700'}>
                  {configStatus.message}
                </AlertDescription>
              </div>
            </Alert>

            {configStatus.configured && (
              <div className="flex gap-2">
                <Badge variant="outline" className="text-green-600 border-green-200">
                  EmailJS Configured
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  Templates Ready
                </Badge>
              </div>
            )}

            {!configStatus.configured && (
              <p className="text-sm text-muted-foreground">
                Please check the EMAILJS_SETUP.md file for configuration instructions.
              </p>
            )}
          </div>

          {/* Test Email Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              <Label className="text-sm font-medium">Send Test Email</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test_name">Recipient Name</Label>
                <Input
                  id="test_name"
                  value={testData.to_name}
                  onChange={(e) => handleInputChange('to_name', e.target.value)}
                  placeholder="Test User"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test_email">Recipient Email</Label>
                <Input
                  id="test_email"
                  type="email"
                  value={testData.to_email}
                  onChange={(e) => handleInputChange('to_email', e.target.value)}
                  placeholder="test@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test_event_title">Event Title</Label>
                <Input
                  id="test_event_title"
                  value={testData.event_title}
                  onChange={(e) => handleInputChange('event_title', e.target.value)}
                  placeholder="Sample Gaming Event"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test_event_price">Event Price</Label>
                <Input
                  id="test_event_price"
                  value={testData.event_price}
                  onChange={(e) => handleInputChange('event_price', e.target.value)}
                  placeholder="₵25"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="test_event_date">Event Date</Label>
                <Input
                  id="test_event_date"
                  type="date"
                  value={testData.event_date}
                  onChange={(e) => handleInputChange('event_date', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test_event_time">Event Time</Label>
                <Input
                  id="test_event_time"
                  value={testData.event_time}
                  onChange={(e) => handleInputChange('event_time', e.target.value)}
                  placeholder="2:00 PM"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="test_event_location">Event Location</Label>
                <Input
                  id="test_event_location"
                  value={testData.event_location}
                  onChange={(e) => handleInputChange('event_location', e.target.value)}
                  placeholder="Community Center"
                />
              </div>
            </div>

            <Button 
              onClick={sendTestEmail} 
              disabled={loading || !configStatus.configured}
              className="w-full"
            >
              {loading ? 'Sending...' : 'Send Test Email'}
            </Button>

            {testResult && (
              <Alert className={testResult === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {testResult === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={testResult === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {testResult === 'success' 
                      ? `Test email sent successfully to ${testData.to_email}! Check your inbox.`
                      : 'Failed to send test email. Check the console for error details.'
                    }
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Admin Notification Test */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Admin Notification Test</CardTitle>
          </div>
          <CardDescription>
            Test admin notifications sent when users purchase tickets for events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin_email">Admin Email</Label>
                <Input
                  id="admin_email"
                  type="email"
                  value={adminTestData.admin_email}
                  onChange={(e) => setAdminTestData(prev => ({ ...prev, admin_email: e.target.value }))}
                  placeholder="admin@gamesandconnect.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant_name">Participant Name</Label>
                <Input
                  id="participant_name"
                  value={adminTestData.participant_name}
                  onChange={(e) => setAdminTestData(prev => ({ ...prev, participant_name: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participant_email">Participant Email</Label>
                <Input
                  id="participant_email"
                  type="email"
                  value={adminTestData.participant_email}
                  onChange={(e) => setAdminTestData(prev => ({ ...prev, participant_email: e.target.value }))}
                  placeholder="john@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participant_phone">Participant Phone</Label>
                <Input
                  id="participant_phone"
                  value={adminTestData.participant_phone}
                  onChange={(e) => setAdminTestData(prev => ({ ...prev, participant_phone: e.target.value }))}
                  placeholder="+233501234567"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="participant_location">Participant Location</Label>
              <Input
                id="participant_location"
                value={adminTestData.participant_location}
                onChange={(e) => setAdminTestData(prev => ({ ...prev, participant_location: e.target.value }))}
                placeholder="Accra, Ghana"
              />
            </div>

            <Button 
              onClick={sendAdminTestEmail} 
              disabled={adminTestLoading || !configStatus.configured}
              className="w-full"
              variant="outline"
            >
              {adminTestLoading ? 'Sending Admin Notification...' : 'Send Admin Test Email'}
            </Button>

            {adminTestResult && (
              <Alert className={adminTestResult === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {adminTestResult === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <AlertDescription className={adminTestResult === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {adminTestResult === 'success' 
                      ? `Admin notification sent successfully to ${adminTestData.admin_email}! Check your inbox.`
                      : 'Failed to send admin notification. Check the console for error details.'
                    }
                  </AlertDescription>
                </div>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>EmailJS package installed</span>
            </div>
            <div className="flex items-center gap-2">
              {configStatus.configured ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <span>Environment variables configured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>User confirmation template created</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Admin notification template created</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Registration form integration complete</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            See EMAILJS_SETUP_GUIDE.md for detailed setup instructions including admin notification template.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
