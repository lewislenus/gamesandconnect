import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Play } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-background overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className="mb-8">
                <div className="text-sm font-semibold text-primary mb-4 tracking-wider uppercase">
                  Game & Connect
                </div>
                <h1 className="text-6xl lg:text-8xl font-black text-foreground mb-6 leading-none">
                  Level Up!
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  Get ready to play, compete, dance, connect and explore at Ghana's biggest gaming event – Games & Connect! Join us for a day of epic battles, thrilling challenges, and unforgettable connections with fellow gamers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button variant="outline" size="lg" className="rounded-full text-base px-8 py-6">
                  <Play className="mr-2 h-5 w-5" />
                  Watch past events
                </Button>
                <Button size="lg" className="rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90">
                  Get tickets
                </Button>
              </div>

              {/* Event Info */}
              <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 max-w-md">
                <div className="text-right mb-4">
                  <div className="text-2xl font-bold text-foreground">8th June, 2025</div>
                  <div className="text-lg text-muted-foreground">Accra, GH</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ghana is stressful enough. At Games & Connect, we are creating a safe place to relax, play, enjoy good food and connect with amazing people.
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Video/Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                <div className="relative text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Play className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">Watch our highlights</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {/* Gaming Traffic Light Illustration */}
              <div className="relative bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="w-32 h-48 bg-foreground rounded-lg flex items-center justify-center relative">
                  <div className="absolute top-4 left-4 right-4">
                    <div className="h-1 bg-red-500 rounded-full mb-2"></div>
                    <div className="h-1 bg-yellow-500 rounded-full mb-2"></div>
                    <div className="h-1 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-4xl font-bold text-background">6.0</div>
                </div>
                <div className="absolute -top-4 -left-4 w-8 h-8">
                  <div className="w-4 h-8 bg-yellow-600 rounded-t-full"></div>
                  <div className="w-8 h-2 bg-yellow-600 -mt-1"></div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8">
                  <div className="w-4 h-8 bg-yellow-600 rounded-t-full ml-auto"></div>
                  <div className="w-8 h-2 bg-yellow-600 -mt-1"></div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-5xl font-black text-foreground mb-6">
                The <span className="text-primary">largest</span> game community in the city of
              </h2>
              <h3 className="text-4xl font-bold text-primary mb-8">
                Accra
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Ghana is stressful enough. At Games & Connect, we are creating a safe place to relax, play, enjoy good food and connect with amazing people.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Ticker */}
      <section className="py-4 bg-foreground text-background overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-8 mx-8">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Date: 08-06-2025</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">Time: 3pm</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">Venue: TBD</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-foreground mb-6">
            Ready to Level Up?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Connect with like-minded young people, create lasting memories, and be part of Ghana's most vibrant gaming community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90">
              Get your tickets now
            </Button>
            <Button variant="outline" size="lg" className="rounded-full text-base px-8 py-6">
              Join WhatsApp Group
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}