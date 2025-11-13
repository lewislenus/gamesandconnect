# 📧 Email Notifications Feature

Automatic email notifications for event registrations.

## ✨ What's Included

When users register for events, the system automatically sends:

1. **Confirmation Email** → Participant
   - Event details (date, time, location, price)
   - Unique confirmation number
   - Registration date
   - Important information and reminders

2. **Admin Notification** → Organizer
   - Participant details (name, email, phone)
   - Event information
   - Payment status
   - Link to admin dashboard
   - Reply-to participant email

## 🚀 Quick Start

### Option 1: Use Without Email (Default)
The system works without email configuration:
- ✅ Registrations work normally
- ⚠️ No emails sent (graceful fallback)
- 💡 Console shows: "EmailJS not configured"

### Option 2: Enable Email Notifications (Recommended)

**3-Minute Setup:**

1. **Sign up for EmailJS** (free): https://www.emailjs.com/

2. **Create 2 templates** in EmailJS dashboard:
   - Open `email-templates-examples.html` in your browser
   - Copy the template content to EmailJS
   - Get your Service ID, Public Key, and Template IDs

3. **Add to `.env.local`:**
   ```bash
   VITE_EMAILJS_SERVICE_ID=service_abc123
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_REGISTRATION_TEMPLATE=template_xyz
   VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE=template_admin
   VITE_ORGANIZER_EMAIL=your-email@example.com
   ```

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

**That's it!** Emails will now be sent automatically. 🎉

## 📚 Documentation

- **📖 Complete Setup Guide**: `EMAILJS_SETUP_GUIDE.md`
- **📊 Implementation Details**: `EMAIL_NOTIFICATION_SUMMARY.md`
- **🎨 Template Examples**: `email-templates-examples.html` (open in browser)
- **⚙️ Email Service Code**: `src/lib/emailjs.ts`

## 🧪 Testing

1. Register for an event with a **real email address**
2. Check browser console for logs:
   ```
   ✅ Confirmation email sent successfully
   ✅ Admin notification sent successfully
   ```
3. Check your inbox (and spam folder)

## 🎯 When Emails Are Sent

### Free Tickets
```
Submit Form → Create Registration → Send Emails → Show Success
```

### Paid Tickets
```
Submit Form → Create Registration → Initiate Payment → 
User Approves → Payment Confirmed → Send Emails → Show Success
```

## 💡 Features

✅ **Auto-generated confirmation numbers** (e.g., GC123456ABCD)  
✅ **Beautiful HTML email templates**  
✅ **Participant and admin notifications**  
✅ **Email validation** (skips invalid emails)  
✅ **Graceful fallback** (works without EmailJS)  
✅ **Detailed console logging** for debugging  
✅ **Production-ready** (Netlify compatible)  

## 🔧 Configuration Variables

```bash
# Required for email notifications
VITE_EMAILJS_SERVICE_ID        # EmailJS service ID
VITE_EMAILJS_PUBLIC_KEY        # EmailJS public key
VITE_EMAILJS_REGISTRATION_TEMPLATE  # Participant email template
VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE  # Admin email template
VITE_ORGANIZER_EMAIL           # Your contact email
```

## 🆓 EmailJS Free Tier

- 200 emails/month
- 2 email templates (we use 2)
- Unlimited services
- Perfect for testing and small events

Upgrade if you need more: https://www.emailjs.com/pricing/

## 🌐 Production Deployment (Netlify)

1. Go to: Site Settings → Environment Variables
2. Add all `VITE_EMAILJS_*` variables
3. Add `VITE_ORGANIZER_EMAIL`
4. Redeploy site

Done! Emails work automatically in production.

## 📝 Email Content Preview

Open `email-templates-examples.html` in your browser to see:
- Full email designs
- Variable placeholders
- Complete template code
- Setup instructions

## 🐛 Troubleshooting

**Emails not sending?**
- Check console for error messages
- Verify EmailJS credentials are correct
- Restart dev server after adding env variables
- Check spam folder
- Verify email templates are published in EmailJS

**Console shows warnings?**
```
⚠️ Failed to send confirmation email (EmailJS may not be configured)
```
This means EmailJS is not set up yet. Registration still works!

## 📞 Support

- **EmailJS Help**: support@emailjs.com
- **Documentation**: https://www.emailjs.com/docs/
- **Issues**: Check console logs for detailed error messages

## 🎨 Customization

Edit email templates in EmailJS dashboard:
- Change colors and styling
- Modify text and layout
- Add your branding/logo
- Update sender name

Templates use HTML, so you can customize fully!

## ✅ Status

**Implementation:** ✅ Complete  
**Testing:** ✅ Ready  
**Production:** ✅ Ready (needs EmailJS setup)  
**Documentation:** ✅ Complete

---

**Next Steps:**
1. Open `email-templates-examples.html` to see templates
2. Follow `EMAILJS_SETUP_GUIDE.md` for setup
3. Test with a real email address
4. Deploy to production

**Questions?** Check the documentation files or console logs for guidance.

