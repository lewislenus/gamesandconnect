-- Replace existing events with CSV data
-- This migration clears existing events and inserts the real event data from CSV

-- First, clear existing events data
-- Using TRUNCATE to avoid trigger issues and for better performance
TRUNCATE TABLE public.registration_logs CASCADE;
TRUNCATE TABLE public.event_feedback CASCADE;
TRUNCATE TABLE public.waitlist CASCADE;
TRUNCATE TABLE public.registrations CASCADE;
TRUNCATE TABLE public.ticket_templates CASCADE;
TRUNCATE TABLE public.events CASCADE;

-- Add new columns if they don't exist
DO $$ 
BEGIN
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'image_url') THEN
        ALTER TABLE public.events ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add time_range column if it doesn't exist  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'time_range') THEN
        ALTER TABLE public.events ADD COLUMN time_range TEXT;
    END IF;
    
    -- Add capacity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'capacity') THEN
        ALTER TABLE public.events ADD COLUMN capacity INTEGER;
    END IF;
    
    -- Add additional_info column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'additional_info') THEN
        ALTER TABLE public.events ADD COLUMN additional_info JSONB;
    END IF;
    
    -- Add gallery column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'gallery') THEN
        ALTER TABLE public.events ADD COLUMN gallery JSONB;
    END IF;
END $$;

-- Insert events from CSV data
INSERT INTO public.events (
    title,
    description,
    long_description,
    date,
    time,
    time_range,
    location,
    category,
    spots,
    total_spots,
    capacity,
    price,
    image,
    image_url,
    status,
    organizer,
    additional_info,
    gallery,
    requirements,
    includes,
    agenda,
    flyer
) VALUES 
(
    'Games Day at Akosombo',
    'Join us for an exciting day of outdoor games and activities at the beautiful Akosombo. Enjoy team sports, water activities, and more in this scenic location.',
    'Experience the perfect blend of adventure and relaxation at one of Ghana''s most beautiful locations. Games Day at Akosombo offers an exciting mix of outdoor activities including team sports, water activities, and scenic exploration. Located in the Eastern Region, Akosombo provides the perfect backdrop for a day of fun, friendship, and unforgettable memories. Whether you''re looking to try new activities, meet new people, or simply enjoy nature, this event has something for everyone.',
    '2025-04-18',
    '9:00 AM - 6:00 PM',
    '9:00 AM - 6:00 PM',
    'Akosombo, Eastern Region',
    'travel',
    85,
    100,
    100,
    'GHS 350 per person',
    '🏞️',
    'https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Akosombo.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWtvc29tYm8uanBnIiwiaWF0IjoxNzQ0NDgwMjA2LCJleHAiOjE4MzA4ODAyMDZ9.8SkB-Ay1kzDptkib8JrOKXvFBc8ROt4mBXDpr_MPQn4',
    'open',
    'Games & Connect Team',
    '["Transportation from Accra included", "Lunch and refreshments provided", "Swimming is optional (bring swimwear if interested)"]'::jsonb,
    '["https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918906/_MG_2027_oblrvo.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918905/_MG_2015_yysjiq.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918894/_MG_2011_byuoc2.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918886/_MG_2867_y3gl6u.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918885/_MG_2757_e7oo4w.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918885/_MG_2788_zktv2a.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918883/_MG_2731_yxsiun.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918882/_MG_2715_udswrq.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918881/_MG_2712_ijbn4v.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918880/_MG_2690_oewz41.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918881/_MG_2697_ukwvds.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918875/_MG_2612_jrj4b2.jpg"]'::jsonb,
    '["Comfortable outdoor clothing", "Sun protection", "Swimming attire (optional)", "Camera for memories"]'::jsonb,
    '["Round-trip transportation from Accra", "Professional guided activities", "Lunch and refreshments", "Safety equipment for activities", "Group photos"]'::jsonb,
    '[
        {"time": "9:00 AM", "activity": "Departure from Accra meetup point"},
        {"time": "11:30 AM", "activity": "Arrival and welcome activities"},
        {"time": "12:00 PM", "activity": "Team sports and outdoor games"},
        {"time": "1:30 PM", "activity": "Lunch break"},
        {"time": "2:30 PM", "activity": "Water activities and exploration"},
        {"time": "4:00 PM", "activity": "Group activities and photos"},
        {"time": "5:00 PM", "activity": "Wrap-up and departure"},
        {"time": "6:00 PM", "activity": "Arrival back in Accra"}
    ]'::jsonb,
    '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/akosombo-games-flyer.pdf", "alt": "Games Day at Akosombo Event Flyer"}'::jsonb
),
(
    'Beach Day & Games',
    'A day of fun beach games, swimming, and networking at Bojo Beach. The event included volleyball, tug of war, and sand castle building competitions with prizes for winners.',
    'Experience the ultimate beach day combining sun, sand, sports, and socializing! Our Beach Day & Games event at beautiful Bojo Beach offers the perfect escape from city life. Participate in exciting beach volleyball tournaments, competitive tug of war matches, and creative sand castle building competitions. Whether you''re a sports enthusiast or just love beach vibes, this event promises fun activities, great food, and amazing new connections.',
    '2025-01-04',
    '10:00 AM - 5:00 PM',
    '10:00 AM - 5:00 PM',
    'Bojo Beach, Accra',
    'social',
    60,
    75,
    75,
    'GHS 150 per person',
    '🏖️',
    'https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/beach.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvYmVhY2guanBnIiwiaWF0IjoxNzQ1NjgyNDYwLCJleHAiOjE4MzIwODI0NjB9.uq0wSMYpaFEGtKdavhFjHX13kjlSasAVmlpzBJn_3eY',
    'filling-fast',
    'Games & Connect Beach Team',
    '["Beach entrance fees included", "Lunch and refreshments provided", "Professional photography services available"]'::jsonb,
    '["https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1677_v8n5nu.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/t_Banner 16:9/v1742488676/_MG_1656_yoiklo.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/t_Banner 16:9/v1742488676/back_k2fwpf.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/t_Banner 16:9/v1742488675/_MG_1424_f0harp.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1776_eob5jv.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1623_olhksw.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1758_mj5kho.jpg"]'::jsonb,
    '["Beach-appropriate clothing", "Swimwear", "Sun protection (sunscreen, hat)", "Towel", "Change of clothes"]'::jsonb,
    '["Beach entrance fees", "Organized games and competitions", "Lunch and refreshments", "Professional photography", "Game prizes", "Beach volleyball equipment"]'::jsonb,
    '[
        {"time": "10:00 AM", "activity": "Arrival and check-in"},
        {"time": "10:30 AM", "activity": "Welcome games and team formation"},
        {"time": "11:30 AM", "activity": "Beach volleyball tournament"},
        {"time": "1:00 PM", "activity": "Lunch break"},
        {"time": "2:00 PM", "activity": "Tug of war competitions"},
        {"time": "3:00 PM", "activity": "Sand castle building contest"},
        {"time": "4:00 PM", "activity": "Free swim and socializing"},
        {"time": "4:30 PM", "activity": "Prize ceremony and group photos"},
        {"time": "5:00 PM", "activity": "Event wrap-up"}
    ]'::jsonb,
    '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/beach-day-games-flyer.pdf", "alt": "Beach Day & Games Event Flyer"}'::jsonb
),
(
    'Aburi Botanical Gardens Hike',
    'A refreshing hike through the beautiful Aburi Botanical Gardens followed by a picnic lunch and team-building activities. Participants enjoyed the serene environment and made new connections.',
    'Escape the hustle and bustle of city life with a rejuvenating hike through the stunning Aburi Botanical Gardens. This nature-focused event combines physical activity with environmental appreciation and community building. Explore diverse plant species, enjoy scenic mountain views, and participate in team-building activities designed to foster new friendships. The day concludes with a delightful picnic lunch surrounded by nature''s beauty.',
    '2024-11-10',
    '9:00 AM - 4:00 PM',
    '9:00 AM - 4:00 PM',
    'Aburi Botanical Gardens',
    'travel',
    25,
    40,
    40,
    'GHS 180 per person',
    '🌳',
    'https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Aburi.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvQWJ1cmkuanBnIiwiaWF0IjoxNzQ1NjgyNjgyLCJleHAiOjE4MzIwODI2ODJ9.8-AVXRFmnnMp1CQNwIgV-P4x7y-AjLZxdVecmm-Kyvw',
    'almost-full',
    'G&C Nature Explorers',
    '["Transportation from Accra included", "Guided tour of the gardens", "Picnic lunch and refreshments provided", "Comfortable walking shoes recommended"]'::jsonb,
    '["https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488694/white_h6p3pq.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488694/red_g7bdxh.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488693/green_mw2ohv.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488693/blue_wwi0pd.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513148/_MG_6770_ryz3ag.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513151/_MG_6481_jwgs4e.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513150/_MG_6467_cjak4b.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513146/_MG_6738_unqv5k.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513145/_MG_6737_y7kp98.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513144/_MG_6728_hafihn.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513143/_MG_6733_byfbhs.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513141/_MG_6483_f7hwq1.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513139/_MG_6724_j5jhw0.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513140/_MG_6658_vlsgwl.jpg", "https://res.cloudinary.com/drkjnrvtu/image/upload/v1747513139/_MG_6681_wa5nyx.jpg"]'::jsonb,
    '["Comfortable hiking shoes", "Light outdoor clothing", "Water bottle", "Sun protection", "Camera (optional)"]'::jsonb,
    '["Round-trip transportation from Accra", "Professional botanical guide", "Garden entrance fees", "Picnic lunch and refreshments", "Team-building activities", "Group photography"]'::jsonb,
    '[
        {"time": "9:00 AM", "activity": "Departure from Accra"},
        {"time": "10:30 AM", "activity": "Arrival and garden introduction"},
        {"time": "11:00 AM", "activity": "Guided botanical tour and hike"},
        {"time": "12:30 PM", "activity": "Team-building activities"},
        {"time": "1:30 PM", "activity": "Picnic lunch in the gardens"},
        {"time": "2:30 PM", "activity": "Free exploration and photography"},
        {"time": "3:30 PM", "activity": "Group reflection and networking"},
        {"time": "4:00 PM", "activity": "Departure back to Accra"}
    ]'::jsonb,
    '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/aburi-gardens-hike-flyer.pdf", "alt": "Aburi Botanical Gardens Hike Event Flyer"}'::jsonb
),
(
    'Two Days in Cape Coast',
    'Step out of the city and into the refreshing breeze of Cape Coast! This two-day getaway is packed with adventure, culture, nature, and great vibes with amazing people.',
    'Embark on an unforgettable two-day journey to Cape Coast, where history, nature, and adventure converge! Experience the thrill of Kakum National Park''s canopy walk, explore the historical significance of Cape Coast and Elmina Castles, encounter crocodiles at Hans Cottage, and enjoy beach relaxation. This comprehensive getaway includes comfortable accommodation, all meals, transportation, and guided tours, making it the perfect escape for culture enthusiasts and adventure seekers alike.',
    '2025-08-22',
    '7am',
    '7:00 AM - 5:00 PM (2 days)',
    'Cape Coast',
    'travel',
    35,
    50,
    50,
    '700Gh',
    '🏰',
    'https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/Two%20days%20in%20cape%20coast%20(1).jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvVHdvIGRheXMgaW4gY2FwZSBjb2FzdCAoMSkuanBnIiwiaWF0IjoxNzQ3ODIxNzQ5LCJleHAiOjE4MzQyMjE3NDl9.aDvE73YfPdbBQ5bwmSmwWK-S0AOnFLDNbi-cxblEwrU',
    'open',
    'G&C Adventure Tours',
    '["Transportation (round trip)", "Meals (Friday: Lunch & Supper | Saturday: Breakfast, Lunch & Snacks)", "Accommodation (1 night)", "Entry fees to all venues", "Pool access", "Photography"]'::jsonb,
    '["https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/ocean%20breeze%20Games.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvb2NlYW4gYnJlZXplIEdhbWVzLmpwZyIsImlhdCI6MTc0NjYyMDYyMywiZXhwIjoxODMzMDIwNjIzfQ.rTfiLQGDKySPvJdKxgbX8plnU_50duXve-kW7LTmkqg", "https://kgfpdduocqqcbfzzmbbw.supabase.co/storage/v1/object/sign/event-images/beach.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJldmVudC1pbWFnZXMvYmVhY2guanBnIiwiaWF0IjoxNzQ2NjIwNjU2LCJleHAiOjE4MzMwMjA2NTZ9.uZppvRkw5bVlWYj76q61tsFOjoHwk99xyLr6x2eBFSE"]'::jsonb,
    '["Valid ID for travel", "Comfortable walking shoes", "Swimwear for pool and beach", "Camera for memories", "Personal toiletries", "Change of clothes"]'::jsonb,
    '["Round-trip transportation from Nungua", "1-night comfortable accommodation", "All meals as specified", "Entry fees to all destinations", "Professional tour guide", "Pool access", "Photography services", "Fun night games"]'::jsonb,
    '[
        {"time": "Friday 7:00 AM", "activity": "Departure from Nungua"},
        {"time": "Friday 10:00 AM", "activity": "Visit Kakum National Park (Canopy Walk & Nature Tour)"},
        {"time": "Friday 1:00 PM", "activity": "Lunch break"},
        {"time": "Friday 3:00 PM", "activity": "Relax at Cape Coast Beach"},
        {"time": "Friday 6:00 PM", "activity": "Check-in and dinner"},
        {"time": "Friday 8:00 PM", "activity": "Fun Night Activities & Games"},
        {"time": "Saturday 8:00 AM", "activity": "Breakfast"},
        {"time": "Saturday 9:00 AM", "activity": "Tour Elmina & Cape Coast Castles"},
        {"time": "Saturday 12:00 PM", "activity": "Lunch"},
        {"time": "Saturday 1:30 PM", "activity": "Explore Hans Cottage (Crocodiles, Boat Ride & Bird Watching)"},
        {"time": "Saturday 3:00 PM", "activity": "Pool Hangout"},
        {"time": "Saturday 5:00 PM", "activity": "Depart for Accra"}
    ]'::jsonb,
    '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/cape-coast-two-days-flyer.pdf", "alt": "Two Days in Cape Coast Event Flyer"}'::jsonb
);

-- Update spots calculation for realistic registration numbers
UPDATE public.events SET spots = total_spots - FLOOR(total_spots * (0.1 + random() * 0.4))::integer;

-- Update status based on remaining spots
UPDATE public.events SET 
status = CASE 
    WHEN spots <= 5 THEN 'almost-full'
    WHEN spots <= total_spots * 0.3 THEN 'filling-fast'
    ELSE 'open'
END
WHERE status != 'full';

-- Add some sample registrations for realism
WITH sample_registrations AS (
  SELECT 
    e.id as event_id,
    unnest(ARRAY['John Doe', 'Jane Smith', 'Kwame Asante', 'Akosua Osei', 'Kofi Mensah', 'Ama Boateng', 'Prince Osei', 'Grace Addo']) as name,
    unnest(ARRAY['john@example.com', 'jane@example.com', 'kwame@example.com', 'akosua@example.com', 'kofi@example.com', 'ama@example.com', 'prince@example.com', 'grace@example.com']) as email,
    unnest(ARRAY['+233241234567', '+233241234568', '+233241234569', '+233241234570', '+233241234571', '+233241234572', '+233241234573', '+233241234574']) as phone
  FROM public.events e
)
INSERT INTO public.registrations (event_id, name, email, phone, status, created_at)
SELECT 
  event_id,
  name,
  email,
  phone,
  'confirmed',
  now() - (random() * interval '7 days')
FROM sample_registrations
WHERE random() < 0.4  -- Add registrations to ~40% of combinations
LIMIT 20;

-- Add payment instructions to additional_info for Cape Coast event
UPDATE public.events 
SET additional_info = additional_info || '["Payment via MTN Mobile Money", "Merchant Name: Mainstream House", "MoMo Number: 059 859 9616"]'::jsonb
WHERE title = 'Two Days in Cape Coast';
