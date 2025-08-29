# Supabase RLS (Row Level Security) Fix Guide

## 🔍 **Problem: Events not visible in API**

Your Supabase events table is likely blocked by RLS policies that prevent anonymous access.

## 🛠️ **Solution Steps:**

### 1. **Check Current Status**
- Go to your Events page: `http://localhost:8081/events`
- Look at the "Database Status" card
- Click "Check RLS Policies" to see what's blocking access

### 2. **Fix RLS Policies in Supabase Dashboard**

#### **Step 1: Access Supabase Dashboard**
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: `fxqzihpsasuerpfjzwfr`
3. Navigate to **Authentication > Policies**

#### **Step 2: Enable RLS for Events Table**
1. Go to **Table Editor**
2. Select the `events` table
3. Click **"Enable RLS"** if not already enabled

#### **Step 3: Create Policy for Anonymous Read Access**
1. In the `events` table, click **"New Policy"**
2. Choose **"Create a policy from scratch"**
3. Configure as follows:

```sql
-- Policy Name: Allow anonymous read access
-- Target roles: anon
-- Using expression: true
-- Operation: SELECT
```

**Or use this SQL directly:**

```sql
-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous read access
CREATE POLICY "Allow anonymous read access" ON events
FOR SELECT USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON events
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update
CREATE POLICY "Allow authenticated update" ON events
FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON events
FOR DELETE USING (auth.role() = 'authenticated');
```

### 3. **Alternative: Disable RLS (Quick Fix)**

If you want to disable RLS temporarily for testing:

```sql
-- Disable RLS on events table (NOT recommended for production)
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
```

### 4. **Check Table Structure**

Make sure your `events` table has the correct columns:

```sql
-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'events';
```

**Expected columns:**
- `id` (bigint, primary key, auto-increment)
- `title` (text, not null)
- `date` (date, not null)
- `time_range` (text, not null)
- `location` (text, not null)
- `description` (text, not null)
- `image_url` (text, nullable)
- `price` (text, nullable)
- `capacity` (integer, not null)
- `created_at` (timestamp with time zone, nullable, default now())
- `additional_info` (jsonb, nullable)
- `gallery` (jsonb, nullable)
- `agenda` (jsonb, nullable)
- `requirements` (jsonb, nullable)
- `includes` (jsonb, nullable)
- `category` (text, nullable)
- `organizer` (text, nullable)

### 5. **Test the Fix**

1. **Refresh your Events page**
2. **Click "Test Connection"** in the Database Status card
3. **Click "Check RLS Policies"** to verify access
4. **Try "Upload Sample"** to add test events

### 6. **Common Error Messages & Solutions**

| Error | Solution |
|-------|----------|
| `new row violates row-level security policy` | Create INSERT policy |
| `permission denied for table events` | Enable RLS and create SELECT policy |
| `relation "events" does not exist` | Create the events table |
| `column "column_name" does not exist` | Add missing column to table |

### 7. **Production Considerations**

For production, use more restrictive policies:

```sql
-- More secure policy for production
CREATE POLICY "Allow public read access to published events" ON events
FOR SELECT USING (status = 'published' OR status = 'open');

-- Only allow authenticated users to create events
CREATE POLICY "Allow authenticated users to create events" ON events
FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

### 8. **Debugging Commands**

Run these in your browser console to debug:

```javascript
// Check connection
testSupabaseConnection()

// Check RLS policies
checkRLSPolicies()

// Get table structure
getTableStructure()

// Upload sample events
uploadSampleEvents()
```

## 🎯 **Quick Fix Summary:**

1. **Go to Supabase Dashboard** → Your Project → Table Editor → events table
2. **Enable RLS** if not enabled
3. **Create Policy**: Name="Allow anonymous read", Target="anon", Operation="SELECT", Expression="true"
4. **Test** on your Events page

This should resolve the issue and allow your API to fetch events from Supabase!
