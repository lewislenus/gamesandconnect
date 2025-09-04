import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Trophy, Calendar, MapPin, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TeamYellow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const teamImages = [
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915401/_MG_2185_rqpdrv.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915388/_MG_2118_gi8okx.jpg",
    "https://res.cloudinary.com/drkjnrvtu/image/upload/v1746915393/_MG_2181_oohsbh.jpg"
  ];

  const teamMembers = [
    {
      name: "Ama S.",
      role: "Team Captain & History Expert",
      avatar: "👩🏿‍🎨",
      quote: "Team Yellow is pure sunshine - we bring joy, creativity, and boundless energy to everything we do!",
      joinedDate: "Jan 2025",
      achievements: ["Cape Coast Quiz Champion", "History Master", "Cultural Knowledge Leader"]
    },
    {
      name: "Kwame L.",
      role: "Historical Research Director",
      avatar: "👨🏿‍🎭",
      quote: "Life's too short to be serious all the time. Team Yellow knows how to have fun while winning!",
      joinedDate: "Feb 2025",
      achievements: ["Quiz Tournament Winner", "Cultural Heritage Expert", "Strategic Thinker"]
    },
    {
      name: "Akua J.",
      role: "Knowledge Coordinator",
      avatar: "👩🏿‍🎨",
      quote: "Creativity flows like sunshine in Team Yellow. We turn every challenge into an opportunity for fun!",
      joinedDate: "Mar 2025",
      achievements: ["Historical Quiz Victor", "Educational Leader", "Memory Champion"]
    },
    {
      name: "Kojo B.",
      role: "Community Historian",
      avatar: "👨🏿‍🚀",
      quote: "Team Yellow is infectious energy! Once you experience our vibe, you'll never want to leave.",
      joinedDate: "Apr 2025",
      achievements: ["Cape Coast Champion", "Cultural Ambassador", "Knowledge Catalyst"]
    }
  ];

  const recentEvents = [
    {
      name: "Cape Coast Historical Quiz Challenge",
      date: "Sep 14, 2025",
      location: "Cape Coast, Central Region",
      result: "1st Place - Champions",
      participants: "Golden Knowledge Squad"
    },
    {
      name: "Beach Day Games",
      date: "Jul 8, 2025",
      location: "Labadi Beach, Accra",
      result: "2nd Place",
      participants: "24 Sunshine Members"
    },
    {
      name: "Akosombo Adventure Games",
      date: "Jun 15, 2025",
      location: "Akosombo, Eastern Region",
      result: "Participation",
      participants: "28 Team Members"
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
      <section className="bg-gradient-to-r from-yellow-400 to-yellow-500 py-20 relative overflow-hidden">
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
                <div className="text-8xl">☀️</div>
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white mb-2">
                    Team Yellow
                  </h1>
                  <p className="text-2xl text-white/90 font-semibold">"Sunshine Energy"</p>
                </div>
              </div>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                The radiant hearts that bring pure joy and creative energy to everything we touch. 
                Team Yellow believes that life's an adventure best enjoyed with laughter and light!
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">623</div>
                  <div className="text-white/80 text-sm">Members</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">201</div>
                  <div className="text-white/80 text-sm">Wins</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-1">#3</div>
                  <div className="text-white/80 text-sm">Ranking</div>
                </div>
              </div>
              
              <Button size="lg" className="bg-white text-yellow-600 hover:bg-white/90 font-semibold px-8 py-4">
                Join Team Yellow
              </Button>
            </div>
            
            <div className="relative">
              {/* Team Photo Carousel */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                {imageErrors.has(currentImageIndex) ? (
                  // Show fallback SVG for failed images
                  <div className="w-full h-96 bg-gradient-to-br from-yellow-400 to-yellow-500 flex flex-col items-center justify-center text-white">
                    <div className="text-6xl mb-4">☀️</div>
                    <div className="text-2xl font-bold mb-2">Team Yellow</div>
                    <div className="text-lg opacity-80">Sunshine Energy</div>
                  </div>
                ) : (
                  <img 
                    src={teamImages[currentImageIndex]}
                    alt="Team Yellow Members"
                    className="w-full h-96 object-cover"
                    onError={() => {
                      console.log('Image failed to load, showing fallback');
                      setImageErrors(prev => new Set([...prev, currentImageIndex]));
                    }}
                    onLoad={() => {
                      console.log('Image loaded successfully:', teamImages[currentImageIndex]);
                      // Remove from error set if it loads successfully
                      setImageErrors(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(currentImageIndex);
                        return newSet;
                      });
                    }}
                  />
                )}
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
              Meet the <span className="text-yellow-500">Sunshine Makers</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The joyful spirits and creative minds who make Team Yellow a beacon of happiness and energy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-yellow-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4">{member.avatar}</div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="font-semibold text-yellow-600">{member.role}</CardDescription>
                  <Badge variant="outline" className="w-fit mx-auto mt-2 border-yellow-200 text-yellow-600">
                    Joined {member.joinedDate}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-2 mb-4">
                    <Quote className="w-4 h-4 text-yellow-500 mt-1 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground italic leading-relaxed">
                      "{member.quote}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-600 mb-2">Achievements</h4>
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
              Recent <span className="text-yellow-500">Sunshine</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how Team Yellow has been spreading joy and creative energy throughout the community.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {recentEvents.map((event, index) => (
              <Card key={index} className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-yellow-500 text-white">{event.result}</Badge>
                    {index === 1 && <Trophy className="w-5 h-5 text-yellow-500" />}
                  </div>
                  <CardTitle className="text-lg text-yellow-700">{event.name}</CardTitle>
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
              What Makes Us <span className="text-yellow-500">Radiant</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Team Yellow's core values and what you can expect when you join our sunshine-filled family.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "😄",
                title: "Pure Joy",
                description: "We believe that happiness is contagious and every day should be filled with laughter."
              },
              {
                icon: "🎨",
                title: "Creative Spirit",
                description: "Innovation through creativity - we find unique and colorful solutions to every challenge."
              },
              {
                icon: "⚡",
                title: "Boundless Energy",
                description: "Our enthusiasm is infectious and helps energize everyone around us to reach new heights."
              },
              {
                icon: "🌟",
                title: "Positive Vibes",
                description: "We maintain optimism even in tough times and spread positivity wherever we go."
              },
              {
                icon: "🎉",
                title: "Celebration Culture",
                description: "Every victory, big or small, deserves to be celebrated with the people who matter."
              },
              {
                icon: "🌈",
                title: "Colorful Diversity",
                description: "We embrace all backgrounds, ideas, and perspectives to create a vibrant community."
              }
            ].map((value, index) => (
              <Card key={index} className="text-center border-yellow-200 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <CardTitle className="text-xl text-yellow-600">{value.title}</CardTitle>
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
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-yellow-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Shine Bright?
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join Team Yellow and become part of a radiant community that values joy, creativity, 
            and endless positive energy. Let's light up the world together!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-yellow-600 hover:bg-white/90 font-semibold px-8 py-4"
            >
              Join Team Yellow Now
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
