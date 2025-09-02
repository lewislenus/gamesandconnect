# EmailJS Setup Guide for Event Registration Notifications

This guide will help you set up EmailJS to send both user confirmations and admin notifications when someone registers for an event.

## Prerequisites

1. Gmail account (recommended) or other email service
2. EmailJS account (free tier available)
3. Access to your project's environment variables

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Set Up Email Service

1. In your EmailJS dashboard, click **"Add New Service"**
2. Choose **Gmail** (recommended) or your preferred email service
3. Follow the OAuth flow to connect your Gmail account
4. Give your service a meaningful name like "Games Connect Notifications"
5. **Copy the Service ID** - you'll need this for `VITE_EMAILJS_SERVICE_ID`

## Step 3: Create Email Templates

### Template 1: User Registration Confirmation

1. Click **"Create New Template"**
2. Set Template ID: `template_event_registration`
3. Use the template from `EMAIL_TEMPLATES.md` (if it exists) or create a simple one:

```html
Subject: Registration Confirmed - {{event_title}}

Dear {{to_name}},

Your registration for {{event_title}} has been confirmed!

Event Details:
- Date: {{event_date}}
- Time: {{event_time}}
- Location: {{event_location}}
- Confirmation Number: {{confirmation_number}}

Thank you for registering!

Best regards,
Games & Connect Team
```

### Template 2: Admin Notification

1. Click **"Create New Template"**
2. Set Template ID: `template_admin_notification`
3. Use the template from `EMAIL_TEMPLATE_ADMIN_NOTIFICATION.md`

## Step 4: Get Public Key

1. Go to **"Account"** → **"General"**
2. Find your **Public Key**
3. Copy it - you'll need this for `VITE_EMAILJS_PUBLIC_KEY`

## Step 5: Configure Environment Variables

Create a `.env` file in your project root (copy from `.env.example`):

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_REGISTRATION_TEMPLATE=template_event_registration
VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE=template_admin_notification

# Organization Email
VITE_ORGANIZER_EMAIL=admin@yourdomain.com
VITE_ORGANIZATION_NAME=Games & Connect
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to an event page
3. Fill out and submit the registration form
4. Check both:
   - User email inbox for confirmation
   - Admin email inbox for notification

## Template Variables Reference

### User Confirmation Template Variables
- `{{to_name}}` - User's full name
- `{{to_email}}` - User's email
- `{{event_title}}` - Event name
- `{{event_date}}` - Event date
- `{{event_time}}` - Event time
- `{{event_location}}` - Event location
- `{{event_price}}` - Event price
- `{{confirmation_number}}` - Unique confirmation number
- `{{registration_date}}` - When they registered

### Admin Notification Template Variables
- `{{participant_name}}` - User's full name
- `{{participant_email}}` - User's email
- `{{participant_phone}}` - User's phone number
- `{{participant_location}}` - User's location
- `{{number_of_participants}}` - Number of participants
- `{{special_requests}}` - Any special requests
- `{{event_title}}` - Event name
- `{{event_date}}` - Event date
- `{{event_time}}` - Event time
- `{{event_location}}` - Event location
- `{{confirmation_number}}` - Unique confirmation number
- `{{status}}` - Registration status (confirmed/waitlist)
- `{{dashboard_link}}` - Link to admin dashboard

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check console for errors
   - Verify all environment variables are set
   - Ensure EmailJS service is connected properly

2. **Template not found errors**
   - Verify template IDs match exactly
   - Check that templates are published in EmailJS dashboard

3. **Gmail integration issues**
   - Re-authorize Gmail connection in EmailJS
   - Check Gmail security settings
   - Ensure 2FA is enabled on Gmail account

### Testing in Development

The system will work in development mode with proper configuration. For production:

1. Add environment variables to your hosting platform
2. Ensure the domain is added to EmailJS allowed origins
3. Test thoroughly before going live

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate your EmailJS public key if needed
- Monitor email sending quotas (EmailJS free tier has limits)

## Monitoring

- Check EmailJS dashboard for sending statistics
- Monitor email deliverability
- Set up email bounces handling if needed

## Email Delivery Tips

1. **For better deliverability:**
   - Use a professional sender email
   - Include unsubscribe links
   - Monitor spam scores

2. **For Gmail users:**
   - Add sender to contacts
   - Check spam folder during testing

3. **For high volume:**
   - Consider upgrading EmailJS plan
   - Implement rate limiting
   - Set up proper SPF/DKIM records

## Support

- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: Available through their dashboard
- Template Testing: Use EmailJS template testing feature

With this setup, you'll receive instant email notifications whenever someone registers for an event, allowing you to respond quickly and provide excellent customer service!
