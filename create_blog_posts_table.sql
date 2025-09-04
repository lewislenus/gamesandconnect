-- Create blog_posts table for Games & Connect
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  author TEXT NOT NULL,
  author_email TEXT,
  featured_image TEXT,
  category TEXT NOT NULL CHECK (category IN ('gaming', 'community', 'events', 'travel', 'general')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tags TEXT[],
  read_time INTEGER,
  views INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON public.blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Policy for public read access to published posts
CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

-- Policy for authenticated users to view all posts (for admin)
CREATE POLICY "Authenticated users can view all blog posts" ON public.blog_posts
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert posts
CREATE POLICY "Authenticated users can insert blog posts" ON public.blog_posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users to update posts
CREATE POLICY "Authenticated users can update blog posts" ON public.blog_posts
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for authenticated users to delete posts
CREATE POLICY "Authenticated users can delete blog posts" ON public.blog_posts
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample blog posts
INSERT INTO public.blog_posts (
    id,
    title,
    content,
    excerpt,
    author,
    author_email,
    category,
    status,
    published_at,
    created_at,
    updated_at,
    slug,
    tags,
    read_time,
    views
) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'Welcome to Games & Connect Community!',
    '# Welcome to Games & Connect!

We''re thrilled to have you join our vibrant community! Games & Connect is more than just a platform - it''s a place where gaming enthusiasts, travelers, and like-minded individuals come together to share experiences and create lasting connections.

## What We Offer

- **Gaming Events**: From FIFA tournaments to trivia nights, we host exciting events for gamers of all levels
- **Community Gatherings**: Beach cleanups, social meetups, and team-building activities
- **Travel Adventures**: Explore new destinations with fellow community members
- **Learning Opportunities**: Workshops, skill-sharing sessions, and collaborative projects

## Getting Started

1. Browse our upcoming events
2. Register for activities that interest you
3. Connect with other members
4. Share your own experiences and ideas

## Community Guidelines

Our community thrives on respect, inclusivity, and fun. We welcome everyone regardless of skill level or background. Whether you''re a hardcore gamer, casual player, or just looking to make new friends, there''s a place for you here!

Ready to dive in? Check out our upcoming events and start your Games & Connect journey today!',
    'Welcome to Games & Connect - your new favorite community for gaming, travel, and meaningful connections!',
    'Games & Connect Team',
    'team@gamesandconnect.com',
    'community',
    'published',
    '2024-08-15T10:00:00Z',
    '2024-08-15T09:30:00Z',
    '2024-08-15T10:00:00Z',
    'welcome-to-games-connect-community',
    ARRAY['welcome', 'community', 'getting-started'],
    3,
    156
),
(
    '550e8400-e29b-41d4-a716-446655440002',
    'FIFA Tournament Success: Celebrating Our Champions',
    '# FIFA Tournament 2024: A Massive Success!

Last weekend''s FIFA tournament was absolutely incredible! We had 32 participants battling it out for the championship title, and the energy was electric throughout the entire event.

## Tournament Highlights

- **Winner**: Alex "TheGoalMachine" Rodriguez with an impressive 7-0 run
- **Runner-up**: Sarah "MidfieldMaestro" Chen, who dominated the midfield all day
- **Best Newcomer**: Jamie "RookieRocket" Thompson, showing incredible potential

## By the Numbers

- 32 participants from 8 different countries
- 15 hours of non-stop gaming action
- Over 100 goals scored across all matches
- Countless new friendships formed

## Community Spirit

What made this tournament special wasn''t just the competition - it was the incredible sportsmanship and camaraderie displayed by everyone. Players were cheering for each other, sharing tips, and celebrating every great play together.

## What''s Next?

Based on the overwhelming positive response, we''re already planning our next FIFA tournament for October! We''re also exploring the possibility of adding other games like Rocket League and Street Fighter.

Want to join the next tournament? Keep an eye on our events page for registration details!

Thank you to everyone who participated and made this event unforgettable. This is what Games & Connect is all about - bringing people together through the joy of gaming!',
    'Our FIFA tournament brought together 32 players for an unforgettable day of competition and community spirit.',
    'Marcus Johnson',
    'marcus@gamesandconnect.com',
    'gaming',
    'published',
    '2024-08-18T14:30:00Z',
    '2024-08-18T13:45:00Z',
    '2024-08-18T14:30:00Z',
    'fifa-tournament-success-celebrating-our-champions',
    ARRAY['fifa', 'tournament', 'gaming', 'competition', 'results'],
    4,
    89
),
(
    '550e8400-e29b-41d4-a716-446655440003',
    'Cape Coast Adventure: Gaming Meets Travel',
    '# An Unforgettable Weekend in Cape Coast

Last weekend, 40 members of our community embarked on an incredible adventure to Cape Coast, combining our love for gaming with the exploration of Ghana''s rich history and beautiful coastline.

## The Perfect Blend

Our Cape Coast trip was the perfect example of our "Play, Travel, Connect" philosophy in action. We spent our days exploring historical sites and our evenings engaged in exciting gaming sessions.

### Day 1: Arrival and Exploration
- Check-in at our beachfront accommodation
- Visit to Cape Coast Castle
- Sunset gaming session on the beach
- Community bonding over local cuisine

### Day 2: Adventure and Competition
- Morning beach games and activities
- Canopy walk at Kakum National Park
- Afternoon FIFA tournament by the ocean
- Evening trivia night with local history themes

## Gaming Highlights

Even in this beautiful setting, our competitive spirit shone through:
- Beachside FIFA matches with ocean views
- Travel-themed trivia questions
- Team-building games that brought everyone closer

## Community Bonds

The trip strengthened bonds within our community. New friendships were formed, and existing ones deepened. Watching the sunrise over the Atlantic while discussing gaming strategies is an experience none of us will forget.

## What''s Next?

Based on the overwhelming success of this trip, we''re already planning our next adventure:
- Kumasi cultural and gaming weekend
- Lake Volta gaming retreat
- Northern Ghana exploration trip

## Thank You

Special thanks to all the amazing people who joined us and made this trip unforgettable. Your enthusiasm, sportsmanship, and friendship make Games & Connect the incredible community it is today.

Can''t wait for our next adventure together!',
    'Join us as we recap our amazing Cape Coast adventure where gaming met travel in the most spectacular way.',
    'Travel Team',
    'travel@gamesandconnect.com',
    'travel',
    'published',
    '2024-08-25T16:00:00Z',
    '2024-08-25T15:15:00Z',
    '2024-08-25T16:00:00Z',
    'cape-coast-adventure-gaming-meets-travel',
    ARRAY['travel', 'cape-coast', 'adventure', 'community'],
    5,
    312
);

-- Grant necessary permissions
GRANT ALL ON public.blog_posts TO authenticated;
GRANT SELECT ON public.blog_posts TO anon;
