-- Add additional fields for the event details page
ALTER TABLE public.events 
ADD COLUMN long_description TEXT,
ADD COLUMN organizer TEXT,
ADD COLUMN flyer JSONB DEFAULT '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/event-flyer.pdf", "alt": "Event Flyer"}',
ADD COLUMN requirements JSONB DEFAULT '[]',
ADD COLUMN includes JSONB DEFAULT '[]',
ADD COLUMN agenda JSONB DEFAULT '[]';

-- Update existing events with the new fields
UPDATE public.events SET 
long_description = 'Join us every Friday for an exciting trivia night! Test your knowledge across various categories including sports, entertainment, history, science, and local Ghanaian culture. Teams of up to 4 people can participate, and there are amazing prizes for the top 3 teams. The event is hosted online via Zoom, making it accessible to everyone. Whether you''re a trivia newbie or a seasoned quiz master, this event promises fun, learning, and great connections with fellow participants.',
organizer = 'Games & Connect Team',
requirements = '["Stable internet connection", "Device with camera and microphone", "Enthusiastic attitude"]'::jsonb,
includes = '["Zoom link sent 24hrs before", "Digital certificate for winners", "Fun prizes for top teams"]'::jsonb,
agenda = '[{"time": "7:00 PM", "activity": "Welcome & Team Formation"}, {"time": "7:15 PM", "activity": "Round 1: General Knowledge"}, {"time": "7:45 PM", "activity": "Round 2: Ghanaian Culture"}, {"time": "8:15 PM", "activity": "Final Round & Results"}, {"time": "8:30 PM", "activity": "Prize Distribution & Networking"}]'::jsonb,
flyer = '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/trivia-friday-flyer.pdf", "alt": "Trivia Friday Event Flyer"}'::jsonb
WHERE title = 'Trivia Friday';

UPDATE public.events SET 
long_description = 'Make a positive impact while having fun! Start your day by helping clean Laboma Beach, one of Accra''s beautiful coastal areas. After the cleanup, enjoy beach volleyball, football, frisbee, and other fun activities. The day concludes with a delicious BBQ featuring local dishes. This event combines environmental consciousness with community building, making it perfect for those who want to give back while making new friends.',
organizer = 'EcoConnect Ghana',
requirements = '["Comfortable clothing", "Sun protection", "Water bottle", "Positive attitude"]'::jsonb,
includes = '["Cleanup supplies provided", "BBQ lunch included", "Transportation from central meetup"]'::jsonb,
agenda = '[{"time": "10:00 AM", "activity": "Meetup & Transportation"}, {"time": "11:00 AM", "activity": "Beach Cleanup Activity"}, {"time": "1:00 PM", "activity": "Beach Games & Activities"}, {"time": "2:30 PM", "activity": "BBQ Lunch & Socializing"}, {"time": "4:00 PM", "activity": "Return Journey"}]'::jsonb,
flyer = '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/beach-cleanup-flyer.pdf", "alt": "Beach Cleanup & Fun Day Event Flyer"}'::jsonb
WHERE title = 'Accra Beach Cleanup & Fun Day';

UPDATE public.events SET 
long_description = 'Calling all FIFA fans! Join our exciting FIFA 24 tournament featuring single-elimination brackets and cash prizes for winners. Whether you''re a casual player or a FIFA pro, this tournament offers different skill levels to ensure fair competition. Play against fellow gamers in a friendly yet competitive environment. The venue provides gaming setups, snacks, and drinks. Spectators are welcome to cheer on their favorite players!',
organizer = 'Ghana Gaming Community',
requirements = '["Basic FIFA 24 knowledge", "Fair play attitude", "Registration fee"]'::jsonb,
includes = '["Gaming setup provided", "Snacks and drinks", "Cash prizes for top 3"]'::jsonb,
agenda = '[{"time": "2:00 PM", "activity": "Registration & Setup"}, {"time": "2:30 PM", "activity": "Practice Matches"}, {"time": "3:00 PM", "activity": "Tournament Bracket Start"}, {"time": "6:00 PM", "activity": "Semi-Finals"}, {"time": "7:00 PM", "activity": "Finals & Prize Ceremony"}]'::jsonb,
flyer = '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/fifa-tournament-flyer.pdf", "alt": "FIFA Tournament Event Flyer"}'::jsonb
WHERE title = 'FIFA Tournament';

UPDATE public.events SET 
long_description = 'Explore the cultural heart of Ghana in this 3-day adventure to Kumasi. Visit historical sites including the Manhyia Palace Museum, Kumasi Fort, and the famous Kejetia Market. Experience authentic Ashanti culture through food, crafts, and traditional ceremonies. Accommodation is provided in a comfortable local hotel, and transportation is arranged from Accra. This trip is perfect for those who want to delve deeper into Ghana''s rich heritage.',
organizer = 'Travel Ghana Tours',
requirements = '["Valid ID", "Comfortable walking shoes", "Personal essentials for 3 days", "Camera (optional)"]'::jsonb,
includes = '["Round-trip transportation from Accra", "Hotel accommodation (2 nights)", "Daily breakfast and one dinner", "Guided tours of main attractions"]'::jsonb,
agenda = '[{"time": "Day 1", "activity": "Departure from Accra & Arrival in Kumasi"}, {"time": "Day 1", "activity": "Visit to Manhyia Palace Museum"}, {"time": "Day 2", "activity": "Kejetia Market & Craft Villages"}, {"time": "Day 2", "activity": "Cultural dinner and performance"}, {"time": "Day 3", "activity": "Free morning & Return to Accra"}]'::jsonb,
flyer = '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/kumasi-trip-flyer.pdf", "alt": "Kumasi Trip Event Flyer"}'::jsonb
WHERE title = 'New Year Kumasi Trip';

UPDATE public.events SET 
long_description = 'Join us for a fun-filled evening of board games! We''ll have classics like Monopoly and Scrabble, as well as popular African games like Oware. This is a great opportunity to make new friends, enjoy some friendly competition, and relax in a casual environment. Snacks and drinks will be provided, and beginners are absolutely welcome - we''ll teach you how to play! Whether you''re a board game enthusiast or just looking for a fun social activity, this event is perfect for you.',
organizer = 'Games & Connect Team',
requirements = '["Just bring yourself!", "Games to share (optional)"]'::jsonb,
includes = '["All games provided", "Snacks and refreshments", "Instruction for beginners"]'::jsonb,
agenda = '[{"time": "6:00 PM", "activity": "Arrival & Game Selection"}, {"time": "6:30 PM", "activity": "Game Session 1"}, {"time": "8:00 PM", "activity": "Refreshment Break"}, {"time": "8:30 PM", "activity": "Game Session 2"}, {"time": "10:00 PM", "activity": "Wrap-up & Socializing"}]'::jsonb,
flyer = '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/board-game-flyer.pdf", "alt": "Board Game Night Event Flyer"}'::jsonb
WHERE title = 'Board Game Night';

UPDATE public.events SET 
long_description = 'Get ready to learn how to prepare delicious traditional Ghanaian dishes! This hands-on cooking class will teach you how to make classics like Jollof Rice, Waakye, and Red-Red. Our experienced chef will guide you through each step, sharing tips and cultural insights along the way. After cooking, everyone will sit down together to enjoy the meal they''ve prepared. You''ll also receive recipe cards to take home, so you can recreate the dishes for friends and family. No prior cooking experience is necessary!',
organizer = 'Ghana Culinary Arts',
requirements = '["Apron (will be provided if you don''t have one)", "Container for leftovers (optional)", "Interest in Ghanaian cuisine"]'::jsonb,
includes = '["All ingredients and cooking equipment", "Recipe cards to take home", "Full meal to enjoy after cooking", "Beverage pairings"]'::jsonb,
agenda = '[{"time": "3:00 PM", "activity": "Introduction & Prep"}, {"time": "3:30 PM", "activity": "First Dish: Jollof Rice"}, {"time": "4:30 PM", "activity": "Second Dish: Traditional Sides"}, {"time": "5:30 PM", "activity": "Dessert Preparation"}, {"time": "6:00 PM", "activity": "Dinner & Socializing"}]'::jsonb,
flyer = '{"url": "/api/placeholder/600/800", "downloadUrl": "/downloads/cooking-challenge-flyer.pdf", "alt": "Cooking Challenge Event Flyer"}'::jsonb
WHERE title = 'Cooking Challenge';
