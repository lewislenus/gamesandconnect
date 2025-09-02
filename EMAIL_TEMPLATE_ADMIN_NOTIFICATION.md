# EmailJS Admin Notification Template

This template is used to notify administrators when someone registers for an event.

## Template ID
`template_admin_notification`

## Template Variables

### Email Headers
- `{{to_email}}` - Admin email address
- `{{to_name}}` - Admin name (defaults to "Admin")

### Event Information
- `{{event_title}}` - Name of the event
- `{{event_date}}` - Date of the event
- `{{event_time}}` - Time of the event
- `{{event_location}}` - Location of the event
- `{{event_id}}` - Unique event identifier

### Participant Information
- `{{participant_name}}` - Full name of the registrant
- `{{participant_email}}` - Email address of the registrant
- `{{participant_phone}}` - Phone number of the registrant
- `{{participant_location}}` - Location of the registrant
- `{{number_of_participants}}` - Number of participants
- `{{special_requests}}` - Any special requests or notes

### Registration Details
- `{{confirmation_number}}` - Unique confirmation number
- `{{registration_date}}` - Date when registration was made
- `{{status}}` - Registration status (confirmed/waitlist)
- `{{notification_time}}` - When this notification was sent

### Administrative Links
- `{{dashboard_link}}` - Link to the admin dashboard
- `{{reply_to}}` - Participant's email for easy reply

## Sample Template Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>New Event Registration - {{event_title}}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🎯 New Event Registration</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Someone just registered for {{event_title}}</p>
        </div>

        <!-- Content -->
        <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            
            <!-- Event Details -->
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <h2 style="color: #495057; margin-top: 0;">📅 Event Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; width: 30%;">Event:</td>
                        <td style="padding: 8px 0;">{{event_title}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Date:</td>
                        <td style="padding: 8px 0;">{{event_date}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Time:</td>
                        <td style="padding: 8px 0;">{{event_time}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                        <td style="padding: 8px 0;">{{event_location}}</td>
                    </tr>
                </table>
            </div>

            <!-- Participant Details -->
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <h2 style="color: #495057; margin-top: 0;">👤 Participant Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; width: 30%;">Name:</td>
                        <td style="padding: 8px 0;">{{participant_name}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                        <td style="padding: 8px 0;"><a href="mailto:{{participant_email}}" style="color: #007bff;">{{participant_email}}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                        <td style="padding: 8px 0;">{{participant_phone}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                        <td style="padding: 8px 0;">{{participant_location}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Participants:</td>
                        <td style="padding: 8px 0;">{{number_of_participants}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Special Requests:</td>
                        <td style="padding: 8px 0;">{{special_requests}}</td>
                    </tr>
                </table>
            </div>

            <!-- Registration Details -->
            <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                <h2 style="color: #495057; margin-top: 0;">📋 Registration Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; width: 30%;">Confirmation #:</td>
                        <td style="padding: 8px 0; font-family: monospace; background: #f8f9fa; padding: 4px 8px; border-radius: 4px;">{{confirmation_number}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                        <td style="padding: 8px 0;">
                            <span style="background: {{status === 'confirmed' ? '#28a745' : '#ffc107'}}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; text-transform: uppercase;">{{status}}</span>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Registered:</td>
                        <td style="padding: 8px 0;">{{registration_date}}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Notification:</td>
                        <td style="padding: 8px 0;">{{notification_time}}</td>
                    </tr>
                </table>
            </div>

            <!-- Action Buttons -->
            <div style="text-align: center; margin: 20px 0;">
                <a href="{{dashboard_link}}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-right: 10px;">View in Dashboard</a>
                <a href="mailto:{{participant_email}}" style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reply to Participant</a>
            </div>

        </div>

        <!-- Footer -->
        <div style="background: #495057; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">Games & Connect Admin System</p>
            <p style="margin: 5px 0 0 0; opacity: 0.8;">This is an automated notification</p>
        </div>

    </div>
</body>
</html>
```

## Setup Instructions

1. Log in to your EmailJS dashboard
2. Create a new template with ID: `template_admin_notification`
3. Copy the HTML template above into the template editor
4. Set up the template variables as listed above
5. Test the template with sample data
6. Add the template ID to your environment variables:
   ```
   VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE=template_admin_notification
   ```

## Environment Variables Required

```bash
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE=template_admin_notification
VITE_ORGANIZER_EMAIL=admin@gamesandconnect.com
```

## Testing

The admin notification will be sent automatically when:
- Someone successfully registers for an event
- Someone is added to a waitlist
- The EmailJS service is properly configured

You can test by:
1. Making a test registration on the frontend
2. Checking the admin email inbox
3. Reviewing browser console for any errors
