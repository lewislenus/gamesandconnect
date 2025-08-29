-- Fix the registrations table structure
-- Run this in your Supabase SQL Editor

-- Check current table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'registrations' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add user_id column if it doesn't exist
ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Check if we have any existing registrations
SELECT COUNT(*) as total_registrations FROM public.registrations;

-- If no registrations exist, let's add some sample data
-- First, let's check what events we have
SELECT id, title, date FROM public.events LIMIT 5;

-- Insert sample registrations (only if table is empty)
INSERT INTO public.registrations (
    event_id,
    user_id,
    name,
    email,
    phone,
    status,
    created_at
) 
SELECT 
    e.id,
    gen_random_uuid(),
    people.name,
    people.email,
    people.phone,
    people.status,
    now() - (people.days_ago || ' days')::interval
FROM public.events e
CROSS JOIN (
    VALUES 
        ('John Smith', 'john.smith@email.com', '+1-555-0123', 'confirmed', '2'),
        ('Sarah Johnson', 'sarah.johnson@email.com', '+1-555-0125', 'pending', '1'),
        ('Mike Davis', 'mike.davis@email.com', '+1-555-0127', 'confirmed', '3'),
        ('Emily Wilson', 'emily.wilson@email.com', '+1-555-0129', 'confirmed', '0'),
        ('David Brown', 'david.brown@email.com', '+1-555-0131', 'pending', '0')
) AS people(name, email, phone, status, days_ago)
WHERE NOT EXISTS (SELECT 1 FROM public.registrations)
LIMIT 10;

-- Verify the data
SELECT 
    r.id,
    r.name,
    r.email,
    r.status,
    r.created_at,
    e.title as event_title
FROM public.registrations r
LEFT JOIN public.events e ON r.event_id = e.id
ORDER BY r.created_at DESC
LIMIT 10;
