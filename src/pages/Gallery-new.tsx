import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Filter, Calendar, MapPin, Users } from 'lucide-react';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    { value: 'all', label: 'All Adventures', count: 8 },
    { value: 'gaming', label: 'Play', count: 2 },
    { value: 'travel', label: 'Travel', count: 3 },
    { value: 'social', label: 'Connect', count: 2 },
    { value: 'trivia', label: 'Challenge', count: 1 }
  ];

  const galleryItems = [
    {
      id: 1,
      title: "Esports Championship Finals",
      date: "Nov 2024",
      location: "East Legon",
      category: "gaming",
      participants: 32,
      image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1414_ij80mu.jpg",
      description: "Epic FIFA and Mobile Legends finals with tech industry networking"
    },
    {
      id: 2,
      title: "Cape Coast Heritage Experience", 
      date: "Oct 2024",
      location: "Cape Coast",
      category: "travel",
      participants: 22,
      image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1424_f0harp.jpg",
      description: "Cultural immersion journey through Ghana's historic coastal treasures"
    },
    {
      id: 3,
      title: "Young Professionals Mixer",
      date: "Nov 2024", 
      location: "Silverbird Centre",
      category: "social",
      participants: 35,
      image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1623_olhksw.jpg",
      description: "Board games meet networking in perfect harmony"
    },
    {
      id: 4,
      title: "Friday Challenge Night",
      date: "Oct 2024",
      location: "East Legon",
      category: "trivia",
      participants: 40,
      image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1656_yoiklo.jpg",
      description: "Gaming tournaments mixed with brain-teasing challenges"
    },
    {
      id: 5,
      title: "Kakum Forest Adventure",
      date: "Sep 2024",
      location: "Kakum National Park", 
      category: "travel",
      participants: 20,
      image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1677_v8n5nu.jpg",
      description: "Canopy walks, cultural workshops, and team bonding"
    },
    {
      id: 6,
      title: "Community Connect BBQ",
      date: "Nov 2024",
      location: "Laboma Beach",
      category: "social", 
      participants: 45,
      image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1758_mj5kho.jpg",
      description: "Beach cleanup followed by community bonding and BBQ"
    },
    {
      id: 7,
      title: "Gaming & Tech Meetup",
      date: "Oct 2024",
      location: "Impact Hub Accra",
      category: "gaming",
      participants: 28,
      image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/_MG_1776_eob5jv.jpg",
      description: "Where gaming passion meets tech innovation and career growth"
    },
    {
      id: 8,
      title: "Kumasi Cultural Discovery", 
      date: "Aug 2024",
      location: "Kumasi",
      category: "travel",
      participants: 18,
      image: "https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488676/back_k2fwpf.jpg",
      description: "Deep dive into Ashanti heritage with local artisan workshops"
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
            Adventure Gallery
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Relive the incredible moments from our play, travel, and connect adventures across Ghana!
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
                <div className="w-full h-64 mb-6 rounded-2xl overflow-hidden">
                  <img 
                    src={filteredItems[currentImageIndex]?.image}
                    alt={filteredItems[currentImageIndex]?.title}
                    className="w-full h-full object-cover"
                  />
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
                <div className="w-full h-32 mb-3 rounded-xl overflow-hidden">
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
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
              Ready to create your own adventure story? Join our next experience!
            </p>
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => window.open('/events', '_self')}
            >
              Explore Upcoming Adventures
            </Button>
          </div>
        </div>

        {/* Video Section Placeholder */}
        <div className="mt-16 text-center bg-muted/30 rounded-3xl p-12">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-bold text-foreground mb-4">Video Highlights</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Watch our adventure recaps, behind-the-scenes moments, and member transformation stories on YouTube.
          </p>
          <Button variant="community" size="lg">
            Visit Our YouTube Channel
          </Button>
        </div>
      </div>
    </div>
  );
}
