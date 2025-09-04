# Games and Connect

## About

**Games and Connect** is the ultimate gaming community platform for Ghana. Connect with fellow gamers, participate in exciting events, join trivia nights, and build lasting friendships in the gaming community.

## Features

- 🎮 **Gaming Events**: Join tournaments, LAN parties, and gaming meetups
- 🧠 **Trivia Friday**: Weekly trivia sessions with prizes and fun challenges  
- 👥 **Community**: Connect with like-minded gamers across Ghana
- 📸 **Gallery**: Share and explore gaming moments and event photos
- 🏆 **Competitions**: Participate in various gaming competitions and win prizes
- 📧 **Email Notifications**: Automatic confirmation emails for event registrations
- 🎫 **Event Registration**: Streamlined registration process with confirmation numbers
- 💳 **Payment Integration**: MTN Mobile Money payment information included

## How to set up the project locally

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd games-and-connect

# Step 3: Install the necessary dependencies
npm i

# Step 4: Start the development server with auto-reloading and an instant preview
npm run dev
```

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Database & Authentication)
- EmailJS (Email Notifications)
- Framer Motion (Animations)

## Email Notification System

This project includes a comprehensive email notification system for event registrations using EmailJS.

### Features
- ✅ Automatic confirmation emails after registration
- ✅ Professional HTML email templates
- ✅ Unique confirmation numbers
- ✅ Event details and payment information
- ✅ Environment-based configuration
- ✅ Error handling and validation

### Setup Instructions
1. See `EMAILJS_SETUP.md` for detailed setup instructions
2. Copy `.env.example` to `.env.local` and configure EmailJS credentials
3. Create email templates in your EmailJS dashboard using `EMAIL_TEMPLATES.md`
4. Test the system using the EmailTestPanel component

### Files Added
- `src/lib/emailjs.ts` - EmailJS service implementation
- `src/components/EmailTestPanel.tsx` - Testing and configuration panel
- `EMAILJS_SETUP.md` - Complete setup guide
- `EMAIL_TEMPLATES.md` - HTML email templates
- Updated `.env.example` with EmailJS configuration

## How can I deploy this project?

This project can be deployed to various platforms:

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard
4. See `NETLIFY_DEPLOYMENT.md` for detailed instructions

### Other Platforms
- **Vercel**: Connect your GitHub repository and deploy automatically
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **Firebase Hosting**: Use Firebase CLI to deploy the built project

## Custom Domain Setup

You can connect a custom domain to your deployed project through your hosting provider's domain settings.

## Environment Variables (Cloudinary / Email)

Copy `.env.example` to `.env` (or `.env.local`) and fill in:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_general_unsigned_preset   # used for event flyers
VITE_CLOUDINARY_GALLERY_UPLOAD_PRESET=your_gallery_unsigned_preset  # optional override just for gallery (falls back to general preset)
VITE_CLOUDINARY_FOLDER=flyers

# EmailJS
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=template_event_registration
VITE_EMAILJS_PUBLIC_KEY=...
```

Gallery uploader will attempt these presets (in order):
1. `VITE_CLOUDINARY_GALLERY_UPLOAD_PRESET` (if set)
2. `VITE_CLOUDINARY_UPLOAD_PRESET`
3. `website-upload`, `gallery-upload`, `ml_default`, `unsigned_preset`, `unsigned`

At least one unsigned preset must exist in your Cloudinary dashboard and allow the resource type(s) you upload (image / video). Ensure the preset allows the folder `gallery/` (or leave folder blank for all) and unsigned uploads.
