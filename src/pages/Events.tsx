import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Events() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const events = [
    {
      id: 1,
      title: "Trivia Friday",
      description: "Weekly trivia night with prizes and fun challenges",
      date: "December 15, 2024",
      time: "7:00 PM",
      location: "Online via Zoom",
      category: "trivia",
      spots: 20,
      totalSpots: 30,
      price: "Free",
      image: "🧠",
      status: "open"
    },
    {
      id: 2,
      title: "Accra Beach Cleanup & Fun Day",
      description: "Help clean Laboma Beach followed by games and BBQ",
      date: "December 22, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Laboma Beach, Accra",
      category: "travel",
      spots: 5,
      totalSpots: 25,
      price: "₵50",
      image: "🏖️",
      status: "filling-fast"
    },
    {
      id: 3,
      title: "FIFA Tournament",
      description: "FIFA 24 tournament with cash prizes for winners",
      date: "December 28, 2024",
      time: "2:00 PM - 8:00 PM",
      location: "East Legon Game Center",
      category: "gaming",
      spots: 12,
      totalSpots: 16,
      price: "₵30",
      image: "🎮",
      status: "open"
    },
    {
      id: 4,
      title: "New Year Kumasi Trip",
      description: "3-day adventure exploring the cultural heart of Ghana",
      date: "December 30, 2024 - January 1, 2025",
      time: "All Day",
      location: "Kumasi",
      category: "travel",
      spots: 2,
      totalSpots: 20,
      price: "₵800",
      image: "🚌",
      status: "almost-full"
    },
    {
      id: 5,
      title: "Board Game Night",
      description: "Monopoly, Scrabble, and local games with snacks",
      date: "January 5, 2025",
      time: "6:00 PM - 10:00 PM",
      location: "Osu Community Center",
      category: "social",
      spots: 15,
      totalSpots: 20,
      price: "₵25",
      image: "🎲",
      status: "open"
    },
    {
      id: 6,
      title: "Cooking Challenge",
      description: "Learn to cook traditional Ghanaian dishes together",
      date: "January 12, 2025",
      time: "3:00 PM - 7:00 PM",
      location: "Tema Community Kitchen",
      category: "social",
      spots: 8,
      totalSpots: 12,
      price: "₵40",
      image: "👨‍🍳",
      status: "open"
    }
  ];

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'trivia', label: 'Trivia' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'travel', label: 'Travel' },
    { value: 'social', label: 'Social' }
  ];

  const filteredEvents = events.filter(event => {
    const matchesFilter = selectedFilter === 'all' || event.category === selectedFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'almost-full': return 'bg-destructive/10 text-destructive';
      case 'filling-fast': return 'bg-secondary/10 text-secondary';
      default: return 'bg-primary/10 text-primary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'almost-full': return 'Almost Full';
      case 'filling-fast': return 'Filling Fast';
      default: return 'Open';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trivia': return 'bg-trivia text-white';
      case 'gaming': return 'bg-gaming text-white';
      case 'travel': return 'bg-travel text-white';
      case 'social': return 'bg-social text-white';
      default: return 'bg-primary text-white';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary to-accent py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Join exciting events, meet new friends, and create unforgettable memories with Games & Connect
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters & Search */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedFilter === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFilter(category.value)}
                    className="transition-all duration-300"
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredEvents.length} events
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{event.image}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl mb-1">{event.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {event.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{event.price}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-3 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-3 text-primary" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-3 text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-3 text-primary" />
                    <span>{event.spots} spots remaining of {event.totalSpots}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-1">
                    <span>Spots filled</span>
                    <span>{event.totalSpots - event.spots}/{event.totalSpots}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((event.totalSpots - event.spots) / event.totalSpots) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    disabled={event.spots === 0}
                    variant={event.category === 'trivia' ? 'gaming' : 
                            event.category === 'travel' ? 'community' : 'default'}
                  >
                    {event.spots === 0 ? 'Fully Booked' : 'Register Now'}
                  </Button>
                  <Button variant="outline">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-muted-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Don't See What You're Looking For?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community and suggest events you'd like to see. We're always open to new ideas!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => window.open('/community', '_self')}
            >
              Join WhatsApp Group
            </Button>
            <Button variant="outline" size="lg">
              Suggest an Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}