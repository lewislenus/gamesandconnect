# EmailJS Email Templates

This document contains the HTML templates for EmailJS email notifications.

## Registration Confirmation Template

Create a template in your EmailJS dashboard with the following content:

### Template Name: `template_event_registration`

### Subject: 
```
✅ Registration Confirmed - {{event_title}}
```

### HTML Content:
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f8fafc;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .event-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f97316;
        }
        .confirmation-box {
            background: #dcfce7;
            border: 2px solid #16a34a;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #f97316;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Registration Confirmed!</h1>
        <p>Welcome to Games & Connect Community</p>
    </div>
    
    <div class="content">
        <h2>Hi {{to_name}},</h2>
        
        <p>Great news! Your registration for <strong>{{event_title}}</strong> has been confirmed.</p>
        
        <div class="confirmation-box">
            <h3>Confirmation Number</h3>
            <h2 style="color: #16a34a; margin: 5px 0;">{{confirmation_number}}</h2>
            <p><em>Please save this number for your records</em></p>
        </div>
        
        <div class="event-details">
            <h3>📅 Event Details</h3>
            <p><strong>Event:</strong> {{event_title}}</p>
            <p><strong>Date:</strong> {{event_date}}</p>
            <p><strong>Time:</strong> {{event_time}}</p>
            <p><strong>Location:</strong> {{event_location}}</p>
            <p><strong>Price:</strong> {{event_price}}</p>
            <p><strong>Registration Date:</strong> {{registration_date}}</p>
            
            {{#if event_description}}
            <h4>About This Event</h4>
            <p>{{event_description}}</p>
            {{/if}}
            
            {{#if event_requirements}}
            <h4>What to Bring/Requirements</h4>
            <p>{{event_requirements}}</p>
            {{/if}}
            
            {{#if event_includes}}
            <h4>What's Included</h4>
            <p>{{event_includes}}</p>
            {{/if}}
        </div>
        
        <h3>🎯 What's Next?</h3>
        <ul>
            <li>Mark your calendar for {{event_date}} at {{event_time}}</li>
            <li>Arrive 15 minutes early for check-in</li>
            <li>Bring a valid ID and your confirmation number</li>
            <li>Check your email for any event updates</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="button">View Event Details</a>
        </div>
        
        <h3>📞 Need Help?</h3>
        <p>If you have any questions or need to make changes to your registration, please contact us:</p>
        <ul>
            <li>Email: {{organizer_email}}</li>
            <li>Reply to this email</li>
            <li>Visit our community page for FAQs</li>
        </ul>
        
        <p>We're excited to see you at the event!</p>
        
        <p>Best regards,<br>
        <strong>Games & Connect Team</strong></p>
    </div>
    
    <div class="footer">
        <p>This email was sent to {{to_email}}</p>
        <p>© 2025 Games & Connect. All rights reserved.</p>
        <p>Follow us on social media for updates and new events!</p>
    </div>
</body>
</html>
```

## Event Reminder Template

### Template Name: `template_event_reminder`

### Subject:
```
🔔 Reminder: {{event_title}} is Tomorrow!
```

### HTML Content:
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 8px;
        }
        .content {
            padding: 30px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>⏰ Event Reminder</h1>
        <p>Don't forget about your upcoming event!</p>
    </div>
    
    <div class="content">
        <h2>Hi {{to_name}},</h2>
        <p>{{reminder_message}}</p>
        
        <h3>Event Details:</h3>
        <ul>
            <li><strong>Event:</strong> {{event_title}}</li>
            <li><strong>Date:</strong> {{event_date}}</li>
            <li><strong>Time:</strong> {{event_time}}</li>
            <li><strong>Location:</strong> {{event_location}}</li>
        </ul>
        
        <p>See you there!</p>
        <p><strong>Games & Connect Team</strong></p>
    </div>
</body>
</html>
```

## Setup Instructions

1. Sign up for EmailJS at https://www.emailjs.com/
2. Create a new service (Gmail, Outlook, etc.)
3. Create the templates above in your EmailJS dashboard
4. Update the configuration in `src/lib/emailjs.ts` with your:
   - Service ID
   - Template IDs
   - Public Key
5. Test the email functionality

## Template Variables

The following variables are available in the templates:

- `{{to_name}}` - Recipient's name
- `{{to_email}}` - Recipient's email
- `{{event_title}}` - Event name
- `{{event_date}}` - Event date
- `{{event_time}}` - Event time
- `{{event_location}}` - Event location
- `{{event_price}}` - Event price
- `{{registration_date}}` - Date of registration
- `{{confirmation_number}}` - Unique confirmation number
- `{{event_description}}` - Event description
- `{{event_requirements}}` - Event requirements
- `{{event_includes}}` - What's included
- `{{organizer_email}}` - Contact email
