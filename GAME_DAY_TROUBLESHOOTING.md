# Game Day Upload - Troubleshooting Guide

## 🐛 Common Issues & Solutions

### Issue: 500 Error on Upload

The 500 error can be caused by several things. Let's diagnose:

#### Step 1: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Try uploading again
4. Look for detailed error messages

You should now see detailed logs like:
```
Starting upload process... { fileName, fileSize, fileType }
Cloudinary upload result: { success, url, error }
Database insert error: { message, code }
```

---

### Most Common Causes:

#### 1. **Database Table Not Created** ✅ MOST LIKELY

**Symptoms:**
- Error contains "relation does not exist"
- Console shows: `Database error: relation "public.game_day_gallery" does not exist`

**Solution:**
Run the SQL migration from `GAME_DAY_MIGRATION_FIXED.sql` in Supabase Dashboard → SQL Editor

```bash
# Check if table exists in Supabase Dashboard → SQL Editor:
SELECT * FROM public.game_day_gallery LIMIT 1;
```

If error, run the full migration.

---

#### 2. **Cloudinary Not Configured**

**Symptoms:**
- Error: "Cloudinary not configured"
- Console shows: `All presets failed`

**Solution:**
Check your `.env` file has:
```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

**Test Cloudinary:**
1. Go to `/admin` (Gallery management)
2. Try uploading there first
3. If that works, Cloudinary is fine

---

#### 3. **RLS Policy Blocking Insert**

**Symptoms:**
- Cloudinary upload succeeds
- Database insert fails with "permission denied" or "policy violation"
- Console shows: `Database error: new row violates row-level security policy`

**Solution:**

**Check if you're in admin_users table:**
```sql
-- Run in Supabase SQL Editor
SELECT * FROM public.admin_users WHERE user_id = auth.uid();
```

**If empty, add yourself:**
```sql
-- Get your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- Insert into admin_users (replace YOUR_USER_ID)
INSERT INTO public.admin_users (user_id, is_active)
VALUES ('YOUR_USER_ID', true)
ON CONFLICT (user_id) DO UPDATE SET is_active = true;
```

---

#### 4. **Session Expired / Not Logged In**

**Symptoms:**
- Random 500 errors
- Auth-related errors in console

**Solution:**
1. Logout from `/admin`
2. Clear browser cache
3. Login again
4. Try upload

---

## 🔍 Diagnostic Steps

### Step 1: Verify Database Setup

Run in Supabase SQL Editor:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'game_day_gallery'
);

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'game_day_gallery';

-- Check policies
SELECT * FROM pg_policies 
WHERE tablename = 'game_day_gallery';

-- Check if you're an admin
SELECT 
  au.id,
  au.user_id,
  au.is_active,
  u.email
FROM public.admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.user_id = auth.uid();
```

### Step 2: Test Cloudinary

```javascript
// Open browser console and run:
console.log('Cloud Name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
console.log('Upload Preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
```

Should NOT show `undefined`.

### Step 3: Check Network Tab

1. Open DevTools → Network tab
2. Try upload
3. Look for failed requests (red)
4. Click on failed request
5. Check Response tab for error details

---

## 🚀 Quick Fixes

### Fix 1: Restart Dev Server

Sometimes env vars don't load:
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

### Fix 2: Clear Supabase Cache

```javascript
// Run in browser console:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Fix 3: Re-run Migration

If table exists but has issues:
```sql
-- Drop and recreate (WARNING: deletes data!)
DROP TABLE IF EXISTS public.game_day_gallery CASCADE;

-- Then run GAME_DAY_MIGRATION_FIXED.sql again
```

---

## 📋 Checklist

Before uploading, verify:

- [ ] Migration SQL has been run in Supabase
- [ ] Table `game_day_gallery` exists
- [ ] Table `admin_users` exists
- [ ] You are in `admin_users` table
- [ ] Cloudinary env vars are set
- [ ] Dev server has been restarted after env changes
- [ ] You are logged in as admin
- [ ] Browser console shows no errors on page load

---

## 💡 Still Not Working?

### Get Detailed Logs

1. Open browser DevTools
2. Go to Console tab
3. Try upload
4. Copy all red error messages
5. Check what step failed:
   - **"Starting upload"** → Issue before Cloudinary
   - **"Cloudinary upload"** → Cloudinary configuration
   - **"Saving to database"** → RLS/table issues
   - **"Database insert"** → Specific database error

### Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `42P01` | Table doesn't exist | Run migration SQL |
| `42501` | Permission denied | Check RLS policies / admin_users |
| `23505` | Unique violation | Image already uploaded |
| `23502` | NOT NULL violation | Check insert data |
| Network error | Can't reach Cloudinary | Check internet / Cloudinary |

---

## 🎯 Success Indicators

When working correctly, you'll see in console:

```
✅ Starting upload process... { fileName, fileSize, fileType }
✅ Cloudinary upload result: { success: true, url: "https://..." }
✅ Inserting into database: { url, title, description, is_active }
✅ Database insert successful: [{ id, url, title, ... }]
```

And the toast notification: **"Upload successful! 🎉"**

---

**Last Updated:** November 11, 2025

