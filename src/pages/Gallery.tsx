import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Filter, Calendar, MapPin, Users } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    { value: 'all', label: 'All', count: 24 },
    { value: 'gaming', label: 'Gaming', count: 8 },
    { value: 'travel', label: 'Travel', count: 10 },
    { value: 'social', label: 'Social', count: 4 },
    { value: 'trivia', label: 'Trivia', count: 2 }
  ];

  const galleryItems = [
    {
      id: 1,
      title: "FIFA Tournament Finals",
      date: "Nov 2024",
      location: "East Legon",
      category: "gaming",
      participants: 16,
      image: "🎮",
      description: "Epic finale with amazing prizes and competitive gameplay"
    },
    {
      id: 2,
      title: "Cape Coast Castle Trip", 
      date: "Oct 2024",
      location: "Cape Coast",
      category: "travel",
      participants: 22,
      image: "🏰",
      description: "Educational and emotional journey through Ghana's history"
    },
    {
      id: 3,
      title: "Beach Volleyball Tournament",
      date: "Nov 2024", 
      location: "Laboma Beach",
      category: "social",
      participants: 18,
      image: "🏐",
      description: "Sandy fun under the sun with team competitions"
    },
    {
      id: 4,
      title: "Trivia Championship",
      date: "Oct 2024",
      location: "Online",
      category: "trivia",
      participants: 25,
      image: "🧠",
      description: "Mind-bending questions and fierce competition"
    },
    {
      id: 5,
      title: "Kakum Canopy Adventure",
      date: "Sep 2024",
      location: "Kakum National Park", 
      category: "travel",
      participants: 14,
      image: "🌳",
      description: "Walking among the treetops and wildlife spotting"
    },
    {
      id: 6,
      title: "Board Game Café Night",
      date: "Nov 2024",
      location: "Osu",
      category: "social", 
      participants: 12,
      image: "🎲",
      description: "Strategy games and great conversations over coffee"
    },
    {
      id: 7,
      title: "Mobile Gaming Competition",
      date: "Oct 2024",
      location: "Accra Mall",
      category: "gaming",
      participants: 20,
      image: "📱",
      description: "PUBG and Call of Duty mobile championships"
    },
    {
      id: 8,
      title: "Kumasi Cultural Tour", 
      date: "Aug 2024",
      location: "Kumasi",
      category: "travel",
      participants: 19,
      image: "👑",
      description: "Exploring the Asante Kingdom's rich heritage"
    }
  ];

  const filteredItems = galleryItems.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gaming': return 'bg-gaming text-white';
      case 'travel': return 'bg-travel text-white'; 
      case 'social': return 'bg-social text-white';
      case 'trivia': return 'bg-trivia text-white';
      default: return 'bg-primary text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Event Gallery
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Relive the amazing moments from our past events and get excited for what's coming next!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Section */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category.value);
                  setCurrentImageIndex(0);
                }}
                className="transition-all duration-300"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Image Carousel */}
        {filteredItems.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Featured Moments</h2>
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-3xl p-12 text-center shadow-xl">
                <div className="text-8xl mb-6">
                  {filteredItems[currentImageIndex]?.image}
                </div>
                <Badge className={`${getCategoryColor(filteredItems[currentImageIndex]?.category)} mb-4`}>
                  {filteredItems[currentImageIndex]?.category.toUpperCase()}
                </Badge>
                <h3 className="text-3xl font-bold text-foreground mb-4">
                  {filteredItems[currentImageIndex]?.title}
                </h3>
                <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
                  {filteredItems[currentImageIndex]?.description}
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{filteredItems[currentImageIndex]?.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{filteredItems[currentImageIndex]?.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{filteredItems[currentImageIndex]?.participants} participants</span>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              {filteredItems.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full shadow-lg bg-background/90 backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full shadow-lg bg-background/90 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Dots Indicator */}
              {filteredItems.length > 1 && (
                <div className="flex justify-center mt-6 gap-2">
                  {filteredItems.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentImageIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">All Events</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id}
                className={`bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  index === currentImageIndex ? 'ring-2 ring-primary shadow-lg' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <div className="text-4xl mb-3">{item.image}</div>
                <Badge className={`${getCategoryColor(item.category)} mb-2`}>
                  {item.category.toUpperCase()}
                </Badge>
                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{item.participants}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">Our Journey So Far</h3>
          <div className="grid sm:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">48</div>
              <div className="text-muted-foreground">Total Events</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">850+</div>
              <div className="text-muted-foreground">Participants</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2.5K</div>
              <div className="text-muted-foreground">Photos Taken</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">8</div>
              <div className="text-muted-foreground">Cities Visited</div>
            </div>
          </div>
          
          <div className="mt-8">
            <p className="text-xl text-muted-foreground mb-6">
              Want to be featured in our next gallery? Join an upcoming event!
            </p>
            <Button variant="hero" size="lg">
              Browse Upcoming Events
            </Button>
          </div>
        </div>

        {/* Video Section Placeholder */}
        <div className="mt-16 text-center bg-muted/30 rounded-3xl p-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Video Highlights</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Check out our YouTube channel for event recaps, behind-the-scenes footage, and member spotlights.
          </p>
          <Button variant="community" size="lg">
            Visit Our YouTube Channel
          </Button>
        </div>
      </div>
    </div>
  );
}