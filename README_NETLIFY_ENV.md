# Netlify Environment Variables - Important Information

## About VITE_ Prefixed Variables

The environment variables starting with `VITE_` that Netlify flagged are **NOT secrets** and are **intentionally public**.

### Why VITE_ Variables Are Public

Vite (the build tool we use) requires that **all client-side environment variables** start with `VITE_`. These variables are:

1. **Embedded into the JavaScript bundle** during build
2. **Visible in the browser** (anyone can see them in DevTools)
3. **Designed to be public** - this is how Vite works by design

### These Are NOT Sensitive

The flagged variables are configuration values, not secrets:

- `VITE_CLOUDINARY_CLOUD_NAME` - Your public Cloudinary account name (visible in all image URLs)
- `VITE_CLOUDINARY_UPLOAD_PRESET` - An **unsigned** preset (public by design)
- `VITE_EMAILJS_PUBLIC_KEY` - Literally called "PUBLIC" key by EmailJS
- `VITE_ORGANIZER_EMAIL` - Your public contact email
- `VITE_ORGANIZATION_NAME` - Your public organization name

### Real Secrets (Not in Frontend)

Actual secrets that should NEVER be in frontend code:
- ❌ API secret keys
- ❌ Database passwords
- ❌ Private authentication tokens
- ❌ Payment gateway secrets

These are kept in:
- Supabase Edge Functions (server-side)
- Backend environment variables
- Supabase dashboard secrets

## How to Fix the Netlify Build Error

### Option 1: Disable the Check (Recommended)

In your Netlify dashboard:

1. Go to **Site settings** → **Build & deploy** → **Environment**
2. Scroll to **Sensitive variable policy**
3. Click **Edit settings**
4. Set to **Ignore warnings about exposed secrets in build logs**

### Option 2: Configure in netlify.toml

Already done in `netlify.toml` - added comments explaining these are intentionally public.

### Option 3: Add to .gitignore and Set in Netlify UI

If Netlify still complains:

1. Remove `.env` from git:
   ```bash
   git rm --cached .env
   ```

2. Add all VITE_ variables directly in Netlify dashboard:
   - Site settings → Environment variables
   - Add each variable there

3. Keep `.env.example` in git for documentation

## Documentation

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html#env-files)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Cloudinary Unsigned Uploads](https://cloudinary.com/documentation/upload_images#unsigned_upload)

## Summary

✅ **This is a false positive.** VITE_ variables are meant to be public.

✅ **Your actual secrets are safe** - they're in Supabase server-side functions.

✅ **You can safely ignore this warning** or disable it in Netlify settings.

