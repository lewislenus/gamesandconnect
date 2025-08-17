-- Insert real event details for Games & Connect website
-- This migration adds comprehensive event data that matches the website content

-- First, clear existing sample data
DELETE FROM public.events;

-- Insert comprehensive event data
INSERT INTO public.events (
    id,
    title,
    description,
    long_description,
    date,
    time,
    location,
    category,
    spots,
    total_spots,
    price,
    image,
    status,
    organizer,
    requirements,
    includes,
    agenda,
    flyer
) VALUES (
    '1',
    'Friday Game Night & Connect',
    'Weekly game night mixing digital and board games with networking',
    'Join our signature Friday night where play meets connection! Start with FIFA and Call of Duty tournaments, transition to board games like Ludo and Oware, then wrap up with speed networking and community building activities. This event perfectly embodies our "play, travel, connect" motto by bringing together gaming enthusiasts, travel lovers, and networking pros in one exciting evening.',
    'December 15, 2024',
    '7:00 PM - 11:00 PM',
    'East Legon Community Center',
    'social',
    20,
    40,
    '₵25',
    '🎮',
    'open',
    'Games & Connect Team',
    '["Open mind for gaming and networking", "Enthusiasm for meeting new people", "Casual dress code"]',
    '["Gaming setups provided", "Light refreshments", "Networking cards", "Game prizes"]',
    '[
        {"time": "7:00 PM", "activity": "Welcome & Ice Breakers"},
        {"time": "7:30 PM", "activity": "Digital Game Tournaments"},
        {"time": "8:30 PM", "activity": "Board Game Stations"},
        {"time": "9:30 PM", "activity": "Speed Networking Session"},
        {"time": "10:30 PM", "activity": "Community Planning & Wrap-up"}
    ]',
    '{"url": "https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/game-night-connect", "downloadUrl": "/downloads/game-night-connect-flyer.pdf", "alt": "Friday Game Night & Connect Event Flyer"}'
),
(
    '2',
    'Kakum Forest Adventure & Cultural Discovery',
    'Canopy walk adventure with local cultural immersion and team building',
    'Experience Ghana''s natural beauty and rich culture in this 2-day adventure! Walk among the treetops at Kakum National Park, learn about local Fante traditions, participate in cooking workshops, and bond with fellow adventurers through team-building activities. This journey perfectly combines our travel and connect pillars while adding elements of cultural exploration and personal growth.',
    'December 22-23, 2024',
    '6:00 AM - 6:00 PM (Day 1) | 8:00 AM - 5:00 PM (Day 2)',
    'Kakum National Park, Central Region',
    'travel',
    8,
    20,
    '₵280',
    '🌳',
    'filling-fast',
    'G&C Adventure Squad',
    '["Moderate fitness level", "Adventure-ready attitude", "Comfortable walking shoes", "Valid ID for travel"]',
    '["Transportation from Accra", "Accommodation (1 night)", "All meals", "Park entry fees", "Cultural workshop", "Professional guide"]',
    '[
        {"time": "6:00 AM", "activity": "Departure from Accra meetup point"},
        {"time": "9:00 AM", "activity": "Arrival & Kakum Canopy Walk"},
        {"time": "12:00 PM", "activity": "Local lunch & cultural presentation"},
        {"time": "2:00 PM", "activity": "Team building activities"},
        {"time": "4:00 PM", "activity": "Check-in & rest time"},
        {"time": "6:00 PM", "activity": "Traditional cooking workshop"},
        {"time": "8:00 AM", "activity": "Nature walk & bird watching"},
        {"time": "10:00 AM", "activity": "Visit local craft village"},
        {"time": "12:00 PM", "activity": "Farewell lunch & group reflection"},
        {"time": "2:00 PM", "activity": "Return journey to Accra"}
    ]',
    '{"url": "https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/kakum-adventure", "downloadUrl": "/downloads/kakum-adventure-flyer.pdf", "alt": "Kakum Forest Adventure Event Flyer"}'
),
(
    '3',
    'Esports Championship & Tech Talk',
    'FIFA & Mobile Legends tournament with tech industry networking',
    'Level up your gaming skills and career prospects! Compete in our biggest esports championship featuring FIFA 24 and Mobile Legends, followed by inspiring talks from Ghana''s tech industry leaders. This unique event blends competitive gaming with professional development, connecting gamers with potential mentors, employers, and collaborators in the tech space.',
    'December 28, 2024',
    '1:00 PM - 8:00 PM',
    'Impact Hub Accra',
    'gaming',
    15,
    32,
    '₵40',
    '🏆',
    'open',
    'G&C Gaming Division',
    '["Gaming device for Mobile Legends (or play FIFA)", "Professional mindset for networking", "Tournament entry fee"]',
    '["Gaming equipment for FIFA", "Tech talks by industry leaders", "Networking lunch", "Prize money for winners", "Career guidance session"]',
    '[
        {"time": "1:00 PM", "activity": "Registration & networking lunch"},
        {"time": "2:00 PM", "activity": "Tournament bracket announcements"},
        {"time": "2:30 PM", "activity": "FIFA 24 tournament begins"},
        {"time": "4:00 PM", "activity": "Mobile Legends tournament begins"},
        {"time": "5:30 PM", "activity": "Tech industry panel discussion"},
        {"time": "6:30 PM", "activity": "Tournament finals"},
        {"time": "7:30 PM", "activity": "Prize ceremony & networking wrap-up"}
    ]',
    '{"url": "https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/esports-championship", "downloadUrl": "/downloads/esports-championship-flyer.pdf", "alt": "Esports Championship & Tech Talk Event Flyer"}'
),
(
    '4',
    'Kumasi Heritage Trail & Connect',
    'Explore Ashanti culture, visit historic sites, and build connections',
    'Discover the rich heritage of the Ashanti Kingdom while building meaningful connections with fellow culture enthusiasts. Visit the Manhyia Palace, explore Kejetia Market, experience traditional Kente weaving, and enjoy authentic Ashanti cuisine. This cultural journey combines education, adventure, and community building in Ghana''s cultural capital.',
    'January 5-6, 2025',
    '7:00 AM - 7:00 PM (Day 1) | 9:00 AM - 4:00 PM (Day 2)',
    'Kumasi, Ashanti Region',
    'travel',
    12,
    18,
    '₵320',
    '👑',
    'open',
    'G&C Cultural Explorers',
    '["Interest in Ghanaian culture", "Respectful attitude", "Comfortable walking gear", "Valid travel ID"]',
    '["Round-trip transportation", "1-night accommodation", "All meals", "Cultural guide", "Palace entry fees", "Kente workshop", "Traditional dinner experience"]',
    '[
        {"time": "7:00 AM", "activity": "Departure from Accra"},
        {"time": "10:00 AM", "activity": "Visit Manhyia Palace Museum"},
        {"time": "12:00 PM", "activity": "Traditional lunch & storytelling"},
        {"time": "2:00 PM", "activity": "Explore Kejetia Market"},
        {"time": "4:00 PM", "activity": "Kente weaving workshop"},
        {"time": "6:00 PM", "activity": "Check-in & rest"},
        {"time": "7:30 PM", "activity": "Traditional dinner & cultural show"},
        {"time": "9:00 AM", "activity": "Visit Cultural Centre"},
        {"time": "11:00 AM", "activity": "Local craft shopping"},
        {"time": "12:30 PM", "activity": "Farewell lunch"},
        {"time": "2:00 PM", "activity": "Return journey to Accra"}
    ]',
    '{"url": "https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/kumasi-heritage", "downloadUrl": "/downloads/kumasi-heritage-flyer.pdf", "alt": "Kumasi Heritage Trail Event Flyer"}'
),
(
    '5',
    'Young Professionals Mixer & Board Game Night',
    'Network with young professionals while enjoying strategic board games',
    'Perfect blend of professional networking and strategic gaming! Connect with ambitious young professionals from various industries while enjoying modern board games like Settlers of Catan, Ticket to Ride, and local favorites. This event creates a relaxed environment for meaningful professional relationships to flourish through the shared joy of strategic thinking and friendly competition.',
    'January 12, 2025',
    '6:00 PM - 10:00 PM',
    'Silverbird Lifestyle Centre, Accra',
    'social',
    25,
    35,
    '₵35',
    '🤝',
    'open',
    'G&C Professional Network',
    '["Professional background or student status", "Networking mindset", "Interest in strategic games"]',
    '["Welcome cocktails", "Board game library", "Professional networking cards", "Light dinner", "Industry mixers"]',
    '[
        {"time": "6:00 PM", "activity": "Welcome cocktails & registration"},
        {"time": "6:30 PM", "activity": "Speed networking rounds"},
        {"time": "7:30 PM", "activity": "Board game tournaments begin"},
        {"time": "8:30 PM", "activity": "Dinner break & industry discussions"},
        {"time": "9:15 PM", "activity": "Final game rounds"},
        {"time": "10:00 PM", "activity": "Contact exchange & wrap-up"}
    ]',
    '{"url": "https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/professionals-mixer", "downloadUrl": "/downloads/professionals-mixer-flyer.pdf", "alt": "Young Professionals Mixer Event Flyer"}'
),
(
    '6',
    'Trivia Friday Challenge',
    'Weekly trivia night with prizes and community building',
    'Test your knowledge and make new friends every Friday! Our trivia night covers everything from pop culture and sports to Ghanaian history and current affairs. Teams of up to 4 people compete for amazing prizes while enjoying refreshments and great company. Whether you''re a trivia pro or just love learning new things, this weekly event is the perfect way to wind down your week and connect with your community.',
    'Every Friday',
    '7:00 PM - 9:30 PM',
    'Online via Zoom',
    'trivia',
    15,
    30,
    'Free',
    '🧠',
    'open',
    'G&C Trivia Team',
    '["Stable internet connection", "Device with camera/microphone", "Team spirit"]',
    '["Zoom access", "Digital prizes", "Weekly themes", "Community leaderboard"]',
    '[
        {"time": "7:00 PM", "activity": "Welcome & team formation"},
        {"time": "7:15 PM", "activity": "Round 1: General knowledge"},
        {"time": "7:45 PM", "activity": "Round 2: Theme of the week"},
        {"time": "8:15 PM", "activity": "Final lightning round"},
        {"time": "8:45 PM", "activity": "Results & prizes"},
        {"time": "9:00 PM", "activity": "Community chat & networking"}
    ]',
    '{"url": "https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/trivia-friday", "downloadUrl": "/downloads/trivia-friday-flyer.pdf", "alt": "Trivia Friday Challenge Event Flyer"}'
),
(
    '7',
    'Beach Volleyball & Community Cleanup',
    'Sports, environmental action, and beachside networking',
    'Combine fitness, environmental responsibility, and community building at beautiful Laboma Beach! Start with a beach cleanup to protect our coastline, then enjoy competitive volleyball tournaments with teams of all skill levels. End the day with a beachside BBQ and sunset networking session. This event perfectly captures our community''s values of taking care of our environment while staying active and connected.',
    'January 19, 2025',
    '9:00 AM - 5:00 PM',
    'Laboma Beach, Accra',
    'social',
    18,
    25,
    '₵50',
    '🏐',
    'open',
    'G&C Eco-Sports Team',
    '["Comfortable sports attire", "Sun protection", "Environmental consciousness", "Basic volleyball skills helpful but not required"]',
    '["Volleyball equipment", "Cleanup supplies", "BBQ lunch", "Refreshments", "Transportation from meetup point"]',
    '[
        {"time": "9:00 AM", "activity": "Meetup & transportation to beach"},
        {"time": "10:00 AM", "activity": "Beach cleanup activity"},
        {"time": "11:30 AM", "activity": "Volleyball tournament begins"},
        {"time": "1:00 PM", "activity": "BBQ lunch break"},
        {"time": "2:30 PM", "activity": "Friendly matches & skills training"},
        {"time": "4:00 PM", "activity": "Sunset networking & reflection"},
        {"time": "5:00 PM", "activity": "Return journey"}
    ]',
    '{"url": "https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/beach-volleyball", "downloadUrl": "/downloads/beach-volleyball-flyer.pdf", "alt": "Beach Volleyball & Community Cleanup Event Flyer"}'
),
(
    '8',
    'International Gaming Championship',
    'Multi-platform gaming tournament with international livestream',
    'Join Ghana''s biggest international gaming championship! Compete in FIFA 24, Call of Duty, and Mobile Legends tournaments while being livestreamed to a global audience. This professional-level event features cash prizes, sponsorship opportunities, and networking with gaming industry professionals. Whether you''re an aspiring pro gamer or just love competitive gaming, this championship offers an exciting platform to showcase your skills.',
    'February 1-2, 2025',
    '10:00 AM - 10:00 PM (Day 1) | 12:00 PM - 8:00 PM (Day 2)',
    'Accra International Conference Centre',
    'gaming',
    20,
    50,
    '₵75',
    '🎯',
    'open',
    'G&C Pro Gaming',
    '["Own gaming device for mobile games", "Competitive gaming experience preferred", "Valid ID for tournament registration"]',
    '["Professional gaming setups", "Live streaming coverage", "Industry networking", "Cash prizes up to ₵5000", "Meals and refreshments"]',
    '[
        {"time": "10:00 AM", "activity": "Registration & equipment check"},
        {"time": "11:00 AM", "activity": "Opening ceremony & rules briefing"},
        {"time": "12:00 PM", "activity": "FIFA 24 preliminary rounds"},
        {"time": "3:00 PM", "activity": "Call of Duty team battles"},
        {"time": "6:00 PM", "activity": "Mobile Legends qualifiers"},
        {"time": "8:00 PM", "activity": "Industry networking dinner"},
        {"time": "12:00 PM", "activity": "Semi-finals all games"},
        {"time": "4:00 PM", "activity": "Grand finals"},
        {"time": "7:00 PM", "activity": "Prize ceremony & celebration"}
    ]',
    '{"url": "https://res.cloudinary.com/games-and-connect/image/upload/v1/flyers/international-gaming", "downloadUrl": "/downloads/international-gaming-flyer.pdf", "alt": "International Gaming Championship Event Flyer"}'
);

-- Update event IDs to be UUIDs (regenerate them)
UPDATE public.events SET id = gen_random_uuid();

-- Create some sample registrations to make the events look active
-- Note: This would normally be done through the registration API, but for demo purposes we'll insert some
WITH sample_users AS (
  SELECT unnest(ARRAY[
    'user1@example.com', 'user2@example.com', 'user3@example.com', 
    'user4@example.com', 'user5@example.com', 'user6@example.com'
  ]) AS email,
  unnest(ARRAY[
    'John Doe', 'Jane Smith', 'Kwame Asante', 
    'Akosua Osei', 'Kofi Mensah', 'Ama Boateng'
  ]) AS name,
  unnest(ARRAY[
    '+233241234567', '+233241234568', '+233241234569',
    '+233241234570', '+233241234571', '+233241234572'
  ]) AS phone
)
INSERT INTO public.registrations (event_id, name, email, phone, status, created_at)
SELECT 
  e.id,
  u.name,
  u.email,
  u.phone,
  CASE 
    WHEN random() < 0.8 THEN 'confirmed'
    ELSE 'pending'
  END,
  now() - (random() * interval '7 days')
FROM public.events e
CROSS JOIN sample_users u
WHERE random() < 0.3  -- Only add registrations to ~30% of event-user combinations
LIMIT 15;  -- Limit total registrations

-- Update spots count based on confirmed registrations
UPDATE public.events 
SET spots = total_spots - (
  SELECT COUNT(*) 
  FROM public.registrations 
  WHERE event_id = events.id AND status IN ('confirmed', 'pending')
);

-- Add some feedback for past events (if any)
INSERT INTO public.event_feedback (event_id, registration_id, rating, feedback_text, is_anonymous)
SELECT 
  r.event_id,
  r.id,
  (random() * 2 + 3)::integer,  -- Random rating between 3-5
  CASE 
    WHEN random() < 0.5 THEN 'Great event! Well organized and lots of fun.'
    WHEN random() < 0.8 THEN 'Really enjoyed meeting new people and the activities were engaging.'
    ELSE NULL
  END,
  random() < 0.3  -- 30% anonymous feedback
FROM public.registrations r
WHERE r.status = 'confirmed' AND random() < 0.4;  -- 40% of confirmed registrations leave feedback
