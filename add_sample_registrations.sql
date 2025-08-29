-- Add sample registration data to test the admin dashboard
-- First, let's get some event IDs
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
) VALUES
-- Registrations for different events (using dummy UUIDs - these will need to be updated with actual event IDs)
(
    (SELECT id FROM public.events LIMIT 1),
    gen_random_uuid(),
    'John Smith',
    'john.smith@email.com',
    '+1-555-0123',
    'confirmed',
    now() - interval '2 days',
    'Jane Smith +1-555-0124',
    'No dietary restrictions'
),
(
    (SELECT id FROM public.events LIMIT 1),
    gen_random_uuid(),
    'Sarah Johnson',
    'sarah.johnson@email.com',
    '+1-555-0125',
    'pending',
    now() - interval '1 day',
    'Mike Johnson +1-555-0126',
    'Vegetarian'
),
(
    (SELECT id FROM public.events OFFSET 1 LIMIT 1),
    gen_random_uuid(),
    'Mike Davis',
    'mike.davis@email.com',
    '+1-555-0127',
    'confirmed',
    now() - interval '3 days',
    'Lisa Davis +1-555-0128',
    'Gluten-free'
),
(
    (SELECT id FROM public.events OFFSET 1 LIMIT 1),
    gen_random_uuid(),
    'Emily Wilson',
    'emily.wilson@email.com',
    '+1-555-0129',
    'confirmed',
    now() - interval '1 hour',
    'Tom Wilson +1-555-0130',
    'None'
),
(
    (SELECT id FROM public.events OFFSET 2 LIMIT 1),
    gen_random_uuid(),
    'David Brown',
    'david.brown@email.com',
    '+1-555-0131',
    'pending',
    now() - interval '30 minutes',
    'Mary Brown +1-555-0132',
    'Vegan'
),
(
    (SELECT id FROM public.events OFFSET 2 LIMIT 1),
    gen_random_uuid(),
    'Lisa Anderson',
    'lisa.anderson@email.com',
    '+1-555-0133',
    'cancelled',
    now() - interval '4 days',
    'John Anderson +1-555-0134',
    'Lactose intolerant'
),
(
    (SELECT id FROM public.events LIMIT 1),
    gen_random_uuid(),
    'James Miller',
    'james.miller@email.com',
    '+1-555-0135',
    'confirmed',
    now() - interval '6 hours',
    'Susan Miller +1-555-0136',
    'No restrictions'
),
(
    (SELECT id FROM public.events OFFSET 3 LIMIT 1),
    gen_random_uuid(),
    'Maria Garcia',
    'maria.garcia@email.com',
    '+1-555-0137',
    'pending',
    now() - interval '2 hours',
    'Carlos Garcia +1-555-0138',
    'Pescatarian'
);

-- Add some additional recent registrations for today's stats
INSERT INTO public.registrations (
    event_id,
    user_id,
    name,
    email,
    phone,
    status,
    created_at,
    emergency_contact
) VALUES
(
    (SELECT id FROM public.events LIMIT 1),
    gen_random_uuid(),
    'Alex Thompson',
    'alex.thompson@email.com',
    '+1-555-0139',
    'pending',
    now(),
    'Kelly Thompson +1-555-0140'
),
(
    (SELECT id FROM public.events OFFSET 1 LIMIT 1),
    gen_random_uuid(),
    'Rachel Lee',
    'rachel.lee@email.com',
    '+1-555-0141',
    'confirmed',
    now() - interval '15 minutes',
    'David Lee +1-555-0142'
);
