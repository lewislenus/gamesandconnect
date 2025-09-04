import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Trophy, Calendar, MapPin, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TeamBlue() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const teamImages = [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746918906/_MG_2027_oblrvo.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915400/_MG_2284_njl6kn.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915395/_MG_2305_z4ozhb.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915383/_MG_2106_epgam5.jpg"
  ];

  const teamMembers = [
    {
      name: "Kwesi A.",
      role: "Team Captain",
      avatar: "👨🏿‍✈️",
      quote: "Team Blue is the depth of the ocean - calm on the surface but with immense power underneath.",
      joinedDate: "Mar 2025",
      achievements: ["Akosombo Champion", "Lake Adventure Leader", "Team Builder"]
    },
    {
      name: "Abena K.",
      role: "Strategy Coordinator",
      avatar: "👩🏿‍💼",
      quote: "Like the deep blue sea, we adapt to any situation and find ways to navigate through challenges.",
      joinedDate: "Feb 2025",
      achievements: ["Master Strategist", "Boat Activity Expert", "Problem Solver"]
    },
    {
      name: "Yaw O.",
      role: "Adventure Lead",
      avatar: "👨🏿‍💻",
      quote: "Innovation flows through Team Blue like a river. We're always finding new ways to excel.",
      joinedDate: "Apr 2025",
      achievements: ["Adventure Tourism Pro", "Dam Tour Guide", "Team Activities Coach"]
    },
    {
      name: "Efua D.",
      role: "Community Manager",
      avatar: "👩🏿‍🎓",
      quote: "Trust and loyalty run deeper than the ocean in Team Blue. We're family first, competitors second.",
      joinedDate: "May 2025",
      achievements: ["Community Builder", "Travel Mentor", "Cultural Ambassador"]
    }
  ];

  const recentEvents = [
    {
      name: "Akosombo Games Day Tournament",
      date: "Jun 15, 2025",
      location: "Akosombo, Eastern Region",
      result: "2nd Place - Runner-up",
      participants: "Blue Waves Squad"
    },
    {
      name: "Aburi Gardens Adventure",
      date: "Jul 22, 2025",
      location: "Aburi Botanical Gardens",
      result: "2nd Place",
      participants: "20 Blue Members"
    },
    {
      name: "Beach Day Games",
      date: "Jul 8, 2025",
      location: "Labadi Beach, Accra",
      result: "Participation",
      participants: "24 Team Members"
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
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 py-20 relative overflow-hidden">
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
                <div className="text-8xl">🌊</div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white mb-2">
                    Team Blue
                  </h1>
                  <p className="text-2xl text-white/90 font-semibold">"Ocean's Depth"</p>
                </div>
              </div>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                The strategic minds that run as deep as the ocean. Team Blue brings wisdom, innovation, 
                and unwavering loyalty to every challenge we face together.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">30</div>
                  <div className="text-white/80 text-sm">Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">1</div>
                  <div className="text-white/80 text-sm">Wins</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">#1</div>
                  <div className="text-white/80 text-sm">Ranking</div>
                </div>
              </div>
              
              <Button size="lg" className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-8 py-4">
                Join Team Blue
              </Button>
            </div>
            
            <div className="relative">
              {/* Team Photo Carousel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={teamImages[currentImageIndex]}
                  alt="Team Blue Members"
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
              Meet the <span className="text-blue-500">Deep Thinkers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The strategic minds and innovative souls who make Team Blue a force of wisdom and depth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4">{member.avatar}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-blue-600">{member.role}</CardDescription>
                  <Badge variant="outline" className="w-fit mx-auto mt-2 border-blue-200 text-blue-600">
                    Joined {member.joinedDate}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 mb-4">
                    <Quote className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{member.quote}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-blue-600 mb-2">Achievements</h4>
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
              Recent <span className="text-blue-500">Waves</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how Team Blue has been making strategic moves and innovative breakthroughs in the community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recentEvents.map((event, index) => (
              <Card key={index} className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-500 text-white">{event.result}</Badge>
                    {index === 2 && <Trophy className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <CardTitle className="text-lg text-blue-700">{event.name}</CardTitle>
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
              What Makes Us <span className="text-blue-500">Deep</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Team Blue's core values and what you can expect when you join our depth-focused family.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "Strategic Thinking",
                description: "We think multiple moves ahead and approach every challenge with careful planning."
              },
              {
                icon: "🌊",
                title: "Adaptive Flow",
                description: "Like water, we adapt to any situation while maintaining our core strength and direction."
              },
              {
                icon: "🔬",
                title: "Innovation Focus",
                description: "We constantly explore new technologies and methods to stay ahead of the curve."
              },
              {
                icon: "🤝",
                title: "Deep Loyalty",
                description: "Our bonds run deeper than competition - we're committed to each other's success."
              },
              {
                icon: "🎯",
                title: "Precision Excellence",
                description: "We aim for perfection in every detail and execute with surgical precision."
              },
              {
                icon: "🌀",
                title: "Calm Power",
                description: "We maintain composure under pressure and let our actions speak louder than words."
              }
            ].map((value, index) => (
              <Card key={index} className="text-center border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle className="text-xl text-blue-600">{value.title}</CardTitle>
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
      <section className="py-20 bg-gradient-to-r from-blue-500 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Dive Deep?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Team Blue and become part of a strategic community that values depth, innovation, 
            and unwavering loyalty. Let's navigate to victory together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 font-semibold px-8 py-4"
            >
              Join Team Blue Now
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
