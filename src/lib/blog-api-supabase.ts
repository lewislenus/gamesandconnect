import { supabase } from '../integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  author_email?: string;
  featured_image?: string;
  category: 'gaming' | 'community' | 'events' | 'travel' | 'general';
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
  slug: string;
  tags?: string[];
  read_time?: number;
  views?: number;
}

// Sample blog posts data (fallback)
export const sampleBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to Games & Connect Community!',
    slug: 'welcome-to-games-connect-community',
    content: `# Welcome to Games & Connect!

We're thrilled to have you join our vibrant community! Games & Connect is more than just a platform - it's a place where gaming enthusiasts, travelers, and like-minded individuals come together to share experiences and create lasting connections.

## What We Offer

- **Gaming Events**: From FIFA tournaments to trivia nights, we host exciting events for gamers of all levels
- **Community Gatherings**: Beach cleanups, social meetups, and team-building activities
- **Travel Adventures**: Explore new destinations with fellow community members
- **Learning Opportunities**: Workshops, skill-sharing sessions, and collaborative projects

## Getting Started

1. Browse our upcoming events
2. Get tickets for activities that interest you
3. Connect with other members
4. Share your own experiences and ideas

## Community Guidelines

Our community thrives on respect, inclusivity, and fun. We welcome everyone regardless of skill level or background. Whether you're a hardcore gamer, casual player, or just looking to make new friends, there's a place for you here!

Ready to dive in? Check out our upcoming events and start your Games & Connect journey today!`,
    excerpt: 'Welcome to Games & Connect - your new favorite community for gaming, travel, and meaningful connections!',
    author: 'Games & Connect Team',
    author_email: 'team@gamesandconnect.com',
    category: 'community',
    status: 'published',
    published_at: '2024-08-15T10:00:00Z',
    created_at: '2024-08-15T09:30:00Z',
    updated_at: '2024-08-15T10:00:00Z',
    tags: ['welcome', 'community', 'getting-started'],
    read_time: 3,
    views: 156
  },
  {
    id: '2',
    title: 'FIFA Tournament Success: Celebrating Our Champions',
    slug: 'fifa-tournament-success-celebrating-our-champions',
    content: `# FIFA Tournament 2024: A Massive Success!

Last weekend's FIFA tournament was absolutely incredible! We had 32 participants battling it out for the championship title, and the energy was electric throughout the entire event.

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

What made this tournament special wasn't just the competition - it was the incredible sportsmanship and camaraderie displayed by everyone. Players were cheering for each other, sharing tips, and celebrating every great play together.

## What's Next?

Based on the overwhelming positive response, we're already planning our next FIFA tournament for October! We're also exploring the possibility of adding other games like Rocket League and Street Fighter.

Want to join the next tournament? Keep an eye on our events page for registration details!

Thank you to everyone who participated and made this event unforgettable. This is what Games & Connect is all about - bringing people together through the joy of gaming!`,
    excerpt: 'Our FIFA tournament brought together 32 players for an unforgettable day of competition and community spirit.',
    author: 'Marcus Johnson',
    author_email: 'marcus@gamesandconnect.com',
    category: 'gaming',
    status: 'published',
    published_at: '2024-08-18T14:30:00Z',
    created_at: '2024-08-18T13:45:00Z',
    updated_at: '2024-08-18T14:30:00Z',
    tags: ['fifa', 'tournament', 'gaming', 'competition', 'results'],
    read_time: 4,
    views: 89
  },
  {
    id: '3',
    title: 'Cape Coast Adventure: Gaming Meets Travel',
    slug: 'cape-coast-adventure-gaming-meets-travel',
    content: `# An Unforgettable Weekend in Cape Coast

Last weekend, 40 members of our community embarked on an incredible adventure to Cape Coast, combining our love for gaming with the exploration of Ghana's rich history and beautiful coastline.

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

## What's Next?

Based on the overwhelming success of this trip, we're already planning our next adventure:
- Kumasi cultural and gaming weekend
- Lake Volta gaming retreat
- Northern Ghana exploration trip

## Thank You

Special thanks to all the amazing people who joined us and made this trip unforgettable. Your enthusiasm, sportsmanship, and friendship make Games & Connect the incredible community it is today.

Can't wait for our next adventure together!`,
    excerpt: 'Join us as we recap our amazing Cape Coast adventure where gaming met travel in the most spectacular way.',
    author: 'Travel Team',
    author_email: 'travel@gamesandconnect.com',
    category: 'travel',
    status: 'published',
    published_at: '2024-08-25T16:00:00Z',
    created_at: '2024-08-25T15:15:00Z',
    updated_at: '2024-08-25T16:00:00Z',
    tags: ['travel', 'cape-coast', 'adventure', 'community'],
    read_time: 5,
    views: 312
  }
];

// Helper function to generate slug from title
export function generateBlogSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to calculate read time
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Get all published blog posts
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching blog posts:', error);
      return sampleBlogPosts.filter(post => post.status === 'published');
    }

    return data || [];
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    return sampleBlogPosts.filter(post => post.status === 'published');
  }
};

// Get all blog posts for admin (including drafts)
export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all blog posts:', error);
      return sampleBlogPosts;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllBlogPosts:', error);
    return sampleBlogPosts;
  }
};

// Get single blog post by slug
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      console.error('Error fetching blog post:', error);
      return sampleBlogPosts.find(post => post.slug === slug && post.status === 'published') || null;
    }

    // Increment view count
    if (data) {
      await supabase
        .from('blog_posts')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', data.id);
      
      // Update the returned data with the new view count
      data.views = (data.views || 0) + 1;
    }

    return data;
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    return sampleBlogPosts.find(post => post.slug === slug && post.status === 'published') || null;
  }
};

// Create new blog post
export const createBlogPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'slug' | 'views'>): Promise<BlogPost | null> => {
  try {
    const slug = generateBlogSlug(postData.title);
    const readTime = calculateReadTime(postData.content);
    
    const newPost = {
      ...postData,
      slug,
      read_time: readTime,
      views: 0,
      published_at: postData.status === 'published' ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([newPost])
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createBlogPost:', error);
    throw error;
  }
};

// Update blog post
export const updateBlogPost = async (id: string, postData: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const updateData: any = {
      ...postData,
    };

    // If title changed, update slug
    if (postData.title) {
      updateData.slug = generateBlogSlug(postData.title);
    }

    // If content changed, recalculate read time
    if (postData.content) {
      updateData.read_time = calculateReadTime(postData.content);
    }

    // If status changed to published and no published_at date, set it
    if (postData.status === 'published' && !postData.published_at) {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in updateBlogPost:', error);
    throw error;
  }
};

// Delete blog post
export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in deleteBlogPost:', error);
    throw error;
  }
};
