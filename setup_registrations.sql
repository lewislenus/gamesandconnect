-- Check if registrations table exists and add sample data
-- Run this in your Supabase SQL editor

-- First, check if the table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'registrations'
);

-- Check current registrations
SELECT COUNT(*) as total_registrations FROM public.registrations;

-- Check events for reference
SELECT id, title, date, location FROM public.events LIMIT 5;

-- Add sample registration data if the table is empty
INSERT INTO public.registrations (
    event_id,
    user_id,
    name,
    email,
    phone,
    status,
    created_at,
    emergency_contact,
    dietary_requirements
) 
SELECT 
    e.id,
    gen_random_uuid(),
    'John Smith',
    'john.smith@email.com',
    '+1-555-0123',
    'confirmed',
    now() - interval '2 days',
    'Jane Smith +1-555-0124',
    'No dietary restrictions'
FROM public.events e 
LIMIT 1
ON CONFLICT (event_id, email) DO NOTHING;

INSERT INTO public.registrations (
    event_id,
    user_id,
    name,
    email,
    phone,
    status,
    created_at,
    emergency_contact,
    dietary_requirements
) 
SELECT 
    e.id,
    gen_random_uuid(),
    'Sarah Johnson',
    'sarah.johnson@email.com',
    '+1-555-0125',
    'pending',
    now() - interval '1 day',
    'Mike Johnson +1-555-0126',
    'Vegetarian'
FROM public.events e 
LIMIT 1
ON CONFLICT (event_id, email) DO NOTHING;

INSERT INTO public.registrations (
    event_id,
    user_id,
    name,
    email,
    phone,
    status,
    created_at,
    emergency_contact,
    dietary_requirements
) 
SELECT 
    e.id,
    gen_random_uuid(),
    'Mike Davis',
    'mike.davis@email.com',
    '+1-555-0127',
    'confirmed',
    now() - interval '3 hours',
    'Lisa Davis +1-555-0128',
    'Gluten-free'
FROM public.events e 
OFFSET 1 LIMIT 1
ON CONFLICT (event_id, email) DO NOTHING;

INSERT INTO public.registrations (
    event_id,
    user_id,
    name,
    email,
    phone,
    status,
    created_at,
    emergency_contact,
    dietary_requirements
) 
SELECT 
    e.id,
    gen_random_uuid(),
    'Emily Wilson',
    'emily.wilson@email.com',
    '+1-555-0129',
    'confirmed',
    now() - interval '1 hour',
    'Tom Wilson +1-555-0130',
    'None'
FROM public.events e 
OFFSET 1 LIMIT 1
ON CONFLICT (event_id, email) DO NOTHING;

INSERT INTO public.registrations (
    event_id,
    user_id,
    name,
    email,
    phone,
    status,
    created_at,
    emergency_contact,
    dietary_requirements
) 
SELECT 
    e.id,
    gen_random_uuid(),
    'David Brown',
    'david.brown@email.com',
    '+1-555-0131',
    'pending',
    now() - interval '30 minutes',
    'Mary Brown +1-555-0132',
    'Vegan'
FROM public.events e 
OFFSET 2 LIMIT 1
ON CONFLICT (event_id, email) DO NOTHING;

-- Check the results
SELECT 
    r.id,
    r.name,
    r.email,
    r.status,
    r.created_at,
    e.title as event_title,
    e.date as event_date
FROM public.registrations r
LEFT JOIN public.events e ON r.event_id = e.id
ORDER BY r.created_at DESC
LIMIT 10;
