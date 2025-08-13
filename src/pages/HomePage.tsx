import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Gamepad2, Camera, ArrowRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Trivia Friday",
      date: "Dec 15, 2024",
      time: "7:00 PM",
      location: "Online",
      category: "trivia",
      spots: "20 spots left"
    },
    {
      id: 2,
      title: "Accra Beach Day",
      date: "Dec 22, 2024", 
      time: "10:00 AM",
      location: "Laboma Beach",
      category: "travel",
      spots: "5 spots left"
    },
    {
      id: 3,
      title: "Gaming Tournament",
      date: "Dec 28, 2024",
      time: "2:00 PM", 
      location: "East Legon",
      category: "gaming",
      spots: "12 spots left"
    }
  ];

  const stats = [
    { label: "Active Members", value: "500+", icon: Users },
    { label: "Events This Year", value: "48", icon: Calendar },
    { label: "Cities Reached", value: "8", icon: MapPin },
    { label: "Photos Shared", value: "2.5K", icon: Camera },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-accent to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              Games & Connect
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Ghana's premier youth community bringing people together through games, travel experiences, and unforgettable social events.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4 shadow-2xl">
                Join the Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Link to="/events">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  See Events
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-2 inline-block">
                    <stat.icon className="h-8 w-8 text-white mx-auto" />
                  </div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">What's Coming Up?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these exciting upcoming events - join the fun!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.category === 'trivia' ? 'bg-trivia/10 text-trivia' :
                      event.category === 'travel' ? 'bg-travel/10 text-travel' :
                      'bg-gaming/10 text-gaming'
                    }`}>
                      {event.category.toUpperCase()}
                    </span>
                    <span className="text-xs text-primary font-medium">{event.spots}</span>
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                  <Button 
                    variant={event.category === 'trivia' ? 'gaming' : event.category === 'travel' ? 'community' : 'default'}
                    className="w-full"
                  >
                    Join Event
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link to="/events">
              <Button variant="outline" size="lg">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the Adventure?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Connect with like-minded young people, create lasting memories, and be part of Ghana's most vibrant community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="bg-white text-primary hover:bg-white/90">
              Join WhatsApp Group
            </Button>
            <Link to="/community">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}