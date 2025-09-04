-- Create blog_posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author TEXT NOT NULL,
    author_email TEXT,
    featured_image TEXT,
    category TEXT DEFAULT 'general' CHECK (category IN ('gaming', 'community', 'events', 'travel', 'general')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    slug TEXT UNIQUE NOT NULL,
    tags TEXT[], -- Array of tags
    read_time INTEGER DEFAULT 1,
    views INTEGER DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_status ON blog_posts(status);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_posts_updated_at();

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published blog posts
CREATE POLICY "Public can view published blog posts" ON blog_posts
    FOR SELECT USING (status = 'published');

-- Policy: Allow authenticated admin users to manage all blog posts
CREATE POLICY "Admin users can manage blog posts" ON blog_posts
    FOR ALL USING (
        auth.jwt() ->> 'email' IN (
            SELECT email FROM admin_users WHERE is_active = true
        )
    );

-- Insert sample blog posts
INSERT INTO blog_posts (
    title, content, excerpt, author, author_email, featured_image, 
    category, status, published_at, slug, tags, read_time, views
) VALUES 
(
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
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg',
    'community',
    'published',
    '2024-08-15T10:00:00Z',
    'welcome-to-games-connect-community',
    ARRAY['welcome', 'community', 'getting-started'],
    3,
    156
),
(
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
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2393_cv5xbp.jpg',
    'gaming',
    'published',
    '2024-08-18T14:30:00Z',
    'fifa-tournament-success-celebrating-our-champions',
    ARRAY['fifa', 'tournament', 'gaming', 'competition', 'results'],
    4,
    89
),
(
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
    'https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/cape-coast-flyer_bqx8md.jpg',
    'travel',
    'published',
    '2024-08-25T16:00:00Z',
    'cape-coast-adventure-gaming-meets-travel',
    ARRAY['travel', 'cape-coast', 'adventure', 'community'],
    5,
    312
);
