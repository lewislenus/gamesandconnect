import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
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
                  Games & Connect
                </div>
                <h1 className="text-6xl lg:text-8xl font-black text-foreground mb-6 leading-none">
                  Play. Travel. Connect.
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                  Join a growing community of young Ghanaians making memories through fun, adventure, and connection. 
                  Experience our exciting events, travel adventures, and build lasting friendships.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/gallery">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="rounded-full text-base px-8 py-6"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    See our adventures
                  </Button>
                </Link>
                <Link to="/events">
                  <Button 
                    size="lg" 
                    className="rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90"
                  >
                    Join the journey
                  </Button>
                </Link>
              </div>

              {/* Event Info */}
              <div className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 max-w-md">
                <div className="text-right mb-4">
                  <div className="text-2xl font-bold text-foreground">Next Event</div>
                  <div className="text-lg text-muted-foreground">Two Days in Cape Coast</div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Join us for an amazing 2-day adventure to Cape Coast featuring historical tours, 
                  beach fun, and unforgettable memories with the community.
                </p>
              </div>
            </div>

            <div className="relative">
              {/* Hero Image */}
              <div className="aspect-square rounded-3xl overflow-hidden relative shadow-2xl">
                <img 
                  src="https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1344_y4iq2a.jpg"
                  alt="Games & Connect Community"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Play className="w-5 h-5" />
                    <span className="text-sm font-medium">Live the Adventure</span>
                  </div>
                  <p className="text-sm opacity-90">Join Ghana's most vibrant community</p>
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
              {/* Community Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://res.cloudinary.com/drkjnrvtu/image/upload/v1742488675/_MG_1679_ovnanp.jpg"
                  alt="Games & Connect Community Gathering"
                  className="w-full h-full object-cover aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"></div>
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <div className="text-3xl font-black text-foreground mb-2">200+</div>
                    <div className="text-sm text-muted-foreground">Community Members</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-5xl font-black text-foreground mb-6">
                Where <span className="text-primary">adventure</span> meets community in the heart of
              </h2>
              <h3 className="text-4xl font-bold text-primary mb-8">
                Ghana
              </h3>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We believe life is meant to be lived fully. Through gaming tournaments, travel experiences, 
                and meaningful connections, we're building Ghana's most vibrant community of young explorers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Our <span className="text-primary">Three Pillars</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything we do is built around our core philosophy: Play, Travel, and Connect
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {[
              {
                icon: "🎮",
                title: "PLAY",
                subtitle: "Gaming & Entertainment",
                description: "From tournaments to casual game nights, we celebrate the joy of play in all its forms.",
                features: ["Gaming Tournaments", "Board Games", "Video Games", "Card Games"]
              },
              {
                icon: "✈️",
                title: "TRAVEL",
                subtitle: "Adventures & Exploration",
                description: "Discover Ghana's hidden gems and beyond with fellow adventurers who share your wanderlust.",
                features: ["Cape Coast Tours", "Cultural Sites", "Beach Adventures", "Historical Exploration"]
              },
              {
                icon: "🤝",
                title: "CONNECT",
                subtitle: "Community & Relationships",
                description: "Build meaningful friendships and professional networks in Ghana's most welcoming community.",
                features: ["Networking Events", "Skill Workshops", "WhatsApp Community", "Social Gatherings"]
              }
            ].map((pillar, index) => (
              <div key={index} className="text-center group">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h3 className="text-3xl font-black text-foreground mb-2">{pillar.title}</h3>
                <h4 className="text-lg font-semibold text-primary mb-4">{pillar.subtitle}</h4>
                <p className="text-muted-foreground leading-relaxed mb-6">{pillar.description}</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  {pillar.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center justify-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Upcoming <span className="text-primary">Adventures</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From gaming tournaments to weekend getaways, discover your next adventure with us!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Two Days in Cape Coast",
                date: "August 22, 2025",
                time: "7:00 AM",
                location: "Cape Coast, Ghana",
                price: "Contact for pricing",
                image: "🏰",
                category: "TRAVEL"
              },
              {
                title: "Gaming Tournament",
                date: "September 5, 2025",
                time: "3:00 PM",
                location: "Accra",
                price: "GHS 50",
                image: "🎮",
                category: "PLAY"
              },
              {
                title: "Community Networking",
                date: "September 12, 2025",
                time: "6:00 PM",
                location: "East Legon",
                price: "GHS 30",
                image: "🎉",
                category: "CONNECT"
              }
            ].map((event, index) => (
              <div key={index} className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6 hover:bg-muted/50 transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{event.image}</div>
                  <div className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {event.category}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{event.price}</span>
                  <Button 
                    size="sm" 
                    className="rounded-full"
                    onClick={() => window.open('/events', '_self')}
                  >
                    Join Adventure
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Collection */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Our <span className="text-primary">Games Collection</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our variety of exciting games and activities for all skill levels
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { name: "Archery", emoji: "🏹", level: "Intermediate" },
              { name: "Card Games", emoji: "🃏", level: "Beginner" },
              { name: "Cup Games", emoji: "🥤", level: "Beginner" },
              { name: "Darts", emoji: "🎯", level: "Beginner" },
              { name: "Football", emoji: "⚽", level: "Intermediate" },
              { name: "Limbo", emoji: "🤸", level: "Beginner" },
              { name: "Shooting Range", emoji: "🎪", level: "Intermediate" },
              { name: "UNO", emoji: "🎴", level: "Beginner" },
              { name: "Volleyball", emoji: "🏐", level: "Intermediate" }
            ].map((game, index) => (
              <div key={index} className="bg-background rounded-2xl p-4 text-center hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-3">{game.emoji}</div>
                <h3 className="font-bold text-foreground mb-1">{game.name}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {game.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              Choose Your <span className="text-primary">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join one of our four legendary teams and compete for glory, prizes, and bragging rights!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Team Red",
                color: "red",
                bgColor: "bg-red-500",
                textColor: "text-red-500",
                borderColor: "border-red-500",
                motto: "Fire & Passion",
                members: "485",
                wins: "127"
              },
              {
                name: "Team Yellow",
                color: "yellow", 
                bgColor: "bg-yellow-500",
                textColor: "text-yellow-600",
                borderColor: "border-yellow-500",
                motto: "Lightning Speed",
                members: "423",
                wins: "134"
              },
              {
                name: "Team Green",
                color: "green",
                bgColor: "bg-green-500", 
                textColor: "text-green-500",
                borderColor: "border-green-500",
                motto: "Nature's Force",
                members: "467",
                wins: "119"
              },
              {
                name: "Team Blue",
                color: "blue",
                bgColor: "bg-blue-500",
                textColor: "text-blue-500", 
                borderColor: "border-blue-500",
                motto: "Ocean Deep",
                members: "512",
                wins: "142"
              }
            ].map((team, index) => (
              <div key={index} className={`relative bg-muted/30 backdrop-blur-sm rounded-2xl p-6 border-2 ${team.borderColor} hover:bg-muted/50 transition-all duration-300 transform hover:scale-105 group`}>
                {/* Team Color Badge */}
                <div className={`absolute -top-3 -right-3 w-12 h-12 ${team.bgColor} rounded-full flex items-center justify-center shadow-lg`}>
                  <div className="w-6 h-6 bg-white rounded-full"></div>
                </div>
                
                {/* Team Icon */}
                <div className={`text-6xl mb-4 ${team.textColor} transform group-hover:scale-110 transition-transform duration-300`}>
                  {team.color === 'red' && '🔥'}
                  {team.color === 'yellow' && '⚡'}
                  {team.color === 'green' && '🌿'}
                  {team.color === 'blue' && '🌊'}
                </div>
                
                <h3 className={`text-2xl font-bold ${team.textColor} mb-2`}>{team.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 font-medium">{team.motto}</p>
                
                {/* Team Stats */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Members:</span>
                    <span className="font-bold text-foreground">{team.members}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wins:</span>
                    <span className="font-bold text-foreground">{team.wins}</span>
                  </div>
                </div>
                
                <Link to={`/team-${team.color}`}>
                  <Button className={`w-full rounded-full ${team.bgColor} hover:${team.bgColor}/90 text-white border-0`}>
                    View Team
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-6">
              Can't decide? Don't worry - you can switch teams anytime before major tournaments!
            </p>
            <Link to="/teams">
              <Button variant="outline" size="lg" className="rounded-full">
                View All Teams
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">
              By The <span className="text-primary">Numbers</span>
            </h2>
            <p className="text-xl text-background/80 max-w-2xl mx-auto">
              Our community continues to grow stronger every day
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "200+", label: "Active Members" },
              { number: "24+", label: "Events Organized" },
              { number: "4", label: "Team Colors" },
              { number: "100%", label: "Fun Guaranteed" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-black text-primary mb-2">{stat.number}</div>
                <div className="text-lg text-background/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-foreground mb-6">
              What Our <span className="text-primary">Community Says</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from real people in our community
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Adjoa K.",
                role: "Adventure Enthusiast",
                quote: "Games & Connect opened my eyes to a whole new Ghana. From Cape Coast to Kumasi, every adventure teaches me something new about my country and myself.",
                avatar: "👩🏿‍💻",
                pillar: "TRAVEL"
              },
              {
                name: "Kojo M.",
                role: "Tournament Champion",
                quote: "I thought I was good at games until I joined G&C! The competition pushed me to my limits, and I've made amazing friends along the way.",
                avatar: "👨🏿‍🎨",
                pillar: "PLAY"
              },
              {
                name: "Efua A.",
                role: "Community Leader",
                quote: "This community changed my life. I've met my best friends here and found a family that truly cares. G&C is where connections become family.",
                avatar: "👩🏿‍🚀",
                pillar: "CONNECT"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-muted/30 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                    {testimonial.pillar}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-background rounded-3xl p-12 shadow-lg">
            <h2 className="text-4xl font-black text-foreground mb-4">
              Stay In The <span className="text-primary">Loop</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Get the latest updates on events, tournaments, and community news
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-3 rounded-full border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button 
                size="lg" 
                className="rounded-full px-8"
                onClick={() => alert('Thanks for subscribing! We\'ll keep you updated on all our events.')}
              >
                Subscribe
              </Button>
            </div>
            <div className="mt-6">
              <p className="text-sm text-muted-foreground mb-3">Or join our WhatsApp community:</p>
              <Button 
                variant="outline"
                onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
              >
                Join WhatsApp Group
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-foreground mb-6">
            Ready to Play, Travel & Connect?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Ghana's most vibrant community where every day is an adventure, every game is a lesson, 
            and every connection is a new beginning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="rounded-full text-base px-8 py-6 bg-primary hover:bg-primary/90"
              onClick={() => window.open('/events', '_self')}
            >
              Start Your Adventure
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-full text-base px-8 py-6"
              onClick={() => window.open('https://chat.whatsapp.com/LT0Zolnz9fMLm7b7aKtQld', '_blank')}
            >
              Join Our Community
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
