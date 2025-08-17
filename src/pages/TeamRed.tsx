import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Trophy, Calendar, MapPin, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TeamRed() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const teamImages = [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915399/_MG_2393_cv5xbp.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918852/_MG_2075_i2peyk.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915388/_MG_2318_kszvtt.jpg"
  ];

  const teamMembers = [
    {
      name: "Kwame A.",
      role: "Team Captain",
      avatar: "👨🏿‍💼",
      quote: "Leading Team Red means bringing out the fire in everyone. We don't just compete - we dominate!",
      joinedDate: "Jan 2024",
      achievements: ["FIFA Champion 2024", "Team Builder Award", "Community Leader"]
    },
    {
      name: "Ama K.",
      role: "Strategy Coordinator",
      avatar: "👩🏿‍💻",
      quote: "Every victory starts with a plan. I make sure Team Red is always three steps ahead.",
      joinedDate: "Mar 2024",
      achievements: ["Strategic Mind Award", "Tournament Organizer", "Gaming Mentor"]
    },
    {
      name: "Kojo M.",
      role: "Gaming Champion",
      avatar: "👨🏿‍🎮",
      quote: "When the pressure is on, Team Red rises. That's the power of passion and preparation.",
      joinedDate: "Feb 2024",
      achievements: ["Call of Duty Champion", "MVP Award 2024", "Team Spirit Award"]
    },
    {
      name: "Efua S.",
      role: "Community Ambassador",
      avatar: "👩🏿‍🎨",
      quote: "Team Red isn't just about winning - we're about lifting each other up and having fun together.",
      joinedDate: "Apr 2024",
      achievements: ["Community Builder", "Event Coordinator", "Friendship Champion"]
    }
  ];

  const recentEvents = [
    {
      name: "FIFA Tournament Final",
      date: "Dec 15, 2024",
      location: "East Legon Center",
      result: "1st Place",
      participants: "Team Red Squad"
    },
    {
      name: "Community Beach Day",
      date: "Nov 28, 2024", 
      location: "Laboma Beach",
      result: "Team Building",
      participants: "25 Members"
    },
    {
      name: "Gaming Marathon",
      date: "Nov 10, 2024",
      location: "Accra Mall",
      result: "2nd Place",
      participants: "Red Warriors"
    }
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % teamImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + teamImages.length) % teamImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/teams" className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Teams
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-8xl">🔥</div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white mb-2">
                    Team Red
                  </h1>
                  <p className="text-2xl text-white/90 font-semibold">"Fire & Passion"</p>
                </div>
              </div>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                The warriors of Games & Connect. Team Red brings fierce competition, unwavering determination, 
                and passionate energy to every challenge. We don't just play games - we ignite the spirit of victory.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">485</div>
                  <div className="text-white/80 text-sm">Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">127</div>
                  <div className="text-white/80 text-sm">Wins</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">#2</div>
                  <div className="text-white/80 text-sm">Ranking</div>
                </div>
              </div>
              
              <Button size="lg" className="bg-white text-red-600 hover:bg-white/90 font-semibold px-8 py-4">
                Join Team Red
              </Button>
            </div>
            
            <div className="relative">
              {/* Team Photo Carousel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={teamImages[currentImageIndex]}
                  alt="Team Red Members"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Navigation Buttons */}
                {teamImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 border-white/30 text-white hover:bg-white/30"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Dots Indicator */}
                {teamImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {teamImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Meet the <span className="text-red-500">Fire Warriors</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate leaders and dedicated members who make Team Red the fierce competitor it is today.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-red-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4">{member.avatar}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-red-600">{member.role}</CardDescription>
                  <Badge variant="outline" className="w-fit mx-auto mt-2 border-red-200 text-red-600">
                    Joined {member.joinedDate}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 mb-4">
                    <Quote className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{member.quote}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-red-600 mb-2">Achievements</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.achievements.map((achievement, achievementIndex) => (
                        <Badge key={achievementIndex} variant="secondary" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-20 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Recent <span className="text-red-500">Victories</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how Team Red has been dominating the Games & Connect arena with passion and strategy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recentEvents.map((event, index) => (
              <Card key={index} className="border-red-200 bg-gradient-to-br from-red-50 to-red-100/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-red-500 text-white">{event.result}</Badge>
                    {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <CardTitle className="text-lg text-red-700">{event.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{event.participants}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              What Makes Us <span className="text-red-500">Legendary</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Team Red's core values and what you can expect when you join our fire family.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔥",
                title: "Passionate Energy",
                description: "We bring intensity and enthusiasm to everything we do, from casual games to major tournaments."
              },
              {
                icon: "🏆",
                title: "Winning Mindset",
                description: "We play to win, but we also know how to learn from defeats and come back stronger."
              },
              {
                icon: "🤝",
                title: "Team Unity",
                description: "Our bond is unbreakable. When one Red member succeeds, we all celebrate together."
              },
              {
                icon: "⚡",
                title: "Quick Adaptation",
                description: "Fast-paced games require quick thinking. We excel at adapting strategies on the fly."
              },
              {
                icon: "🎯",
                title: "Strategic Focus",
                description: "Every move is calculated. We combine passion with smart tactical planning."
              },
              {
                icon: "🌟",
                title: "Leadership",
                description: "Many community leaders come from Team Red. We build confidence and leadership skills."
              }
            ].map((value, index) => (
              <Card key={index} className="text-center border-red-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle className="text-xl text-red-600">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Ignite Your Passion?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Team Red and become part of a legendary community that combines fierce competition 
            with genuine friendship. The fire starts with you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-red-600 hover:bg-white/90 font-semibold px-8 py-4"
            >
              Join Team Red Now
            </Button>
            <Link to="/events">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/10 px-8 py-4"
              >
                Attend an Event First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
