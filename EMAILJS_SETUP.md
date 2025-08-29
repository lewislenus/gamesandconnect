# EmailJS Setup Guide for Games & Connect

This guide will help you set up email notifications for event registrations using EmailJS.

## Prerequisites

- A valid email account (Gmail, Outlook, Yahoo, etc.)
- Access to the Games & Connect admin panel or environment configuration

## Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Set Up Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail recommended)
4. Follow the authentication process:
   - For Gmail: Allow EmailJS to access your Gmail account
   - For Outlook: Enter your credentials
   - For other providers: Follow the specific instructions
5. Note down your **Service ID** (e.g., `service_xyz123`)

## Step 3: Create Email Templates

Create three email templates in your EmailJS dashboard:

### Registration Confirmation Template

1. Go to **Email Templates** in your dashboard
2. Click **Create New Template**
3. Use the template name: `template_event_registration`
4. Copy the HTML content from `EMAIL_TEMPLATES.md` (Registration Confirmation Template section)
5. Set the subject to: `✅ Registration Confirmed - {{event_title}}`
6. Save the template and note the **Template ID**

### Event Reminder Template (Optional)

1. Create another template with name: `template_event_reminder`
2. Copy the HTML content from `EMAIL_TEMPLATES.md` (Event Reminder Template section)
3. Set the subject to: `🔔 Reminder: {{event_title}} is Tomorrow!`
4. Save the template

### Event Cancellation Template (Optional)

1. Create another template with name: `template_event_cancellation`
2. Create a simple cancellation email template
3. Set the subject to: `❌ Event Cancelled: {{event_title}}`
4. Save the template

## Step 4: Get Your Public Key

1. Go to **Account** → **General** in your EmailJS dashboard
2. Find your **Public Key** (User ID)
3. Note it down (e.g., `user_xyz789`)

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local` in your project root
2. Update the EmailJS configuration variables:

```bash
# EmailJS Service Configuration
VITE_EMAILJS_SERVICE_ID=service_xyz123
VITE_EMAILJS_TEMPLATE_ID=template_event_registration
VITE_EMAILJS_PUBLIC_KEY=user_xyz789

# Email Templates
VITE_EMAILJS_REGISTRATION_TEMPLATE=template_event_registration
VITE_EMAILJS_REMINDER_TEMPLATE=template_event_reminder
VITE_EMAILJS_CANCELLATION_TEMPLATE=template_event_cancellation

# Organization Email Settings
VITE_ORGANIZER_EMAIL=your-events@email.com
VITE_ORGANIZATION_NAME=Games & Connect
```

## Step 6: Test the Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to register for an event
3. Check the browser console for any EmailJS-related messages
4. Verify that the confirmation email is received

## Step 7: Troubleshooting

### Common Issues

**Email not sending:**
- Check console for error messages
- Verify all environment variables are set correctly
- Ensure EmailJS service is active and properly authenticated
- Check EmailJS dashboard for quota limits (free accounts have limits)

**Template not found:**
- Verify template IDs match exactly (case-sensitive)
- Ensure templates are published/active in EmailJS dashboard

**Authentication errors:**
- Re-authenticate your email service in EmailJS dashboard
- Check if your email provider requires app-specific passwords

### Testing Email Delivery

You can test email functionality in the browser console:

```javascript
// Open browser dev tools and run:
import EmailService from './src/lib/emailjs';

// Test configuration
console.log(EmailService.getConfigurationStatus());

// Test email sending (replace with actual data)
EmailService.sendRegistrationConfirmation({
  to_name: 'Test User',
  to_email: 'test@example.com',
  event_title: 'Test Event',
  event_date: '2025-01-01',
  event_time: '10:00 AM',
  event_location: 'Test Location',
  event_price: '₵50',
  registration_date: '2024-12-01',
  confirmation_number: 'GC123456TEST'
});
```

## Email Template Variables

The following variables are automatically populated in your email templates:

- `{{to_name}}` - Registrant's full name
- `{{to_email}}` - Registrant's email address
- `{{event_title}}` - Name of the event
- `{{event_date}}` - Event date
- `{{event_time}}` - Event time
- `{{event_location}}` - Event location
- `{{event_price}}` - Event price
- `{{registration_date}}` - Date when registration was made
- `{{confirmation_number}}` - Unique confirmation number
- `{{event_description}}` - Event description
- `{{event_requirements}}` - Event requirements (comma-separated)
- `{{event_includes}}` - What's included (comma-separated)
- `{{organizer_email}}` - Contact email for inquiries

## Features Included

✅ **Registration Confirmation Emails**: Automatic emails sent after successful registration  
✅ **Unique Confirmation Numbers**: Each registration gets a unique confirmation code  
✅ **Event Details**: Full event information included in emails  
✅ **Payment Information**: MTN Mobile Money details included  
✅ **Professional Templates**: Responsive HTML email templates  
✅ **Environment Configuration**: Easy setup with environment variables  
✅ **Error Handling**: Graceful fallbacks if email service is unavailable  
✅ **Validation**: Email format and configuration validation  

## Future Enhancements

- **Event Reminders**: Automatic reminder emails 24 hours before events
- **Event Cancellation Notifications**: Automated cancellation emails
- **Waitlist Notifications**: Emails when spots become available
- **Event Updates**: Notifications for event changes or updates

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your EmailJS dashboard for service status
3. Review environment variable configuration
4. Test with a simple email first

For EmailJS-specific issues, consult the [EmailJS Documentation](https://www.emailjs.com/docs/).

## Security Notes

- Never commit your actual EmailJS credentials to version control
- Use environment variables for all sensitive configuration
- Consider using different EmailJS accounts for development and production
- Monitor your EmailJS quota usage
- Set up proper email authentication (SPF, DKIM) for better deliverability
