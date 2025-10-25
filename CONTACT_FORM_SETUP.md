# Contact Form Setup Guide

## Overview
The Contact Us page has been added to your Games & Connect website. This guide will help you configure the EmailJS template for the contact form.

## Features
- Beautiful contact form with validation
- Real-time email notifications
- Contact information display
- Success confirmation
- Mobile responsive design
- Integration with existing EmailJS setup

## EmailJS Template Setup

### 1. Create a New Template in EmailJS

1. Go to your [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Navigate to **Email Templates**
3. Click **Create New Template**
4. Use template ID: `template_contact_form` (or update in your .env)

### 2. Template Configuration

**Template Name:** Contact Form Submission

**Subject Line:**
```
New Contact Form Message: {{subject}}
```

**Email Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
        }
        .header {
            background: linear-gradient(135deg, #f97316, #ef4444);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .field {
            margin-bottom: 15px;
            padding: 10px;
            background: #f3f4f6;
            border-radius: 4px;
        }
        .label {
            font-weight: bold;
            color: #f97316;
            display: block;
            margin-bottom: 5px;
        }
        .message-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 New Contact Form Submission</h1>
        </div>
        <div class="content">
            <p>You've received a new message from your Games & Connect contact form:</p>
            
            <div class="field">
                <span class="label">From:</span>
                {{from_name}}
            </div>
            
            <div class="field">
                <span class="label">Email:</span>
                <a href="mailto:{{from_email}}">{{from_email}}</a>
            </div>
            
            <div class="field">
                <span class="label">Phone:</span>
                {{phone}}
            </div>
            
            <div class="field">
                <span class="label">Subject:</span>
                {{subject}}
            </div>
            
            <div class="message-box">
                <span class="label">Message:</span>
                <p style="white-space: pre-wrap; margin: 10px 0 0 0;">{{message}}</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-radius: 4px;">
                <p style="margin: 0;"><strong>Quick Actions:</strong></p>
                <p style="margin: 10px 0 0 0;">
                    <a href="mailto:{{from_email}}?subject=Re: {{subject}}" 
                       style="color: #0284c7; text-decoration: none;">
                        📧 Reply to this message
                    </a>
                </p>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated message from your Games & Connect website.</p>
            <p>Sent via EmailJS • Games & Connect Contact Form</p>
        </div>
    </div>
</body>
</html>
```

### 3. Template Variables

Make sure these variables are configured in your template:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email (also set as reply-to)
- `{{phone}}` - Sender's phone (optional)
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{to_email}}` - Your organization email
- `{{to_name}}` - Your organization name

### 4. Environment Variables

Add this to your Netlify environment variables:

```bash
VITE_EMAILJS_CONTACT_TEMPLATE=template_contact_form
```

Or if you named your template differently, use that name instead.

### 5. Test the Contact Form

1. Navigate to `/contact` on your website
2. Fill out and submit the form
3. Check your email for the notification
4. Verify the reply-to address works correctly

## Contact Page Features

### Main Features:
- ✅ Contact form with validation
- ✅ Email, phone, and location information cards
- ✅ Quick help links to Events, Registrations, and Community
- ✅ Success confirmation with animation
- ✅ Mobile-responsive design
- ✅ SEO optimized

### Form Fields:
- **Name** (required)
- **Email** (required)
- **Phone** (optional)
- **Subject** (required)
- **Message** (required)

## Navigation

The Contact page is now accessible from:
- Main navigation menu (desktop & mobile)
- Direct URL: `/contact`

## Troubleshooting

### Form Not Sending
1. Check that `VITE_EMAILJS_CONTACT_TEMPLATE` is set in Netlify
2. Verify the template ID matches in EmailJS dashboard
3. Check browser console for error messages
4. Ensure EmailJS public key is still valid

### Emails Not Receiving
1. Check EmailJS quota (free plan: 200 emails/month)
2. Verify `VITE_ORGANIZER_EMAIL` is correct
3. Check spam/junk folder
4. Review EmailJS dashboard logs

### Styling Issues
The Contact page uses:
- Tailwind CSS for styling
- Shadcn/ui components
- Lucide React icons
- Gradient backgrounds matching your theme

## Future Enhancements

Consider adding:
- ReCAPTCHA for spam protection
- File attachment support
- Live chat integration
- Auto-responder confirmation email to sender
- Contact form analytics

## Support

If you need help with:
- EmailJS template configuration
- Custom styling
- Additional features
- Integration issues

Contact your development team or refer to [EmailJS Documentation](https://www.emailjs.com/docs/).

