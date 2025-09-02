# Netlify Deployment Guide for Games & Connect

## 🚀 Quick Deployment Steps

### 1. Deploy to Netlify

**Option A: Drag & Drop (Fastest)**
1. Go to [netlify.com](https://netlify.com) and log in
2. Drag the entire `dist` folder from your project to the Netlify dashboard
3. Your site will be deployed instantly with a random URL

**Option B: Git Integration (Recommended)**
1. Go to [netlify.com](https://netlify.com) and log in
2. Click "New site from Git"
3. Connect your GitHub account
4. Select the `lewislenus/Games-connect-august` repository
5. Netlify will auto-detect the settings from `netlify.toml`

### 2. Configure Environment Variables

In your Netlify dashboard, go to **Site settings → Environment variables** and add:

```
VITE_CLOUDINARY_CLOUD_NAME=drkjnrvtu
VITE_CLOUDINARY_UPLOAD_PRESET=website-upload
VITE_CLOUDINARY_FOLDER=flyers
VITE_CLOUDINARY_GALLERY_UPLOAD_PRESET=website-upload
VITE_CLOUDINARY_GALLERY_FOLDER=gallery
VITE_EMAILJS_SERVICE_ID=service_d4amp99
VITE_EMAILJS_PUBLIC_KEY=U1c0I6JdyzA-NInXj
VITE_EMAILJS_REGISTRATION_TEMPLATE=template_event_registration
VITE_EMAILJS_ADMIN_NOTIFICATION_TEMPLATE=template_a6r325j
VITE_ORGANIZER_EMAIL=admin@gamesandconnect.com
VITE_ORGANIZATION_NAME=Games & Connect
```

### 3. Database Configuration (Supabase)

**Add these additional environment variables for your Supabase database:**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

*Get these from your Supabase project dashboard → Settings → API*

### 4. Custom Domain (Optional)

1. In Netlify dashboard → **Domain settings**
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL will be automatically configured

## 📁 Build Output

- **Total bundle size**: ~1MB (276KB gzipped)
- **Static files**: Included in `dist/downloads/` for event flyers
- **Routing**: SPA routing configured with `_redirects`

## ⚡ Performance Optimizations Included

- Asset caching (1 year for static assets)
- Gzip compression
- Security headers
- Proper redirects for React Router

## 🔧 Build Settings (Auto-configured)

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

## 🎯 Key Features Ready for Production

✅ **Event Management System**
✅ **Admin Dashboard** 
✅ **Email Notifications** (EmailJS)
✅ **Image Uploads** (Cloudinary)
✅ **Database Integration** (Supabase)
✅ **Schedule Display** 
✅ **Social Media Sharing**
✅ **Responsive Design**

## 🚨 Important Notes

1. **Environment Variables**: Must be configured in Netlify for the app to work
2. **Database**: Ensure Supabase project is properly configured
3. **Email Service**: EmailJS templates should be set up and tested
4. **File Uploads**: Cloudinary should be configured for image uploads

## 📱 Mobile Ready

The site is fully responsive and optimized for mobile devices.

---

**Need help?** Check the Netlify deployment logs or contact support if you encounter any issues.
