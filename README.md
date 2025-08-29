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

## Project info

**URL**: https://lovable.dev/projects/f3cd09ae-3df3-473c-87b1-b24e7ce0a1c5

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f3cd09ae-3df3-473c-87b1-b24e7ce0a1c5) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

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

Simply open [Lovable](https://lovable.dev/projects/f3cd09ae-3df3-473c-87b1-b24e7ce0a1c5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
